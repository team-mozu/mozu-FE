import { vi } from "vitest";

// env 모의 처리
vi.mock("../../packages/util-config/src/env", () => ({
  SERVER_URL: "http://mock-server.com",
  COOKIE_DOMAIN: "mock-domain.com",
  STUDENT_COOKIE_DOMAIN: "student.mock-domain.com",
  ADMIN_COOKIE_DOMAIN: "admin.mock-domain.com",
}));

// axios 인스턴스 모의 처리
vi.mock("../../packages/util-config/src/utils/apis/axios", () => ({
  instance: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: {
        use: vi.fn(),
      },
      response: {
        use: vi.fn(),
      },
    },
  },
}));

// auth 관련 함수 모의 처리
vi.mock("../../packages/util-config/src/utils/apis/auth", () => ({
  reIssueToken: vi.fn(),
  setTokens: vi.fn(),
  removeTokens: vi.fn(),
}));

// cookies 유틸리티 함수 모의 처리
vi.mock("../../packages/util-config/src/utils/cookies", () => ({
  getCookies: vi.fn(),
  setCookies: vi.fn(),
  removeCookies: vi.fn(),
  removeCookiesAsync: vi.fn(),
}));
