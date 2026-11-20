/* eslint-disable no-console */
import crypto from 'crypto';

// Auth audit logging. Never logs tokens; session ids and user ids are
// HMAC-hashed so that events can be correlated without exposing identities.
// Lifecycle events (login, refresh, failures) are always logged; per-request
// events are only logged when AUTH_AUDIT=true.
const key = process.env.SESSION_SECRET || 'reittiopas_secret';
const verbose = process.env.AUTH_AUDIT === 'true';

const sessionErrorCodes = new Set([
  'ECONNREFUSED',
  'ECONNRESET',
  'ETIMEDOUT',
  'ENOTFOUND',
  'EAI_AGAIN',
  'EPIPE',
  'NR_CLOSED',
  'NR_OFFLINE',
  'CONNECTION_BROKEN',
  'UNCERTAIN_STATE',
  'SESSION_STORE_TIMEOUT',
  'READONLY',
  'NOAUTH',
  'WRONGPASS',
  'ERR',
]);
const sessionCommands = new Set([
  'GET',
  'SET',
  'EXPIRE',
  'DEL',
  'AUTH',
  'INFO',
  'SMEMBERS',
  'SADD',
]);

export const isSessionStoreError = error => sessionErrorCodes.has(error?.code);

export function logSessionError(message, error) {
  // Redis errors can include the entire serialized session in their arguments.
  console.error(message, {
    code: sessionErrorCodes.has(error?.code) ? error.code : 'UNKNOWN',
    command: sessionCommands.has(error?.command) ? error.command : 'UNKNOWN',
  });
}

export const hash = value =>
  value
    ? crypto
        .createHmac('sha256', key)
        .update(String(value))
        .digest('hex')
        .slice(0, 12)
    : '-';

// Mobile IPs change often, so only a coarse prefix is logged
const coarseIp = req => {
  const ip = (req.headers['x-forwarded-for'] || req.ip || '')
    .split(',')[0]
    .trim();
  if (ip.includes(':')) {
    return `${ip.split(':').slice(0, 3).join(':')}::/48`;
  }
  return ip ? `${ip.split('.').slice(0, 2).join('.')}.0.0/16` : '-';
};

export function audit(event, req, extra = {}, alwaysLog = true) {
  if (!alwaysLog && !verbose) {
    return;
  }
  console.log(
    `AUTH_AUDIT ${JSON.stringify({
      event,
      ts: new Date().toISOString(),
      sid: hash(req.sessionID),
      sub: hash(req.user?.data?.sub),
      ip: coarseIp(req),
      ua: req.headers['user-agent'] || '-',
      path: req.path,
      ...extra,
    })}`,
  );
}

// Responses that may set or depend on a session cookie must never be shared
export function privateNoStore(req, res, next) {
  res.set('Cache-Control', 'private, no-store');
  res.vary('Cookie');
  next();
}
