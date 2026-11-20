import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import session from 'express-session';
import { createIndexHandler } from '../indexHandler.js';
import { logSessionError } from '../auth/authAudit.js';
import optionalSession from '../auth/optionalSession.js';
import { sessionStoreTimeout } from '../auth/redisRetry.js';

const sessionSecret = 'test-secret';
const sessionCookie = `connect.sid=${encodeURIComponent(
  `s:test-session.${crypto
    .createHmac('sha256', sessionSecret)
    .update('test-session')
    .digest('base64')
    .replace(/=+$/, '')}`,
)}`;

test('session error logging drops unrecognized metadata and raw error details', t => {
  const errorLog = t.mock.method(console, 'error', () => {});
  const error = new Error('synthetic-sensitive-error-message');
  error.code = 'synthetic-sensitive-code';
  error.command = 'synthetic-sensitive-command';
  error.args = ['synthetic-sensitive-session'];
  error.origin = new Error('synthetic-sensitive-origin');
  logSessionError('Session failure', error);
  assert.deepEqual(errorLog.mock.calls[0].arguments, [
    'Session failure',
    { code: 'UNKNOWN', command: 'UNKNOWN' },
  ]);
});

const startIndexServer = async (sessionMiddleware, redisClient) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'public-session-'));
  const indexPath = path.join(directory, 'index.html');
  fs.writeFileSync(
    indexPath,
    '<!doctype html><html><head></head><body>Monitor</body></html>',
  );
  const app = express();
  app.use(optionalSession(sessionMiddleware, redisClient, ['/api']));
  app.get('*', createIndexHandler(indexPath));
  const server = http.createServer(app);
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: async () => {
      await new Promise((resolve, reject) => {
        server.close(error => (error ? reject(error) : resolve()));
      });
      fs.rmSync(directory, { recursive: true, force: true });
    },
  };
};

test('public index page renders without reading Redis when disconnected', async () => {
  let sessionReads = 0;
  const store = new session.MemoryStore();
  const sessionMiddleware = session({
    secret: sessionSecret,
    store,
    resave: false,
    saveUninitialized: false,
  });
  const server = await startIndexServer(
    (req, res, next) => {
      sessionReads += 1;
      sessionMiddleware(req, res, next);
    },
    { ready: false },
  );

  try {
    const response = await fetch(server.url, {
      headers: {
        Cookie: sessionCookie,
        'X-Original-SaaS-Host': 'monitor.example',
      },
    });
    assert.equal(response.status, 200);
    assert.match(
      await response.text(),
      /window.ORIGINAL_SAAS_HOST="monitor.example"/,
    );
    assert.equal(response.headers.get('set-cookie'), null);
    assert.equal(sessionReads, 0);
  } finally {
    await server.close();
  }
});

test('public index page falls back when a Redis session read times out', async t => {
  const store = new session.MemoryStore();
  t.mock.method(store, 'get', () => {});
  const redisClient = {
    ready: true,
    stream: { destroy: () => {} },
  };
  const timedStore = sessionStoreTimeout(store, redisClient, 10);
  const sessionMiddleware = session({
    secret: sessionSecret,
    store: timedStore,
    resave: false,
    saveUninitialized: false,
  });
  t.mock.method(console, 'error', () => {});
  const server = await startIndexServer(sessionMiddleware, redisClient);

  try {
    const response = await fetch(server.url, {
      headers: {
        Cookie: sessionCookie,
        'X-Original-SaaS-Host': 'monitor.example',
      },
    });
    assert.equal(response.status, 200);
    assert.match(
      await response.text(),
      /window.ORIGINAL_SAAS_HOST="monitor.example"/,
    );
    assert.equal(response.headers.get('set-cookie'), null);
  } finally {
    await server.close();
  }
});

test('a session write failure after headers are sent is logged without crashing', async t => {
  const store = new session.MemoryStore();
  const writeError = new Error('synthetic-sensitive-write-message');
  writeError.code = 'ECONNRESET';
  writeError.command = 'SET';
  writeError.args = [
    'sess:synthetic-session-id',
    JSON.stringify({
      token: {
        access_token: 'synthetic-access-token',
        refresh_token: 'synthetic-refresh-token',
      },
      ssoToken: 'synthetic-sso-token',
    }),
  ];
  t.mock.method(store, 'set', (id, value, callback) => {
    setImmediate(() => callback(writeError));
  });
  const errorLog = t.mock.method(console, 'error', () => {});
  const app = express();
  app.use(
    optionalSession(
      session({
        secret: 'test-secret',
        store,
        resave: false,
        saveUninitialized: false,
      }),
      { ready: true },
      ['/auth'],
    ),
  );
  app.post('/auth', (req, res) => {
    req.session.value = 'changed';
    res.send('response already started');
  });
  app.get('/status', (req, res) => res.send('alive'));
  const server = http.createServer(app);
  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve);
  });

  try {
    const url = `http://127.0.0.1:${server.address().port}`;
    const response = await fetch(`${url}/auth`, { method: 'POST' });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'response already started');
    await new Promise(resolve => {
      setImmediate(resolve);
    });
    assert.ok(
      errorLog.mock.calls.some(
        call => call.arguments[0] === 'Failed to persist session',
      ),
    );
    assert.deepEqual(errorLog.mock.calls[0].arguments, [
      'Failed to persist session',
      { code: 'ECONNRESET', command: 'SET' },
    ]);
    const status = await fetch(`${url}/status`);
    assert.equal(await status.text(), 'alive');
  } finally {
    await new Promise(resolve => {
      server.close(resolve);
    });
  }
});
