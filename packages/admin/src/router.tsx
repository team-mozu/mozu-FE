import { createBrowserRouter } from 'react-router-dom';
import {
  StockManagementPage,
  SignInPage,
  StockManagementAddPage,
  ClassManagement,
} from '@/pages';
import { AppLayout } from '@/layout';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/stock-management',
        children: [
          {
            index: true,
            element: <StockManagementPage />,
          },
          {
            path: ':id',
            children: [
              {
                path: '/',
                element: <StockManagementPage />,
              },
              {
                path: '/add',
                element: <StockManagementAddPage />,
              },
            ],
          },
        ],
      },
      {
        path: '/class-management',
        element: <ClassManagement />,
      },
    ],
  },
  {
    path: '/signin',
    element: <SignInPage />,
  },
  {
    path: '*', // 404 페이지
    element: <div>404</div>,
  },
]);
