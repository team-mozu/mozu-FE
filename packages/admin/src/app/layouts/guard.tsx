import { getCookies } from "@mozu/util-config";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface AppLayoutGuardProps {
  children: React.ReactNode;
}

export const AppLayoutGuard = ({ children }: AppLayoutGuardProps) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const accessToken = getCookies<string>("accessToken");

  useEffect(() => {
    if (accessToken === undefined) {
      navigate("/signin", {
        replace: true,
      });
      return;
    }

    if (pathname === "/") {
      navigate("/class-management", {
        replace: true,
      });
    }
  }, [
    accessToken,
    pathname,
    navigate,
  ]);

  return <>{children}</>;
};
