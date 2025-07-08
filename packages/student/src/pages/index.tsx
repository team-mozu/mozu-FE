import { lazy } from 'react';

export const HomePage = lazy(() =>
  import('@/pages/HomePage').then((module) => ({ default: module.HomePage })),
);
export const NewsPage = lazy(() =>
  import('@/pages/NewsPage').then((module) => ({ default: module.NewsPage })),
);
export const SignInPage = lazy(() =>
  import('@/pages/SignInPage').then((module) => ({
    default: module.SignInPage,
  })),
);
export const StockPage = lazy(() =>
  import('@/pages/StockPage').then((module) => ({ default: module.StockPage })),
);
export const ResultPage = lazy(() =>
  import('@/pages/ResultPage').then((module) => ({
    default: module.ResultPage,
  })),
);
export const NewsDetailPage = lazy(() =>
  import('@/pages/NewsDetailPage').then((module) => ({
    default: module.NewsDetailPage,
  })),
);

export const StudentWaitPage = lazy(() =>
  import('@/pages/StudentWaitPage')
    .then((module) => ({ default: module.StudentWaitPage }))
    .catch((error) => {
      console.error('StudentWaitPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    })
);

export const NotFoundPage = lazy(() =>
  import('@/pages/404').then((module) => ({ default: module.NotFoundPage })),
);
