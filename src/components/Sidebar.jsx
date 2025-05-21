import React, { useState } from 'react';
    import { NavLink, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Home, MessageSquare as MessageSquareText, User, Settings, LogOut, ChevronDown, PlusCircle, Menu, X, Sun, Moon, SlidersHorizontal, Zap, ChevronsLeft, ChevronsRight, DollarSign, Briefcase } from 'lucide-react';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Separator } from '@/components/ui/separator';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import useAuth from '@/hooks/useAuth';
    import useChat from '@/hooks/useChat';
    import { useTheme } from '@/contexts/ThemeProvider';
    import { toast } from '@/components/ui/use-toast';

    const Sidebar = ({ isCollapsed, toggleSidebar }) => {
      const { user, logout } = useAuth();
      const { conversations, createConversation, setActiveConversationId } = useChat();
      const navigate = useNavigate();
      const { theme, setTheme } = useTheme();
      const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

      const handleLogout = () => {
        logout();
        navigate('/auth');
        if(isMobileMenuOpen) setIsMobileMenuOpen(false);
      };
      
      const handleCreateConversation = () => {
        const newChatId = createConversation();
        if (newChatId) {
          navigate(`/app/chat/${newChatId}`);
        } else {
          toast({ title: "Erreur", description: "Impossible de créer une nouvelle conversation.", variant: "destructive"});
        }
        if(isMobileMenuOpen) setIsMobileMenuOpen(false);
      };

      const navLinkClasses = ({ isActive }) =>
        `flex items-center p-3 space-x-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors duration-200 group ${
          isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-muted-foreground hover:text-foreground'
        } ${isCollapsed ? 'justify-center' : ''}`;

      const NavItem = ({ to, icon: Icon, children, isExternal = false }) => {
        const content = (
          <>
            <Icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="truncate">{children}</span>}
          </>
        );

        const linkProps = {
          className: navLinkClasses,
          onClick: () => isMobileMenuOpen && setIsMobileMenuOpen(false)
        };

        if (isExternal) {
          return (
            <a href={to} target="_blank" rel="noopener noreferrer" {...linkProps}>
              {content}
            </a>
          );
        }

        return (
          <NavLink to={to} {...linkProps}>
            {content}
          </NavLink>
        );
      };
      
      const ConversationItem = ({ conv }) => (
        <NavLink 
          to={`/app/chat/${conv.id}`} 
          className={navLinkClasses}
          onClick={() => {
            setActiveConversationId(conv.id);
            if(isMobileMenuOpen) setIsMobileMenuOpen(false);
          }}
        >
          <MessageSquareText className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
          {!isCollapsed && <span className="truncate flex-grow text-sm">{conv.name}</span>}
        </NavLink>
      );

      const sidebarVariants = {
        collapsed: { width: "5rem" }, // 80px
        expanded: { width: "18rem" } // 288px
      };
      
      const mobileSidebarVariants = {
        closed: { x: "-100%" },
        open: { x: 0 }
      };

      const sidebarContent = (
        <TooltipProvider delayDuration={isCollapsed ? 0 : 500}>
        <div className={`flex flex-col h-full p-4 bg-card border-r border-border shadow-md transition-all duration-300 ease-in-out ${isCollapsed ? 'items-center' : ''}`}>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className={`flex items-center mb-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
             <NavLink to="/app/dashboard" className="flex items-center space-x-2 group" onClick={() => isMobileMenuOpen && setIsMobileMenuOpen(false)}>
              <img src="/logo.svg" alt="Alya Logo" className="h-10 w-10 transition-transform duration-300 group-hover:rotate-[15deg]" />
              {!isCollapsed && <h1 className="text-2xl font-bold text-primary tracking-tight">Alya</h1>}
            </NavLink>
            <div className="lg:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4, delay: 0.2 }}
             className="w-full"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={handleCreateConversation} className={`w-full mb-6 btn-primary-solid ${isCollapsed ? 'px-0' : ''}`}>
                  <PlusCircle className={`${isCollapsed ? '' : 'mr-2'} h-5 w-5`} /> {!isCollapsed && "Nouvelle Discussion"}
                </Button>
              </TooltipTrigger>
              {isCollapsed && <TooltipContent side="right"><p>Nouvelle Discussion</p></TooltipContent>}
            </Tooltip>
          </motion.div>
          
          <ScrollArea className={`flex-grow mb-4 ${isCollapsed ? 'w-full -mr-0 pr-0' : '-mr-2 pr-2'}`}>
             <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.3 } }
                }}
              >
                {!isCollapsed && <h2 className="px-3 py-2 text-xs font-semibold text-muted-foreground tracking-wider uppercase">Discussions</h2>}
                {conversations.length > 0 ? conversations.map(conv => (
                  <motion.div key={conv.id} variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div><ConversationItem conv={conv} /></div>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right"><p>{conv.name}</p></TooltipContent>}
                    </Tooltip>
                  </motion.div>
                )) : (
                  !isCollapsed && <p className="px-3 text-sm text-muted-foreground">Aucune discussion.</p>
                )}
              </motion.div>
          </ScrollArea>
          
          <Separator className="my-4" />
          
          <motion.nav 
            className="space-y-1 mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } }
            }}
          >
            {[
              { to: "/app/dashboard", icon: Home, label: "Tableau de Bord" },
              { to: "/app/integrations", icon: SlidersHorizontal, label: "Intégrations" },
              { to: "/app/automations", icon: Zap, label: "Automatisations" },
              { to: "/pricing", icon: DollarSign, label: "Abonnements", isExternal: false }, // Changed to internal link
            ].map(item => (
              <motion.div key={item.to} variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div><NavItem to={item.to} icon={item.icon} isExternal={item.isExternal}>{item.label}</NavItem></div>
                  </TooltipTrigger>
                  {isCollapsed && <TooltipContent side="right"><p>{item.label}</p></TooltipContent>}
                </Tooltip>
              </motion.div>
            ))}
          </motion.nav>

          <Separator className="my-4" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="mt-auto" 
          >
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className={`w-full justify-start text-left h-auto py-3 px-3 hover:bg-accent/50 group ${isCollapsed ? 'justify-center px-0' : ''}`}>
                      <Avatar className="h-9 w-9 border-2 border-transparent group-hover:border-accent transition-colors">
                        <AvatarImage src={user?.avatarUrl || `https://avatar.vercel.sh/${user?.email || 'user'}.png`} />
                        <AvatarFallback className="bg-muted group-hover:bg-accent/80 transition-colors">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <div className="flex flex-col items-start overflow-hidden ml-3">
                          <span className="text-sm font-medium truncate max-w-[120px]">{user?.name || 'Utilisateur'}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[120px]">{user?.email}</span>
                        </div>
                      )}
                      {!isCollapsed && <ChevronDown className="ml-auto h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity" />}
                    </Button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                {isCollapsed && <TooltipContent side="right"><p>{user?.name || 'Mon Compte'}</p></TooltipContent>}
              </Tooltip>
              <DropdownMenuContent className="w-60" align="end" sideOffset={isCollapsed ? 10 : 5} forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name || 'Mon Compte'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {navigate('/app/profile'); if(isMobileMenuOpen) setIsMobileMenuOpen(false);}}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {navigate('/app/settings'); if(isMobileMenuOpen) setIsMobileMenuOpen(false);}}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Paramètres</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                  {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
                  <span>{theme === "dark" ? "Mode Clair" : "Mode Sombre"}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive-foreground focus:bg-destructive/90">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Déconnexion</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {!isMobileMenuOpen && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={toggleSidebar} className={`mt-2 hidden lg:inline-flex ${isCollapsed ? 'mx-auto' : ''}`}>
                    {isCollapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right"><p>{isCollapsed ? "Étendre la barre latérale" : "Réduire la barre latérale"}</p></TooltipContent>
              </Tooltip>
            )}
          </motion.div>
        </div>
        </TooltipProvider>
      );

      return (
        <>
          <div className="lg:hidden fixed top-4 left-4 z-[100]">
            <Button variant="outline" size="icon" onClick={() => setIsMobileMenuOpen(true)} className="shadow-lg">
              <Menu className="h-6 w-6" />
            </Button>
          </div>

          <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              variants={mobileSidebarVariants}
              initial="closed"
              animate="open"
              exit="closed"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-0 z-[90] lg:hidden"
            >
              <motion.div 
                initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} 
              />
              <div className="relative w-72 max-w-[80vw] h-full">
                {sidebarContent}
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          <motion.aside 
            className="hidden lg:block flex-shrink-0"
            variants={sidebarVariants}
            initial={false}
            animate={isCollapsed ? "collapsed" : "expanded"}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {sidebarContent}
          </motion.aside>
        </>
      );
    };

    export default Sidebar;