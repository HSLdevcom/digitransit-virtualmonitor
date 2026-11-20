import { isSessionStoreError } from './authAudit.js';

// Reconnect delay for the redis client: 200 ms per attempt, capped at 5 s
export const redisRetryStrategy = options =>
  Math.min(options.attempt * 200, 5000);

// redis v3 otherwise stops retrying after its cumulative connect_timeout.
export const continuousRedisRetry = getClient => options => {
  const client = getClient();
  if (client) {
    client.retry_totaltime = 0;
  }
  return redisRetryStrategy(options);
};

const SESSION_OPERATION_TIMEOUT_MS = 1000;
const SESSION_SOCKET_RESET_GRACE_MS = 4000;

// A timed-out request fails fast, but the shared socket is only reset if the
// operation is still unanswered after the grace period; a late reply cancels it.
export function sessionStoreTimeout(
  store,
  redisClient,
  timeoutMs = SESSION_OPERATION_TIMEOUT_MS,
  resetGraceMs = SESSION_SOCKET_RESET_GRACE_MS,
) {
  ['get', 'set', 'touch', 'destroy'].forEach(method => {
    const original = store[method];
    store[method] = function timedStoreOperation(...args) {
      const callback = args.pop();
      const { stream } = redisClient;
      let completed = false;
      let resetTimer;
      const finish = (...result) => {
        if (completed) {
          return;
        }
        completed = true;
        clearTimeout(timer);
        if (isSessionStoreError(result[0])) {
          result[0].status = 503;
        }
        callback(...result);
      };
      const timer = setTimeout(() => {
        const error = new Error(`Redis session ${method} timed out`);
        error.code = 'SESSION_STORE_TIMEOUT';
        finish(error);
        resetTimer = setTimeout(() => {
          if (stream && redisClient.stream === stream) {
            stream.destroy();
          }
        }, resetGraceMs);
        resetTimer.unref();
      }, timeoutMs);
      const onReply = (...result) => {
        clearTimeout(resetTimer);
        finish(...result);
      };

      try {
        original.call(this, ...args, onReply);
      } catch (error) {
        if (completed) {
          throw error;
        }
        finish(error);
      }
    };
  });
  return store;
}
