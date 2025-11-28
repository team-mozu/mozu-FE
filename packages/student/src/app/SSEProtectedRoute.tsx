import { Outlet, useLocation } from "react-router-dom";
import { SSEProvider } from "@/shared/contexts";

/**
 * SSE 프로바이더를 제공하는 라우트
 * SSE Context 내부에서 토큰 체크하여 조건부 연결
 */
export const SSEProtectedRoute = () => {
  const location = useLocation();
  const isSigninPage = location.pathname === "/signin";

  if (isSigninPage) {
    return <Outlet />;
  }

  return (
    <SSEProvider>
      <Outlet />
    </SSEProvider>
  );
};