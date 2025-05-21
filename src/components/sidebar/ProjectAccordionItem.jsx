import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
    import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
    import { FolderOpen, MoreHorizontal, Edit3, Trash2, Check, X as CloseIcon } from 'lucide-react';
    import ConversationItem, { itemMotionVariants } from './ConversationItem';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger as AlertDialogTriggerRadix } from '@/components/ui/alert-dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';

    const ProjectAccordionItem = ({ 
        project, 
        conversationsInProject, 
        isCollapsed, 
        onLinkClick, 
        setActiveConversationId, 
        activeChatId, 
        navigate, 
        projects, 
        onAssignToProject, 
        conversationNewMessages, 
        onMarkAsReadUnread,
        onRenameProject,
        onDeleteProject
    }) => {
        const [isEditingProjectName, setIsEditingProjectName] = useState(false);
        const [newProjectName, setNewProjectName] = useState(project.name);

        const handleRenameProject = () => {
            setIsEditingProjectName(true);
        };

        const handleSaveProjectName = () => {
            if (newProjectName.trim() && newProjectName.trim() !== project.name) {
                onRenameProject(project.id, newProjectName.trim());
            }
            setIsEditingProjectName(false);
        };

        const handleCancelEditProjectName = () => {
            setNewProjectName(project.name);
            setIsEditingProjectName(false);
        };
        
        return (
        <AccordionItem value={project.id} className="border-b-0 group/projectitem">
            <div className="flex items-center">
                <AccordionTrigger className={`flex-1 py-1.5 px-2 hover:bg-accent/50 dark:hover:bg-accent/30 rounded-md text-xs font-medium text-muted-foreground hover:text-foreground hover:no-underline transition-colors
                    ${isCollapsed ? 'justify-center h-9 w-9 p-0 [&>svg]:hidden' : ''}`}>
                    {isCollapsed ? (
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <FolderOpen className="h-4 w-4" />
                            </TooltipTrigger>
                            <TooltipContent side="right" className="ml-1"><p>{project.name}</p></TooltipContent>
                        </Tooltip>
                    ) : isEditingProjectName ? (
                        <div className="flex items-center w-full">
                            <FolderOpen className="h-3.5 w-3.5 mr-2 text-primary/80 flex-shrink-0" />
                            <Input 
                                value={newProjectName}
                                onChange={(e) => setNewProjectName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSaveProjectName()}
                                className="h-6 text-xs flex-grow bg-transparent focus:ring-1 focus:ring-primary"
                                autoFocus
                            />
                            <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 text-green-600 hover:text-green-700" onClick={(e) => {e.stopPropagation(); handleSaveProjectName();}}> <Check className="h-3.5 w-3.5"/> </Button>
                            <Button variant="ghost" size="icon" className="h-5 w-5 text-red-600 hover:text-red-700" onClick={(e) => {e.stopPropagation(); handleCancelEditProjectName();}}> <CloseIcon className="h-3.5 w-3.5"/> </Button>
                        </div>
                    ) : (
                        <div className="flex items-center">
                            <FolderOpen className="h-3.5 w-3.5 mr-2 text-primary/80" />
                            <span className="truncate">{project.name}</span>
                            <span className="ml-1.5 text-[0.7rem] opacity-70">({conversationsInProject.length})</span>
                        </div>
                    )}
                </AccordionTrigger>
                {!isCollapsed && !isEditingProjectName && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover/projectitem:opacity-100 focus:opacity-100 transition-opacity mr-1">
                                <MoreHorizontal className="h-3.5 w-3.5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" sideOffset={5} className="text-xs w-40">
                            <DropdownMenuItem onClick={handleRenameProject}>
                                <Edit3 className="mr-2 h-3.5 w-3.5" /> Renommer Projet
                            </DropdownMenuItem>
                            <AlertDialog>
                                <AlertDialogTriggerRadix asChild>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 dark:focus:text-red-400">
                                        <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer Projet
                                    </DropdownMenuItem>
                                </AlertDialogTriggerRadix>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer le projet "{project.name}" ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible. Les conversations dans ce projet ne seront pas supprimées mais deviendront "Non assignées".
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                                        <AlertDialogAction onClick={() => onDeleteProject(project.id)} className="bg-destructive hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700">
                                            Supprimer Projet
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            {!isCollapsed && (
            <AccordionContent className="pt-0.5 pb-0.5 pl-3 border-l-2 border-primary/20 ml-2">
                {conversationsInProject.length > 0 ? conversationsInProject.map(conv => (
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
                        hasNewMessagesState={conversationNewMessages[conv.id] || false}
                        onMarkAsReadUnread={onMarkAsReadUnread}
                    />
                   </motion.div>
                )) : (
                    <p className="px-2 py-1.5 text-xs text-muted-foreground/70 italic">Aucune discussion dans ce projet.</p>
                )}
            </AccordionContent>
            )}
        </AccordionItem>
        )
    };

    export default ProjectAccordionItem;