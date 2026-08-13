'use strict';

module.exports = api => {
  const isTest = api.env('test');

  return {
    presets: [
      [
        '@babel/preset-env',
        // In test we compile for the running Node version. Otherwise pass no
        // explicit targets so preset-env reads the `browserslist` field in
        // package.json — the single source of truth for build targets.
        isTest ? { targets: { node: 'current' } } : {},
      ],
      // runtime: 'automatic' enables the new JSX transform — no need to
      // import React in every file
      ['@babel/preset-react', { runtime: 'automatic' }],
      '@babel/preset-typescript',
    ],
  };
};
