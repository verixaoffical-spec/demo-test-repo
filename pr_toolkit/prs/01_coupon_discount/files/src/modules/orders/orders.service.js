const db = require('../../data/db');
const { HttpError } = require('../../core/http');
const cart = require('../cart/cart.service');
const { calculateTotals } = require('../pricing/pricing.service');
const { findCoupon } = require('../coupons/coupons.service');

function checkout(userId, couponCode) {
  const items = cart.getCartItems(userId);
  if (items.length === 0) throw new HttpError(400, 'Cart is empty');
  const coupon = couponCode ? findCoupon(couponCode) : null;
  if (couponCode && !coupon) throw new HttpError(400, 'Invalid coupon');
  const totals = calculateTotals(items, coupon);
  const order = {
    id: db.nextOrderId++,
    userId,
    items,
    totals,
    status: 'PLACED',
    createdAt: new Date().toISOString(),
  };
  db.orders.push(order);
  cart.clearCart(userId);
  return order;
}

function listOrders(userId) {
  return db.orders.filter((o) => o.userId === userId);
}

function getOrder(userId, id) {
  const order = db.orders.find((o) => o.id === Number(id));
  if (!order || order.userId !== userId) throw new HttpError(404, 'Order not found');
  return order;
}

module.exports = { checkout, listOrders, getOrder };
