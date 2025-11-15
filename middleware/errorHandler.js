// middleware/errorHandler.js
const { ValidationError, NotFoundError, AuthError } = require('../utils/errors');

function notFoundHandler(req, res, next) {
  const err = new NotFoundError('Resource not found');
  next(err);
}

function errorHandler(err, req, res, next) {
  // If the error has a status property, use it. Otherwise map known error types.
  let status = 500;
  let message = err.message || 'Internal Server Error';

  if (err instanceof ValidationError) status = 400;
  else if (err instanceof NotFoundError) status = 404;
  else if (err instanceof AuthError) status = 401;
  else if (err.status && Number.isInteger(err.status)) status = err.status;

  // Optionally include stack for non-production
  const response = {
    error: {
      type: err.name || 'Error',
      message
    }
  };

  if (process.env.NODE_ENV !== 'production') {
    response.error.stack = err.stack;
  }

  res.status(status).json(response);
}

module.exports = {
  notFoundHandler,
  errorHandler
};