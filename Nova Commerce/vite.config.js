import { defineConfig } from 'vite';

export default defineConfig({
  publicDir: false,
  build: {
    outDir: 'public/build',
    manifest: true,
    rollupOptions: {
      input: ['public/assets/js/app.js', 'public/assets/css/app.css']
    }
  }
});
