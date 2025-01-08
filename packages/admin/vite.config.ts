import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [reactRefresh(), tsconfigPaths()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 3500,
  },
});
