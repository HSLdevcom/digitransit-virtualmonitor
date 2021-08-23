import express from 'express';
import path from 'path';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
// const express = require('express');
// const path = require('path');
// const logger = require('morgan');
// const cookieParser = require('cookie-parser');
// const bodyParser = require('body-parser');

//const index = require('./routes');
import index from './routes.js';

const app = express();

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(import.meta.url, '../build')));

// view engine setup
app.set('views', path.join(import.meta.url, '../views'));
app.set('view engine', 'pug');

app.use('/api', index);
app.get('/favicon.ico', (req, res) => res.status(200)) 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'))
  //res.end()
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: err
  });
});

//module.exports = app;
export default app;
