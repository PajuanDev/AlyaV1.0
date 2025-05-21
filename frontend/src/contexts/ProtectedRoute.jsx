import React from 'react';
    import { Navigate, useLocation } from 'react-router-dom';
    import { useAuth } from '@/auth/AuthContext';
    import { Loader2 } from 'lucide-react';

    const ProtectedRoute = ({ children, allowUnauthenticated = false, redirectTo = "/auth", checkOnboarding = false }) => {
      const { user, loading, isOnboardingCompleted } = useAuth();
      const location = useLocation();

      if (loading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        );
      }

      if (!user && !allowUnauthenticated) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
      }
      
      // If user is authenticated and checkOnboarding is true, verify onboarding status
      if (user && checkOnboarding && !isOnboardingCompleted()) {
         // Redirect to the first step of onboarding if not completed
        return <Navigate to="/onboarding/welcome" state={{ from: location }} replace />;
      }

      return children;
    };

    export default ProtectedRoute;