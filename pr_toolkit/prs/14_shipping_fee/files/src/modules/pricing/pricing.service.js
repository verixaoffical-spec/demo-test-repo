const FREE_SHIPPING_THRESHOLD = 5000;
const FLAT_SHIPPING = 499;

function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : FLAT_SHIPPING;
  return { subtotal, discount: 0, shipping, total: subtotal + shipping };
}

module.exports = { calculateTotals };
