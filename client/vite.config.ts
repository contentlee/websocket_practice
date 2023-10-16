import { resolve } from 'path';

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      { find: '@assets', replacement: resolve(__dirname, 'src/assets') },
      { find: '@atoms', replacement: resolve(__dirname, 'src/atoms') },
      { find: '@call', replacement: resolve(__dirname, 'src/call/pages') },
      { find: '@chat', replacement: resolve(__dirname, 'src/chat/pages') },
      {
        find: '@components',
        replacement: resolve(__dirname, 'src/common/components'),
      },
      { find: '@entry', replacement: resolve(__dirname, 'src/entry/pages') },
      { find: '@hooks', replacement: resolve(__dirname, 'src/hooks') },
      { find: '@login', replacement: resolve(__dirname, 'src/login/pages') },
      { find: '@pages', replacement: resolve(__dirname, 'src/common/pages') },
      { find: '@utils', replacement: resolve(__dirname, 'src/utils') },
    ],
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});
