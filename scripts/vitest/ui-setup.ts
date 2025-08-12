import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// 의존하는 설정 파일들을 먼저 임포트합니다.
import "./global-setup";
import "./design-token-setup";
import "./util-config-setup";

// 각 테스트 케이스가 끝난 후 DOM을 정리합니다.
afterEach(() => {
  cleanup();
});
