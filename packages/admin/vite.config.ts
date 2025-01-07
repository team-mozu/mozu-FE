import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRefresh()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 3500,
  },
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
      '@mozu/design-token': path.resolve(
        __dirname,
        '../design-token/src/index.ts',
      ),
    },
  },
});
