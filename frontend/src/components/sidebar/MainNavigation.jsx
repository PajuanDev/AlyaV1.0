import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { LayoutDashboard, Settings, Zap, Users } from 'lucide-react';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { motion } from 'framer-motion';

    const navItems = [
      { to: "/app/dashboard", icon: LayoutDashboard, label: "Tableau de Bord" },
      { to: "/app/integrations", icon: Zap, label: "Intégrations" },
      { to: "/app/automations", icon: Users, label: "Automatisations" }, 
      { to: "/app/settings", icon: Settings, label: "Paramètres" },
    ];

    const NavItem = ({ item, isCollapsed, onLinkClick }) => {
      const navLinkClasses = ({ isActive }) =>
        `flex items-center p-2.5 rounded-md hover:bg-accent dark:hover:bg-accent/70 hover:text-accent-foreground dark:hover:text-foreground transition-colors duration-150 group ${
          isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 font-medium' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'
        } ${isCollapsed ? 'justify-center' : 'space-x-3'}`;

      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink
              to={item.to}
              className={navLinkClasses}
              onClick={onLinkClick}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
              {!isCollapsed && <span className="truncate text-sm">{item.label}</span>}
            </NavLink>
          </TooltipTrigger>
          {isCollapsed && <TooltipContent side="right" className="ml-1"><p>{item.label}</p></TooltipContent>}
        </Tooltip>
      );
    };
    
    const MainNavigation = ({ isCollapsed, onLinkClick }) => {
        const motionProps = {
            initial:"hidden",
            animate:"visible",
            variants:{
                visible: { transition: { staggerChildren: 0.03 } }
            }
        };
        const itemMotionProps = {
            variants:{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }
        };

      return (
        <TooltipProvider delayDuration={isCollapsed ? 0 : 300}>
        <nav className="space-y-0.5">
          <motion.div {...motionProps} className="space-y-0.5">
            {navItems.map((item) => (
                <motion.div key={item.to} {...itemMotionProps}>
                    <NavItem item={item} isCollapsed={isCollapsed} onLinkClick={onLinkClick} />
                </motion.div>
            ))}
          </motion.div>
        </nav>
        </TooltipProvider>
      );
    };

    export default MainNavigation;