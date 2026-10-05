const crypto = require('crypto');

const SECRET = process.env.TOKEN_SECRET || 'shoplite_dev_secret';
const TTL_SECONDS = 3600;

function now() {
  return Math.floor(Date.now() / 1000);
}

function signature(body) {
  return crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
}

function sign(payload) {
  const claims = { ...payload, exp: now() + TTL_SECONDS };
  const body = Buffer.from(JSON.stringify(claims)).toString('base64url');
  return body + '.' + signature(body);
}

function verify(raw) {
  const parts = String(raw).split('.');
  const body = parts[0];
  const sig = parts[1];
  if (!body || !sig) return null;
  if (signature(body) !== sig) return null;
  let payload;
  try {
    payload = JSON.parse(Buffer.from(body, 'base64url').toString());
  } catch (err) {
    return null;
  }
  if (payload.exp < now()) return null;
  return payload;
}

module.exports = { sign, verify };
