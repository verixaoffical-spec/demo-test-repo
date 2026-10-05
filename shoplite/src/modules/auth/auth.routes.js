const auth = require('./auth.service');

function register(router) {
  router.add('POST', '/api/auth/register', ({ body }) => ({ status: 201, body: auth.register(body) }));
  router.add('POST', '/api/auth/login', ({ body }) => ({ body: auth.login(body) }));
  router.add('GET', '/api/auth/me', ({ req }) => ({ body: auth.authenticate(req) }));
}

module.exports = { register };
