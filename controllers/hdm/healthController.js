const os = require('os');
const mongoose = require('mongoose');
const env = require('../../config/env');
const redis = require('../../config/redis');
const asyncHandler = require('../../utils/asyncHandler');
const { ok } = require('../../utils/apiResponse');
const cloudinaryService = require('../../services/cloudinaryService');
const HdmBackup = require('../../models/hdm/Backup');
const HdmCompany = require('../../models/hdm/Company');

const humanUptime = (seconds) => {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d) parts.push(`${d}d`);
  if (h) parts.push(`${h}h`);
  if (m) parts.push(`${m}m`);
  return parts.join(' ') || `${Math.floor(seconds)}s`;
};

exports.getHealth = asyncHandler(async (req, res) => {
  const mem = process.memoryUsage();
  const load = os.loadavg();

  const dbConnected = mongoose.connection.readyState === 1;

  let dbCollections = 0;
  let dbDocuments = 0;
  if (dbConnected) {
    try {
      const stats = await mongoose.connection.db.stats();
      dbCollections = stats.collections || 0;
      dbDocuments = stats.objects || 0;
    } catch {}
  }

  const redisReady = redis.isReady();

  let cloudStorage = { type: 'cloudinary', status: 'unknown' };
  try {
    const usage = await cloudinaryService.getUsage();
    const usedBytes = usage.storage?.usage || 0;
    const limitBytes = usage.storage?.limit || 0;
    cloudStorage = {
      type: 'cloudinary',
      status: 'up',
      plan: usage.plan || 'free',
      storageUsed: usedBytes,
      storageLimit: limitBytes,
      usedPercent: limitBytes
        ? Number(((usedBytes / limitBytes) * 100).toFixed(2))
        : 0,
      bandwidthUsed: usage.bandwidth?.usage || 0,
      bandwidthLimit: usage.bandwidth?.limit || 0,
      credits: usage.credits?.usage ?? null,
    };
  } catch (err) {
    cloudStorage.status = 'down';
    cloudStorage.error = err.message;
  }

  const backupCount = await HdmBackup.countDocuments();
  const lastBackup = await HdmBackup.findOne().sort({ createdAt: -1 });

  const company = await HdmCompany.findOne().lean();

  const services = {
    server: {
      status: 'up',
      version: '2.0.0',
      node: process.version,
      platform: os.platform(),
      arch: os.arch(),
      uptime: Math.floor(process.uptime()),
      uptimeHuman: humanUptime(process.uptime()),
      cpuCores: os.cpus().length,
      load1m: Number(load[0].toFixed(2)),
      memoryRssMb: Number((mem.rss / 1024 / 1024).toFixed(1)),
      memoryHeapMb: Number((mem.heapUsed / 1024 / 1024).toFixed(1)),
      pid: process.pid,
      environment: env.nodeEnv,
    },

    database: {
      status: dbConnected ? 'up' : 'down',
      name: dbConnected ? mongoose.connection.name : null,
      host: dbConnected ? mongoose.connection.host : null,
      collections: dbCollections,
      documents: dbDocuments,
    },

    redis: {
      status: env.redisEnabled
        ? (redisReady ? 'up' : 'down')
        : 'disabled',
      enabled: env.redisEnabled,
    },

    email: {
      status: env.bridge.apiKey ? 'up' : 'down',
      provider: 'HDM Bridge',
      from: env.bridge.fromEmail,
    },

    sms: {
      status: env.smsEnabled ? 'up' : 'disabled',
      enabled: env.smsEnabled,
      provider: 'HDM Bridge',
      sender: env.bridge.smsSender,
    },

    ai: {
      status: env.ai.key ? 'up' : 'down',
      provider: 'HDM AI',
      url: env.ai.url,
    },

    storage: cloudStorage,
  };

  const upCount = Object.values(services).filter(
    (s) => s.status === 'up'
  ).length;
  const totalCount = Object.keys(services).length;

  return ok(res, {
    status: dbConnected ? 'OK' : 'DEGRADED',
    environment: env.nodeEnv,
    timestamp: new Date().toISOString(),
    overall: { up: upCount, total: totalCount },

    ...services,

    backups: {
      count: backupCount,
      lastBackupAt: lastBackup?.createdAt || null,
      lastBackupSize: lastBackup?.fileSize || null,
      lastBackupType: lastBackup?.type || null,
    },

    platform: {
      platformName: company?.name || 'HDM Technologies',
      supportEmail: company?.email || env.adminEmail,
      supportPhone: company?.phone || env.adminPhone,
      url: env.hdmUrl,
    },

    cors: env.allowedOrigins,
    urls: {
      base: env.baseUrl,
      hdm: env.hdmUrl,
      smartgen: env.smartgenUrl,
      admin: env.adminUrl,
    },
  });
});