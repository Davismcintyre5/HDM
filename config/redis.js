const Redis = require('ioredis');
const env = require('./env');
const logger = require('../utils/logger');

let redis = null;

const connect = () => {
  if (!env.redisEnabled || !env.redisUrl) {
    logger.info('Redis disabled');
    return null;
  }

  try {
    const useTls = env.redisUrl.startsWith('rediss://');

    redis = new Redis(env.redisUrl, {
      ...(useTls ? { tls: { rejectUnauthorized: false } } : {}),
      retryStrategy: (times) => {
        if (times > 3) {
          logger.error('Redis connection failed after 3 retries. Running without Redis.');
          return null;
        }
        return Math.min(times * 200, 2000);
      },
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });

    redis.on('connect', () => logger.db('Redis connected'));
    redis.on('error', (err) => logger.error(`Redis: ${err.message}`));

    redis.connect().catch((err) => {
      logger.error(`Redis connection failed: ${err.message}`);
      redis = null;
    });
  } catch (err) {
    logger.error(`Redis init failed: ${err.message}`);
    redis = null;
  }

  return redis;
};

const getClient = () => redis;
const isReady = () => !!redis && redis.status === 'ready';

const disconnect = async () => {
  if (redis) {
    try {
      await redis.quit();
    } catch {}
    redis = null;
  }
};

module.exports = { connect, getClient, isReady, disconnect };