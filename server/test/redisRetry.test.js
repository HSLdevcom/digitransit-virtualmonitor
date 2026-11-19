import { test } from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { once } from 'node:events';
import redis from 'redis';
import {
  redisRetryStrategy,
  continuousRedisRetry,
} from '../auth/redisRetry.js';

test('grows the reconnect delay by 200 ms per attempt', () => {
  assert.equal(redisRetryStrategy({ attempt: 1 }), 200);
  assert.equal(redisRetryStrategy({ attempt: 3 }), 600);
});

test('caps the reconnect delay at 5 s', () => {
  assert.equal(redisRetryStrategy({ attempt: 25 }), 5000);
  assert.equal(redisRetryStrategy({ attempt: 1000 }), 5000);
});

test('reconnects after the Redis v3 cumulative connection timeout', async () => {
  const server = net.createServer();
  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const { port } = server.address();
  await new Promise(resolve => {
    server.close(resolve);
  });

  let client;
  let reconnects = 0;
  try {
    client = redis.createClient(port, '127.0.0.1', {
      retry_strategy: continuousRedisRetry(() => client),
      connect_timeout: 60,
      enable_offline_queue: false,
      no_ready_check: true,
    });
    client.on('reconnecting', () => {
      reconnects += 1;
      if (reconnects === 4) {
        server.listen(port, '127.0.0.1');
      }
    });
    await Promise.race([
      once(client, 'ready'),
      new Promise((resolve, reject) => {
        const timer = setTimeout(
          () => reject(new Error('Redis did not recover')),
          3000,
        );
        timer.unref();
      }),
    ]);
    assert.ok(reconnects >= 4);
    assert.equal(client.closing, false);
  } finally {
    if (client) {
      client.end(true);
    }
    if (server.listening) {
      await new Promise(resolve => {
        server.close(resolve);
      });
    }
  }
});
