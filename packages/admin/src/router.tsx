import { createBrowserRouter } from 'react-router-dom';
import {
  StockManagementPage,
  SignInPage,
  ClassManagement,
  ArticleManagementAdd,
  StockManagementAddPage,
  StockManagementEditPage,
} from '@/pages';
import { AppLayout } from '@/layout';

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
              {
                index: true,
                element: <StockManagementPage />,
              },
            ],
          },
          {
            path: 'add',
            element: <StockManagementAddPage />,
          },
          {
            path: 'edit',
            element: <StockManagementEditPage />,
          },
        ],
      },
      {
        path: 'article-management-add',
        element: <ArticleManagementAdd />,
      },
      {
        path: 'class-management',
        element: <ClassManagement />,
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
