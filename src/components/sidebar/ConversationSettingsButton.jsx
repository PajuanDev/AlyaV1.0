import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
    import { SlidersHorizontal } from 'lucide-react';

    const ConversationSettingsButton = ({ isCollapsed, onClick, disabled }) => {
      return (
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4, delay: 0.25 }}
           className={`${isCollapsed ? 'w-full' : 'w-auto flex-shrink-0'}`}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`${isCollapsed ? 'w-full' : ''}`}>
                <Button 
                  variant="outline" 
                  onClick={onClick} 
                  disabled={disabled}
                  className={`border-border hover:bg-accent/80 dark:hover:bg-accent/50 h-10 w-10 p-0 flex items-center justify-center`}
                  aria-label="Paramètres de la conversation"
                >
                  <SlidersHorizontal className="h-5 w-5" />
                </Button>
              </div>
            </TooltipTrigger>
            <TooltipContent side={isCollapsed ? "right" : "top"}><p>Paramètres de la conversation</p></TooltipContent>
          </Tooltip>
        </motion.div>
      );
    };

    export default ConversationSettingsButton;