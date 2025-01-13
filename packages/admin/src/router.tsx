import { createBrowserRouter } from 'react-router-dom';
import { StockManagementPage, SignInPage, ClassManagement } from '@/pages';
import { AppLayout } from '@/layout';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/stock-management',
        element: <StockManagementPage />,
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
