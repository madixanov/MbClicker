import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
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

          if (id.includes('/pages/')) {
            const parts = id.split('/pages/')[1].split('/');
            const name = parts[0].replace(/\.(js|jsx|ts|tsx)$/, '');
            return `page-${name}`;
          }

          // Можно ещё разбивать по store/компонентам
          if (id.includes('/store/')) return 'store';
          if (id.includes('/components/')) return 'components';
        }
      },
    },
  },
});
