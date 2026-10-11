const rateLimit = require('express-rate-limit');
const env = require('../../config/env');

const make = (opts = {}) =>
  rateLimit({
    windowMs: 60 * 1000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: 'Too many requests. Please slow down and try again shortly.',
    },
    skip: () => env.nodeEnv === 'test',
    ...opts,
  });

module.exports = {
  global: make({ max: 300 }),

  auth: make({
    max: 10,
    message: {
      success: false,
      message: 'Too many authentication attempts. Try again in a minute.',
    },
  }),

  ai: make({
    max: 20,
    message: {
      success: false,
      message: 'Too many AI requests. Please wait a moment.',
    },
  }),

  upload: make({
    max: 10,
    message: {
      success: false,
      message: 'Too many uploads. Please wait a moment.',
    },
  }),

  contact: make({
    max: 5,
    message: {
      success: false,
      message: 'Too many contact submissions. Please wait before trying again.',
    },
  }),

  mpesa: make({
    max: 30,
    message: {
      success: false,
      message: 'Too many payment requests. Please wait a moment.',
    },
  }),

  publicRead: make({ max: 200 }),
};