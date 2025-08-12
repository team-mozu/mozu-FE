import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    react(),
  ],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [
      "../../test-setup/ui-setup.ts",
    ],

    // UI 컴포넌트 스냅샷 설정
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },

    // 컴포넌트 테스트에 특화된 설정
    include: [
      "src/components/**/*.{test,spec}.{js,jsx,ts,tsx}",
    ],
  },
});
