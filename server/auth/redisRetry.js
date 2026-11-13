// Reconnect delay for the redis client: 200 ms per attempt, capped at 5 s
export const redisRetryStrategy = options => Math.min(options.attempt * 200, 5000);
