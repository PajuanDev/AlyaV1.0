import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

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

import { RequireAuth } from '@/auth/RequireAuth';     // ← nouveau garde
import { useAuth } from '@/auth/AuthContext';         // ← nouveau hook
import { Toaster } from '@/components/ui/toaster';

function App() {
  const location = useLocation();
  const { loading } = useAuth();                     // le user est accessible via hook si besoin

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Onboarding (protégé) */}
          <Route
            path="/onboarding"
            element={
              <RequireAuth>
                <OnboardingPage />
              </RequireAuth>
            }
          />
          <Route
            path="/onboarding/:stepId"
            element={
              <RequireAuth>
                <OnboardingStepPage />
              </RequireAuth>
            }
          />

          {/* Application principale (protégée) */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <Layout />
              </RequireAuth>
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

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AnimatePresence>

      <Toaster />
    </>
  );
}

export default App;
