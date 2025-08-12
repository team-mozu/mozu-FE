import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // 워크스페이스 설정 - 각 패키지별 vitest 설정을 찾음
  test: {
    // 글로벌 설정
    globals: true,
    environment: "jsdom",

    // 공통 setup 파일
    setupFiles: [
      "./test-setup/global-setup.ts",
    ],

    // 루트에서 실행할 테스트 (공통 유틸리티 등)
    include: [
      "packages/*/src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
      "test/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}",
    ],

    // 워크스페이스 별 설정 파일 경로
    workspace: "vitest.workspace.ts",

    // 공통 커버리지 설정
    coverage: {
      provider: "v8",
      reporter: [
        "text",
        "json",
        "html",
      ],
      reportsDirectory: "./coverage",
      exclude: [
        "node_modules/",
        "dist/",
        "build/",
        "**/*.d.ts",
        "**/*.config.{js,ts}",
        "**/test-setup/**",
        "**/coverage/**",
      ],
    },
  },

  // 모노레포 내 패키지 간 경로 해석
  resolve: {
    alias: {
      "@ui": path.resolve(__dirname, "packages/ui/src"),
      "@design-tokens": path.resolve(__dirname, "packages/design-token/src"),
      "@student": path.resolve(__dirname, "packages/student/src"),
      "@admin": path.resolve(__dirname, "packages/admin/src"),
      "@util-config": path.resolve(__dirname, "packages/util-config/src"),
    },
  },
});
