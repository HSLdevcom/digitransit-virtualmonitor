import express from 'express';
import path from 'path';
import logger from 'morgan';
import axios from 'axios';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import { getTranslations } from 'gtfs';
import setUpOIDC from './auth/openidConnect.js';
import { userAuthenticated, errorHandler } from './auth/openidConnect.js';
import createUrlCompression from './urlCompression.js';
import monitorService from './monitorService.js';
import { getMonitors, isUserOwnedMonitor,updateStaticMonitor, deleteMonitor, createMonitor } from './hslID.js';

const FavouriteHost =
process.env.FAVOURITE_HOST || 'https://dev-api.digitransit.fi/favourites';

const NotificationHost =
process.env.NOTIFICATION_HOST ||
'https://test.hslfi.hsldev.com/user/api/v1/notifications';

const __dirname = fileURLToPath(import.meta.url);
const port = process.env.PORT || 3001;
const app = express();

app.use(logger('dev'));
// app.use(function(req,res,next){console.log(req.headers);next();});
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

app.get('/api/monitor/:id', (req, res) => {
  monitorService.get(req, res);
});

app.put('/api/monitor', (req, res) => {
  monitorService.create(req, res);
});

app.get('/api/translations/:recordIds', (req, res) => {
  const ids = req.params.recordIds.split(',');
  getTranslations({ trans_id: ids }).then(t => {
    res.json(t);
  });
});

app.get('/api/staticmonitor/:id', (req, res) => {
  monitorService.getStatic(req, res);
});

app.post('/api/decompress/', (req, res) => {
  try {
    const decompresser = createUrlCompression(
      Buffer.from(displayDictionaries.v0),
    );
    decompresser
      .unpack(req.body.payload)
      .then(t => {
        res.json(t);
      })
      .catch((e) => console.log(e));
  } catch (e) {
    console.log(e);
  }
});

function setUpOpenId() {
  const localPort = process.env.NODE_ENV === 'production' ? null : 3000;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
  setUpOIDC(
    app,
    port,
    '',
    [
      'https://virtualmonitor-app-login-dev.azurewebsites.net/',
      'http://virtualmonitor-app-login-dev.azurewebsites.net/',
    ],
    [
      '/static/',
      '/view/',
      '/createview/',
    ],
    localPort,
  );
}

setUpOpenId();

app.delete('/api/staticmonitor', userAuthenticated, (req, res) => {
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
  console.log("usermonitors")
  getMonitors(req,res);
});

app.get('/api/userowned/:id', userAuthenticated, (req, res) => {
  isUserOwnedMonitor(req, res)
});

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
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err,
  });
});

export default app;
