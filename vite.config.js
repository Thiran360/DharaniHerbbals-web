import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**']
    },
    proxy: {
      '/api': {
        target: 'https://api.codingboss.in/herbal',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
