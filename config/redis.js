const { createClient } = require('redis');
const env = require('./env');
const logger = require('../utils/logger');

let client = null;
let ready = false;

const connect = async () => {
  if (!env.redisEnabled) {
    logger.info('Redis disabled');
    return null;
  }

  if (!env.redisUrl) {
    logger.warn('REDIS_ENABLED=true but REDIS_URL empty');
    return null;
  }

  if (client) return client;

  client = createClient({ url: env.redisUrl });

  client.on('error', (err) => logger.error(`Redis: ${err.message}`));
  client.on('ready', () => {
    ready = true;
    logger.db('Redis connected');
  });
  client.on('reconnecting', () => logger.warn('Redis reconnecting'));

  try {
    await client.connect();
    return client;
  } catch (err) {
    logger.error(`Redis connection failed: ${err.message}`);
    client = null;
    return null;
  }
};

const getClient = () => client;
const isReady = () => ready;

const disconnect = async () => {
  if (client) {
    await client.quit();
    client = null;
    ready = false;
    logger.db('Redis disconnected');
  }
};

module.exports = { connect, getClient, isReady, disconnect };