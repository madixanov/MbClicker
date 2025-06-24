import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    historyApiFallback: true,
  },
  base: '/',
  build: {
    minify: 'terser', // 👉 более эффективная минификация
    terserOptions: {
      compress: {
        drop_console: true, // 👉 удаляет console.log
        drop_debugger: true,
      },
    },
  },
})
