import { getCookies } from "@mozu/util-config";
import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = () => {
  const accessToken = getCookies<string>("accessToken");

  if (!accessToken) {
    return <Navigate to="/signin" replace />;
  }

  return <Outlet />;
};
