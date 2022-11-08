/* eslint-disable func-names, no-console */
import passport from 'passport';
import session from 'express-session';
import redis from 'redis';
import axios from 'axios';
import dayjs from 'dayjs';
import connectRedis from 'connect-redis';
import { OIDCStrategy } from 'passport-azure-ad';
import Strategy from './Strategy.js';
import config from './config.js'
import User from './User.js';

const OIDCHost = process.env.OIDCHOST || 'https://hslid-dev.t5.fi';

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

export const userAuthenticated = function (req, res, next) {
  console.log('what?')
  console.log("is authenticated: ", req.isAuthenticated())

  if (req.isAuthenticated()) { return next(); }
  res.redirect('/');

  /* HSL ID */
  /*   axios
      .get(`${OIDCHost}/openid/userinfo`, {
        headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      })
      .then(() => {
        next();
      })
      .catch(err => {
        errorHandler(res, err);
      }); */
};

const RedisStore = connectRedis(session);

const clearAllUserSessions = false; // set true if logout should erase all user's sessions

const debugLogging = true // process.env.DEBUGLOGGING;

axios.defaults.timeout = 12000;

function setUpOIDC(app, port, indexPath, hostnames, paths, localPort) {
  /* ********* Setup OpenID Connect ********* */
  const callbackPath = '/oid_callback'; // connect callback path
  const logoutCallbackPath = '/logout/callback';
  // Use Passport with OpenId Connect strategy to authenticate users

  const RedisHost = process.env.REDIS_HOST || '127.0.0.1';
  const RedisPort = process.env.REDIS_PORT || 6379;
  const RedisKey = process.env.REDIS_KEY;
  const RedisClient = RedisKey
    ? redis.createClient(RedisPort, RedisHost, {
      auth_pass: RedisKey,
      tls: { servername: RedisHost },
    })
    : redis.createClient(RedisPort, RedisHost);

  const redirectUris = hostnames.map(host => `${host}${callbackPath}`);
  const postLogoutRedirectUris = hostnames.map(
    host => `${host}${logoutCallbackPath}`,
  );
  if (process.env.NODE_ENV === 'development') {
    redirectUris.push(`http://localhost:${port}${callbackPath}`);
    postLogoutRedirectUris.push(
      `http://localhost:${port}${logoutCallbackPath}`,
    );
  }

  const oic = new Strategy({
    issuerHost:
      process.env.OIDC_ISSUER || `${OIDCHost}/.well-known/openid-configuration`,
    client_id: process.env.OIDC_CLIENT_ID,
    client_secret: process.env.OIDC_CLIENT_SECRET,
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
    if (
      req.isAuthenticated() &&
      req.user.token &&
      req.user.token.refresh_token &&
      dayjs().unix() >= req.user.token.expires_at
    ) {
      // must be changes to accommodate azure users too
      return passport.authenticate('passport-openid-connect', {
        refresh: true,
        successReturnToOrRedirect: `/${indexPath}`,
        failureRedirect: `/${indexPath}`,
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
  passport.use('passport-openid-connect', oic);
  passport.use('azuread-openidconnect', new OIDCStrategy({
    identityMetadata: config.creds.identityMetadata,
    clientID: config.creds.clientID,
    responseType: config.creds.responseType,
    responseMode: config.creds.responseMode,
    redirectUrl: config.creds.redirectUrl,
    allowHttpForRedirectUrl: config.creds.allowHttpForRedirectUrl,
    clientSecret: config.creds.clientSecret,
    validateIssuer: config.creds.validateIssuer,
    isB2C: false,
    issuer: config.creds.issuer,
    passReqToCallback: config.creds.passReqToCallback,
    scope: config.creds.scope,
    loggingLevel: config.creds.loggingLevel,
    nonceLifetime: config.creds.nonceLifetime,
    nonceMaxAmount: config.creds.nonceMaxAmount,
    useCookieInsteadOfSession: config.creds.useCookieInsteadOfSession,
    cookieEncryptionKeys: config.creds.cookieEncryptionKeys,
    clockSkew: config.creds.clockSkew,
  },
    function (iss, sub, profile, accessToken, refreshToken, done) {
      console.log('HERE', profile)
      if (!profile.oid) {
        return done(new Error("No oid found"), null);
      }

      process.nextTick(function () {
        const user = new User(profile);
        return done(null, user);
      });
    },
  ));

  passport.serializeUser(Strategy.serializeUser);
  passport.deserializeUser(Strategy.deserializeUser);




  app.use(redirectToLogin);
  app.use(refreshTokens);

  // Initiates an authentication request
  // users will be redirected to hsl.id and once authenticated
  // they will be returned to the callback handler below
  app.get('/login', (req, res) => {
    const { url, ...rest } = req.query;

    if (url) {
      const restParams = Object.keys(rest)
        .map(k => `${k}=${rest[k]}`)
        .join('&')
        .replaceAll(' ', '+');

      req.session.returnTo = localPort
        ? `http://localhost:${localPort}${url}?${restParams}`
        : `${url}?${restParams}`;
    }
    passport.authenticate('passport-openid-connect', {
      scope: 'profile',
      successReturnToOrRedirect: '/',
    })(req, res);
  });

  app.get('/matka-login', (req, res, next) => {
    console.log('MOI')
    passport.authenticate('azuread-openidconnect',
      {
        response: res,
        failureRedirect: '/'
      }
    )(req, res, next);
  },
    function (req, res) {
      console.log('Login called')
      res.redirect('/');
    });

  // 'GET returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // query (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  app.get('/auth/openid/return',
    function (req, res, next) {
      console.log('HELLO')
      passport.authenticate('azuread-openidconnect',
        {
          response: res,    // required
          failureRedirect: '/'
        }
      )(req, res, next);
    },
    function (req, res) {
      console.log('Return from azureAd')
      res.redirect('/');
    });

  // 'POST returnURL'
  // `passport.authenticate` will try to authenticate the content returned in
  // body (such as authorization code). If authentication fails, user will be
  // redirected to '/' (home page); otherwise, it passes to the next middleware.
  app.post('/auth/openid/return',
    function (req, res, next) {
      passport.authenticate('azuread-openidconnect',
        {
          response: res,    // required
          failureRedirect: '/'
        }
      )(req, res, next);
    },
    function (req, res) {
      console.log('Return from AzureAD')
      res.redirect('/');
    });

  // Callback handler that will redirect back to application after successfull authentication
  app.get(
    callbackPath,
    passport.authenticate('passport-openid-connect', {
      callback: true,
      successReturnToOrRedirect: localPort
        ? `http://localhost:${localPort}/${indexPath}`
        : `/${indexPath}`,
      failureRedirect: '/login',
    }),
  );

  app.get('/logout', (req, res) => {
    const cookieLang = req.cookies.lang || 'fi';
    const host = req.headers['x-forwarded-host'] || req.headers.host;
    const postLogoutRedirectUri = req.secure
      ? `https://${host}${logoutCallbackPath}`
      : `http://${host}${logoutCallbackPath}`;
    const params = {
      post_logout_redirect_uri: postLogoutRedirectUri,
      id_token_hint: req.user.token.id_token,
      ui_locales: cookieLang,
    };
    const logoutUrl = oic.client.endSessionUrl(params);

    req.session.userId = req.user.data.sub;
    if (debugLogging) {
      console.log(`logout for user ${req.user.data.name} to ${logoutUrl}`);
    }
    res.redirect(logoutUrl);
  });

  app.get('/logout/callback', (req, res) => {
    if (debugLogging) {
      console.log(`logout callback for userId ${req.session.userId}`);
    }
    const sessions = `sessions-${req.session.userId}`;
    req.logout();
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

  // 'logout' route, logout from passport, and destroy the session with AAD.
  app.get('/matka-logout', function (req, res) {
    // redis client deletions needed
    console.log("You have reached matka-logout")
    req.session.destroy(function (err) {
      req.logOut();
      res.redirect(config.destroySessionUrl);
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
    console.log('FOOO')
    axios
      .get(`${OIDCHost}/openid/userinfo`, {
        headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      })
      .then(response => {
        console.log('resp')
        if (response && response.status && response.data) {
          console.log("User response ", response.status, " data ", response.data)
          res.status(response.status).send(response.data);
        } else {
          errorHandler(res);
        }
      })
      .catch(err => {
        console.log('error')
        errorHandler(res, err);
      });
  });
  app.get('/api/matka-user', (req, res) => {
    console.log('matka user ', req.user)
    if (req.isAuthenticated()) {
      res.status(200).send(req.user.data);
    } else {
      res.sendStatus(401);
    }

  });
}

export default setUpOIDC;
