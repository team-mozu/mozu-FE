import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "@/components";
import { protectedRoutes, publicRoutes } from "./routes";

export const Router = createBrowserRouter([
  // 인증이 필요한 페이지(로그인을 해야 접근할 수 있는 페이지)는 ProtectedRoute로 묶음, 인증이 필요하지 않은 페이지(로그인, 회원가입 페이지 등)은 publicRoutes 사용
  {
    element: <ProtectedRoute />,
    children: protectedRoutes,
  },
  ...publicRoutes,
]);
