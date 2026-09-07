import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Portable Vite configuration: React remains the frontend and Laravel remains the only API backend.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          ui: ['bootstrap', 'sweetalert2', 'lucide-react'],
          http: ['axios'],
        },
      },
    },
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://127.0.0.1:8000',
  //       changeOrigin: true,
  //     },
  //   },
  // },
  base: "/"
});
