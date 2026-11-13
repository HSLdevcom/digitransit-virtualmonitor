import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';
import { createIndexFileGuard, createIndexHandler } from '../indexHandler.js';

const indexHtml =
  '<!doctype html><html><head><title>Test</title></head><body></body></html>';

let tmpDir;
let server;
let baseUrl;

before(async () => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'index-handler-'));
  fs.writeFileSync(path.join(tmpDir, 'index.html'), indexHtml);

  const app = express();
  app.get('*', createIndexHandler(path.join(tmpDir, 'index.html')));
  server = http.createServer(app);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise(resolve => server.close(resolve));
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

const get = (headers = {}) => fetch(`${baseUrl}/`, { headers });

test('serves index.html unchanged when the header is absent', async () => {
  const res = await get();
  assert.equal(res.status, 200);
  assert.equal(await res.text(), indexHtml);
  assert.match(res.headers.get('vary'), /X-Original-SaaS-Host/i);
});

test('serves index.html unchanged when the header is empty', async () => {
  const res = await get({ 'X-Original-SaaS-Host': '' });
  assert.equal(res.status, 200);
  assert.equal(await res.text(), indexHtml);
});

test('injects the header value into the head', async () => {
  const res = await get({ 'X-Original-SaaS-Host': 'monitor.tremonitori.fi' });
  const body = await res.text();
  assert.equal(res.status, 200);
  assert.ok(
    body.includes(
      '<head><script>window.ORIGINAL_SAAS_HOST="monitor.tremonitori.fi";</script>',
    ),
  );
});

test('marks the injected response as not cacheable and varies on the header', async () => {
  const res = await get({ 'X-Original-SaaS-Host': 'monitor.tremonitori.fi' });
  assert.equal(res.headers.get('cache-control'), 'no-cache');
  assert.match(res.headers.get('vary'), /X-Original-SaaS-Host/i);
  assert.match(res.headers.get('content-type'), /text\/html/);
});

test('escapes "<" so the value cannot close the script tag', async () => {
  const res = await get({ 'X-Original-SaaS-Host': 'x</script><script>alert(1)' });
  const body = await res.text();
  assert.equal(body.split('</script>').length - 1, 1);
  assert.ok(body.includes('\\u003c/script>'));
});

test('escapes quotes and backslashes so the value stays a valid JS string', async () => {
  const res = await get({ 'X-Original-SaaS-Host': 'a"b\\c' });
  const body = await res.text();
  assert.ok(body.includes('window.ORIGINAL_SAAS_HOST="a\\"b\\\\c";'));
});

test('returns 500 when index.html cannot be read', async () => {
  const brokenApp = express();
  brokenApp.get('*', createIndexHandler(path.join(tmpDir, 'missing.html')));
  brokenApp.use((err, req, res, next) => res.status(500).end());
  const brokenServer = http.createServer(brokenApp);
  await new Promise(resolve => brokenServer.listen(0, '127.0.0.1', resolve));
  try {
    const res = await fetch(`http://127.0.0.1:${brokenServer.address().port}/`, {
      headers: { 'X-Original-SaaS-Host': 'monitor.tremonitori.fi' },
    });
    assert.equal(res.status, 500);
  } finally {
    await new Promise(resolve => brokenServer.close(resolve));
  }
});

test('returns 500 when index.html has no head element', async () => {
  fs.writeFileSync(path.join(tmpDir, 'nohead.html'), '<html><body></body></html>');
  const app2 = express();
  app2.get('*', createIndexHandler(path.join(tmpDir, 'nohead.html')));
  app2.use((err, req, res, next) => res.status(500).end());
  const s = http.createServer(app2);
  await new Promise(resolve => s.listen(0, '127.0.0.1', resolve));
  try {
    const res = await fetch(`http://127.0.0.1:${s.address().port}/`, {
      headers: { 'X-Original-SaaS-Host': 'monitor.tremonitori.fi' },
    });
    assert.equal(res.status, 500);
  } finally {
    await new Promise(resolve => s.close(resolve));
  }
});

test('injects /index.html requests that go through the guard before static', async () => {
  const app3 = express();
  const file = path.join(tmpDir, 'index.html');
  app3.use(createIndexFileGuard(file));
  app3.use(express.static(tmpDir, { index: false }));
  const s = http.createServer(app3);
  await new Promise(resolve => s.listen(0, '127.0.0.1', resolve));
  try {
    const base = `http://127.0.0.1:${s.address().port}`;
    const injected = await fetch(`${base}/index.html`, {
      headers: { 'X-Original-SaaS-Host': 'monitor.tremonitori.fi' },
    });
    assert.ok((await injected.text()).includes('window.ORIGINAL_SAAS_HOST='));
    const plain = await fetch(`${base}/index.html`);
    assert.equal(await plain.text(), indexHtml);
  } finally {
    await new Promise(resolve => s.close(resolve));
  }
});
