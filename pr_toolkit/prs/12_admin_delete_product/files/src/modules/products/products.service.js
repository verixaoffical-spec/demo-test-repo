const db = require('../../data/db');
const { HttpError } = require('../../core/http');

function list({ category } = {}) {
  let products = db.products;
  if (category) {
    products = products.filter((p) => p.category === category);
  }
  return products;
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

function remove(id) {
  const product = get(id);
  db.products.splice(db.products.indexOf(product), 1);
  return { deleted: product.id };
}

module.exports = { list, get, create, remove };
