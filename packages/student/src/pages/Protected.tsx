import { useAuth } from '@/hook/useAuth';
import { Navigate } from 'react-router-dom';

interface ProtectedPageProps {
  element: React.ReactNode;
  option: boolean;
}

export const Protected = ({ element, option }: ProtectedPageProps) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn && option) return <Navigate to="/signin" replace />;

  return element;
};
