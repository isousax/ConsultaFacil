import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Loading } from '../components/ui/Loading';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loading size="lg" text="Carregando..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
