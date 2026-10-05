const COUPONS = {
  SAVE10: { type: 'percent', value: 10 },
  WELCOME5: { type: 'fixed', value: 500 },
};

function findCoupon(code) {
  return COUPONS[String(code).toUpperCase()] || null;
}

function computeDiscount(coupon, subtotal) {
  if (coupon.type === 'percent') return Math.round((subtotal * coupon.value) / 100);
  return coupon.value;
}

module.exports = { findCoupon, computeDiscount };
