const test = require('node:test');
const assert = require('node:assert');
const { createApp } = require('../src/app');

let server;
let base;

test.before(async () => {
  server = createApp();
  await new Promise((resolve) => server.listen(0, resolve));
  base = 'http://localhost:' + server.address().port;
});

test.after(() => server.close());

async function call(path, { method = 'GET', token, body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = 'Bearer ' + token;
  const res = await fetch(base + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, data: await res.json() };
}

async function loginAsCustomer() {
  const res = await call('/api/auth/login', {
    method: 'POST',
    body: { email: 'customer@shoplite.test', password: 'Customer123!' },
  });
  return res.data.token;
}

test('health endpoint returns ok', async () => {
  const res = await call('/health');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.status, 'ok');
});

test('login rejects a wrong password', async () => {
  const res = await call('/api/auth/login', {
    method: 'POST',
    body: { email: 'customer@shoplite.test', password: 'wrong' },
  });
  assert.strictEqual(res.status, 401);
});

test('products list returns seeded products', async () => {
  const res = await call('/api/products');
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.data.length, 6);
});

test('cart requires authentication', async () => {
  const res = await call('/api/cart');
  assert.strictEqual(res.status, 401);
});

test('customer can add to cart and check out', async () => {
  const token = await loginAsCustomer();
  const added = await call('/api/cart/items', { method: 'POST', token, body: { productId: 1, quantity: 2 } });
  assert.strictEqual(added.status, 201);
  assert.strictEqual(added.data.subtotal, 4998);
  const order = await call('/api/orders', { method: 'POST', token, body: {} });
  assert.strictEqual(order.status, 201);
  assert.strictEqual(order.data.totals.total, 4998);
  const cart = await call('/api/cart', { token });
  assert.strictEqual(cart.data.items.length, 0);
});

test('customer cannot create products', async () => {
  const token = await loginAsCustomer();
  const res = await call('/api/products', { method: 'POST', token, body: { name: 'X', price: 100 } });
  assert.strictEqual(res.status, 403);
});
