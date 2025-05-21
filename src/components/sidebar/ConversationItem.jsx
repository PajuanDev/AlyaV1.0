import React, { useState, useEffect, useRef } from 'react';
    import { NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { MessageSquare as MessageSquareText, MoreHorizontal, Edit3, Trash2, FolderOpen, FolderPlus, Archive as ArchiveIcon, Eye, EyeOff, CheckCircle, X } from 'lucide-react';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger as AlertDialogTriggerRadix } from '@/components/ui/alert-dialog';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import useChat from '@/hooks/useChat';
    import { toast } from '@/components/ui/use-toast';

    export const itemMotionVariants = {
        hidden: { opacity: 0, y: -5, height: 0 },
        visible: { opacity: 1, y: 0, height: 'auto', transition: { type: 'spring', stiffness: 260, damping: 25, duration:0.2 } },
        exit: { opacity: 0, x: 10, height:0, transition: { duration: 0.15 } }
    };

    const ConversationItem = ({ conv, isCollapsed, onLinkClick, setActiveConvId, activeChatId, navigate, projects, onAssignToProject, onMarkAsReadUnread, hasNewMessagesState }) => {
      const { renameConversation, deleteConversation, archiveConversation } = useChat();
      const [isEditing, setIsEditing] = useState(false);
      const [newName, setNewName] = useState(conv.name);
      const inputRef = useRef(null);
      const [hasNewMessages, setHasNewMessages] = useState(hasNewMessagesState);

      useEffect(() => {
        setHasNewMessages(hasNewMessagesState);
      }, [hasNewMessagesState]);
      
      useEffect(() => {
        setNewName(conv.name);
      }, [conv.name]);

      const handleRename = () => {
        setIsEditing(true);
        setTimeout(() => inputRef.current?.focus(), 0);
      };

      const handleSaveName = () => {
        if (newName.trim() && newName.trim() !== conv.name) {
          renameConversation(conv.id, newName.trim());
          toast({title: "Conversation renommée", description: `Nouveau nom : "${newName.trim()}"`});
        }
        setIsEditing(false);
      };
      
      const handleDelete = () => {
        deleteConversation(conv.id);
        toast({title: "Conversation supprimée", description: `"${conv.name}" a été supprimée.`, variant: "destructive"});
      };

      const handleArchive = () => {
        archiveConversation(conv.id, !conv.archived);
        toast({ title: `Conversation ${conv.archived ? 'désarchivée' : 'archivée'}`, description: `"${conv.name}" a été ${conv.archived ? 'restaurée' : 'archivée'}.` });
      };
      
      const handleLocalMarkAsReadUnread = () => {
        setHasNewMessages(!hasNewMessages);
        if (onMarkAsReadUnread) onMarkAsReadUnread(conv.id, !hasNewMessages);
        toast({ title: `Conversation marquée comme ${hasNewMessages ? 'lue' : 'non lue'}`});
      };
      
      const navLinkClasses = ({ isActive }) =>
      `w-full flex items-center p-2 rounded-md hover:bg-accent dark:hover:bg-accent/70 transition-colors duration-150 group relative
      ${
        isActive ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 font-medium shadow-sm' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'
      } ${isCollapsed ? 'justify-center h-10 w-10' : 'space-x-2.5 h-auto'}`;


      if (isEditing && !isCollapsed) {
        return (
          <div className={`flex items-center p-2 rounded-md space-x-2.5`}>
            <MessageSquareText className={`w-4 h-4 flex-shrink-0 text-primary`} />
            <Input
              ref={inputRef}
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={handleSaveName}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveName()}
              className="h-7 text-xs flex-1 bg-transparent focus:ring-1 focus:ring-primary"
            />
          </div>
        );
      }

      return (
        <div className="flex items-center relative group">
          <NavLink 
            to={`/app/chat/${conv.id}`} 
            className={navLinkClasses}
            onClick={() => {
              setActiveConvId(conv.id);
              if(onLinkClick) onLinkClick();
              if(hasNewMessages) {
                setHasNewMessages(false);
                if (onMarkAsReadUnread) onMarkAsReadUnread(conv.id, false); // Mark as read on click
              }
            }}
          >
            <MessageSquareText className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${isCollapsed ? 'mx-auto' : ''}`} />
            {!isCollapsed && <span className="truncate flex-grow text-sm">{conv.name || `Discussion ${conv.id.substring(0,4)}`}</span>}
            {!isCollapsed && hasNewMessages && !isEditing && (
              <motion.div 
                className="h-1.5 w-1.5 bg-blue-500 rounded-full absolute right-2 top-1/2 -translate-y-1/2"
                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              />
            )}
          </NavLink>
          {!isCollapsed && (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    aria-label="Options de la conversation"
                  >
                    <MoreHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="text-xs w-48">
                  <DropdownMenuItem onClick={handleRename}>
                    <Edit3 className="mr-2 h-3.5 w-3.5" /> Renommer
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleArchive}>
                    <ArchiveIcon className="mr-2 h-3.5 w-3.5" /> {conv.archived ? 'Désarchiver' : 'Archiver'}
                  </DropdownMenuItem>
                   <DropdownMenuItem onClick={handleLocalMarkAsReadUnread}>
                    {hasNewMessages ? <EyeOff className="mr-2 h-3.5 w-3.5" /> : <Eye className="mr-2 h-3.5 w-3.5" />}
                    Marquer comme {hasNewMessages ? 'lu' : 'non lu'}
                  </DropdownMenuItem>
                   <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <FolderOpen className="mr-2 h-3.5 w-3.5" /> Assigner à un projet
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent className="text-xs w-40">
                        <DropdownMenuItem onClick={() => onAssignToProject(conv.id, null)}>
                           <X className="mr-2 h-3.5 w-3.5 text-muted-foreground" /> Aucun projet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {projects.map(project => (
                            <DropdownMenuItem key={project.id} onClick={() => onAssignToProject(conv.id, project.id)}>
                                {conv.projectId === project.id && <CheckCircle className="mr-2 h-3.5 w-3.5 text-primary" />}
                                {conv.projectId !== project.id && <span className="w-[calc(0.875rem+0.5rem)] mr-0"></span>}
                                {project.name}
                            </DropdownMenuItem>
                        ))}
                         <DropdownMenuSeparator />
                         <DropdownMenuItem disabled><FolderPlus className="mr-2 h-3.5 w-3.5" /> Nouveau Projet...</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator />
                  <AlertDialog>
                    <AlertDialogTriggerRadix asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 dark:focus:text-red-400">
                         <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer
                      </DropdownMenuItem>
                    </AlertDialogTriggerRadix>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Cette action est irréversible et supprimera la conversation "{conv.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700">
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
          )}
        </div>
      );
    };

    export default ConversationItem;