const logger = require('../../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    logger.req(req.method, req.originalUrl, res.statusCode, Date.now() - start);

    if (req.originalUrl.includes('payment-requests')) {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress;
      const ua = req.headers['user-agent'] || '';
      console.log(`[WHO] ${req.method} ${req.originalUrl} from ${ip} — UA: ${ua.slice(0, 80)}`);
    }
  });

  next();
};

module.exports = requestLogger;