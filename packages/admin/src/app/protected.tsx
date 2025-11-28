import { SSEProvider } from "@/shared/lib/contexts";
import { AppLayout } from "./AppLayout";
import * as pages from "./router/lazyPages";

export const protectedRoutes = [
  //인증이 필요한 페이지들
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "stock-management",
        element: <pages.StockManagementLayout />,
        children: [
          {
            index: true,
            element: <pages.StockManagementPage />,
          },
          {
            path: ":id",
            element: <pages.StockManagementPage />,
          },
          {
            path: ":id/edit",
            element: <pages.StockManagementEditPage />,
          },
          {
            path: "add",
            element: <pages.StockManagementAddPage />,
          },
        ],
      },
      {
        path: "article-management",
        element: <pages.ArticleManagementLayout />,
        children: [
          {
            index: true,
            element: <pages.ArticleManagementPage />,
          },
          {
            path: ":id",
            element: <pages.ArticleManagementPage />,
          },
          {
            path: ":id/edit",
            element: <pages.ArticleManagementEditPage />,
          },
          {
            path: "add",
            element: <pages.ArticleManagementAddPage />,
          },
        ],
      },
      {
        path: "class-management",
        children: [
          {
            index: true,
            element: <pages.ClassManagement />,
          },
          {
            path: ":id",
            children: [
              {
                index: true,
                element: <pages.ClassEnvironment />,
              },
              {
                path: "edit",
                element: <pages.ClassEdit />,
              },
              {
                path: "start",
                element: (
                  <SSEProvider>
                    <pages.InvestmentPreparation />
                  </SSEProvider>
                ),
              },
              {
                path: "monitoring",
                element: (
                  <SSEProvider>
                    <pages.ImprovedClassMonitoringPage />
                  </SSEProvider>
                ),
              },
            ],
          },
          {
            path: "create",
            element: <pages.CreateClass />,
          },
        ],
      },
    ],
  },
];
