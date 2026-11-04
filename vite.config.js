import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Permissions-Policy': 'unload=*'
    },
    watch: {
      ignored: ['**/dist/**', '**/.git/**', '**/node_modules/**', '**/*.zip', '**/dist*/**']
    },
    proxy: {
      '/api/media': {
        target: 'http://179.197.251.47:30080',
        changeOrigin: true,
        secure: false,
        headers: {
          host: '179.197.251.47:30080'
        },
        rewrite: (path) => path.replace(/^\/api\/media/, '/media')
      },
      '/api': {
        target: 'http://179.197.251.47:30080',
        changeOrigin: true,
        secure: false,
        headers: {
          host: '179.197.251.47:30080'
        },
        rewrite: (path) => path.replace(/^\/api/, '/herbal')
      }
    }
  },
  preview: {
    headers: {
      'Permissions-Policy': 'unload=*'
    }
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true,
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('react-router-dom/')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-lucide';
            }
            if (id.includes('canvas-confetti')) {
              return 'vendor-confetti';
            }
          }
        }
      }
    }
  }
})
