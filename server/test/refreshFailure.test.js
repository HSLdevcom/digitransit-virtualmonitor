import { test } from 'node:test';
import assert from 'node:assert/strict';
import OICStrategy from '../auth/Strategy.js';

const { refresh } = OICStrategy.prototype;

const createStrategy = refreshError => {
  const calls = { success: 0, fail: [] };
  const strategy = {
    client: { refresh: () => Promise.reject(refreshError) },
    success: () => {
      calls.success += 1;
    },
    fail: err => {
      calls.fail.push(err);
    },
  };
  return { strategy, calls };
};

const createReq = logoutError => {
  const req = {
    sessionID: 'sid',
    headers: {},
    user: { token: { refresh_token: 'refresh' }, data: { sub: 'user' } },
    logout: cb => cb(logoutError),
    session: {
      destroy: () => {
        req.destroyed = true;
      },
    },
  };
  return req;
};

test('destroys the session and fails when token refresh fails', async t => {
  t.mock.method(console, 'error', () => {});
  t.mock.method(console, 'log', () => {});
  const refreshError = new Error('invalid_grant');
  const { strategy, calls } = createStrategy(refreshError);
  const req = createReq(undefined);

  await refresh.call(strategy, req);

  assert.equal(req.destroyed, true);
  assert.deepEqual(calls.fail, [refreshError]);
  assert.equal(calls.success, 0);
});

test('still destroys the session when logout reports an error', async t => {
  const errorLog = t.mock.method(console, 'error', () => {});
  const auditLog = t.mock.method(console, 'log', () => {});
  const refreshError = new Error('synthetic-sensitive-refresh-message');
  refreshError.error = 'synthetic-sensitive-refresh-code';
  refreshError.response = {
    data: { access_token: 'synthetic-refresh-token' },
  };
  const { strategy, calls } = createStrategy(refreshError);
  const logoutError = new Error('synthetic-sensitive-logout-message');
  logoutError.code = 'ECONNRESET';
  logoutError.command = 'SET';
  logoutError.args = ['sess:sid', '{"token":"synthetic-refresh-token"}'];
  const req = createReq(logoutError);

  await refresh.call(strategy, req);

  assert.equal(req.destroyed, true);
  assert.equal(calls.fail.length, 1);
  assert.ok(
    errorLog.mock.calls.some(
      c =>
        c.arguments[0] === 'Logout failed' &&
        c.arguments[1].code === 'ECONNRESET' &&
        c.arguments[1].command === 'SET',
    ),
  );
  assert.doesNotMatch(
    JSON.stringify([
      ...errorLog.mock.calls.map(c => c.arguments),
      ...auditLog.mock.calls.map(c => c.arguments),
    ]),
    /synthetic-sensitive|synthetic-refresh-token/,
  );
});
