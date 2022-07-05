import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import index from './routes.js';
import axios from 'axios';
import setUpOIDC from './auth/openidConnect.js';

const __dirname = fileURLToPath(import.meta.url);
const port = process.env.PORT || 3001;
const app = express();

app.use(logger('dev'));
//app.use(function(req,res,next){console.log(req.headers);next();});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser(process.env.SESSION_SECRET || 'reittiopas_secret'));
app.use(express.static(path.join(__dirname, '../../build')));
// view engine setup
app.set('views', path.join(__dirname, '../views'));
app.set('view engine', 'pug');


//app.use('/api', index);

import { getTranslations } from 'gtfs';
import createUrlCompression from './urlCompression.js';
import monitorService from './monitorService.js';

const displayDictionaries = {
  v0: '{"displaySeconds":,"view":{"pierColumnTitle":","stops":[","},"title":{"fi","en"}}]}},"type":"stopTimes"HSL:10"]}',
};

//const router = express.Router();

app.get('/api/monitor/:id', (req, res) => {
  monitorService.get(req, res);
});

app.get('/api/usermonitors/:id', (req, res) => {
  monitorService.getMonitorsForUser(req, res);
});

// app.get('/api/usermonitors', (req, res) => {
//   monitorService.getAllMonitorsForUser(req, res);
// });

app.put('/api/monitor', (req, res) => {
  monitorService.create(req, res);
});

app.get('/api/translations/:recordIds', (req, res) => {
  const ids = req.params.recordIds.split(',');
  getTranslations({ trans_id: ids }).then(t => {
    res.json(t);
  });
});

app.post('/api/decompress/', (req, res) => {
  try {
    const decompresser = createUrlCompression(Buffer.from(displayDictionaries['v0']))
    decompresser.unpack(req.body.payload).then(t => {
      res.json(t);
    }).catch((e) => console.log(e));
  } catch (e) {
    console.log(e)
  }
});

app.post('/api/staticmonitor', (req, res) => {
  monitorService.updateStatic(req, res);
});

app.delete('/api/staticmonitor', (req, res) => {
  monitorService.deleteStatic(req, res);
});
function setUpOpenId() {
  const localPort = process.env.NODE_ENV === 'production' ? null : 3000;
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = 1;
  setUpOIDC(app, port, '', ['https://virtualmonitor-app-login-dev.azurewebsites.net/', 'http://virtualmonitor-app-login-dev.azurewebsites.net/'], localPort);
}

setUpOpenId();

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
