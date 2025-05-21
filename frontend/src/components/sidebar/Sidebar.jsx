import React, { useState, useEffect } from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import SidebarHeader from '@/components/sidebar/SidebarHeader';
    import NewDiscussionButton from '@/components/sidebar/NewDiscussionButton';
    import ConversationListSection from '@/components/sidebar/ConversationListSection';
    import ArchivedConversationsSection from '@/components/sidebar/ArchivedConversationsSection';
    import MainNavigation from '@/components/sidebar/MainNavigation';
    import PricingTeaserBox from '@/components/sidebar/PricingTeaserBox';
    import { Button } from '@/components/ui/button';
    import { ChevronLeft, ChevronRight } from 'lucide-react';
    import { cn } from '@/lib/utils';

    const Sidebar = () => {
        const [isCollapsed, setIsCollapsed] = useState(false);
        const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

        useEffect(() => {
            const checkMobile = () => {
                const mobile = window.innerWidth < 768;
                setIsMobile(mobile);
                if (mobile) setIsCollapsed(true);
            };
            checkMobile();
            window.addEventListener('resize', checkMobile);
            return () => window.removeEventListener('resize', checkMobile);
        }, []);
        
        const toggleSidebar = () => {
            setIsCollapsed(!isCollapsed);
        };

        const sidebarVariants = {
            collapsed: { width: 'var(--sidebar-collapsed-width)' },
            expanded: { width: 'var(--sidebar-width)' },
        };

        const mobileSidebarVariants = {
            open: { x: 0 },
            closed: { x: '-100%' },
        };
        
        const commonTransition = { type: 'spring', stiffness: 300, damping: 30 };

        if (isMobile) {
            return (
                <>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleSidebar} 
                        className="fixed top-3.5 left-3 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                        aria-label="Ouvrir/Fermer la barre latérale"
                    >
                        {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                    </Button>
                    <AnimatePresence>
                    {!isCollapsed && (
                        <motion.aside
                            key="mobile-sidebar"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={mobileSidebarVariants}
                            transition={{ ...commonTransition, duration: 0.3 }}
                            className="fixed top-0 left-0 h-full z-40 w-[var(--sidebar-width)] bg-card border-r flex flex-col shadow-2xl"
                        >
                            <SidebarContent isCollapsed={false} toggleSidebar={toggleSidebar} isMobile={isMobile} />
                        </motion.aside>
                    )}
                    </AnimatePresence>
                    {!isCollapsed && <div onClick={toggleSidebar} className="fixed inset-0 z-30 bg-black/30 backdrop-blur-sm md:hidden" />}
                </>
            );
        }

        return (
            <motion.aside
                key="desktop-sidebar"
                layout
                variants={sidebarVariants}
                initial={false}
                animate={isCollapsed ? "collapsed" : "expanded"}
                transition={commonTransition}
                className={cn(
                    "hidden md:flex flex-col h-screen bg-card border-r sticky top-0 overflow-x-hidden",
                    isCollapsed ? "items-center" : "items-stretch"
                )}
                style={{
                  width: isCollapsed ? 'var(--sidebar-collapsed-width)' : 'var(--sidebar-width)'
                }}
            >
                <SidebarContent isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} isMobile={isMobile} />
            </motion.aside>
        );
    };
    
    const SidebarContent = ({ isCollapsed, toggleSidebar, isMobile }) => (
        <>
            <SidebarHeader isCollapsed={isCollapsed} toggleSidebar={isMobile ? null : toggleSidebar} />
            <div className={cn("px-3 mt-3", isCollapsed && "px-1.5")}>
                 <NewDiscussionButton isCollapsed={isCollapsed} />
            </div>
            <ScrollArea className={cn("flex-grow mt-1 mb-2 px-3", isCollapsed && "px-1.5")}>
                <ConversationListSection isCollapsed={isCollapsed} />
                <ArchivedConversationsSection isCollapsed={isCollapsed} />
            </ScrollArea>
            <div className={cn("mt-auto border-t py-3 px-3", isCollapsed && "px-1.5")}>
                <MainNavigation isCollapsed={isCollapsed} />
                <AnimatePresence>
                    {!isCollapsed && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0, marginTop: 0 }}
                            animate={{ opacity: 1, height: 'auto', marginTop: '0.75rem' }}
                            exit={{ opacity: 0, height: 0, marginTop: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <PricingTeaserBox />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </>
    );

    export default Sidebar;