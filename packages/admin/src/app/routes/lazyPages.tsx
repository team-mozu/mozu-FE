import { lazy } from "react";

export const StockManagementLayout = lazy(() => import("@/pages/stock/ui/StockManagementLayout").then(module => ({ default: module.StockManagementLayout })));
export const StockManagementPage = lazy(() => import("@/pages/stock/ui/StockManagementPage").then(module => ({ default: module.StockManagementPage })));
export const StockManagementEditPage = lazy(() => import("@/pages/stock/ui/StockManagementEditPage").then(module => ({ default: module.StockManagementEditPage })));
export const StockManagementAddPage = lazy(() => import("@/pages/stock/ui/StockManagementAddPage").then(module => ({ default: module.StockManagementAddPage })));

export const ArticleManagementLayout = lazy(() => import("@/pages/article/ui/ArticleManagementLayout").then(module => ({ default: module.ArticleManagementLayout })));
export const ArticleManagementPage = lazy(() => import("@/pages/article/ui/ArticleManagementPage").then(module => ({ default: module.ArticleManagementPage })));
export const ArticleManagementEditPage = lazy(() => import("@/pages/article/ui/ArticleManagementEditPage").then(module => ({ default: module.ArticleManagementEditPage })));
export const ArticleManagementAddPage = lazy(() => import("@/pages/article/ui/ArticleManagementAddPage").then(module => ({ default: module.ArticleManagementAddPage })));

export const ClassManagement = lazy(() => import("@/pages/class/ui/ClassManagement").then(module => ({ default: module.ClassManagement })));
export const ClassEnvironment = lazy(() => import("@/pages/class/ui/ClassEnvironment").then(module => ({ default: module.ClassEnvironment })));
export const ClassEdit = lazy(() => import("@/pages/class/ui/ClassEdit").then(module => ({ default: module.ClassEdit })));
export const CreateClass = lazy(() => import("@/pages/class/ui/ClassCreate").then(module => ({ default: module.CreateClass })));

export const InvestmentPreparation = lazy(() => import("@/pages/monitoring/ui/ImprovedClassMonitoringPage").then(module => ({ default: module.InvestmentPreparation })));
export const ImprovedClassMonitoringPage = lazy(() => import("@/pages/monitoring/ui/ImprovedClassMonitoringPage").then(module => ({ default: module.ImprovedClassMonitoringPage })));