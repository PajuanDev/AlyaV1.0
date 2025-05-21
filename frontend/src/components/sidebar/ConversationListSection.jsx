import React, { useState, useEffect } from 'react';
    import { useParams, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { Accordion } from "@/components/ui/accordion";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { FolderPlus, Check, X as CloseIcon } from 'lucide-react';
    import useChat from '@/hooks/useChat';
    import { toast } from '@/components/ui/use-toast';
    import ConversationItem, { itemMotionVariants } from './ConversationItem';
    import ProjectAccordionItem from './ProjectAccordionItem';
    import ArchivedConversationsSection from './ArchivedConversationsSection';
    import ConversationSearch from './ConversationSearch';

    const ConversationListSection = ({ conversations: propConversations, isCollapsed, setActiveConversationId, onLinkClick }) => {
      const { chatId: activeChatIdFromParams } = useParams();
      const navigate = useNavigate();
      const [searchTerm, setSearchTerm] = useState('');
      const { 
        projects, 
        assignConversationToProject, 
        createProject, 
        renameProject, 
        deleteProject 
      } = useChat();
      const [conversationNewMessages, setConversationNewMessages] = useState({});
      const [isCreatingProject, setIsCreatingProject] = useState(false);
      const [newProjectName, setNewProjectName] = useState('');

      const conversations = Array.isArray(propConversations) ? propConversations : [];

      useEffect(() => {
        const newStates = {};
        conversations.forEach(conv => {
            if (conversationNewMessages[conv.id] === undefined) { 
                 newStates[conv.id] = Math.random() < 0.2;
            } else {
                newStates[conv.id] = conversationNewMessages[conv.id];
            }
        });
        setConversationNewMessages(newStates);
      }, [conversations]);

      const handleMarkAsReadUnread = (convId, isUnread) => {
        setConversationNewMessages(prev => ({...prev, [convId]: isUnread}));
      };
      
      const handleAssignToProject = (conversationId, projectId) => {
          assignConversationToProject(conversationId, projectId);
          const convName = conversations.find(c => c.id === conversationId)?.name || 'La conversation';
          const projName = projectId ? (projects.find(p => p.id === projectId)?.name || 'le projet') : 'aucun projet';
          toast({ title: "Conversation assignée", description: `${convName} a été assignée à ${projName}.`});
      };

      const handleCreateProject = () => {
        if (newProjectName.trim()) {
            createProject(newProjectName.trim());
            setNewProjectName('');
            setIsCreatingProject(false);
        } else {
            toast({ title: "Nom de projet invalide", description: "Veuillez entrer un nom pour le projet.", variant: "destructive" });
        }
      };

      const filterAndSortConversations = (convList) => {
        if (!Array.isArray(convList)) return [];
        return convList
          .filter(c => (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()))
          .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      }

      const conversationsByProject = (projectId) => 
        filterAndSortConversations(conversations.filter(c => c.projectId === projectId && !c.archived));

      const unassignedConversations = filterAndSortConversations(conversations.filter(c => !c.projectId && !c.archived));
      
      const archivedConversations = filterAndSortConversations(conversations.filter(c => c.archived));

      return (
        <TooltipProvider delayDuration={isCollapsed ? 0 : 300}>
        <div className="flex flex-col h-full">
          <ConversationSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} isCollapsed={isCollapsed} />
          
          {!isCollapsed && (
            <div className="px-1.5 pt-1 pb-1.5">
                {isCreatingProject ? (
                    <div className="flex items-center space-x-1.5 p-1 bg-muted/50 rounded-md">
                        <Input 
                            type="text"
                            placeholder="Nom du nouveau projet..."
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleCreateProject()}
                            className="h-7 text-xs flex-grow bg-transparent focus:ring-1 focus:ring-primary"
                            autoFocus
                        />
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-green-600 hover:text-green-700" onClick={handleCreateProject}><Check className="h-3.5 w-3.5"/></Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6 text-red-600 hover:text-red-700" onClick={() => setIsCreatingProject(false)}><CloseIcon className="h-3.5 w-3.5"/></Button>
                    </div>
                ) : (
                    <Button variant="outline" size="sm" className="w-full h-8 text-xs border-dashed hover:border-solid hover:bg-accent/70 dark:hover:bg-accent/40" onClick={() => setIsCreatingProject(true)}>
                        <FolderPlus className="h-3.5 w-3.5 mr-1.5" /> Créer un projet
                    </Button>
                )}
            </div>
          )}

          <ScrollArea className={`flex-grow ${isCollapsed ? 'w-full -mr-0 pr-0' : '-mr-1.5 pr-1.5'}`}>
           <motion.div
              className="space-y-0.5"
              layout
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.02, delayChildren: 0.1 } }
              }}
            >
            {!isCollapsed && projects.length > 0 && (
                <Accordion type="multiple" className="w-full space-y-0.5">
                    {projects.sort((a,b) => a.name.localeCompare(b.name)).map(project => (
                        <ProjectAccordionItem 
                            key={project.id} 
                            project={project} 
                            conversationsInProject={conversationsByProject(project.id)}
                            isCollapsed={isCollapsed} 
                            onLinkClick={onLinkClick}
                            setActiveConversationId={setActiveConversationId}
                            activeChatId={activeChatIdFromParams}
                            navigate={navigate}
                            projects={projects}
                            onAssignToProject={handleAssignToProject}
                            conversationNewMessages={conversationNewMessages}
                            onMarkAsReadUnread={handleMarkAsReadUnread}
                            onRenameProject={renameProject}
                            onDeleteProject={deleteProject}
                        />
                    ))}
                </Accordion>
            )}
            {!isCollapsed && (unassignedConversations.length > 0 || projects.length > 0) && <div className="h-2"></div>}
              <AnimatePresence initial={false}>
                {unassignedConversations.length > 0 ? unassignedConversations.map(conv => (
                  <motion.div key={conv.id} variants={itemMotionVariants} layout="position">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div>
                          <ConversationItem 
                              conv={conv} 
                              isCollapsed={isCollapsed} 
                              onLinkClick={onLinkClick}
                              setActiveConvId={setActiveConversationId}
                              activeChatId={activeChatIdFromParams}
                              navigate={navigate}
                              projects={projects}
                              onAssignToProject={handleAssignToProject}
                              hasNewMessagesState={conversationNewMessages[conv.id] || false}
                              onMarkAsReadUnread={handleMarkAsReadUnread}
                          />
                        </div>
                      </TooltipTrigger>
                      {isCollapsed && <TooltipContent side="right" className="ml-1"><p>{conv.name || `Discussion ${conv.id.substring(0,4)}`}</p></TooltipContent>}
                    </Tooltip>
                  </motion.div>
                )) : (
                  !isCollapsed && searchTerm && projects.every(p => conversationsByProject(p.id).length === 0) && (
                    <motion.p 
                        initial={{opacity:0}} animate={{opacity:1}}
                        className="px-2.5 py-4 text-center text-xs text-muted-foreground"
                    >
                        {`Aucun résultat pour "${searchTerm}"`}
                    </motion.p>
                  )
                )}
              </AnimatePresence>
              
            <ArchivedConversationsSection
                conversations={archivedConversations}
                isCollapsed={isCollapsed}
                onLinkClick={onLinkClick}
                setActiveConversationId={setActiveConversationId}
                activeChatId={activeChatIdFromParams}
                navigate={navigate}
                projects={projects}
                onAssignToProject={handleAssignToProject}
                conversationNewMessages={conversationNewMessages}
                onMarkAsReadUnread={handleMarkAsReadUnread}
            />

            </motion.div>
        </ScrollArea>
        </div>
        </TooltipProvider>
      );
    };

    export default ConversationListSection;