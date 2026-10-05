const products = require('./products.service');
const auth = require('../auth/auth.service');

function register(router) {
  router.add('GET', '/api/products', ({ query }) => ({ body: products.list(query) }));
  router.add('GET', '/api/products/:id', ({ params }) => ({ body: products.get(params.id) }));
  router.add('DELETE', '/api/products/:id', ({ req, params }) => {
    auth.authenticate(req);
    return { body: products.remove(params.id) };
  });
  router.add('POST', '/api/products', ({ req, body }) => {
    const user = auth.authenticate(req);
    auth.requireAdmin(user);
    return { status: 201, body: products.create(body) };
  });
}

module.exports = { register };
