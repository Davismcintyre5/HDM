const multer = require('multer');
const logger = require('../../utils/logger');

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) return next(err);

  logger.error(err.stack || err.message || String(err));

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || undefined;

  if (err instanceof multer.MulterError) {
    statusCode = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    message = err.message;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate key error';
    details = err.keyValue;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}`;
  }

  const body = { success: false, message };
  if (details) body.details = details;
  if (process.env.NODE_ENV === 'development') body.stack = err.stack;

  res.status(statusCode).json(body);
};

module.exports = errorHandler;