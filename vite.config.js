import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true
  },
  assetsInclude: ['**/*.glb']
});