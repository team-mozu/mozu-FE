import { lazy } from 'react';

export const StockManagementPage = lazy(() =>
  import('@/pages/StockManagementPage').then((module) => ({
    default: module.StockManagementPage,
  })),
);

export const StockManagementEditPage = lazy(() =>
  import('@/pages/StockManagementEditPage').then((module) => ({
    default: module.StockManagementEditPage,
  })),
);

export const StockManagementAddPage = lazy(() =>
  import('@/pages/StockManagementAddPage').then((module) => ({
    default: module.StockManagementAddPage,
  })),
);

export const SignInPage = lazy(() =>
  import('@/pages/SignInPage').then((module) => ({
    default: module.SignInPage,
  })),
);

export const ClassManagement = lazy(() =>
  import('@/pages/ClassManagement').then((module) => ({
    default: module.ClassManagement,
  })),
);

export const ArticleManagementAddPage = lazy(() =>
  import('@/pages/ArticleManagementAddPage').then((module) => ({
    default: module.ArticleManagementAddPage,
  })),
);
export const ArticleManagementEditPage = lazy(() =>
  import('@/pages/ArticleManagementEditPage').then((module) => ({
    default: module.ArticleManagementEditPage,
  })),
);
export const ArticleManagementPage = lazy(() =>
  import('@/pages/ArticleManagementPage').then((module) => ({
    default: module.ArticleManagementPage,
  })),
);
export const CreateClass = lazy(() =>
  import('@/pages/ClassCreate').then((module) => ({
    default: module.CreateClass,
  })),
);
export const ClassEnvironment = lazy(() =>
  import('@/pages/ClassEnvironment').then((module) => ({
    default: module.ClassEnvironment,
  })),
);
export const ClassEdit = lazy(() =>
  import('@/pages/ClassEdit').then((module) => ({
    default: module.ClassEdit,
  })),
);

export const InvestmentPreparation = lazy(() =>
  import('@/pages/InvestmentPreparation').then((module) => ({
    default: module.InvestmentPreparation,
  })),
);

export const ClassMonitoringPage = lazy(() =>
  import('@/pages/ClassMonitoringPage').then((module) => ({
    default: module.ClassMonitoringPage,
  })),
);
