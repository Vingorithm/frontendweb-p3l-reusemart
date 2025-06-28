import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/', // Update to '/subpath/' if hosted in a subdirectory
  build: {
    outDir: 'dist',
    sourcemap: true, // Enable for debugging
    assetsDir: 'assets' // Ensure assets are organized
  },
  server: {
    host: true
  }
});