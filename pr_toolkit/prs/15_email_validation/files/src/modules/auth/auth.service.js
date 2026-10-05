const db = require('../../data/db');
const { HttpError } = require('../../core/http');
const { hashPassword } = require('../../core/crypto');
const token = require('../../core/token');

function publicUser(user) {
  return { id: user.id, email: user.email, name: user.name, role: user.role };
}

function register({ email, password, name } = {}) {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new HttpError(400, 'A valid email is required');
  email = email.trim().toLowerCase();
  if (!password || password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters');
  if (db.users.find((u) => u.email === email)) throw new HttpError(409, 'Email already registered');
  const user = {
    id: db.nextUserId++,
    email,
    name: name || email,
    role: 'customer',
    passwordHash: hashPassword(password),
  };
  db.users.push(user);
  return publicUser(user);
}

function login({ email, password } = {}) {
  const user = db.users.find((u) => u.email === email);
  if (!user || user.passwordHash !== hashPassword(password || '')) {
    throw new HttpError(401, 'Invalid credentials');
  }
  return { token: token.sign({ sub: user.id }), user: publicUser(user) };
}

function authenticate(req) {
  const header = req.headers.authorization || '';
  const raw = header.startsWith('Bearer ') ? header.slice(7) : '';
  const payload = token.verify(raw);
  if (!payload) throw new HttpError(401, 'Authentication required');
  const user = db.users.find((u) => u.id === payload.sub);
  if (!user) throw new HttpError(401, 'Authentication required');
  return publicUser(user);
}

function requireAdmin(user) {
  if (user.role !== 'admin') throw new HttpError(403, 'Admin access required');
}

module.exports = { register, login, authenticate, requireAdmin };
