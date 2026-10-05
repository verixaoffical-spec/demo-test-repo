const cart = require('./cart.service');
const auth = require('../auth/auth.service');

function register(router) {
  router.add('GET', '/api/cart', ({ req }) => {
    const user = auth.authenticate(req);
    return { body: cart.getCart(user.id) };
  });
  router.add('POST', '/api/cart/items', ({ req, body }) => {
    const user = auth.authenticate(req);
    return { status: 201, body: cart.addItem(user.id, body) };
  });
  router.add('DELETE', '/api/cart/items/:productId', ({ req, params }) => {
    const user = auth.authenticate(req);
    return { body: cart.removeItem(user.id, params.productId) };
  });
}

module.exports = { register };
