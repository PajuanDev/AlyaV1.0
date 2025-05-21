import React from 'react';
    import { motion } from 'framer-motion';
    import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
    import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
    import { Archive as ArchiveIcon } from 'lucide-react';
    import ConversationItem, { itemMotionVariants } from './ConversationItem';

    const ArchivedConversationsSection = ({ conversations: propConversations, isCollapsed, onLinkClick, setActiveConversationId, activeChatId, navigate, projects, onAssignToProject, conversationNewMessages, onMarkAsReadUnread }) => {
        const conversations = Array.isArray(propConversations) ? propConversations : [];

        if (isCollapsed || conversations.length === 0) return null;

        return (
            <Accordion type="single" collapsible className="w-full mt-2">
                <AccordionItem value="archived" className="border-b-0">
                    <AccordionTrigger className={`py-1.5 px-2 hover:bg-accent/50 dark:hover:bg-accent/30 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:no-underline transition-colors`}>
                        <div className="flex items-center">
                            <ArchiveIcon className="h-3.5 w-3.5 mr-2 text-primary/80" />
                            <span className="truncate">Archivées</span>
                            <span className="ml-1.5 text-[0.7rem] opacity-70">({conversations.length})</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-0.5 pb-0.5 pl-3 border-l-2 border-primary/20 ml-2">
                        {conversations.map(conv => (
                            <motion.div key={conv.id} variants={itemMotionVariants} layout="position">
                                <ConversationItem 
                                    conv={conv} 
                                    isCollapsed={isCollapsed} 
                                    onLinkClick={onLinkClick}
                                    setActiveConvId={setActiveConversationId}
                                    activeChatId={activeChatId}
                                    navigate={navigate}
                                    projects={projects}
                                    onAssignToProject={onAssignToProject}
                                    hasNewMessagesState={conversationNewMessages && conversationNewMessages[conv.id] || false}
                                    onMarkAsReadUnread={onMarkAsReadUnread}
                                />
                            </motion.div>
                        ))}
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        );
    };

    export default ArchivedConversationsSection;