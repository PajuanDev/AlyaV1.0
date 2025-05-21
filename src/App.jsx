import React from 'react';
    import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
    import Layout from '@/components/Layout';
    import HomePage from '@/pages/HomePage';
    import AuthPage from '@/pages/AuthPage';
    import DashboardPage from '@/pages/DashboardPage';
    import ChatPage from '@/pages/ChatPage';
    import ProfilePage from '@/pages/ProfilePage';
    import IntegrationsPage from '@/pages/IntegrationsPage';
    import AutomationPage from '@/pages/AutomationPage';
    import SettingsPage from '@/pages/SettingsPage';
    import PricingPage from '@/pages/PricingPage';
    import OnboardingPage from '@/pages/OnboardingPage';
    import OnboardingStepPage from '@/pages/onboarding/OnboardingStepPage';
    import NotFoundPage from '@/pages/NotFoundPage';
    import DocumentationPage from '@/pages/DocumentationPage';
    import FAQPage from '@/pages/FAQPage';
    import TutorialsPage from '@/pages/TutorialsPage';
    import ContactPage from '@/pages/ContactPage';
    import ProtectedRoute from '@/components/ProtectedRoute';
    import { Toaster } from "@/components/ui/toaster";
    import { AnimatePresence } from 'framer-motion';
    import useAuth from '@/hooks/useAuth';

    function App() {
      const location = useLocation();
      const { user, loading } = useAuth();

      return (
        <>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<HomePage />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/contact" element={<ContactPage />} />
              
              <Route 
                path="/onboarding" 
                element={
                  <ProtectedRoute allowUnauthenticated={false} redirectTo="/auth">
                    <OnboardingPage />
                  </ProtectedRoute>
                } 
              />
               <Route 
                path="/onboarding/:stepId" 
                element={
                  <ProtectedRoute allowUnauthenticated={false} redirectTo="/auth">
                    <OnboardingStepPage />
                  </ProtectedRoute>
                } 
              />
              
              <Route 
                path="/app" 
                element={
                  <ProtectedRoute allowUnauthenticated={false} redirectTo="/auth" checkOnboarding={true}>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="chat/:chatId" element={<ChatPage />} />
                <Route path="chat" element={<ChatPage />} /> 
                <Route path="profile" element={<ProfilePage />} />
                <Route path="integrations" element={<IntegrationsPage />} />
                <Route path="automations" element={<AutomationPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="documentation" element={<DocumentationPage />} />
                <Route path="faq" element={<FAQPage />} />
                <Route path="tutorials" element={<TutorialsPage />} />
                <Route path="tutorials/:tutorialId" element={<TutorialsPage />} />
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
          <Toaster />
        </>
      );
    }

    export default App;