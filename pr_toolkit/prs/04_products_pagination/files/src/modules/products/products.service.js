const db = require('../../data/db');
const { HttpError } = require('../../core/http');

function list({ category, page = 1, limit = 10 } = {}) {
  let products = db.products;
  if (category) {
    products = products.filter((p) => p.category === category);
  }
  const pageNumber = Number(page);
  const pageSize = Number(limit);
  const start = (pageNumber - 1) * pageSize;
  return { items: products.slice(start, start + pageSize), page: pageNumber, limit: pageSize, total: products.length };
}

function get(id) {
  const product = db.products.find((p) => p.id === Number(id));
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
