const { computeDiscount } = require('../coupons/coupons.service');

function calculateTotals(items, coupon) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = coupon ? computeDiscount(coupon, subtotal) : 0;
  return { subtotal, discount, shipping: 0, total: subtotal - discount };
}

module.exports = { calculateTotals };
