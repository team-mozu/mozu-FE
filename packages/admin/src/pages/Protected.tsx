import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router';

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
