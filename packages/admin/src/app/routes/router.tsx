import { createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { protectedRoutes } from "./protected";
import { publicRoutes } from "./public";

export const Router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: protectedRoutes,
  },
  ...publicRoutes,
]);
