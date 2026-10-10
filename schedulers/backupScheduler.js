const cron = require('node-cron');
const logger = require('../utils/logger');
const env = require('../config/env');
const HdmBackup = require('../models/hdm/Backup');
const HdmBackupSettings = require('../models/hdm/BackupSettings');
const backupService = require('../services/backupService');
const emailService = require('../services/emailService');

let job = null;

const runBackup = async (type = 'auto') => {
  const settings = await HdmBackupSettings.findOne();
  if (!settings) return null;

  try {
    const backup = await backupService.performBackup({
      BackupModel: HdmBackup,
      name: 'hdm',
      type,
    });

    settings.lastAutoBackup = new Date();
    await settings.save();

    await backupService.cleanupOldBackups({
      BackupModel: HdmBackup,
      maxBackups: settings.maxBackups,
      retentionDays: settings.retentionDays,
    });

    if (settings.emailOnCompletion) {
      const to = settings.emailRecipient || env.adminEmail;
      if (to) {
        await emailService.backupCompleted({
          to,
          data: {
            fileName: backup.fileName,
            fileUrl: backup.fileUrl,
            fileSize: backup.fileSize,
            collections: backup.collections,
            completedAt: new Date().toISOString(),
            type,
          },
        });
      }
    }

    return backup;
  } catch (err) {
    logger.error(`Backup failed: ${err.message}`);

    const to = settings.emailRecipient || env.adminEmail;
    if (to) {
      await emailService.backupFailed({
        to,
        data: {
          fileName: `${env.bridge.fromName}_${type}`,
          error: err.message,
          attemptedAt: new Date().toISOString(),
        },
      });
    }

    return null;
  }
};

const buildCron = (frequency, time) => {
  const [hour, minute] = time.split(':').map(Number);
  switch (frequency) {
    case 'weekly':
      return `${minute} ${hour} * * 0`;
    case 'monthly':
      return `${minute} ${hour} 1 * *`;
    case 'daily':
    default:
      return `${minute} ${hour} * * *`;
  }
};

const start = async () => {
  const settings = await HdmBackupSettings.findOne();
  if (!settings) {
    logger.warn('Backup scheduler: no settings found');
    return;
  }

  if (!settings.enabled) {
    logger.info('Backup scheduler: disabled');
    return;
  }

  stop();

  const expression = buildCron(settings.frequency, settings.time);
  job = cron.schedule(expression, () => runBackup('auto'));
  logger.info(`Backup scheduler: ${settings.frequency} @ ${settings.time}`);
};

const stop = () => {
  if (job) {
    job.stop();
    job = null;
  }
};

const restart = async () => {
  stop();
  await start();
};

module.exports = { start, stop, restart, runBackup };