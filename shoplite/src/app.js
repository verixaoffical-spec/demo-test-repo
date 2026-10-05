const http = require('http');
const fs = require('fs');
const path = require('path');
const { Router } = require('./core/router');
const { sendJson } = require('./core/http');

const router = new Router();
require('./modules/auth/auth.routes').register(router);
require('./modules/products/products.routes').register(router);
require('./modules/cart/cart.routes').register(router);
require('./modules/orders/orders.routes').register(router);

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };

function serveStatic(res, pathname) {
  const file = pathname === '/' ? '/index.html' : pathname;
  const full = path.join(PUBLIC_DIR, file);
  if (!full.startsWith(PUBLIC_DIR) || !fs.existsSync(full) || !fs.statSync(full).isFile()) {
    return sendJson(res, 404, { error: 'Not found' });
  }
  res.writeHead(200, { 'Content-Type': MIME[path.extname(full)] || 'application/octet-stream' });
  fs.createReadStream(full).pipe(res);
}

function createApp() {
  return http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    try {
      if (url.pathname === '/health') return sendJson(res, 200, { status: 'ok' });
      if (url.pathname.startsWith('/api/')) {
        const result = await router.handle(req, url);
        if (!result) return sendJson(res, 404, { error: 'Not found' });
        return sendJson(res, result.status || 200, result.body);
      }
      return serveStatic(res, url.pathname);
    } catch (err) {
      return sendJson(res, err.status || 500, { error: err.message });
    }
  });
}

module.exports = { createApp };
