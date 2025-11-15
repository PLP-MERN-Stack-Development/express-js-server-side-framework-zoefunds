// middleware/auth.js
const { AuthError } = require('../utils/errors');

module.exports = function auth(req, res, next) {
  // Expect header: x-api-key or authorization: ApiKey <key>
  const apiKeyHeader = req.header('x-api-key') || req.header('authorization');
  const expected = process.env.API_KEY || 'test-api-key';

  if (!apiKeyHeader) {
    return next(new AuthError('API key missing'));
  }

  let provided = apiKeyHeader;
  if (provided.startsWith('ApiKey ')) {
    provided = provided.slice(7).trim();
  }

  if (provided !== expected) {
    return next(new AuthError('Invalid API key'));
  }

  // Attach a simple user object if you want downstream handlers to use
  req.user = { apiKey: provided };
  next();
};