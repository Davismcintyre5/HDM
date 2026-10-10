const backupScheduler = require('./backupScheduler');
const cleanupScheduler = require('./cleanupScheduler');
const mongoAlertScheduler = require('./mongoAlertScheduler');
const emailReplyScheduler = require('./emailReplyScheduler');
const logger = require('../utils/logger');

const startAll = async () => {
  await backupScheduler.start();
  cleanupScheduler.start();
  mongoAlertScheduler.start();
  emailReplyScheduler.start();
  logger.info('All schedulers started');
};

const stopAll = () => {
  backupScheduler.stop();
  cleanupScheduler.stop();
  mongoAlertScheduler.stop();
  emailReplyScheduler.stop();
  logger.info('All schedulers stopped');
};

module.exports = { startAll, stopAll };