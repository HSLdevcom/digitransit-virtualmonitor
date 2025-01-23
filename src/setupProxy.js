/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

const setLocalhostCookies = proxyRes => {
  if (
    process.env.NODE_ENV === 'development' &&
    proxyRes.headers.location === 'http://localhost:3000/' &&
    proxyRes.headers['set-cookie'] !== undefined
  ) {
    const cookies = proxyRes.headers['set-cookie'].map(
      // get browser to set cookie for testing
      cookie => cookie.replace('SameSite=None', 'SameSite=Strict; Secure'),
    );
    proxyRes.headers["set-cookie"] = cookies;
  }
};

module.exports = function (app) {
  app.use(
    '/oid_callback',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      onProxyRes: function (proxyRes) {
        setLocalhostCookies(proxyRes);
      },
    }),
  );
  app.use(
    '/oid_waltti_callback',
    createProxyMiddleware({
      target: 'http://localhost:3001',
      changeOrigin: true,
      onProxyRes: function (proxyRes) {
        setLocalhostCookies(proxyRes);
      },
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
      hostRewrite: process.env.NODE_ENV === "development",
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
