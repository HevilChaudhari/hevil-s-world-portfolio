/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { PAGES } from './src/data/pages.ts';
import { githubPages404 } from './scripts/githubPages404.ts';

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
    plugins: [
      react(),
      tailwindcss(),
      // dist/404.html forwards hash-less paths (/repo/resume) to /repo/#/resume.
      // PAGES_BASE_PATH comes from actions/configure-pages in the deploy workflow.
      githubPages404({
        basePath: process.env.PAGES_BASE_PATH,
        routeSegments: [...new Set(Object.values(PAGES).map((page) => page.path.split('/')[1]))],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      // Unit tests for framework-free logic (maps, data, input, utils). No DOM needed.
      include: ['src/**/*.test.ts'],
      environment: 'node',
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
