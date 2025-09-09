import * as pages from "@/pages/signIn";

export const publicRoutes = [
  //인증이 필요하지 않은 페이지들
  {
    path: "/signin",
    element: <pages.SignInPage />,
  },
  {
    path: "*",
    element: <div>404</div>,
  },
];
