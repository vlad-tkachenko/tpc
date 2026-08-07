import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Crucial: ensures asset paths are relative for local file loading in Electron
  build: {
    outDir: 'dist',
  },
  server: {
    port: 5173,
  },
});