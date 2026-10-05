const orders = require('./orders.service');
const auth = require('../auth/auth.service');

function register(router) {
  router.add('POST', '/api/orders', ({ req }) => {
    const user = auth.authenticate(req);
    return { status: 201, body: orders.checkout(user.id) };
  });
  router.add('GET', '/api/orders', ({ req }) => {
    const user = auth.authenticate(req);
    return { body: orders.listOrders(user.id) };
  });
  router.add('GET', '/api/orders/:id', ({ req, params }) => {
    const user = auth.authenticate(req);
    return { body: orders.getOrder(user.id, params.id) };
  });
}

module.exports = { register };
