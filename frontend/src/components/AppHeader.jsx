import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Settings, Bell, HelpCircle, MessageSquare } from 'lucide-react';
    import { ThemeToggle } from '@/components/ThemeToggle';
    import UserProfileDropdown from '@/components/sidebar/UserProfileDropdown';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { useLocation, useParams, useNavigate } from 'react-router-dom';
    import useChat from '@/hooks/useChat';
    import useNotifications from '@/hooks/useNotifications';
    import NotificationsPanel from '@/components/notifications/NotificationsPanel';
    import { motion } from 'framer-motion';

    const AppHeader = ({ onOpenConversationSettings, isSidebarCollapsed }) => {
      const location = useLocation();
      const navigate = useNavigate();
      const { chatId } = useParams();
      const { activeConversation } = useChat();
      const { unreadCount, markAllAsRead } = useNotifications();
      const [isNotificationsPanelOpen, setIsNotificationsPanelOpen] = useState(false);
      
      const getPageTitle = () => {
        const path = location.pathname;
        if (path.startsWith('/app/chat/') && activeConversation) return activeConversation.name;
        if (path.startsWith('/app/chat') && !chatId) return "Nouvelle Discussion";
        if (path.startsWith('/app/dashboard')) return "Tableau de Bord";
        if (path.startsWith('/app/profile')) return "Profil Utilisateur";
        if (path.startsWith('/app/integrations')) return "Intégrations";
        if (path.startsWith('/app/automations')) return "Automatisations";
        if (path.startsWith('/app/settings')) return "Paramètres";
        if (path.startsWith('/app/documentation')) return "Documentation & Aide";
        if (path.startsWith('/app/faq')) return "FAQ";
        if (path.startsWith('/app/tutorials')) return "Tutoriels";
        if (path.startsWith('/pricing')) return "Nos Offres";
        return "Alya";
      };

      const showConversationSettingsButton = location.pathname.startsWith('/app/chat/') && chatId && activeConversation;
      
      const handleOpenNotifications = () => {
        setIsNotificationsPanelOpen(true);
        // Optionally mark all as read when panel is opened, or provide a button inside
        // For now, let's assume a button inside the panel handles this.
      };

      return (
        <>
          <motion.header 
            initial={{ y: -64, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 25, delay: 0.2 }}
            className="fixed top-0 right-0 bg-background/80 backdrop-blur-xl border-b border-border/70 flex items-center justify-between px-4 md:px-6 z-40 transition-all duration-300 ease-in-out"
            style={{ 
              height: 'var(--header-height)', 
              left: 'var(--current-sidebar-width)' 
            }}
          >
            <div className="flex items-center overflow-hidden">
              {location.pathname.startsWith('/app/chat/') && activeConversation?.systemPrompt ? (
                  <TooltipProvider delayDuration={150}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <MessageSquare className="h-5 w-5 text-primary mr-2.5 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent side="bottom" align="start" className="max-w-xs">
                        <p className="text-xs font-medium">Personnalité IA Active:</p>
                        <p className="text-xs text-muted-foreground truncate">{activeConversation.systemPrompt}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : null}
              <h1 className="text-lg md:text-xl font-semibold text-foreground truncate" title={getPageTitle()}>
                {getPageTitle()}
              </h1>
            </div>
            
            <div className="flex items-center space-x-1.5 md:space-x-2">
              <TooltipProvider delayDuration={100}>
                {showConversationSettingsButton && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full" onClick={onOpenConversationSettings}>
                        <Settings className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent><p>Paramètres de la conversation</p></TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="relative text-muted-foreground hover:text-primary rounded-full"
                        onClick={handleOpenNotifications}
                    >
                      <Bell className="h-5 w-5" />
                      {unreadCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.3 }}
                          className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5"
                        >
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                        </motion.span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>{unreadCount > 0 ? `${unreadCount} nouvelle${unreadCount > 1 ? 's':''} notification${unreadCount > 1 ? 's':''}` : 'Notifications'}</p></TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full" onClick={() => navigate('/app/documentation')}>
                      <HelpCircle className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Aide & Support</p></TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <ThemeToggle />
              <UserProfileDropdown />
            </div>
          </motion.header>
          <NotificationsPanel isOpen={isNotificationsPanelOpen} onOpenChange={setIsNotificationsPanelOpen} />
        </>
      );
    };

    export default AppHeader;