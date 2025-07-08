import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout } from "@/layout";
import { StockGraph, StockInfo } from "./components";
import * as pages from '@/pages';

export const Router = createBrowserRouter([
  {
    path: "/signin",
    children: [
      {
        index: true,
        element: <pages.SignInPage />,
      },
      {
        path: "wait",
        element: <pages.StudentWaitPage />,
      },
    ],
  },
  {
    path: "/:classId",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <pages.HomePage />,
      },
      {
        path: "stock/:stockId",
        element: <pages.StockPage />,
        children: [
          { index: true, element: <Navigate to="stock-info" replace /> },
          { path: "price-info", element: <StockGraph /> },
          { path: "stock-info", element: <StockInfo /> },
        ],
      },
      {
        path: "news",
        children: [
          { index: true, element: <pages.NewsPage /> },
          { path: ":newsId", element: <pages.NewsDetailPage /> },
        ],
      },
      {
        path: "result",
        element: <pages.ResultPage />,
      },
      {
        path: "ending",
        element: <pages.EndingPage />,
      },
    ],
  },
  {
    path: "*",
    element: <pages.NotFoundPage />,
  },
]);