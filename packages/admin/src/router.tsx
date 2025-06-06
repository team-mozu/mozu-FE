import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from '@/layout';
import * as pages from '@/pages';


export const Router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "stock-management",
        children: [
          {
            index: true,
            element: <pages.StockManagementPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <pages.StockManagementPage />,
              },
              {
                path: 'edit',
                element: <pages.StockManagementEditPage />,
              },
            ],
          },
          {
            path: 'add',
            element: <pages.StockManagementAddPage />,
          },
        ],
      },
      {
        path: "article-management",
        children: [
          {
            index: true,
            element: <pages.ArticleManagementPage />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <pages.ArticleManagementPage />,
              },
              {
                path: 'edit',
                element: <pages.ArticleManagementEditPage />,
              },
            ],
          },
          {
            path: 'add',
            element: <pages.ArticleManagementAddPage />,
          },
        ],
      },
      {
        path: "class-management",
        children: [
          {
            index: true,
            element: <pages.ClassManagement />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <pages.ClassEnvironment />,
              },
              {
                path: 'edit',
                element: <pages.ClassEdit />,
              },
              {
                path: 'start',
                element: <pages.InvestmentPreparation />,
              },
              {
                path: 'monitoring',
                element: <pages.ImprovedClassMonitoringPage />,
              },
            ],
          },
          {
            path: 'create',
            element: <pages.CreateClass />,
          },
        ],
      },
    ],
  },
  {
    path: '/signin',
    element: <pages.SignInPage />,
  },
  {
    path: "*", // 404 페이지
    element: <div>404</div>,
  },
]);
