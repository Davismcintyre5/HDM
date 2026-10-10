const cron = require('node-cron');
const mongoose = require('mongoose');
const env = require('../config/env');
const logger = require('../utils/logger');
const emailService = require('../services/emailService');

let job = null;
const THRESHOLD = 80;

const check = async () => {
  try {
    if (!env.mongoDatabases.length) return;

    const limitBytes = env.mongoStorageLimitMB * 1024 * 1024;
    const client = mongoose.connection.client;

    let totalStorage = 0;
    for (const name of env.mongoDatabases) {
      const stats = await client.db(name).stats().catch(() => ({}));
      totalStorage += stats.storageSize || 0;
    }

    const usedPercent = Number(((totalStorage / limitBytes) * 100).toFixed(2));
    if (usedPercent < THRESHOLD) return;

    if (!env.adminEmail) {
      logger.warn('Mongo alert: ADMIN_EMAIL not set, skipping');
      return;
    }

    await emailService.mongoStorageAlert({
      to: env.adminEmail,
      data: {
        usedPercent,
        usedFormatted: `${(totalStorage / 1024 / 1024).toFixed(1)} MB`,
        limitFormatted: `${env.mongoStorageLimitMB} MB`,
        tier: env.mongoTier,
      },
    });

    logger.info(`Mongo alert sent (${usedPercent}%)`);
  } catch (err) {
    logger.error(`Mongo alert scheduler: ${err.message}`);
  }
};

const start = () => {
  stop();
  job = cron.schedule('0 8 * * *', check);
  logger.info('Mongo alert scheduler: daily @ 08:00');
};

const stop = () => {
  if (job) {
    job.stop();
    job = null;
  }
};

module.exports = { start, stop, check };