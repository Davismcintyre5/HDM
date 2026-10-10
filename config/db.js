const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

const connect = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  await mongoose.connect(env.mongoUri);
  logger.db(`MongoDB connected → ${mongoose.connection.name}`);
  return mongoose.connection;
};

const getDB = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error('Database not connected');
  }
  return mongoose.connection;
};

const disconnect = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
    logger.db('MongoDB disconnected');
  }
};

module.exports = { connect, getDB, disconnect };