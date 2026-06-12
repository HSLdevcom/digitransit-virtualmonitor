'use strict';

module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      [
        '@babel/preset-env',
        isTest
          ? { targets: { node: 'current' } }
          : {
              targets: {
                browsers: ['>0.2%', 'not dead', 'not ie <= 11', 'not op_mini all'],
              },
            },
      ],
      // runtime: 'automatic' enables the new JSX transform — no need to
      // import React in every file
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
    plugins: [
      // React Fast Refresh in development only
      ...(api.env('development') ? ['react-refresh/babel'] : []),
    ],
  };
};
