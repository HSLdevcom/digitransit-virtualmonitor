import { test, before, beforeEach, after } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import http from 'node:http';
import crypto from 'node:crypto';
import redis from 'redis';
import Strategy from '../auth/Strategy.js';

const sessionSecret = 'session-availability-test-secret';
const sessionId = 'test-session';
const sessionCookie = `connect.sid=${encodeURIComponent(
  `s:${sessionId}.${crypto
    .createHmac('sha256', sessionSecret)
    .update(sessionId)
    .digest('base64')
    .replace(/=+$/, '')}`,
)}`;
const originalSaasHost = 'monitor.tremonitori.fi';
const userInfo = { sub: 'test-user', issuer: 'hsl' };
const user = {
  data: userInfo,
  token: { id_token: 'test-id-token' },
};

const redisClient = new EventEmitter();
let storedSession;
let sessionReadError;
let sessionReads;
let sessionReadStalled;
let sessionWriteError;
let sessionTouchError;
let lateSessionReads;
let destroyedConnections;
let redisOptions;
let app;
let server;
let baseUrl;
let monitorService;
let generalAxios;
const originalEnv = {};

before(async t => {
  // The app constructs Cosmos and OIDC clients on import; no real services are
  // contacted by these tests.
  const envKeys = [
    'APPSETTING_DB_ENDPOINT',
    'APPSETTING_DB_KEY',
    'APPSETTING_DB_ID',
    'APPSETTING_DB_CONTAINER',
    'SESSION_SECRET',
    'OIDCHOST',
    'OIDC_CLIENT_ID',
    'OIDC_CLIENT_SECRET',
    'MANAGEMENT_API_ID',
    'MANAGEMENT_API_SECRET',
    'NODE_ENV',
    'NODE_TLS_REJECT_UNAUTHORIZED',
  ];
  envKeys.forEach(key => {
    originalEnv[key] = process.env[key];
  });
  process.env.NODE_ENV = 'test';
  process.env.APPSETTING_DB_ENDPOINT = 'https://localhost:8081';
  process.env.APPSETTING_DB_KEY = 'test-key';
  process.env.APPSETTING_DB_ID = 'test-database';
  process.env.APPSETTING_DB_CONTAINER = 'test-container';
  process.env.SESSION_SECRET = sessionSecret;
  process.env.OIDCHOST = JSON.stringify({
    hsl: 'https://identity.example',
    waltti: 'https://waltti-identity.example',
  });
  process.env.OIDC_CLIENT_ID = JSON.stringify({
    hsl: 'test-client',
    waltti: 'waltti-client',
  });
  process.env.OIDC_CLIENT_SECRET = JSON.stringify({
    hsl: 'test-secret',
    waltti: 'waltti-secret',
  });
  process.env.MANAGEMENT_API_ID = JSON.stringify({ hsl: 'test-client' });
  process.env.MANAGEMENT_API_SECRET = JSON.stringify({ hsl: 'test-secret' });

  t.mock.method(redis, 'createClient', (port, host, options) => {
    redisOptions = options;
    return redisClient;
  });
  t.mock.method(Strategy.prototype, 'init', async () => {});

  redisClient.get = (key, callback) => {
    sessionReads += 1;
    if (sessionReadStalled) {
      lateSessionReads.push(callback);
      return;
    }
    callback(sessionReadError, JSON.stringify(storedSession));
  };
  redisClient.expire = (key, ttl, callback) => {
    setImmediate(() => callback(sessionTouchError, 1));
  };
  redisClient.set = (args, callback) => {
    setImmediate(() => {
      if (!sessionWriteError) {
        storedSession = JSON.parse(args[1]);
      }
      callback(sessionWriteError, 'OK');
    });
  };
  redisClient.stream = {
    destroy: () => {
      destroyedConnections += 1;
    },
  };

  ({ default: monitorService } = await import('../monitorService.js'));
  ({ default: generalAxios } = await import(
    '../axios-general-instance-config.js'
  ));
  ({ default: app } = await import('../app.js'));

  t.mock.method(monitorService, 'get', async (req, res) =>
    res.json({ contenthash: req.params.id }),
  );
  t.mock.method(monitorService, 'create', async (req, res) => res.send('OK'));
  t.mock.method(monitorService, 'getStatic', async (req, res) =>
    res.json({ url: req.params.id }),
  );
  t.mock.method(generalAxios, 'get', async () => ({
    status: 200,
    data: userInfo,
  }));

  server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

beforeEach(() => {
  redisClient.ready = false;
  storedSession = { cookie: {}, passport: { user } };
  sessionReadError = null;
  sessionReadStalled = false;
  sessionWriteError = null;
  sessionTouchError = null;
  lateSessionReads = [];
  destroyedConnections = 0;
  sessionReads = 0;
});

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
  }
  Object.entries(originalEnv).forEach(([key, value]) => {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  });
});

const request = (url, options = {}) =>
  fetch(`${baseUrl}${url}`, {
    headers: {
      Cookie: sessionCookie,
      'X-Original-SaaS-Host': originalSaasHost,
      ...options.headers,
    },
    signal: AbortSignal.timeout(2000),
    redirect: 'manual',
    ...options,
  });

test('real public monitor routes and APIs remain available without Redis', async () => {
  const cases = [
    {
      url: '/api/monitor/hash',
      expected: { contenthash: 'hash' },
    },
    {
      url: '/api/staticmonitor/saved-monitor',
      expected: { url: 'saved-monitor' },
    },
    {
      url: '/api/status',
      expected: { status: 'OK' },
    },
  ];

  const responses = await Promise.all(cases.map(({ url }) => request(url)));
  await Promise.all(
    responses.map(async (response, index) => {
      assert.equal(response.status, 200, cases[index].url);
      assert.deepEqual(await response.json(), cases[index].expected);
    }),
  );

  const create = await request('/api/monitor', {
    method: 'PUT',
    headers: {
      Cookie: sessionCookie,
      'X-Original-SaaS-Host': originalSaasHost,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contenthash: 'new-monitor' }),
  });
  assert.equal(create.status, 200);
  assert.equal(await create.text(), 'OK');
  assert.equal(sessionReads, 0);
});

test('authentication endpoints fail promptly without clearing the session cookie', async () => {
  const paths = [
    '/api/user',
    '/hsl-login',
    '/waltti-login',
    '/oid_callback',
    '/oid_waltti_callback',
    '/logout',
    '/logout/callback',
    '/sso/auth',
  ];

  const responses = await Promise.all(paths.map(url => request(url)));
  await Promise.all(
    responses.map(async (response, index) => {
      assert.equal(response.status, 503, paths[index]);
      assert.equal(response.headers.get('cache-control'), 'private, no-store');
      assert.match(response.headers.get('vary'), /Cookie/i);
      assert.equal(response.headers.get('set-cookie'), null, paths[index]);
      await response.text();
    }),
  );

  const staticWrites = await Promise.all(
    ['PUT', 'POST', 'DELETE'].map(method =>
      request('/api/staticmonitor', { method }),
    ),
  );
  await Promise.all(
    staticWrites.map(async (response, index) => {
      assert.equal(response.status, 503, ['PUT', 'POST', 'DELETE'][index]);
      await response.text();
    }),
  );

  assert.equal(sessionReads, 0);
  assert.equal(redisOptions.enable_offline_queue, false);
});

test('session read errors fail closed for authentication', async t => {
  redisClient.ready = true;
  sessionReadError = new Error('Redis connection lost');
  const errorLog = t.mock.method(console, 'error', () => {});

  const account = await request('/api/user');
  assert.equal(account.status, 503);
  await account.text();
  assert.equal(errorLog.mock.calls.length, 1);
});

test('stalled session reads time out for authenticated requests', async t => {
  redisClient.ready = true;
  sessionReadStalled = true;
  const errorLog = t.mock.method(console, 'error', () => {});

  const account = await request('/api/user');
  assert.equal(account.status, 503);
  await account.text();
  assert.equal(destroyedConnections, 1);
  assert.equal(errorLog.mock.calls.length, 1);

  lateSessionReads.forEach(callback =>
    callback(null, JSON.stringify(storedSession)),
  );
  sessionReadStalled = false;
  const recovered = await request('/api/user');
  assert.equal(recovered.status, 200);
  assert.deepEqual(await recovered.json(), userInfo);
});

test('session write errors fail login and SSO without crashing the server', async t => {
  redisClient.ready = true;
  storedSession = { cookie: {} };
  sessionWriteError = new Error('synthetic-sensitive-write-message');
  sessionWriteError.code = 'ECONNRESET';
  sessionWriteError.command = 'SET';
  sessionWriteError.args = [
    'sess:synthetic-session-id',
    JSON.stringify({
      token: {
        access_token: 'synthetic-access-token',
        refresh_token: 'synthetic-refresh-token',
      },
      ssoToken: 'synthetic-sso-token',
    }),
  ];
  const errorLog = t.mock.method(console, 'error', () => {});
  const login = await request('/hsl-login?url=/');
  assert.equal(login.status, 503);
  assert.equal(login.headers.get('set-cookie'), null);
  await login.text();
  const sso = await request('/sso/auth?sso-token=pending&sso-validity=1');
  assert.equal(sso.status, 503);
  assert.equal(sso.headers.get('set-cookie'), null);
  await sso.text();
  assert.equal(errorLog.mock.calls.length, 2);
  errorLog.mock.calls.forEach(call => {
    assert.deepEqual(call.arguments, [
      'Failed to save authentication session',
      { code: 'ECONNRESET', command: 'SET' },
    ]);
  });
});

test('Redis client errors do not log serialized sessions', t => {
  const errorLog = t.mock.method(console, 'error', () => {});
  const error = new Error('synthetic-sensitive-connection-message');
  error.code = 'ECONNRESET';
  error.command = 'AUTH';
  error.args = ['synthetic-authentication-secret'];
  redisClient.emit('error', error);
  assert.deepEqual(errorLog.mock.calls[0].arguments, [
    'Redis connection error',
    { code: 'ECONNRESET', command: 'AUTH' },
  ]);
});

test('session touch errors after response headers are sent do not crash', async t => {
  redisClient.ready = true;
  sessionTouchError = new Error('Redis touch failed');
  const errorLog = t.mock.method(console, 'error', () => {});

  const account = await request('/api/user');
  assert.equal(account.status, 200);
  await account.json();
  await new Promise(resolve => {
    setImmediate(resolve);
  });
  assert.ok(
    errorLog.mock.calls.some(
      call => call.arguments[0] === 'Failed to persist session',
    ),
  );
  sessionTouchError = null;
  const recovered = await request('/api/user');
  assert.equal(recovered.status, 200);
  await recovered.json();
});

test('an existing login resumes when Redis recovers', async () => {
  const unavailable = await request('/api/user');
  assert.equal(unavailable.status, 503);
  await unavailable.text();

  redisClient.ready = true;
  const recovered = await request('/api/user');
  assert.equal(recovered.status, 200);
  assert.deepEqual(await recovered.json(), userInfo);
  assert.equal(sessionReads, 1);
});

test('healthy Redis still rejects unauthenticated account requests', async () => {
  redisClient.ready = true;
  storedSession = { cookie: {} };

  const response = await request('/api/user');
  assert.equal(response.status, 401);
  await response.text();
});

test('healthy Redis still initiates explicit login', async t => {
  redisClient.ready = true;
  storedSession = { cookie: {} };
  t.mock.method(
    Strategy.prototype,
    'createAuthUrl',
    () => 'https://identity.example/authorize',
  );

  const response = await request('/hsl-login?url=/monitors');
  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get('location'),
    'https://identity.example/authorize',
  );
  assert.equal(storedSession.returnTo, 'http://localhost:3000/monitors?');
  await response.text();
});

test('Waltti login keeps its client configuration without a return URL', async t => {
  redisClient.ready = true;
  storedSession = { cookie: {} };
  const createAuthUrl = t.mock.method(
    Strategy.prototype,
    'createAuthUrl',
    () => 'https://waltti-identity.example/authorize',
  );

  const response = await request('/waltti-login');
  assert.equal(response.status, 302);
  assert.equal(
    response.headers.get('location'),
    'https://waltti-identity.example/authorize',
  );
  const { config } = createAuthUrl.mock.calls[0].this;
  assert.equal(
    config.issuerHost,
    'https://waltti-identity.example/.well-known/openid-configuration',
  );
  assert.equal(config.client_id, 'waltti-client');
  assert.equal(config.client_secret, 'waltti-secret');
  assert.equal(storedSession.returnTo, undefined);
  await response.text();
});

test('healthy Redis sends pending SSO through HSL authentication', async t => {
  redisClient.ready = true;
  storedSession = {
    cookie: {},
    ssoToken: 'test-sso',
    ssoValidTo: Math.floor(Date.now() / 1000) + 60,
  };

  const createAuthUrl = t.mock.method(
    Strategy.prototype,
    'createAuthUrl',
    () => 'https://identity.example/authorize',
  );
  const response = await request('/');
  assert.equal(response.status, 302);
  assert.match(response.headers.get('location'), /^\/hsl-login\?/);
  assert.equal(response.headers.get('cache-control'), 'private, no-store');
  await response.text();
  const login = await request(response.headers.get('location'));
  assert.equal(login.status, 302);
  assert.equal(
    login.headers.get('location'),
    'https://identity.example/authorize',
  );
  assert.equal(createAuthUrl.mock.calls[0].arguments[2], 'test-sso');
  await login.text();
});

test('healthy Redis still stores tokens received by the SSO endpoint', async () => {
  redisClient.ready = true;
  storedSession = { cookie: {} };

  const response = await request('/sso/auth?sso-token=pending&sso-validity=1');
  assert.equal(response.status, 200);
  await response.text();
  assert.equal(storedSession.ssoToken, 'pending');
  assert.ok(storedSession.ssoValidTo > Math.floor(Date.now() / 1000));
});
