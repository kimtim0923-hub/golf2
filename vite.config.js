import { defineConfig } from 'vite';

export default defineConfig({
  envPrefix: ['VITE_', 'ANTHROPIC_'],
  server: {
    proxy: {
      '/api/anthropic': {
        target: 'https://api.anthropic.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/anthropic/, ''),
        secure: true,
      }
    }
  }
});
