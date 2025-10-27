import { lazy } from "react";

export const MockNewsDetailPage = lazy(() =>
  import("@/pages/mocks/MockNewsDetailPage")
    .then(module => ({
      default: module.MockNewsDetailPage,
    }))
    .catch(error => {
      console.error("MockNewsDetailPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const MockNewsPage = lazy(() =>
  import("@/pages/mocks/MockNewsPage")
    .then(module => ({
      default: module.MockNewsPage,
    }))
    .catch(error => {
      console.error("MockNewsPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const MockResultPage = lazy(() =>
  import("@/pages/mocks/MockResultPage")
    .then(module => ({
      default: module.MockResultPage,
    }))
    .catch(error => {
      console.error("MockResultPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const MockStockPage = lazy(() =>
  import("@/pages/mocks/MockStockPage")
    .then(module => ({
      default: module.MockStockPage,
    }))
    .catch(error => {
      console.error("MockStockPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const MockStudentClassPage = lazy(() =>
  import("@/pages/mocks/MockStudentClassPage")
    .then(module => ({
      default: module.MockStudentClassPage,
    }))
    .catch(error => {
      console.error("MockStudentClassPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const MockStudentWaitPage = lazy(() =>
  import("@/pages/mocks/MockStudentWaitPage")
    .then(module => ({
      default: module.MockStudentWaitPage,
    }))
    .catch(error => {
      console.error("MockStudentWaitPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
