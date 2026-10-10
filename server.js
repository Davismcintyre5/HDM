require('./config/env');
require('./scripts/dnsSet');

const express = require('express');
const mongoose = require('mongoose');
const env = require('./config/env');
const db = require('./config/db');
const redis = require('./config/redis');
const logger = require('./utils/logger');

const cors = require('./middleware/global/cors');
const requestLogger = require('./middleware/global/requestLogger');
const notFound = require('./middleware/global/notFound');
const errorHandler = require('./middleware/global/errorHandler');

const app = express();

app.set('trust proxy', true);

app.use(cors);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(requestLogger);

app.get('/', (req, res) => {
  res.json({
    name: 'HDM Technologies API',
    version: '2.0.0',
    status: 'running',
    endpoints: {
      hdm: '/hdm/api',
      smartgen: '/smartgen/api',
      health: '/health',
    },
  });
});

app.get('/api', (req, res) => {
  res.json({
    name: 'HDM Technologies API',
    version: '2.0.0',
    status: 'running',
    modules: {
      hdm: '/hdm/api',
      smartgen: '/smartgen/api',
    },
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    environment: env.nodeEnv,
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redis.isReady() ? 'connected' : (env.redisEnabled ? 'disconnected' : 'disabled'),
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use(require('./routes'));

app.use(notFound);
app.use(errorHandler);

let server;

const start = async () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║        HDM Technologies API          ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  logger.info(`Environment: ${env.nodeEnv}`);
  logger.info(`CORS origins: ${env.allowedOrigins.join(', ') || '(none)'}${env.nodeEnv === 'development' ? ' + localhost wildcard' : ''}`);

  logger.info('Connecting to MongoDB…');
  await db.connect();

  logger.info('Connecting to Redis…');
  await redis.connect();

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
    console.log('');
    console.log(`  Local:    http://localhost:${env.port}`);
    console.log(`  HDM:      http://localhost:${env.port}/hdm/api`);
    console.log(`  SmartGen: http://localhost:${env.port}/smartgen/api`);
    console.log(`  Health:   http://localhost:${env.port}/health`);
    console.log('');
  });
};

const shutdown = async (signal) => {
  console.log('');
  logger.info(`${signal} received — shutting down…`);

  try {
    const { stopAll } = require('./schedulers');
    stopAll();
  } catch (err) {
    logger.warn(`Scheduler stop skipped: ${err.message}`);
  }

  if (server) {
    server.close(async () => {
      logger.info('HTTP server closed');
      await db.disconnect();
      await redis.disconnect();
      logger.info('Goodbye.');
      process.exit(0);
    });

    setTimeout(() => {
      logger.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => {
  logger.error(`Unhandled rejection: ${reason}`);
});
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught exception: ${err.message}`);
  shutdown('uncaughtException');
});

start().catch((err) => {
  logger.error(`Startup failed: ${err.message}`);
  process.exit(1);
});