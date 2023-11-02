/* eslint-disable func-names, no-console */
import passport from 'passport';
import session from 'express-session';
import redis from 'redis';
import axios from '../axios-general-instance-config.js';
import dayjs from 'dayjs';
import connectRedis from 'connect-redis';
import Strategy from './Strategy.js';
import { parseEnvPropJSON } from '../config.js';

const OIDCHost_hsl =
  parseEnvPropJSON(process.env.OIDCHOST, 'OIDCHOST').hsl || 'https://hslid-dev.t5.fi';
const OIDCHost_waltti = parseEnvPropJSON(process.env.OIDCHOST, 'OIDCHOST').waltti;
const oidcClientIdList = parseEnvPropJSON(process.env.OIDC_CLIENT_ID, 'OIDC_CLIENT_ID');
const oidcClientSecretList = parseEnvPropJSON(process.env.OIDC_CLIENT_SECRET, 'OIDC_CLIENT_SECRET');

export const errorHandler = function (res, err) {
  const status = err?.message && err.message.includes('timeout') ? 408 : 500;

  if (err?.response) {
    res
      .status(err.response.status || status)
      .send(err.response.data || err?.message || 'Unknown err');
  } else {
    res.status(status).send(err?.message || 'Unknown error');
  }
};

function selectOidcHost(req) {
  const userData = JSON.stringify(req?.user?.data);
  if (userData.indexOf('hsl') !== -1) {
    return OIDCHost_hsl;
  } else if (userData.indexOf('waltti') !== -1) {
    return OIDCHost_waltti;
  } else {
    return '';
  }
}

export const userAuthenticated = function (req, res, next) {
  const oidc_host = selectOidcHost(req);
  axios
    .get(`${oidc_host}/openid/userinfo`, {
      headers: { Authorization: `Bearer ${req.user.token.access_token}` },
    })
    .then(() => {
      next();
    })
    .catch(err => {
      errorHandler(res, err);
    });
};

const RedisStore = connectRedis(session);

const clearAllUserSessions = false; // set true if logout should erase all user's sessions

const debugLogging = process.env.DEBUGLOGGING;

axios.defaults.timeout = 12000;

function setUpOIDC(app, port, indexPath, hostnames, paths, localPort) {
  /* ********* Setup OpenID Connect ********* */
  const hslCallbackPath = '/oid_callback'; // connect HSL callback path
  const walttiCallbackPath = '/oid_waltti_callback'; // connect Waltti callback path
  const logoutCallbackPath = '/logout/callback';

  const RedisHost = process.env.REDIS_HOST || '127.0.0.1';
  const RedisPort = process.env.REDIS_PORT || 6379;
  const RedisKey = process.env.REDIS_KEY;
  const RedisClient = RedisKey
    ? redis.createClient(RedisPort, RedisHost, {
      auth_pass: RedisKey,
      tls: { servername: RedisHost },
    })
    : redis.createClient(RedisPort, RedisHost);

  const redirectUris = hostnames.map(host => `${host}${hslCallbackPath}`);
  const postLogoutRedirectUris = hostnames.map(
    host => `${host}${logoutCallbackPath}`,
  );
  if (process.env.NODE_ENV === 'development') {
    redirectUris.push(`http://localhost:${port}${hslCallbackPath}`);
    postLogoutRedirectUris.push(
      `http://localhost:${port}${logoutCallbackPath}`,
    );
  }

  RedisClient.on('error', err => {
    console.error(err);
  });

  // Use Passport with OpenId Connect strategy to authenticate users
  const hslStrategyName = 'passport-openid-connect-hsl';
  const walttiStrategyName = 'passport-openid-connect-waltti';
  const hslConfiguration = configurationStrategy(hslStrategyName, hslCallbackPath, OIDCHost_hsl, oidcClientIdList.hsl, oidcClientSecretList.hsl);
  const walttiConfiguration = OIDCHost_waltti
  ? configurationStrategy(
      walttiStrategyName,
      walttiCallbackPath,
      OIDCHost_waltti,
      oidcClientIdList.waltti,
      oidcClientSecretList.waltti
    )
  : null;
  
  function configurationStrategy(strategyName, callbackPath, OIDCHost, client_id, client_secret) {
    return new Strategy(strategyName, callbackPath, {
      issuerHost: `${OIDCHost}/.well-known/openid-configuration`,
      client_id: client_id,
      client_secret: client_secret,
      redirect_uris: redirectUris,
      post_logout_redirect_uris: postLogoutRedirectUris,
      scope: 'openid profile',
      sessionCallback(userId, sessionId) {
        // keep track of per-user sessions
        if (debugLogging) {
          console.log(`adding session for used ${userId} id ${sessionId}`);
        }
        if (clearAllUserSessions) {
          RedisClient.sadd(`sessions-${userId}`, sessionId);
        }
      },
    });
  }

  const redirectToLogin = function (req, res, next) {
    const { ssoValidTo, ssoToken } = req.session;
    // Only allow sso login when user navigates to certain paths
    // Query parameter is string type
    if (
      req.query.sso !== 'false' &&
      (req.path === `/${indexPath}` ||
        paths.some(path => req.path.includes(path))) &&
      !req.isAuthenticated() &&
      ssoToken &&
      ssoValidTo &&
      ssoValidTo > dayjs().unix()
    ) {
      const params = Object.keys(req.query)
        .map(k => `${k}=${req.query[k]}`)
        .join('&');
      if (debugLogging) {
        console.log(
          'redirecting to login with sso token ',
          JSON.stringify(ssoToken),
        );
      }
      res.redirect(`/login?${params}&url=${req.path}`);
    } else {
      next();
    }
  };

  const refreshTokens = function (req, res, next) {
    const token = req?.user?.token;
    if (
      req.isAuthenticated() &&
      req.session &&
      token?.refresh_token &&
      dayjs().unix() >= token?.expires_at
    ) {
      const userData = JSON.stringify(req?.user?.data);
      let oidcStrategyName = '';
      if (userData.indexOf('hsl') !== -1) {
        oidcStrategyName = hslStrategyName;
      } else if (userData.indexOf('waltti') !== -1) {
        oidcStrategyName = walttiStrategyName;
      }

      return passport.authenticate(oidcStrategyName, {
        refresh: true,
        successReturnToOrRedirect: `/${req.path}`,
        failureRedirect: '/',
      })(req, res, next);
    }
    return next();
  };

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
  }

  // Passport requires session to persist the authentication
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'reittiopas_secret',
      store: new RedisStore({
        host: RedisHost,
        port: RedisPort,
        client: RedisClient,
        ttl: 60 * 60 * 24 * 60,
      }),
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24 * 60,
        sameSite: 'none',
      },
    }),
  );

  // Initialize Passport
  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(hslStrategyName, hslConfiguration);
  if (walttiConfiguration) {
    passport.use(walttiStrategyName, walttiConfiguration);
  }

  passport.serializeUser(Strategy.serializeUser);
  passport.deserializeUser(Strategy.deserializeUser);

  app.use(redirectToLogin);
  app.use(refreshTokens);

  const getReturnUrl = function (req) {
    const { url, ...rest } = req.query;

    if (url) {
      const restParams = Object.keys(rest)
        .map(k => `${k}=${rest[k]}`)
        .join('&')
        .replaceAll(' ', '+');

      return localPort
        ? `http://localhost:${localPort}${url}?${restParams}`
        : `${url}?${restParams}`;
    }
  };

  // Initiates an authentication request
  // users will be redirected to hsl.id and once authenticated
  // they will be returned to the callback handler below
  app.get('/hsl-login', (req, res) => {
    req.session.returnTo = getReturnUrl(req);
    passport.authenticate(hslStrategyName, {
      scope: 'profile',
      successReturnToOrRedirect: '/',
    })(req, res);
  });

  app.get('/waltti-login', (req, res) => {
    req.session.returnTo = getReturnUrl(req);
    passport.authenticate(walttiStrategyName, {
      scope: 'profile',
      successReturnToOrRedirect: '/',
    })(req, res);
  });

  // Callback handler that will redirect back to application after successfull authentication
  app.get(
    hslCallbackPath,
    passport.authenticate(hslStrategyName, {
      callback: true,
      successReturnToOrRedirect: localPort
        ? `http://localhost:${localPort}/${indexPath}`
        : `/${indexPath}`,
      failureRedirect: '/hsl-login',
    }),
  );

  app.get(
    walttiCallbackPath,
    passport.authenticate(walttiStrategyName, {
      callback: true,
      successReturnToOrRedirect: localPort
        ? `http://localhost:${localPort}/${indexPath}`
        : `/${indexPath}`,
      failureRedirect: '/waltti-login',
    }),
  );

  app.get('/logout', (req, res) => {
    const user = req?.user;
    const cookieLang = req.cookies.lang || 'fi';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const postLogoutRedirectUri = req.secure
      ? `https://${host}${logoutCallbackPath}`
      : `http://${host}${logoutCallbackPath}`;
    const params = {
      post_logout_redirect_uri: postLogoutRedirectUri,
      id_token_hint: user.token.id_token,
      ui_locales: cookieLang,
    };

    let logoutUrl = '';
    const userData = user?.data;
    const userDataString = JSON.stringify(userData);
    if (userDataString.indexOf('hsl') !== -1) {
      logoutUrl = hslConfiguration.client.endSessionUrl(params);
    } else if (userDataString.indexOf('waltti') !== -1) {
      logoutUrl = walttiConfiguration.client.endSessionUrl(params);
    }

    req.session.userId = userData.sub;
    if (debugLogging) {
      console.log(`logout for user ${userData.name} to ${logoutUrl}`);
    }
    res.redirect(logoutUrl);
  });

  app.get('/logout/callback', (req, res) => {
    if (debugLogging) {
      console.log(`logout callback for userId ${req.session.userId}`);
    }
    const sessions = `sessions-${req.session.userId}`;
    req.logout(function (err) {
      if (err) { return next(err); }
    });
    RedisClient.smembers(sessions, (err, sessionIds) => {
      req.session.destroy(() => {
        res.clearCookie('connect.sid');
        if (sessionIds && sessionIds.length > 0) {
          if (debugLogging) {
            console.log(`Deleting ${sessionIds.length} sessions`);
          }
          RedisClient.del(...sessionIds);
          RedisClient.del(sessions);
        }
        res.redirect(
          localPort
            ? `http://localhost:${localPort}/${indexPath}`
            : `/${indexPath}`,
        );
      });
    });
  });

  app.get('/sso/auth', (req, res, next) => {
    if (debugLogging) {
      console.log(`GET sso/auth, token=${req.query['sso-token']}`);
    }
    if (req.isAuthenticated()) {
      if (debugLogging) {
        console.log('GET sso/auth -> already authenticated');
      }
      next();
    } else {
      if (debugLogging) {
        console.log('GET sso/auth -> updating token');
      }
      req.session.ssoToken = req.query['sso-token'];
      req.session.ssoValidTo =
        Number(req.query['sso-validity']) * 60 * 1000 + dayjs().unix();
      res.send();
    }
  });

  app.use('/api', (req, res, next) => {
    res.set('Cache-Control', 'no-store');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(401);
    }
  });
  /* GET the profile of the current authenticated user */
  app.get('/api/user', (req, res) => {
    const oidc_host = selectOidcHost(req);
    axios
      .get(`${oidc_host}/openid/userinfo`, {
        headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      })
      .then(response => {
        if (response && response.status && response.data) {
          res.status(response.status).send(response.data);
        } else {
          errorHandler(res);
        }
      })
      .catch(err => {
        errorHandler(res, err);
      });
  });
}

export default setUpOIDC;
