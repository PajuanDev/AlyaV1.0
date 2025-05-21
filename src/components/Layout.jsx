import React, { useState, useEffect } from 'react';
    import { Outlet, useLocation, useParams } from 'react-router-dom';
    import Sidebar from '@/components/sidebar/Sidebar';
    import AppHeader from '@/components/AppHeader';
    import ConversationSettingsModal from '@/components/chat/ConversationSettingsModal';
    import useChat from '@/hooks/useChat';
    import { motion, AnimatePresence } from 'framer-motion';

    const Layout = () => {
      const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
        return localStorage.getItem('sidebarCollapsed') === 'true';
      });
      const location = useLocation();
      const { chatId } = useParams();
      const { getConversationById } = useChat();
      
      const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
      const [selectedConversationForSettings, setSelectedConversationForSettings] = useState(null);
      
      useEffect(() => {
        const root = document.documentElement;
        if (isSidebarCollapsed) {
          root.style.setProperty('--current-sidebar-width', 'var(--sidebar-width-collapsed)');
        } else {
          root.style.setProperty('--current-sidebar-width', 'var(--sidebar-width-expanded)');
        }
        localStorage.setItem('sidebarCollapsed', isSidebarCollapsed.toString());
      }, [isSidebarCollapsed]);

      const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
      };

      const handleOpenConversationSettings = () => {
        if (chatId) {
          const currentConv = getConversationById(chatId);
          if (currentConv) {
            setSelectedConversationForSettings(currentConv);
            setIsSettingsModalOpen(true);
          }
        }
      };

      const pageVariants = {
        initial: { opacity: 0, y: 10, scale: 0.99 },
        in: { opacity: 1, y: 0, scale: 1 },
        out: { opacity: 0, y: -10, scale: 0.99 },
      };

      const pageTransition = {
        type: 'tween',
        ease: "anticipate",
        duration: 0.4
      };

      return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden">
          <Sidebar isCollapsed={isSidebarCollapsed} toggleSidebar={toggleSidebar} />
          <div 
            className="flex-1 flex flex-col overflow-hidden relative transition-all duration-300 ease-[cubic-bezier(0.4,_0,_0.2,_1)]"
            style={{ marginLeft: 'var(--current-sidebar-width)' }}
          >
            <AppHeader 
              onOpenConversationSettings={handleOpenConversationSettings} 
              isSidebarCollapsed={isSidebarCollapsed}
            />
            <AnimatePresence mode="wait">
              <motion.main
                key={location.pathname} 
                className="flex-1 overflow-y-auto custom-scrollbar bg-gradient-to-br from-background via-background to-muted/5 dark:to-muted/3" 
                style={{ paddingTop: 'calc(var(--header-height) + 0.75rem)', paddingLeft: '0.75rem', paddingRight: '0.75rem', paddingBottom: '0.75rem' }} 
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                <div className="pb-8"> {/* Added padding bottom to content wrapper */}
                    <Outlet />
                </div>
              </motion.main>
            </AnimatePresence>
          </div>
          {selectedConversationForSettings && (
            <ConversationSettingsModal
              isOpen={isSettingsModalOpen}
              onOpenChange={setIsSettingsModalOpen}
              conversation={selectedConversationForSettings}
            />
          )}
        </div>
      );
    };

    export default Layout;