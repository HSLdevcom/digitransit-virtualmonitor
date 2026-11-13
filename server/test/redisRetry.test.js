import { test } from 'node:test';
import assert from 'node:assert/strict';
import { redisRetryStrategy } from '../auth/redisRetry.js';

test('grows the reconnect delay by 200 ms per attempt', () => {
  assert.equal(redisRetryStrategy({ attempt: 1 }), 200);
  assert.equal(redisRetryStrategy({ attempt: 3 }), 600);
});

test('caps the reconnect delay at 5 s', () => {
  assert.equal(redisRetryStrategy({ attempt: 25 }), 5000);
  assert.equal(redisRetryStrategy({ attempt: 1000 }), 5000);
});
