const db = require('../../data/db');
const { HttpError } = require('../../core/http');

function list({ category } = {}) {
  let result = db.products;
  if (category) {
    result = result.filter((p) => p.category === category);
  }
  return result;
}

function findById(id) {
  return db.products.find((p) => p.id === Number(id));
}

function get(id) {
  const product = findById(id);
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
}

function create({ name, price, stock, category } = {}) {
  if (!name) throw new HttpError(400, 'Name is required');
  if (!Number.isInteger(price) || price <= 0) throw new HttpError(400, 'Price must be a positive integer in cents');
  const product = {
    id: db.nextProductId++,
    name,
    price,
    stock: Number.isInteger(stock) ? stock : 0,
    category: category || 'general',
  };
  db.products.push(product);
  return product;
}

module.exports = { list, get, create };
