import { test } from 'node:test';
import assert from 'node:assert/strict';
import OICStrategy from '../auth/Strategy.js';

const createRedirectUrl = OICStrategy.prototype.createRedirectUrl;
const strategy = {
  callbackPath: '/oid_callback',
  config: { allowedHosts: ['monitor.tremonitori.fi', 'provider.example.com'] },
};

test('prefers the original SaaS host over forwarded and Host headers', () => {
  const req = {
    secure: true,
    headers: {
      'x-original-saas-host': 'monitor.tremonitori.fi',
      'x-forwarded-host': 'provider.example.com',
      host: 'internal.example.com',
    },
  };
  assert.equal(
    createRedirectUrl.call(strategy, req),
    'https://monitor.tremonitori.fi/oid_callback',
  );
});

test('falls back to x-forwarded-host when the original host is absent', () => {
  const req = {
    secure: false,
    headers: {
      'x-forwarded-host': 'provider.example.com',
      host: 'internal.example.com',
    },
  };
  assert.equal(
    createRedirectUrl.call(strategy, req),
    'http://provider.example.com/oid_callback',
  );
});

test('falls back to the Host header when no forwarding headers are present', () => {
  const req = { secure: true, headers: { host: 'monitor.example.com' } };
  assert.equal(
    createRedirectUrl.call(strategy, req),
    'https://monitor.example.com/oid_callback',
  );
});

test('ignores a forwarded host that is not in the allowlist', () => {
  const req = {
    secure: true,
    headers: {
      'x-original-saas-host': 'attacker.example.org',
      host: 'internal.example.com',
    },
  };
  assert.equal(
    createRedirectUrl.call(strategy, req),
    'https://internal.example.com/oid_callback',
  );
});
