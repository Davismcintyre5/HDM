require('./config/env');
require('./scripts/dnsSet');

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const env = require('./config/env');
const db = require('./config/db');
const redis = require('./config/redis');
const keepAlive = require('./config/keepAlive');
const logger = require('./utils/logger');

const cors = require('./middleware/global/cors');
const requestLogger = require('./middleware/global/requestLogger');
const notFound = require('./middleware/global/notFound');
const errorHandler = require('./middleware/global/errorHandler');

const app = express();

app.set('trust proxy', 1);

app.use(cors);
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(requestLogger);

/* ============================================================
   Info + health endpoints
   ============================================================ */
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
    database:
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    redis: redis.isReady()
      ? 'connected'
      : env.redisEnabled
      ? 'disconnected'
      : 'disabled',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

/* ============================================================
   API routes
   ============================================================ */
app.use(require('./routes'));

/* ============================================================
   Serve built client from client/dist
   ============================================================ */
const clientDist = path.join(__dirname, 'client', 'dist');
const clientIndex = path.join(clientDist, 'index.html');

if (fs.existsSync(clientDist)) {
  app.use(
    express.static(clientDist, {
      index: false,
      maxAge: '1h',
      setHeaders: (res, filePath) => {
        // Immutable cache for hashed Vite assets
        if (/[.-][a-f0-9]{6,}\.(js|css)$/i.test(filePath)) {
          res.setHeader(
            'Cache-Control',
            'public, max-age=31536000, immutable'
          );
        }
      },
    })
  );

  // SPA fallback — everything except API prefixes returns index.html
  app.get(/^(?!\/(hdm\/api|smartgen\/api|api|health)).*/, (req, res, next) => {
    if (!fs.existsSync(clientIndex)) return next();
    res.sendFile(clientIndex);
  });

  logger.info(`Serving client from ${clientDist}`);
} else {
  logger.info(
    'Client dist not found — API only. Run "npm run build" to build the client.'
  );

  app.get('/', (req, res) => {
    res.json({
      name: 'HDM Technologies API',
      version: '2.0.0',
      status: 'running',
      note: 'Client not built. Run "npm run build".',
      endpoints: {
        hdm: '/hdm/api',
        smartgen: '/smartgen/api',
        health: '/health',
      },
    });
  });
}

/* ============================================================
   404 + error handling
   ============================================================ */
app.use(notFound);
app.use(errorHandler);

/* ============================================================
   Startup
   ============================================================ */
let server;

const start = async () => {
  console.log('');
  console.log('  ╔══════════════════════════════════════╗');
  console.log('  ║        HDM Technologies              ║');
  console.log('  ╚══════════════════════════════════════╝');
  console.log('');

  logger.info(`Environment: ${env.nodeEnv}`);

  logger.info('Connecting to MongoDB…');
  await db.connect();

  logger.info('Connecting to Redis…');
  await redis.connect();

  server = app.listen(env.port, () => {
    logger.info(`Server running on port ${env.port}`);
    console.log('');
    console.log(`  Base:     ${env.baseUrl}`);
    console.log(`  Client:   ${env.baseUrl}`);
    console.log(`  HDM API:  ${env.baseUrl}/hdm/api`);
    console.log(`  SmartGen: ${env.baseUrl}/smartgen/api`);
    console.log(`  Health:   ${env.baseUrl}/health`);
    console.log('');

    keepAlive.start();
  });
};

/* ============================================================
   Graceful shutdown
   ============================================================ */
const shutdown = async (signal) => {
  console.log('');
  logger.info(`${signal} received — shutting down…`);

  keepAlive.stop();

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