import { createBrowserRouter } from 'react-router-dom';
import { StockManagementPage, SignInPage } from '@/pages';
import { AppLayout } from '@/layout';
import { CreateClass } from './pages/CreateClass';

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
            element: <StockManagementPage />,
          },
        ],
      },
      {
        path: 'create-class',
        element: <CreateClass />,
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
