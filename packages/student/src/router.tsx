import { createBrowserRouter, Navigate } from "react-router-dom";
import {
  HomePage,
  NewsPage,
  SignInPage,
  StockPage,
  ResultPage,
  NewsDetailPage,
  StudentWaitPage,
  NotFoundPage,
} from "@/pages";
import { AppLayout } from "@/layout";

export const Router = createBrowserRouter([
  {
    path: "/signin",
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
    path: "/:classId",
    element: <AppLayout />,
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
      {
        path: "stock/:stockId",
        element: <StockPage />,
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
    path: "*",
    element: <NotFoundPage />,
  },
]);
