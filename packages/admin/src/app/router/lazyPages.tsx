import { lazy } from "react";

export const StockManagementLayout = lazy(() => import("@/pages").then(module => ({ default: module.StockManagementLayout })));
export const StockManagementPage = lazy(() => import("@/pages").then(module => ({ default: module.StockManagementPage })));
export const StockManagementEditPage = lazy(() => import("@/pages").then(module => ({ default: module.StockManagementEditPage })));
export const StockManagementAddPage = lazy(() => import("@/pages").then(module => ({ default: module.StockManagementAddPage })));

export const ArticleManagementLayout = lazy(() => import("@/pages").then(module => ({ default: module.ArticleManagementLayout })));
export const ArticleManagementPage = lazy(() => import("@/pages").then(module => ({ default: module.ArticleManagementPage })));
export const ArticleManagementEditPage = lazy(() => import("@/pages").then(module => ({ default: module.ArticleManagementEditPage })));
export const ArticleManagementAddPage = lazy(() => import("@/pages").then(module => ({ default: module.ArticleManagementAddPage })));

export const ClassManagement = lazy(() => import("@/pages").then(module => ({ default: module.ClassManagement })));
export const ClassEnvironment = lazy(() => import("@/pages").then(module => ({ default: module.ClassEnvironment })));
export const ClassEdit = lazy(() => import("@/pages").then(module => ({ default: module.ClassEdit })));
export const InvestmentPreparation = lazy(() => import("@/pages").then(module => ({ default: module.InvestmentPreparation })));
export const ImprovedClassMonitoringPage = lazy(() => import("@/pages").then(module => ({ default: module.ImprovedClassMonitoringPage })));
export const CreateClass = lazy(() => import("@/pages").then(module => ({ default: module.CreateClass })));