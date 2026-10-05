const attempts = new Map();
const MAX_ATTEMPTS = 5;
const LOCK_MS = 15 * 60 * 1000;

function isLocked(key) {
  const entry = attempts.get(key);
  return Boolean(entry && entry.lockedUntil > Date.now());
}

function registerFailure(key) {
  const entry = attempts.get(key) || { count: 0, lockedUntil: 0 };
  entry.count += 1;
  if (entry.count >= MAX_ATTEMPTS) entry.lockedUntil = Date.now() + LOCK_MS;
  attempts.set(key, entry);
}

module.exports = { isLocked, registerFailure };
