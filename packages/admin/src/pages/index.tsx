import { lazy } from 'react';

export const StockManagementPage = lazy(() =>
  import('@/pages/StockManagementPage')
    .then((module) => ({ default: module.StockManagementPage }))
    .catch((error) => {
      console.error('StockManagementPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const StockManagementEditPage = lazy(() =>
  import('@/pages/StockManagementEditPage')
    .then((module) => ({ default: module.StockManagementEditPage }))
    .catch((error) => {
      console.error('StockManagementEditPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const StockManagementAddPage = lazy(() =>
  import('@/pages/StockManagementAddPage')
    .then((module) => ({ default: module.StockManagementAddPage }))
    .catch((error) => {
      console.error('StockManagementAddPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const SignInPage = lazy(() =>
  import('@/pages/SignInPage')
    .then((module) => ({ default: module.SignInPage }))
    .catch((error) => {
      console.error('SignInPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const ClassManagement = lazy(() =>
  import('@/pages/ClassManagement')
    .then((module) => ({ default: module.ClassManagement }))
    .catch((error) => {
      console.error('ClassManagement 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const ArticleManagementAddPage = lazy(() =>
  import('@/pages/ArticleManagementAddPage')
    .then((module) => ({ default: module.ArticleManagementAddPage }))
    .catch((error) => {
      console.error('ArticleManagementAddPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const ArticleManagementEditPage = lazy(() =>
  import('@/pages/ArticleManagementEditPage')
    .then((module) => ({ default: module.ArticleManagementEditPage }))
    .catch((error) => {
      console.error('ArticleManagementEditPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const ArticleManagementPage = lazy(() =>
  import('@/pages/ArticleManagementPage')
    .then((module) => ({ default: module.ArticleManagementPage }))
    .catch((error) => {
      console.error('ArticleManagementPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const CreateClass = lazy(() =>
  import('@/pages/ClassCreate')
    .then((module) => ({ default: module.CreateClass }))
    .catch((error) => {
      console.error('CreateClass 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const ClassEnvironment = lazy(() =>
  import('@/pages/ClassEnvironment')
    .then((module) => ({ default: module.ClassEnvironment }))
    .catch((error) => {
      console.error('ClassEnvironment 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const ClassEdit = lazy(() =>
  import('@/pages/ClassEdit')
    .then((module) => ({ default: module.ClassEdit }))
    .catch((error) => {
      console.error('ClassEdit 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
export const InvestmentPreparation = lazy(() =>
  import('@/pages/InvestmentPreparation')
    .then((module) => ({ default: module.InvestmentPreparation }))
    .catch((error) => {
      console.error('InvestmentPreparation 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);

export const ImprovedClassMonitoringPage = lazy(() =>
  import('@/pages/ImprovedClassMonitoringPage')
    .then((module) => ({ default: module.ImprovedClassMonitoringPage }))
    .catch((error) => {
      console.error('ImprovedClassMonitoringPage 로드 실패:', error);
      return { default: () => <div>페이지를 불러올 수 없습니다.</div> };
    }),
);
