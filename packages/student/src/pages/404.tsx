import { Navigate, useNavigate } from "react-router-dom";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return <Navigate to={"/signin"} replace />;
};
