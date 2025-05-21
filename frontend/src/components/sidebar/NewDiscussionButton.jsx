import React from 'react';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, MessageSquarePlus } from 'lucide-react';
    import { useNavigate } from 'react-router-dom';
    import useChat from '@/hooks/useChat';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { cn } from '@/lib/utils';

    const NewDiscussionButton = ({ isCollapsed }) => {
      const navigate = useNavigate();
      const { setActiveConversationId } = useChat();

      const handleNewDiscussion = () => {
        setActiveConversationId(null); 
        navigate('/app/chat');
      };

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant={isCollapsed ? "ghost" : "outline"}
                className={cn(
                  `w-full justify-start text-left h-auto group transition-all duration-200 ease-out`,
                  isCollapsed 
                    ? 'justify-center p-0 h-10 w-10 rounded-lg hover:bg-primary/10' 
                    : 'py-2.5 px-3 mb-2 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10'
                )}
                onClick={handleNewDiscussion}
              >
                {isCollapsed ? (
                  <MessageSquarePlus className="h-5 w-5 text-primary group-hover:text-primary/80" />
                ) : (
                  <>
                    <PlusCircle className="h-5 w-5 mr-2.5 text-primary group-hover:text-primary/80 transition-colors" />
                    <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Nouvelle Discussion</span>
                  </>
                )}
              </Button>
            </TooltipTrigger>
            {isCollapsed && <TooltipContent side="right" className="bg-card text-foreground border-border"><p>Nouvelle Discussion</p></TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      );
    };

    export default NewDiscussionButton;