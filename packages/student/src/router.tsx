// import { createBrowserRouter, Navigate } from 'react-router-dom';
// import {
//   HomePage,
//   NewsPage,
//   SignInPage,
//   StockPage,
//   ResultPage,
//   NewsDetailPage,
//   StudentWaitPage,
//   Protected,
// } from '@/pages';
// import { AppLayout } from '@/layout';

// export const Router = createBrowserRouter([
//   {
//     path: '/:id',
//     element: <Protected element={<AppLayout />} option={true} />,
//     children: [
//       {
//         path: 'home',
//         children: [
//           {
//             index: true,
//             element: <Protected element={<HomePage />} option={true} />,
//           },
//           {
//             path: 'stock/:id',
//             element: <Protected element={<StockPage />} option={true} />,
//             children: [
//               { index: true, element: <Navigate to="price-info" replace /> },
//               {
//                 path: 'price-info',
//                 element: <Protected element={<StockPage />} option={true} />,
//               },
//               {
//                 path: 'stock-info',
//                 element: <Protected element={<StockPage />} option={true} />,
//               },
//             ],
//           },
//         ],
//       },
//       {
//         path: 'news',
//         children: [
//           {
//             index: true,
//             element: <Protected element={<NewsPage />} option={true} />,
//           },
//           {
//             path: ':id',
//             element: <Protected element={<NewsDetailPage />} option={true} />,
//           },
//         ],
//       },
//       {
//         path: 'result',
//         element: <Protected element={<ResultPage />} option={true} />,
//       },
//     ],
//   },
//   {
//     path: 'signin',
//     children: [
//       {
//         index: true,
//         element: <Protected element={<SignInPage />} option={false} />,
//       },
//       {
//         path: 'wait',
//         element: <Protected element={<StudentWaitPage />} option={false} />,
//       },
//     ],
//   },
//   {
//     path: '*', // 404 페이지
//     element: <div>404</div>,
//   },
// ]);

import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  HomePage,
  NewsPage,
  SignInPage,
  StockPage,
  ResultPage,
  NewsDetailPage,
  StudentWaitPage,
} from "@/pages";
import { AppLayout } from "@/layout";
import { NotFoundPage } from "./pages/404";

export const Router = createBrowserRouter([
  {
    path: "/:classId",
    element: <AppLayout />,
    children: [
      {
        path: "home",
        children: [
          {
            index: true,
            element: <HomePage />,
          },
          {
            path: "stock/:stockId",
            element: <StockPage />,
            children: [
              { index: true, element: <Navigate to="price-info" replace /> },
              { path: "price-info", element: <StockPage /> },
              { path: "stock-info", element: <StockPage /> },
            ],
          },
        ],
      },
      {
        path: "news",
        children: [
          { index: true, element: <NewsPage /> },
          { path: ":newsId", element: <NewsDetailPage /> },
        ],
      },
      {
        path: "result",
        element: <ResultPage />,
      },
    ],
  },
  {
    path: "signin",
    children: [
      {
        index: true,
        element: <SignInPage />,
      },
      {
        path: "wait",
        element: <StudentWaitPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
