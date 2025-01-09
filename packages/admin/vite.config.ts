import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // 새로운 권장 플러그인
import path from 'path';

export default defineConfig({
  plugins: [react()], // react-refresh 대신 사용
  server: {
    port: 3000,
    host: true, // 네트워크 접근 허용
    cors: true, // CORS 설정
  },
  build: {
    outDir: 'build',
    chunkSizeWarningLimit: 3500,
    sourcemap: true, // 소스맵 생성
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
  optimizeDeps: {
    include: [
      'react-router',
      'react-router-dom',
      '@emotion/react',
      '@emotion/utils',
      '@emotion/serialize',
      '@emotion/use-insertion-effect-with-fallbacks',
      'hoist-non-react-statics',
      'scheduler',
    ],
    force: true,
    exclude: ['@babel/runtime'],
  },
});
