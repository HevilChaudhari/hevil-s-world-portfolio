import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

/**
 * Base path
 * ---------
 * Defaults to './' (relative). Combined with HashRouter, a relative base lets the
 * same build work at both https://USER.github.io/ and https://USER.github.io/REPO/
 * without hardcoding the repository name anywhere.
 *
 * Override with VITE_BASE_PATH (e.g. '/my-repo/') if you ever need an absolute base.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || './';

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    build: {
      // Phaser is large (~1.2 MB minified); keep it in its own cacheable chunk.
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules/phaser')) return 'phaser';
            if (id.includes('node_modules/react')) return 'react';
            return undefined;
          },
        },
      },
    },
  };
});
