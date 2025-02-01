import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  HomePage,
  NewsPage,
  SignInPage,
  StockPage,
  ResultPage,
  NewsDetailPage,
} from '@/pages';
import { AppLayout } from '@/layout';

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: 'home',
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: 'stock/:id',
            element: <StockPage />,
            children: [
              { index: true, element: <Navigate to="price-info" replace /> },
              { path: 'price-info', element: <StockPage /> },
              { path: 'stock-info', element: <StockPage /> },
              { path: 'news', element: <StockPage /> },
            ],
          },
        ],
      },
      {
        path: 'news',
        children: [
          { index: true, element: <NewsPage /> },
          { path: ':id', element: <NewsDetailPage /> },
        ],
      },
      {
        path: 'result',
        element: <ResultPage />,
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
