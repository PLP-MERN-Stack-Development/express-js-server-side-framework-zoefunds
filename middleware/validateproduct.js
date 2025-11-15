// middleware/validateProduct.js
const { ValidationError } = require('../utils/errors');

function isNumber(n) {
  return typeof n === 'number' && !Number.isNaN(n);
}

module.exports = function validateProduct(mode = 'create') {
  return (req, res, next) => {
    const body = req.body || {};

    // For create, require name and price. For update, allow partial updates.
    if (mode === 'create') {
      if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
        return next(new ValidationError('name is required and must be a non-empty string'));
      }
      if (!isNumber(body.price)) {
        return next(new ValidationError('price is required and must be a number'));
      }
    } else if (mode === 'update') {
      if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim() === '')) {
        return next(new ValidationError('name must be a non-empty string when provided'));
      }
      if (body.price !== undefined && !isNumber(body.price)) {
        return next(new ValidationError('price must be a number when provided'));
      }
    }

    // Optional fields checks
    if (body.category !== undefined && typeof body.category !== 'string') {
      return next(new ValidationError('category must be a string when provided'));
    }
    if (body.inStock !== undefined && typeof body.inStock !== 'boolean') {
      return next(new ValidationError('inStock must be a boolean when provided'));
    }

    next();
  };
};