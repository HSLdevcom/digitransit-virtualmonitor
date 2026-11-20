import { test } from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import net from 'node:net';
import redis from 'redis';
import session from 'express-session';
import connectRedis from 'connect-redis';
import { sessionStoreTimeout } from '../auth/redisRetry.js';

const sleep = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

test('times out a stalled store operation and ignores a late reply', async () => {
  let reply;
  let disconnects = 0;
  let calls = 0;
  const client = {
    stream: {
      destroy: () => {
        disconnects += 1;
      },
    },
  };
  const store = sessionStoreTimeout(
    {
      get: (key, callback) => {
        reply = callback;
      },
      set() {},
      touch() {},
      destroy() {},
    },
    client,
    10,
    20,
  );

  const result = await new Promise(resolve => {
    store.get('sid', (err, value) => {
      calls += 1;
      resolve({ err, value });
    });
  });
  assert.equal(result.err.code, 'SESSION_STORE_TIMEOUT');
  assert.equal(disconnects, 0);
  await sleep(60);
  assert.equal(disconnects, 1);
  reply(null, { user: 'late' });
  assert.equal(calls, 1);
});

test('a reply within the grace period keeps the Redis connection', async () => {
  let reply;
  let disconnects = 0;
  const client = {
    stream: {
      destroy: () => {
        disconnects += 1;
      },
    },
  };
  const store = sessionStoreTimeout(
    {
      get: (key, callback) => {
        reply = callback;
      },
      set() {},
      touch() {},
      destroy() {},
    },
    client,
    10,
    100,
  );

  const result = await new Promise(resolve => {
    store.get('sid', (err, value) => resolve({ err, value }));
  });
  assert.equal(result.err.code, 'SESSION_STORE_TIMEOUT');
  reply(null, { user: 'late' });
  await sleep(150);
  assert.equal(disconnects, 0);
});

test('marks only Redis and timeout errors as 503', async () => {
  const redisError = Object.assign(new Error('connection lost'), {
    code: 'ECONNRESET',
  });
  const parseError = new SyntaxError('Unexpected token in session');
  const failWith = error =>
    sessionStoreTimeout(
      {
        get: (key, callback) => callback(error),
        set() {},
        touch() {},
        destroy() {},
      },
      { stream: null },
    );

  const redisResult = await new Promise(resolve => {
    failWith(redisError).get('sid', resolve);
  });
  const parseResult = await new Promise(resolve => {
    failWith(parseError).get('sid', resolve);
  });
  assert.equal(redisResult.status, 503);
  assert.equal(parseResult.status, undefined);
});

test('a late timeout does not disconnect a replacement Redis connection', async () => {
  let oldDisconnects = 0;
  let newDisconnects = 0;
  const client = {
    stream: {
      destroy: () => {
        oldDisconnects += 1;
      },
    },
  };
  const store = sessionStoreTimeout(
    {
      get() {},
      set() {},
      touch() {},
      destroy() {},
    },
    client,
    10,
    10,
  );

  const timedOut = new Promise(resolve => {
    store.set('sid', {}, err => resolve(err));
  });
  client.stream = {
    destroy: () => {
      newDisconnects += 1;
    },
  };
  assert.equal((await timedOut).code, 'SESSION_STORE_TIMEOUT');
  await sleep(50);
  assert.equal(oldDisconnects, 0);
  assert.equal(newDisconnects, 0);
});

test('a Redis connection that stops replying is reset after a session timeout', async () => {
  const server = net.createServer(socket => {
    socket.resume();
  });
  await new Promise(resolve => {
    server.listen(0, '127.0.0.1', resolve);
  });
  const client = redis.createClient(server.address().port, '127.0.0.1', {
    no_ready_check: true,
    enable_offline_queue: false,
    retry_strategy: () => 10,
  });
  try {
    await once(client, 'ready');
    const RedisStore = connectRedis(session);
    const store = sessionStoreTimeout(
      new RedisStore({ client }),
      client,
      30,
      30,
    );
    const stalledStream = client.stream;
    const error = await new Promise(resolve => {
      store.get('sid', resolve);
    });
    assert.equal(error.code, 'SESSION_STORE_TIMEOUT');
    assert.equal(error.status, 503);
    await once(stalledStream, 'close');
    assert.equal(stalledStream.destroyed, true);
  } finally {
    client.end(true);
    await new Promise(resolve => {
      server.close(resolve);
    });
  }
});
