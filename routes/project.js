// routes/products.js
const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

const productsData = require('../data/products');
const asyncHandler = require('../utils/asyncHandler');
const { ValidationError, NotFoundError } = require('../utils/errors');
const validateProduct = require('../middleware/validateProduct');

// GET /api/products
// Supports ?category=, ?page=, ?limit= and ?search=
router.get(
  '/',
  asyncHandler(async (req, res) => {
    let results = productsData.getAll();

    // Filter by category
    if (req.query.category) {
      const category = String(req.query.category).toLowerCase();
      results = results.filter(p => p.category && p.category.toLowerCase() === category);
    }

    // Search by name
    if (req.query.search) {
      const q = String(req.query.search).toLowerCase();
      results = results.filter(p => p.name && p.name.toLowerCase().includes(q));
    }

    // Pagination
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const start = (page - 1) * limit;
    const end = start + limit;
    const paginated = results.slice(start, end);

    res.json({
      total: results.length,
      page,
      limit,
      data: paginated
    });
  })
);

// GET /api/products/:id
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = productsData.getById(req.params.id);
    if (!product) throw new NotFoundError('Product not found');
    res.json(product);
  })
);

// POST /api/products
router.post(
  '/',
  validateProduct('create'),
  asyncHandler(async (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
      id: uuidv4(),
      name,
      description: description || '',
      price,
      category: category || 'uncategorized',
      inStock: Boolean(inStock)
    };
    productsData.create(newProduct);
    res.status(201).json(newProduct);
  })
);

// PUT /api/products/:id
router.put(
  '/:id',
  validateProduct('update'),
  asyncHandler(async (req, res) => {
    const existing = productsData.getById(req.params.id);
    if (!existing) throw new NotFoundError('Product not found');

    const { name, description, price, category, inStock } = req.body;
    const updated = {
      ...existing,
      name: name !== undefined ? name : existing.name,
      description: description !== undefined ? description : existing.description,
      price: price !== undefined ? price : existing.price,
      category: category !== undefined ? category : existing.category,
      inStock: inStock !== undefined ? Boolean(inStock) : existing.inStock
    };
    productsData.update(req.params.id, updated);
    res.json(updated);
  })
);

// DELETE /api/products/:id
router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const existing = productsData.getById(req.params.id);
    if (!existing) throw new NotFoundError('Product not found');
    productsData.remove(req.params.id);
    res.status(204).end();
  })
);

// GET /api/products/search?name=...
router.get(
  '/search',
  asyncHandler(async (req, res) => {
    const q = req.query.name || req.query.q;
    if (!q) throw new ValidationError('Search query "name" or "q" is required');
    const lower = String(q).toLowerCase();
    const results = productsData.getAll().filter(p => p.name && p.name.toLowerCase().includes(lower));
    res.json({ total: results.length, data: results });
  })
);

// GET /api/products/stats - e.g., count by category
router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const all = productsData.getAll();
    const countByCategory = all.reduce((acc, p) => {
      const key = p.category || 'uncategorized';
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    res.json({
      total: all.length,
      countByCategory
    });
  })
);

module.exports = router;