import { test } from 'node:test';
import assert from 'node:assert/strict';
import OICStrategy from '../auth/Strategy.js';

const refresh = OICStrategy.prototype.refresh;

const createStrategy = refreshError => {
  const calls = { success: 0, fail: [] };
  const strategy = {
    client: { refresh: () => Promise.reject(refreshError) },
    success: () => { calls.success += 1; },
    fail: err => { calls.fail.push(err); },
  };
  return { strategy, calls };
};

const createReq = logoutError => {
  const req = {
    sessionID: 'sid',
    headers: {},
    user: { token: { refresh_token: 'refresh' }, data: { sub: 'user' } },
    logout: cb => cb(logoutError),
    session: { destroy: () => { req.destroyed = true; } },
  };
  return req;
};

test('destroys the session and fails when token refresh fails', async t => {
  t.mock.method(console, 'error', () => {});
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
  const { strategy, calls } = createStrategy(new Error('invalid_grant'));
  const logoutError = new Error('logout failed');
  const req = createReq(logoutError);

  await refresh.call(strategy, req);

  assert.equal(req.destroyed, true);
  assert.equal(calls.fail.length, 1);
  assert.ok(errorLog.mock.calls.some(c => c.arguments[1] === logoutError));
});
