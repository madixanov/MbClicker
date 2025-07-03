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
    sourcemap: true,
    target: 'es2020',
    // minify: 'terser',
    terserOptions: {
      compress: {
        // drop_console: true,
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
            if (id.includes('react-router-dom')) return 'router';
            if (id.includes('zustand')) return 'zustand';
            if (id.includes('framer-motion')) return 'motion';
            return 'vendor';
          }
        }
      },
    },
  },
});
