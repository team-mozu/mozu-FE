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
  InvestmentPreparation,
  Protected,
} from '@/pages';
import { AppLayout } from '@/layout';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Protected element={<AppLayout />} option={true} />,
    children: [
      {
        path: 'stock-management',
        children: [
          {
            index: true,
            element: (
              <Protected element={<StockManagementPage />} option={true} />
            ),
          },
          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <Protected element={<StockManagementPage />} option={true} />
                ),
              },
              {
                path: 'edit',
                element: (
                  <Protected
                    element={<StockManagementEditPage />}
                    option={true}
                  />
                ),
              },
            ],
          },
          {
            path: 'add',
            element: (
              <Protected element={<StockManagementAddPage />} option={true} />
            ),
          },
        ],
      },
      {
        path: 'article-management',
        children: [
          {
            index: true,
            element: (
              <Protected element={<ArticleManagementPage />} option={true} />
            ),
          },
          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <Protected
                    element={<ArticleManagementPage />}
                    option={true}
                  />
                ),
              },
              {
                path: 'edit',
                element: (
                  <Protected
                    element={<ArticleManagementEditPage />}
                    option={true}
                  />
                ),
              },
            ],
          },
          {
            path: 'add',
            element: (
              <Protected element={<ArticleManagementAddPage />} option={true} />
            ),
          },
        ],
      },
      {
        path: 'class-management',
        children: [
          {
            index: true,
            element: <Protected element={<ClassManagement />} option={true} />,
          },

          {
            path: ':id',
            children: [
              {
                index: true,
                element: (
                  <Protected element={<ClassEnvironment />} option={true} />
                ),
              },
              {
                path: 'edit',
                element: <Protected element={<ClassEdit />} option={true} />,
              },
              {
                path: 'start',
                element: (
                  <Protected
                    element={<InvestmentPreparation />}
                    option={true}
                  />
                ),
              },
              {
                path: 'monitoring',
                element: (
                  <Protected element={<ClassMonitoringPage />} option={true} />
                ),
              },
            ],
          },

          {
            path: 'create',
            element: <Protected element={<CreateClass />} option={true} />,
          },
        ],
      },
    ],
  },
  {
    path: 'signin',
    element: <Protected element={<SignInPage />} option={false} />,
  },
  {
    path: '*', // 404 페이지
    element: <div>404</div>,
  },
]);
