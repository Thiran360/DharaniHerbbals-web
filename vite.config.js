import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**', '**/*.zip', '**/dist*/**']
    },
    proxy: {
      '/api/media': {
        target: 'http://179.197.251.47:30080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/api': {
        target: 'http://179.197.251.47:30080/herbal',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
