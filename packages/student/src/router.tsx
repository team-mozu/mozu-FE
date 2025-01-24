import { createBrowserRouter } from 'react-router-dom';
import { SignInPage } from '@/pages';
import { AppLayout } from '@/layout';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [{}],
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
