import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// ❌ НЕЛЬЗЯ: import { visualizer } from 'rollup-plugin-visualizer';
import {visualizer} from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: './dist/stats.html',
      open: true, // откроется автоматически после сборки
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  base: '/',
  server: {
    host: true,
    historyApiFallback: true,
  },
  build: {
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info', 'console.debug'],
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
});
