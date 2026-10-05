function calculateTotals(items) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { subtotal, discount: 0, shipping: 0, total: subtotal };
}

module.exports = { calculateTotals };
