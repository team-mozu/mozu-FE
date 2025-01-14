import { createBrowserRouter } from 'react-router-dom';
import {
  StockManagementPage,
  SignInPage,
  ClassManagement,
  ArticleManagementAddPage,
  StockManagementAddPage,
  StockManagementEditPage,
  ArticleManagementPage,
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
            element: <StockManagementPage />,
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
        path: 'article-management',
        children: [
          {
            index: true,
            element: <ArticleManagementPage />,
          },
          {
            path: ':id',
            element: <ArticleManagementPage />,
          },
          {
            path: 'add',
            element: <ArticleManagementAddPage />,
          },
          {
            path: 'edit',
            element: <ArticleManagementAddPage />, //! 여기 수정페이지 컴포넌트로 바꾸시오
          },
        ],
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
