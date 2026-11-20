import { test } from 'node:test';
import assert from 'node:assert/strict';
import OICStrategy from '../auth/Strategy.js';

// Object.create skips the constructor, which would otherwise call Issuer.discover
const createStrategy = ({ client, sessionCallback } = {}) => {
  const calls = { success: [], fail: [] };
  const strategy = Object.create(OICStrategy.prototype);
  Object.assign(strategy, {
    client,
    config: { sessionCallback },
    callbackPath: '/oid_callback',
    success: user => calls.success.push(user),
    fail: err => calls.fail.push(err),
  });
  return { strategy, calls };
};

const createReq = () => ({
  sessionID: 'sid',
  headers: { host: 'example.test' },
  path: '/oid_callback',
  query: { code: 'code', state: 'state' },
  user: {
    token: { refresh_token: 'old-refresh', id_token: 'old-id' },
    data: { sub: 'user-1' },
  },
  session: {
    id: 'sid',
    ssoToken: 'token',
    ssoValidTo: 999,
    destroy() {
      this.destroyed = true;
    },
  },
  logout: cb => cb(undefined),
});

const logged = mock => mock.mock.calls.map(c => c.arguments.join(' '));

test('refresh keeps the old refresh and id tokens when the IdP omits them', async t => {
  t.mock.method(console, 'log', () => {});
  const client = {
    refresh: async () => ({ access_token: 'new-access', expires_in: 300 }),
    userinfo: async () => ({ sub: 'user-1' }),
  };
  const { strategy, calls } = createStrategy({ client });
  const req = createReq();

  await OICStrategy.prototype.refresh.call(strategy, req);

  assert.equal(calls.fail.length, 0);
  assert.equal(calls.success.length, 1);
  const [user] = calls.success;
  assert.equal(user.data.sub, 'user-1');
  assert.equal(user.token.access_token, 'new-access');
  assert.equal(user.token.refresh_token, 'old-refresh');
  assert.equal(user.token.id_token, 'old-id');
});

test('refresh rejects a token for a different user and destroys the session', async t => {
  const log = t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'error', () => {});
  const client = {
    refresh: async () => ({ access_token: 'new-access' }),
    userinfo: async () => ({ sub: 'user-2' }),
  };
  const { strategy, calls } = createStrategy({ client });
  const req = createReq();

  await OICStrategy.prototype.refresh.call(strategy, req);

  assert.equal(calls.success.length, 0);
  assert.equal(calls.fail.length, 1);
  assert.equal(calls.fail[0].message, 'Refreshed user does not match session user');
  assert.equal(req.session.destroyed, true);
  assert.ok(logged(log).some(line => line.includes('refresh_sub_mismatch')));
});

test('callback exchanges the code, clears SSO state and logs in the user', async t => {
  t.mock.method(console, 'log', () => {});
  const seen = {};
  const client = {
    callback: async (redirectUri, query, checks) => {
      Object.assign(seen, { redirectUri, query, checks });
      return { access_token: 'access', claims: () => ({}) };
    },
    userinfo: async () => ({ sub: 'user-1' }),
  };
  const sessionCalls = [];
  const { strategy, calls } = createStrategy({
    client,
    sessionCallback: (sub, sid) => sessionCalls.push([sub, sid]),
  });
  const req = createReq();

  await OICStrategy.prototype.callback.call(strategy, req, {});

  assert.equal(seen.redirectUri, 'http://example.test/oid_callback');
  assert.equal(seen.checks.state, 'state');
  assert.equal(req.session.ssoToken, null);
  assert.equal(req.session.ssoValidTo, null);
  assert.equal(calls.fail.length, 0);
  assert.equal(calls.success.length, 1);
  assert.equal(calls.success[0].data.sub, 'user-1');
  assert.deepEqual(sessionCalls, [['user-1', 'sid']]);
});

test('callback failure clears SSO state and fails without logging in', async t => {
  t.mock.method(console, 'log', () => {});
  const errorLog = t.mock.method(console, 'error', () => {});
  const callbackError = new Error('bad state');
  const client = {
    callback: async () => {
      throw callbackError;
    },
  };
  const { strategy, calls } = createStrategy({ client });
  const req = createReq();

  await OICStrategy.prototype.callback.call(strategy, req, {});

  assert.equal(calls.success.length, 0);
  assert.deepEqual(calls.fail, [callbackError]);
  assert.equal(req.session.ssoToken, null);
  assert.equal(req.session.ssoValidTo, null);
  assert.ok(errorLog.mock.calls.some(c => c.arguments[1] === callbackError));
});
