import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-oxc';
import svgr from 'vite-plugin-svgr';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Rewrites SameSite cookie attribute on auth redirect responses for local dev
const patchSameSiteCookie = (proxyRes: {
  headers: Record<string, string | string[] | undefined>;
}) => {
  if (
    proxyRes.headers.location === 'http://localhost:3000/' &&
    Array.isArray(proxyRes.headers['set-cookie'])
  ) {
    proxyRes.headers['set-cookie'] = proxyRes.headers['set-cookie'].map(c =>
      c.replace('SameSite=None', 'SameSite=Strict; Secure'),
    );
  }
};

const i18nMockPath = fileURLToPath(
  new URL('./src/__mocks__/reactI18next.js', import.meta.url),
);

export default defineConfig(({ mode }) => ({
  plugins: [
    // In tests, stub all SVG files to avoid SVGR JSX output hitting Rollup's SSR parser
    ...(mode === 'test'
      ? [
          {
            name: 'vitest-svg-stub',
            enforce: 'pre' as const,
            load(id: string) {
              if (/\.svg(\?.*)?$/.test(id)) {
                const basename = JSON.stringify(
                  path.basename(id.split('?')[0]),
                );
                return `
                  import React from 'react';
                  function SvgStub(props) { return React.createElement('svg', props, ${basename}); }
                  SvgStub.displayName = 'SvgStub';
                  export const ReactComponent = SvgStub;
                  export default SvgStub;
                `;
              }
            },
          },
        ]
      : []),
    // Enable JSX transform for React Fast Refresh
    react(),
    // Support `import { ReactComponent as X } from './x.svg'` throughout the codebase
    svgr({
      include: '**/*.svg',
      svgrOptions: { namedExport: 'ReactComponent', exportType: 'named' },
    }),
  ],
  resolve: {
    // In tests: stub i18n to avoid initialisation issues during SSR transform
    alias:
      mode === 'test'
        ? [
            { find: 'react-i18next', replacement: i18nMockPath },
            { find: 'i18next', replacement: i18nMockPath },
          ]
        : [],
  },
  build: { outDir: 'build' },
  optimizeDeps: {
    // Pre-bundle so its many internal CJS sub-imports resolve in one request during dev
    include: ['@digitransit-component/digitransit-component-autosuggest'],
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Resolve bare node_modules imports (e.g. `@use '@hsl-fi/...'`)
        loadPaths: [path.resolve(__dirname, 'node_modules')],
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/oid_callback': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: proxy => {
          proxy.on('proxyRes', patchSameSiteCookie);
        },
      },
      '/oid_waltti_callback': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        configure: proxy => {
          proxy.on('proxyRes', patchSameSiteCookie);
        },
      },
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/hsl-login': { target: 'http://localhost:3001', changeOrigin: true },
      '/waltti-login': { target: 'http://localhost:3001', changeOrigin: true },
      '/logout': { target: 'http://localhost:3001', changeOrigin: true },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    css: false,
    // Process @hsl-fi packages and broadcast-channel through Vite — they import CSS/storage APIs that Node can't handle natively
    server: {
      deps: {
        inline: [/@hsl-fi/, /broadcast-channel/],
      },
    },
  },
}));
