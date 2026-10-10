const rateLimit = require('express-rate-limit');

const make = (opts = {}) =>
  rateLimit({
    windowMs: 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    ...opts,
  });

module.exports = {
  global: make({ max: 300 }),
  auth: make({ max: 10 }),
  ai: make({ max: 20 }),
  upload: make({ max: 10 }),
};