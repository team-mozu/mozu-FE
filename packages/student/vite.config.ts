import react from "@vitejs/plugin-react"; // 새로운 권장 플러그인
import path from "path";
import { defineConfig } from "vite";
import { getLocalIPv4 } from "./src/shared/lib/getLocalIp.node";

export default defineConfig(({ mode }) => {
  const config = {
    plugins: [
      react(),
    ],
    server: {
      port: 3001,
      host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "student.localhost",
      cors: true,
    },
    define: {
      // 기본 환경 변수 정의
      "import.meta.env.VITE_STUDENT_URL": JSON.stringify("http://student.localhost:3001"),
      "import.meta.env.VITE_STUDENT_AUTH_URL": JSON.stringify("http://student.localhost:3001/signin"),
      "import.meta.env.VITE_STUDENT_COOKIE_DOMAIN": JSON.stringify("localhost"),
    },
    build: {
      chunkSizeWarningLimit: 3500,
      sourcemap: true,
    },
    resolve: {
      alias: {
        "@": path.resolve(process.cwd(), "./src"),
        "@mozu/design-token": path.resolve(__dirname, "../design-token/src"),
        "@mozu/ui": path.resolve(__dirname, "../ui/src"),
        "@mozu/util-config": path.resolve(__dirname, "../util-config/src"),
      },
    },
    optimizeDeps: {
      include: [
        "react-router",
        "react-router-dom",
        "@emotion/react",
        "@emotion/utils",
        "@emotion/serialize",
        "@emotion/use-insertion-effect-with-fallbacks",
        "hoist-non-react-statics",
        "scheduler",
      ],
      exclude: [
        "@mozu/ui",
        "@mozu/design-token",
        "@mozu/util-config",
      ],
      force: true,
    },
  };

  if (mode === "ipdev") {
    const localIp = getLocalIPv4();

    console.log(`\n🚀 IP 모드로 실행합니다. 접속 IP: http://${localIp}:5173\n`);

    config.define = {
      ...config.define,
      // VITE_STUDENT_URL의 값을 로컬 IP로 재정의합니다.
      // JSON.stringify()로 감싸는 것이 중요합니다.
      "import.meta.env.VITE_STUDENT_URL": JSON.stringify(`http://${localIp}:3001`),
      "import.meta.env.VITE_STUDENT_AUTH_URL": JSON.stringify(`http://${localIp}:3001/signin`),
      "import.meta.env.VITE_STUDENT_COOKIE_DOMAIN": JSON.stringify(localIp),
    };
  }

  return config;
});
