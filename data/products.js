// data/products.js
// In-memory products store (for the assignment). Replace with DB in real apps.
const { v4: uuidv4 } = require('uuid');

let products = [
  {
    id: uuidv4(),
    name: 'Sample Product A',
    description: 'A sample product',
    price: 9.99,
    category: 'books',
    inStock: true
  },
  {
    id: uuidv4(),
    name: 'Sample Product B',
    description: 'Another sample',
    price: 19.99,
    category: 'electronics',
    inStock: false
  }
];

module.exports = {
  getAll: () => products.slice(),
  getById: id => products.find(p => p.id === id),
  create: p => {
    products.push(p);
    return p;
  },
  update: (id, updated) => {
    products = products.map(p => (p.id === id ? updated : p));
    return updated;
  },
  remove: id => {
    products = products.filter(p => p.id !== id);
  },
  // helper for tests / resetting store
  _reset: arr => {
    products = arr;
  }
};