const { readJson } = require('./http');

class Router {
  constructor() {
    this.routes = [];
  }

  add(method, path, handler) {
    const keys = [];
    const source = path.replace(/:([a-zA-Z]+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
    this.routes.push({ method, pattern: new RegExp('^' + source + '$'), keys, handler });
  }

  async handle(req, url) {
    for (const route of this.routes) {
      if (route.method !== req.method) continue;
      const match = route.pattern.exec(url.pathname);
      if (!match) continue;
      const params = {};
      route.keys.forEach((key, i) => {
        params[key] = decodeURIComponent(match[i + 1]);
      });
      const hasBody = ['POST', 'PUT', 'PATCH'].includes(req.method);
      const body = hasBody ? await readJson(req) : {};
      const query = Object.fromEntries(url.searchParams);
      return route.handler({ req, params, query, body });
    }
    return null;
  }
}

module.exports = { Router };
