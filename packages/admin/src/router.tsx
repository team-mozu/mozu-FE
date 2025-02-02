import { createBrowserRouter } from 'react-router-dom';

import {
  StockManagementPage,
  SignInPage,
  ClassManagement,
  ArticleManagementAddPage,
  StockManagementAddPage,
  StockManagementEditPage,
  ArticleManagementPage,
  CreateClass,
  ClassEnvironment,
  ClassEdit,
  ArticleManagementEditPage,
  ClassMonitoringPage,
} from '@/pages';

import { AppLayout } from '@/layout';
import { InvestmentPreparation } from './pages/InvestmentPreparation';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'stock-management',
        children: [
          {
            index: true,
            element: <StockManagementPage />,
          },
          {
            path: ':id',
            children: [
              { index: true, element: <StockManagementPage /> },
              {
                path: 'edit',
                element: <StockManagementEditPage />,
              },
            ],
          },
          {
            path: 'add',
            element: <StockManagementAddPage />,
          },
        ],
      },
      {
        path: 'article-management',
        children: [
          {
            index: true,
            element: <ArticleManagementPage />,
          },
          {
            path: ':id',
            children: [
              { index: true, element: <ArticleManagementPage /> },
              {
                path: 'edit',
                element: <ArticleManagementEditPage />,
              },
            ],
          },
          {
            path: 'add',
            element: <ArticleManagementAddPage />,
          },
        ],
      },
      {
        path: 'class-management',
        children: [
          {
            index: true,
            element: <ClassManagement />,
          },

          {
            path: ':id',
            children: [
              {
                index: true,
                element: <ClassEnvironment />,
              },
              {
                path: 'edit',
                element: <ClassEdit />,
              },
              {
                path: 'start',
                element: <InvestmentPreparation />,
              },
              {
                path: 'monitoring',
                element: <ClassMonitoringPage />,
              },
            ],
          },

          {
            path: 'create',
            element: <CreateClass />,
          },
        ],
      },
    ],
  },
  {
    path: 'signin',
    element: <SignInPage />,
  },
  {
    path: '*', // 404 페이지
    element: <div>404</div>,
  },
]);
