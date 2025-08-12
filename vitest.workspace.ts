import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  // 각 패키지별 테스트 설정
  {
    test: {
      name: "design-token",
      root: "./packages/design-token",
      environment: "node", // 토큰은 node 환경에서 테스트
      include: [
        "src/**/*.{test,spec}.{js,ts}",
      ],
      setupFiles: [
        "../../test-setup/design-tokens-setup.ts",
      ],
    },
  },
  {
    test: {
      name: "util-config",
      root: "./packages/util-config",
      environment: "node",
      include: [
        "src/**/*.{test,spec}.{js,ts}",
      ],
      setupFiles: [
        "../../test-setup/app-setup.ts",
      ],
    },
  },
  {
    test: {
      name: "ui",
      root: "./packages/ui",
      environment: "jsdom", // UI 컴포넌트는 DOM 환경 필요
      include: [
        "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
      setupFiles: [
        "../../test-setup/ui-setup.ts",
      ],
    },
  },
  {
    test: {
      name: "student",
      root: "./packages/student",
      environment: "jsdom",
      include: [
        "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
      setupFiles: [
        "../../test-setup/app-setup.ts",
      ],
    },
  },
  {
    test: {
      name: "admin",
      root: "./packages/admin",
      environment: "jsdom",
      include: [
        "src/**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
      setupFiles: [
        "../../test-setup/app-setup.ts",
      ],
    },
  },

  // 통합 테스트용 설정
  {
    test: {
      name: "integration",
      root: "./integration-tests",
      environment: "jsdom",
      include: [
        "**/*.{test,spec}.{js,jsx,ts,tsx}",
      ],
      testTimeout: 30000, // 통합 테스트는 더 긴 타임아웃
    },
  },
]);
