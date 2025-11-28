import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppLayout, MockAppLayout, ProtectedRoute, SSEProtectedRoute } from "@/app";
import * as _ from "@/pages";
import { StockGraph, StockInfo } from "../../features";

export const Router = createBrowserRouter([
  {
    element: <SSEProtectedRoute />, // 🔥 최상위에서 SSE 관리 (토큰 있을 때만 연결)
    children: [
      {
        path: "/signin",
        children: [
          {
            index: true,
            element: <_.SignInPage />,
          },
          {
            path: "wait",
            element: <_.StudentWaitPage />,
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
                element: <_.HomePage />,
              },
              {
                path: "stock/:stockId",
                element: <_.StockPage />,
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
                    element: <_.NewsPage />,
                  },
                  {
                    path: ":newsId",
                    element: <_.NewsDetailPage />,
                  },
                ],
              },
              {
                path: "result",
                element: <_.ResultPage />,
              },
              {
                path: "ending",
                element: <_.EndingPage />,
              },
            ],
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
        element: <_.MockStudentClassPage />,
      },
      {
        path: "/__test__/mock-news",
        children: [
          {
            index: true,
            element: <_.MockNewsPage />,
          },
          {
            path: ":newsId",
            element: <_.MockNewsDetailPage />,
          },
        ],
      },
      {
        path: "/__test__/mock-result",
        element: <_.MockResultPage />,
      },
      {
        path: "/__test__/mock-stock",
        element: <_.MockStockPage />,
      },
      {
        path: "/__test__/mock-wait",
        element: <_.MockStudentWaitPage />,
      },
    ],
  },
  {
    path: "*",
    element: <_.NotFoundPage />,
  },
]);
