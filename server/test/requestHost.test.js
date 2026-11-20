import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hostOf } from '../auth/requestHost.js';

test('hostOf extracts the host from a configured URL', () => {
  assert.equal(hostOf('https://monitor.tremonitori.fi/'), 'monitor.tremonitori.fi');
  assert.equal(hostOf('http://localhost:3000'), 'localhost:3000');
});

test('hostOf returns null for an invalid URL', () => {
  assert.equal(hostOf('not a url'), null);
});
