import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

export const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};
