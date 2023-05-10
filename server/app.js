import express from 'express';
import path from 'path';
import logger from 'morgan';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import setUpOIDC, {
  userAuthenticated,
  errorHandler,
} from './auth/openidConnect.js';
import createUrlCompression from './urlCompression.js';
import monitorService from './monitorService.js';
import {
  getMonitors,
  isUserOwnedMonitor,
  updateStaticMonitor,
  deleteMonitor,
  createMonitor,
} from './openID.js';

const FavouriteHost =
  process.env.FAVOURITE_HOST || 'https://dev-api.digitransit.fi/favourites';

const NotificationHost =
  process.env.NOTIFICATION_HOST ||
  'https://test.hslfi.hsldev.com/user/api/v1/notifications';

const MAP_URL = process.env.MAP_URL
  ? process.env.MAP_URL
  : 'https://cdn.digitransit.fi/map/v2/hsl-map/{z}/{x}/{y}.png';

const __dirname = fileURLToPath(import.meta.url);
const port = process.env.PORT || 3001;
const app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET || 'reittiopas_secret'));
app.use(express.static(path.join(__dirname, '../../build')));
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');

const displayDictionaries = {
  v0: '{"displaySeconds":,"view":{"pierColumnTitle":","stops":[","},"title":{"fi","en"}}]}},"type":"stopTimes"HSL:10"]}',
};

app.get('/api/monitor/:id', (req, res, next) => {
  monitorService.get(req, res, next);
});

app.use('/api/graphql', (req, res, next) => {
  const baseurl = process.env.API_URL ?? 'https://dev-api.digitransit.fi';
  const endpoint =
    req.headers['graphql-endpoint'] ?? 'routing/v1/routers/hsl/index/graphql';
  const queryparams = process.env.API_SUBSCRIPTION_QUERY_PARAMETER_NAME
    ? `?${process.env.API_SUBSCRIPTION_QUERY_PARAMETER_NAME}=${process.env.API_SUBSCRIPTION_TOKEN}`
    : '';
  const url = `${baseurl}/${endpoint}${queryparams}`;
  axios({
    headers: { 'content-type': 'application/json' },
    method: req.method,
    data: JSON.stringify(req.body),
    url,
  })
    .then(r => {
      res.json(r.data);
    })
    .catch(e => next(e));
});

app.get('/api/geocoding/:endpoint', (req, res, next) => {
  const baseurl = process.env.API_URL ?? 'https://dev-api.digitransit.fi';
  const endpoint = `/geocoding/v1/${req.params.endpoint}`;
  const apiSubscriptionParameter = process.env
    .API_SUBSCRIPTION_QUERY_PARAMETER_NAME
    ? `&${process.env.API_SUBSCRIPTION_QUERY_PARAMETER_NAME}=${process.env.API_SUBSCRIPTION_TOKEN}`
    : '';
  const url = `${baseurl}/${endpoint}?${req._parsedUrl.query}${apiSubscriptionParameter}`;

  axios
    .get(url)
    .then(response => {
      res.json(response.data);
    })
    .catch(e => next(e));
});

app.get('/api/map', (req, res) => {
  const apiSubscriptionParameter = process.env
    .API_SUBSCRIPTION_QUERY_PARAMETER_NAME
    ? `&${process.env.API_SUBSCRIPTION_QUERY_PARAMETER_NAME}=${process.env.API_SUBSCRIPTION_TOKEN}`
    : '';
  const url = `${MAP_URL}?${apiSubscriptionParameter}`;
  return res.status(200).json(url);
});

app.put('/api/monitor', (req, res, next) => {
  monitorService.create(req, res, next);
});

app.get('/api/status', (req, res) => res.status(200).json({ status: 'OK' }));

app.get('/api/translations/:recordIds', (req, res, next) => {
  const ids = req.params.recordIds.split(',');
  getTranslations({ trans_id: ids })
    .then(t => {
      res.json(t);
    })
    .catch(e => next(e));
});

app.get('/api/staticmonitor/:id', (req, res, next) => {
  monitorService.getStatic(req, res, next);
});

app.post('/api/decompress/', (req, res, next) => {
  try {
    const decompresser = createUrlCompression(
      Buffer.from(displayDictionaries.v0),
    );
    decompresser
      .unpack(req.body.payload)
      .then(t => {
        res.json(t);
      })
      .catch(e => console.log(e));
  } catch (e) {
    next(e);
  }
});

function setUpOpenId() {
  const urls = process.env.OIDC_URLS?.split(',') || [];
  const localPort = process.env.NODE_ENV === 'production' ? null : 3000;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
  setUpOIDC(
    app,
    port,
    '',
    urls,
    ['/static/', '/view/', '/createview/'],
    localPort,
  );
}

setUpOpenId();

app.delete('/api/staticmonitor', userAuthenticated, (req, res, next) => {
  deleteMonitor(req, res, next);
});

app.post('/api/staticmonitor', userAuthenticated, (req, res, next) => {
  updateStaticMonitor(req, res, next);
});

app.put('/api/staticmonitor', userAuthenticated, (req, res, next) => {
  createMonitor(req, res, next)
    .then(response => {
      monitorService.createStatic(req, res, next);
    })
    .catch(err => {
      errorHandler(res, err);
    });
});

app.get(
  '/api/usermonitors/:instanceName',
  userAuthenticated,
  (req, res, next) => {
    getMonitors(req, res, next);
  },
);

app.get('/api/userowned/:id', userAuthenticated, (req, res, next) => {
  isUserOwnedMonitor(req, res, next);
});

app.use('/api/user/favourites', userAuthenticated, (req, res) => {
  axios({
    headers: { Authorization: `Bearer ${req.user.token.id_token}` },
    method: req.method,
    url: `${FavouriteHost}/${req.user.data.sub}`,
    data: JSON.stringify(req.body),
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

app.use('/api/user/notifications', userAuthenticated, (req, res) => {
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
      'x-hslid-token': req.user.token.id_token,
    },
    method: req.method,
    url,
    data: JSON.stringify(req.body),
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../build', 'index.html'));
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || err.response?.status || 500).send(err.message);
});

export default app;
