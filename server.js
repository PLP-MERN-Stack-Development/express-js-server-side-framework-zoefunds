// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const productRoutes = require('./routes/products');
const logger = require('./middleware/logger');
const auth = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware: parse JSON bodies
app.use(bodyParser.json());

// Custom logger middleware
app.use(logger);

// Simple Hello World route
app.get('/', (req, res) => {
  res.json({ message: 'Hello World from Express.js API!' });
});

// Authentication middleware for /api routes
app.use('/api', auth);

// API routes
app.use('/api/products', productRoutes);

// 404 for unknown routes
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;