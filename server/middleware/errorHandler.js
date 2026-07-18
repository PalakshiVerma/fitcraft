const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
  logger.error({ err, path: req.path, method: req.method }, err.message);
  
  const status = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? 'Something went wrong. Please try again.'
    : err.message;
    
  res.status(status).json({ error: message });
}

module.exports = errorHandler;
