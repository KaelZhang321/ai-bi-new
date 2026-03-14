import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/meeting/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/meeting/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/meeting/, ''),
      },
    },
  },
})
