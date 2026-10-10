const cron = require('node-cron');
const logger = require('../utils/logger');
const SmartGenUser = require('../models/smartgen/User');

let job = null;

const cleanExpiredVerifyTokens = async () => {
  const now = new Date();
  const result = await SmartGenUser.updateMany(
    { emailVerifyExpires: { $lt: now } },
    { $set: { emailVerifyToken: null, emailVerifyExpires: null } }
  );
  if (result.modifiedCount) {
    logger.info(`Cleanup: cleared ${result.modifiedCount} expired verify tokens`);
  }
};

const cleanExpiredResetTokens = async () => {
  const now = new Date();
  const result = await SmartGenUser.updateMany(
    { resetExpires: { $lt: now } },
    { $set: { resetToken: null, resetExpires: null } }
  );
  if (result.modifiedCount) {
    logger.info(`Cleanup: cleared ${result.modifiedCount} expired reset tokens`);
  }
};

const cleanUnverifiedUsers = async () => {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const result = await SmartGenUser.deleteMany({
    emailVerified: false,
    createdAt: { $lt: cutoff },
  });
  if (result.deletedCount) {
    logger.info(`Cleanup: removed ${result.deletedCount} unverified users`);
  }
};

const run = async () => {
  try {
    await cleanExpiredVerifyTokens();
    await cleanExpiredResetTokens();
    await cleanUnverifiedUsers();
  } catch (err) {
    logger.error(`Cleanup scheduler: ${err.message}`);
  }
};

const start = () => {
  stop();
  job = cron.schedule('0 3 * * *', run);
  logger.info('Cleanup scheduler: daily @ 03:00');
};

const stop = () => {
  if (job) {
    job.stop();
    job = null;
  }
};

module.exports = { start, stop, run };