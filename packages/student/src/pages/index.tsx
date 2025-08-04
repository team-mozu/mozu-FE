import { lazy } from "react";

export const HomePage = lazy(() =>
  import("@/pages/HomePage")
    .then(module => ({
      default: module.HomePage,
    }))
    .catch(error => {
      console.error("HomePage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
export const NewsPage = lazy(() =>
  import("@/pages/NewsPage")
    .then(module => ({
      default: module.NewsPage,
    }))
    .catch(error => {
      console.error("NewsPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
export const SignInPage = lazy(() =>
  import("@/pages/SignInPage")
    .then(module => ({
      default: module.SignInPage,
    }))
    .catch(error => {
      console.error("SignInPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
export const StockPage = lazy(() =>
  import("@/pages/StockPage")
    .then(module => ({
      default: module.StockPage,
    }))
    .catch(error => {
      console.error("StockPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
export const ResultPage = lazy(() =>
  import("@/pages/ResultPage")
    .then(module => ({
      default: module.ResultPage,
    }))
    .catch(error => {
      console.error("ResultPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
export const NewsDetailPage = lazy(() =>
  import("@/pages/NewsDetailPage")
    .then(module => ({
      default: module.NewsDetailPage,
    }))
    .catch(error => {
      console.error("NewsDetailPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const StudentWaitPage = lazy(() =>
  import("@/pages/StudentWaitPage")
    .then(module => ({
      default: module.StudentWaitPage,
    }))
    .catch(error => {
      console.error("StudentWaitPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const NotFoundPage = lazy(() =>
  import("@/pages/404")
    .then(module => ({
      default: module.NotFoundPage,
    }))
    .catch(error => {
      console.error("404Page 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);

export const EndingPage = lazy(() =>
  import("@/pages/EndingPage")
    .then(module => ({
      default: module.EndingPage,
    }))
    .catch(error => {
      console.error("EndingPage 로드 실패:", error);
      return {
        default: () => <div>페이지를 불러올 수 없습니다.</div>,
      };
    }),
);
