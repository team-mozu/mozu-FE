import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout, MockAppLayout, ProtectedRoute } from "@/app";
import { StockGraph, StockInfo } from "@/features/stock-trading";
import * as pages from "@/pages";

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
    element: <ProtectedRoute />,
    children: [
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
              {
                index: true,
                element: (
                  <Navigate
                    to="stock-info"
                    replace
                  />
                ),
              },
              {
                path: "price-info",
                element: <StockGraph />,
              },
              {
                path: "stock-info",
                element: <StockInfo />,
              },
            ],
          },
          {
            path: "news",
            children: [
              {
                index: true,
                element: <pages.NewsPage />,
              },
              {
                path: ":newsId",
                element: <pages.NewsDetailPage />,
              },
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
    ],
  },
  {
    element: <MockAppLayout />,
    children: [
      {
        path: "/__test__/mock-classroom",
        element: <pages.MockStudentWaitPage />,
      },
      {
        path: "/__test__/mock-news",
        children: [
          {
            index: true,
            element: <pages.MockNewsPage />,
          },
          {
            path: ":newsId",
            element: <pages.MockNewsDetailPage />,
          },
        ],
      },
      {
        path: "/__test__/mock-result",
        element: <pages.MockResultPage />,
      },
      {
        path: "/__test__/mock-stock",
        element: <pages.MockStockPage />,
      },
      {
        path: "/__test__/mock-wait",
        element: <pages.MockStudentWaitPage />,
      },
    ],
  },
  {
    path: "*",
    element: <pages.NotFoundPage />,
  },
]);
