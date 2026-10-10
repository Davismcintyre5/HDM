const cron = require('node-cron');
const logger = require('../utils/logger');
const HdmEmailJob = require('../models/hdm/EmailJob');
const emailService = require('../services/emailService');

let job = null;

const BATCH_SIZE = 20;
const MAX_ATTEMPTS = 5;

const backoffMinutes = (attempt) => Math.min(2 ** attempt, 60);

const process = async () => {
  try {
    const jobs = await HdmEmailJob.find({
      status: 'pending',
      nextAttemptAt: { $lte: new Date() },
    }).limit(BATCH_SIZE);

    if (!jobs.length) return;

    for (const j of jobs) {
      j.status = 'sending';
      await j.save();

      const result = await emailService.send(j.payload);

      if (result.ok) {
        j.status = 'sent';
        j.lastError = '';
      } else {
        j.attempts += 1;
        j.lastError = result.error || 'Unknown error';
        if (j.attempts >= MAX_ATTEMPTS) {
          j.status = 'failed';
          logger.warn(`Email job ${j._id} failed permanently: ${j.lastError}`);
        } else {
          j.status = 'pending';
          j.nextAttemptAt = new Date(Date.now() + backoffMinutes(j.attempts) * 60 * 1000);
        }
      }

      await j.save();
    }

    logger.info(`Email reply scheduler: processed ${jobs.length} job(s)`);
  } catch (err) {
    logger.error(`Email reply scheduler: ${err.message}`);
  }
};

const start = () => {
  stop();
  job = cron.schedule('*/1 * * * *', process);
  logger.info('Email reply scheduler: every 1 min');
};

const stop = () => {
  if (job) {
    job.stop();
    job = null;
  }
};

module.exports = { start, stop, process };