import React, { useEffect } from 'react';
    import { useNavigate } from 'react-router-dom';
    import useAuth from '@/hooks/useAuth';

    // This page now primarily acts as a redirector or entry point to the first step.
    // The actual step logic is in OnboardingStepPage.
    const OnboardingPage = () => {
      const navigate = useNavigate();
      const { user } = useAuth();

      useEffect(() => {
        // If user has already completed onboarding, redirect to dashboard
        if (user?.onboardingCompleted) {
          navigate('/app/dashboard', { replace: true });
        } else {
          // Redirect to the first step of onboarding
          // The first step ID should match one defined in OnboardingStepPage's stepsConfig
          navigate('/onboarding/welcome', { replace: true });
        }
      }, [user, navigate]);

      // Render a loading state or null while redirecting
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <p className="text-muted-foreground">Chargement de l'onboarding...</p>
        </div>
      );
    };

    export default OnboardingPage;