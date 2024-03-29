/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/oid_callback',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );
  app.use(
    '/oid_waltti_callback',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );
  app.use(
    '/hsl-login',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );
  app.use(
    '/waltti-login',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    })
  )
  app.use(
    '/logout',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
    }),
  );
};
