import { logSessionError, privateNoStore } from './authAudit.js';

export default function optionalSession(
  middleware,
  redisClient,
  requiredPaths,
) {
  return (req, res, next) => {
    const requestPath = req.path.toLowerCase();
    const required = requiredPaths.some(
      path => requestPath === path || requestPath.startsWith(`${path}/`),
    );
    const unavailable = () => {
      if (required) {
        privateNoStore(req, res, () => {
          res.status(503).send('Authentication temporarily unavailable');
        });
      } else {
        next();
      }
    };

    // Never queue a session lookup behind Redis reconnection.
    if (!redisClient.ready) {
      unavailable();
      return;
    }

    let sessionLoaded = false;
    middleware(req, res, err => {
      if (err) {
        logSessionError(
          sessionLoaded
            ? 'Failed to persist session'
            : 'Failed to load session',
          err,
        );
        if (sessionLoaded) {
          if (!res.headersSent) {
            err.status = 503;
            next(err);
          }
          return;
        }
        delete req.session;
        unavailable();
        return;
      }
      sessionLoaded = true;
      next();
    });
  };
}
