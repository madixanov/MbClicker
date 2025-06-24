import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: true,
    historyApiFallback: true,
  },
  build: {
    target: 'es2020', // 🎯 современный таргет для меньшего кода
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,   // 🔻 удалить все console.log
        drop_debugger: true,  // 🔻 удалить debugger
        pure_funcs: ['console.info', 'console.debug'], // 🔻 доп. очистка
      },
      format: {
        comments: false, // 🔻 убрать комментарии
      },
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // 📦 отделить сторонние библиотеки
          }
        },
      },
    },
  },
});
