const db = require('../../data/db');
const { HttpError } = require('../../core/http');
const products = require('../products/products.service');

function rawCart(userId) {
  if (!db.carts[userId]) db.carts[userId] = [];
  return db.carts[userId];
}

function getCartItems(userId) {
  return rawCart(userId).map((entry) => {
    const product = products.get(entry.productId);
    return {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: entry.quantity,
      lineTotal: product.price * entry.quantity,
    };
  });
}

function getCart(userId) {
  const items = getCartItems(userId);
  const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
  return { items, subtotal };
}

function addItem(userId, { productId, quantity } = {}) {
  const product = products.get(productId);
  if (!Number.isInteger(quantity) || quantity < 1) throw new HttpError(400, 'Quantity must be a whole number of at least 1');
  const cart = rawCart(userId);
  const existing = cart.find((entry) => entry.productId === product.id);
  const newQuantity = (existing ? existing.quantity : 0) + quantity;
  if (newQuantity > product.stock) throw new HttpError(409, 'Not enough stock');
  if (existing) {
    existing.quantity = newQuantity;
  } else {
    cart.push({ productId: product.id, quantity });
  }
  return getCart(userId);
}

function updateItem(userId, productId, quantity) {
  const cart = rawCart(userId);
  const entry = cart.find((e) => e.productId === Number(productId));
  if (!entry) throw new HttpError(404, 'Item not in cart');
  entry.quantity = quantity;
  return getCart(userId);
}

function removeItem(userId, productId) {
  const cart = rawCart(userId);
  const index = cart.findIndex((entry) => entry.productId === Number(productId));
  if (index === -1) throw new HttpError(404, 'Item not in cart');
  cart.splice(index, 1);
  return getCart(userId);
}

function clearCart(userId) {
  db.carts[userId] = [];
}

module.exports = { getCart, getCartItems, addItem, updateItem, removeItem, clearCart };
