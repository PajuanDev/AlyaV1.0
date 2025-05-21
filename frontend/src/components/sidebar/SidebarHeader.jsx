import React from 'react';
    import { Link } from 'react-router-dom';
    import { PanelLeftClose, PanelRightClose } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import AlyaLogo from '@/components/AlyaLogo';

    const SidebarHeader = ({ isCollapsed, toggleSidebar }) => {
      return (
        <TooltipProvider delayDuration={isCollapsed ? 0 : 300}>
          <div className={`flex items-center justify-between h-16 border-b px-2.5 transition-all duration-300 ease-in-out ${isCollapsed ? 'px-1.5' : 'pl-3.5 pr-2.5'}`}>
            {!isCollapsed && (
              <Link to="/app/dashboard" className="flex items-center gap-2 overflow-hidden flex-shrink min-w-0">
                <AlyaLogo className="h-7 w-auto text-primary flex-shrink-0" />
                <span className="font-semibold text-lg text-foreground truncate">Alya AI</span>
              </Link>
            )}
            {isCollapsed && (
               <Link to="/app/dashboard" className="flex items-center justify-center w-full h-full">
                 <AlyaLogo className="h-7 w-auto text-primary" />
               </Link>
            )}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleSidebar} 
                  className={`transition-opacity duration-300 rounded-md hover:bg-muted ${isCollapsed ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                  aria-label={isCollapsed ? "Étendre la barre latérale" : "Réduire la barre latérale"}
                >
                  {isCollapsed ? <PanelRightClose className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
                </Button>
              </TooltipTrigger>
              {!isCollapsed && <TooltipContent side="right" className="ml-2"><p>Réduire</p></TooltipContent>}
              {isCollapsed && <TooltipContent side="right" className="ml-2"><p>Étendre</p></TooltipContent>}
            </Tooltip>
          </div>
        </TooltipProvider>
      );
    };

    export default SidebarHeader;