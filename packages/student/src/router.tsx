import { createBrowserRouter } from 'react-router-dom';
import { SignInPage } from '@/pages';
import { AppLayout } from '@/layout';
import { Test } from './pages/test';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Test />,
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
