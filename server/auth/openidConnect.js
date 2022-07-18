/* eslint-disable func-names, no-console */
import passport from 'passport';
import session from 'express-session';
import redis from 'redis';
import axios from 'axios';
import dayjs from 'dayjs';
import connectRedis from 'connect-redis';
import Strategy from './Strategy.js';
import monitorService from '../monitorService.js';

const CLIENT_ID = process.env.MANAGEMENT_API_ID;
const CLIENT_SECRET = process.env.MANAGEMENT_API_SECRET;

const RedisStore = connectRedis(session);

const clearAllUserSessions = false; // set true if logout should erase all user's sessions

const debugLogging = process.env.DEBUGLOGGING;

axios.defaults.timeout = 12000;

function setUpOIDC(app, port, indexPath, hostnames, localPort) {
  /* ********* Setup OpenID Connect ********* */
  const callbackPath = '/oid_callback'; // connect callback path
  const logoutCallbackPath = '/logout/callback';
  // Use Passport with OpenId Connect strategy to authenticate users
  const OIDCHost = process.env.OIDCHOST || 'https://hslid-dev.t5.fi';
  const FavouriteHost =
    process.env.FAVOURITE_HOST || 'https://dev-api.digitransit.fi/favourites';

  const NotificationHost =
    process.env.NOTIFICATION_HOST ||
    'https://test.hslfi.hsldev.com/user/api/v1/notifications';

  const RedisHost = process.env.REDIS_HOST || '127.0.0.1';
  const RedisPort = process.env.REDIS_PORT || 6379;
  const RedisKey = process.env.REDIS_KEY;
  console.log(RedisHost, RedisPort, RedisKey)
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
    const paths = [
      '/fi/',
      '/en/',
      '/sv/',
      '/reitti/',
      '/pysakit/',
      '/linjat/',
      '/terminaalit/',
      '/pyoraasemat/',
      '/lahellasi/',
    ];
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
      req.user.token.refresh_token &&
      dayjs().unix() >= req.user.token.expires_at
    ) {
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
  passport.serializeUser(Strategy.serializeUser);
  passport.deserializeUser(Strategy.deserializeUser);

  app.use(redirectToLogin);
  app.use(refreshTokens);

  // Initiates an authentication request
  // users will be redirected to hsl.id and once authenticated
  // they will be returned to the callback handler below
  app.get('/login', (req, res) => {
    console.log("LOGIN")
    const { url, favouriteModalAction, ...rest } = req.query;
    if (favouriteModalAction) {
      req.session.returnTo = `/${indexPath}?favouriteModalAction=${favouriteModalAction}`;
    }
    if (url) {
      const restParams = Object.keys(rest)
        .map(k => `${k}=${rest[k]}`)
        .join('&');
      req.session.returnTo = localPort ? `http://localhost:${localPort}${url}?${restParams}` : `${url}?${restParams}`;
    }
    passport.authenticate('passport-openid-connect', {
      scope: 'profile',
      successReturnToOrRedirect: '/',
    })(req, res);
  });

  // Callback handler that will redirect back to application after successfull authentication
  app.get(callbackPath,
    passport.authenticate('passport-openid-connect', {
      callback: true,
      successReturnToOrRedirect: localPort ? `http://localhost:${localPort}/${indexPath}` : `/${indexPath}`,
      failureRedirect: '/login',
    })
  );

  app.get('/logout', function (req, res) {
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

  app.get('/logout/callback', function (req, res) {
    if (debugLogging) {
      console.log(`logout callback for userId ${req.session.userId}`);
    }
    const sessions = `sessions-${req.session.userId}`;
    req.logout();
    RedisClient.smembers(sessions, function (err, sessionIds) {
      req.session.destroy(function () {
        res.clearCookie('connect.sid');
        if (sessionIds && sessionIds.length > 0) {
          if (debugLogging) {
            console.log(`Deleting ${sessionIds.length} sessions`);
          }
          RedisClient.del(...sessionIds);
          RedisClient.del(sessions);
        }
        res.redirect(localPort ? `http://localhost:${localPort}/${indexPath}` : `/${indexPath}`);
      });
    });
  });

  app.get('/sso/auth', function (req, res, next) {
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

  app.use('/api', function (req, res, next) {
    res.set('Cache-Control', 'no-store');
    if (req.isAuthenticated()) {
      next();
    } else {
      res.sendStatus(401);
    }
  });

  const errorHandler = function (res, err) {
    const status = err?.message && err.message.includes('timeout') ? 408 : 500;

    if (err?.response) {
      res
        .status(err.response.status || status)
        .send(err.response.data || err?.message || 'Unknown err');
    } else {
      res.status(status).send(err?.message || 'Unknown error');
    }
  };

  /* GET the profile of the current authenticated user */
  app.get('/api/user', function (req, res) {
    axios
      .get(`${OIDCHost}/openid/userinfo`, {
        headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      })
      .then(function (response) {
        if (response && response.status && response.data) {
          res.status(response.status).send(response.data);
        } else {
          errorHandler(res);
        }
      })
      .catch(function (err) {
        errorHandler(res, err);
      });
  });

  // Temporary solution for checking if user is authenticated
  const userAuthenticated = function (req, res, next) {
    axios
      .get(`${OIDCHost}/openid/userinfo`, {
        headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      })
      .then(function () {
        next();
      })
      .catch(function (err) {
        errorHandler(res, err);
      });
  };

  app.use('/api/user/favourites', userAuthenticated, function (req, res) {
    axios({
      headers: { Authorization: `Bearer ${req.user.token.access_token}` },
      method: req.method,
      url: `${FavouriteHost}/${req.user.data.sub}`,
      data: JSON.stringify(req.body),
    })
      .then(function (response) {
        if (response && response.status && response.data) {
          res.status(response.status).send(response.data);
        } else {
          errorHandler(res);
        }
      })
      .catch(function (err) {
        errorHandler(res, err);
      });
  });

  app.delete('/api/staticmonitor', userAuthenticated, (req, res) => {
    console.log("deleting monitor! ", req.body)
    deleteMonitor(req, res);
  });

  app.post('/api/staticmonitor', userAuthenticated, (req, res) => {
    updateStaticMonitor(req, res)
  });

  app.put('/api/staticmonitor', userAuthenticated, (req, res) => {
    createMonitor(req, res);
    monitorService.createStatic(req, res);
  });

  app.get('/api/usermonitors', userAuthenticated, (req, res) => {
    getMonitors(req,res);
  });

  app.get('/api/userowned/:id', userAuthenticated, (req, res) => {
    isUserOwnedMonitor(req, res)
  });

  app.use('/api/user/notifications', userAuthenticated, function (req, res) {
    const params = Object.keys(req.query)
      .map(k => `${k}=${req.query[k]}`)
      .join('&');

    const url =
      req.method === 'POST'
        ? `${NotificationHost}/read?${params}`
        : `${NotificationHost}?${params}`;
    axios({
      headers: {
        'content-type': 'application/json',
        'x-hslid-token': req.user.token.access_token,
      },
      method: req.method,
      url,
      data: JSON.stringify(req.body),
    })
      .then(function (response) {
        if (response && response.status && response.data) {
          res.status(response.status).send(response.data);
        } else {
          errorHandler(res);
          console.log("ERROR")
        }
      })
      .catch(function (err) {
        errorHandler(res, err);
      });
  });
}

const isUserOwnedMonitor = async (req, res) => {
  const userMonitors = await getDataStorageMonitors(req, res)
  if (userMonitors.includes(req.params.id)) {
    res.status(200).send({msg: 'OK'});
  } else {
    res.status(401).send({msg: 'Unauthorized'});
  }
}

const updateStaticMonitor = async (req, res) => {
  const userMonitors = await getDataStorageMonitors(req, res)
  if (userMonitors.includes(req.body.url)) {
    monitorService.updateStatic(req, res);
  } else {
    res.status(401).send("Unauthorized");
  }
}

const getMonitors = async (req, res) => {
  try {
    const monitors = await getDataStorageMonitors(req, res)
    monitorService.getMonitorsForUser(req, res, monitors);
  } catch {
    console.log("error")
  }
}

const getDataStorageMonitors = async (req, res) => {
  try {
    let dataStorage
    console.log("fetching all user monitors for", req?.user?.data.sub);
    dataStorage = await getDataStorage(req?.user?.data.sub);
    if (dataStorage) {
      console.log("found data storage: ", dataStorage)
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataStorage.id}/data`,
      };
      const response = await makeHslIdRequest(options);
      return Object.keys(response.data).map(key => key);
    } else {
      console.log("no data storage found, user doesn't have any monitors")
      res.json([])
    }
  } catch {
    console.log("Error fetching monitors")
  }
}

const deleteMonitor = async (req, res) => {
  try {
    const userId = req?.user?.data.sub;
    let dataS = await getDataStorage(userId);
    if (dataS) {
      const options = {
        endpoint: `/api/rest/v1/datastorage/${dataS.id}/data`,
      };
      const response = await makeHslIdRequest(options);
      const monitors = Object.keys(response.data).map(key => key);
      if (monitors.includes(req.body.url)) {
        const response = await deleteMonitorHSL(dataS.id, req.body.url)
        monitorService.deleteStatic(req,res);
      } else {
        console.log("not authorised")
      }
    }
  } catch {
    console.log("error deleting monitor")
  }
}

const createMonitor = async (req, res) => {
  try {
    const userId = req?.user?.data.sub;
    //validate(updateSchema, schema);
    const dataStorage = {
      id: '',
    };
    //console.log('searching existing datastorage');
    let dataS = await getDataStorage(userId);//.then(res => {
    if (dataS) {
      dataStorage.id = dataS.id;
      console.log("existing data storage found");
    } else {
      console.log("no data storage, creating one")
      dataS = await createDataStorage(userId);
      dataStorage.id = dataS;
    }
    console.log("adding monitor to data storage: ", dataStorage.id)
    const res = await updateMonitors(dataStorage.id, req.body);
  } catch (e) {
    console.log("Error creating monitor", e)
  }
}

const makeHslIdRequest = async (
  options,
) => {
  try {
    const hslIdUrl = 'https://hslid-uat.cinfra.fi';
    const credentials = `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`;
    options.url = `${hslIdUrl}${options.endpoint}`;
    options.headers = {
      Authorization: credentials,
      'Content-Type': 'application/json',
    };
    const response = axios(options);
    return response;
  } catch (err) {
    console.log("error making hslid request");
  }
  
};

export const deleteMonitorHSL = async (
  dataStorageId,
  monitor,
) => {
  try {
    console.log("Deleting  MONITOR from", dataStorageId)
    const options = {
      method: 'DELETE',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor}`,
    };
    const response = await makeHslIdRequest(options);
    return response;
  } catch (err) {
    console.log("Error updating data storage", err)
  }
};

export const updateMonitors = async (
  dataStorageId,
  monitor,
) => {
  try {
    console.log("UPDATING MONITOR TO", dataStorageId)
    const options = {
      method: 'PUT',
      endpoint: `/api/rest/v1/datastorage/${dataStorageId}/data/${monitor.url}`,
      data: {'value': monitor.monitorContenthash},
    };
    const response = await makeHslIdRequest(options);
    return response;
  } catch (err) {
    console.log("Error updating data storage", err)
  }
};

const createDataStorage = async (id) => {
  const options = {
    method: 'POST',
    endpoint: `/api/rest/v1/datastorage`,
    data: {
      name: `monitors-${CLIENT_ID || ''}`,
      description: 'Pysäkkinäytöt',
      ownerId: id,
      adminAccess: [CLIENT_ID],
      readAccess: [CLIENT_ID, id],
      writeAccess: [CLIENT_ID, id],
    },
  };
  try {
    const response = await makeHslIdRequest(options);
    console.log("created, res:", response.data)
    return response.data.id;
  } catch (e) {
    console.log("error creating data storage", e)
  }
}

export const getDataStorage = async (id) => {

  const options = {
    method: 'GET',
    endpoint: '/api/rest/v1/datastorage',
    params: {
      dsfilter: `ownerId eq "${id}" and name eq "monitors-${
        CLIENT_ID || ''
      }"`,
    },
  };
  try {
    const response = await makeHslIdRequest(options);
    const dataStorage = response.data.resources[0];
    if (dataStorage) {
      return dataStorage;
    } else {
      throw "Datastorage not found"
    }
  } catch (error) {
    console.log('error, DataStorage not found');
  }
};

export default setUpOIDC;