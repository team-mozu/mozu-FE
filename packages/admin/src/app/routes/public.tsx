import * as pages from "@/pages/login";

export const publicRoutes = [
  {
    path: "/signin",
    element: <pages.SignInPage />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
];
