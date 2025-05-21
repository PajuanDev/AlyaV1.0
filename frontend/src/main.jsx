import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from '@/App';
import { AuthProvider } from '@/auth/AuthContext';      // ← nouveau chemin
import { ChatProvider } from '@/contexts/ChatContext';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

import '@/index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider defaultTheme="dark" storageKey="alya-ui-theme">
        <AuthProvider>                                 {/* ← nouveau provider */}
          <ChatProvider>
            <TooltipProvider delayDuration={100}>
              <App />
            </TooltipProvider>
          </ChatProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
