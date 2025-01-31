import { createBrowserRouter } from 'react-router-dom';
import { HomePage, NewsPage, SignInPage, StockPage, ResultPage } from '@/pages';
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
              { path: 'quote', element: <StockPage /> },
              { path: 'stock-info', element: <StockPage /> },
              { path: 'news', element: <StockPage /> },
            ],
          },
        ],
      },
      {
        path: 'news',
        element: <NewsPage />,
        children: [{ path: ':id', element: <div>NewsPage</div> }],
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
