import React, { useState } from 'react';
    import { useNavigate, useParams } from 'react-router-dom';
    import useChat from '@/hooks/useChat';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger as AlertDialogTriggerRadix } from '@/components/ui/alert-dialog';
    import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
    import { MessageSquare, MoreHorizontal, Trash2, Edit3, Search, FolderPlus, FolderOpen } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { toast } from '@/components/ui/use-toast';

    const ConversationItem = ({ conv, activeChatId, onEdit, onDelete, onOrganize, onSelect, isEditing, newName, setNewName, handleSaveName, editingId }) => {
      const itemVariants = {
        hidden: { opacity: 0, x: -15, height: 0 },
        visible: { opacity: 1, x: 0, height: 'auto', transition: { type: 'spring', stiffness: 300, damping: 25, duration:0.3 } },
        exit: { opacity: 0, x: 20, height: 0, transition: { duration: 0.2 } }
      };
      
      return (
        <motion.div
          key={conv.id}
          layout="position"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className={`flex items-center justify-between p-2.5 rounded-lg hover:bg-accent dark:hover:bg-accent/70 cursor-pointer group relative
            ${conv.id === activeChatId ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-foreground/90 shadow-sm' : 'text-muted-foreground hover:text-foreground dark:hover:text-foreground'}
          `}
          onClick={() => {
            if (isEditing && editingId === conv.id) return;
            onSelect(conv.id);
          }}
        >
          <div className="flex items-center overflow-hidden flex-1 min-w-0">
            <MessageSquare className={`h-4 w-4 mr-2.5 flex-shrink-0 ${conv.id === activeChatId ? 'text-primary' : ''}`} />
            {isEditing && editingId === conv.id ? (
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={() => handleSaveName(conv.id)}
                onKeyPress={(e) => e.key === 'Enter' && handleSaveName(conv.id)}
                autoFocus
                className="h-7 text-xs flex-1 bg-transparent focus:ring-1 focus:ring-primary"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="truncate text-sm font-medium flex-1">{conv.name || `Discussion ${conv.id.substring(0,4)}`}</span>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-6 w-6 opacity-0 group-hover:opacity-100 focus:opacity-100 flex-shrink-0 transition-opacity duration-150" 
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={5} onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => onEdit(conv)}>
                <Edit3 className="mr-2 h-3.5 w-3.5" /> Renommer
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FolderOpen className="mr-2 h-3.5 w-3.5" /> Organiser
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem onClick={() => onOrganize(conv.id, null)}>
                       <FolderPlus className="mr-2 h-3.5 w-3.5" /> Nouveau Projet...
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem disabled><span className="text-xs text-muted-foreground">Projets existants (bientôt)</span></DropdownMenuItem>
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
                      Cette action est irréversible et supprimera définitivement la conversation "{conv.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onDelete(conv.id)} className="bg-destructive hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700">
                      Supprimer
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      );
    };
    
    const ConversationList = () => {
      const { conversations, deleteConversation, renameConversation, setActiveConversationId } = useChat();
      const navigate = useNavigate();
      const { chatId: activeChatIdFromParams } = useParams();
      const [editingId, setEditingId] = useState(null); 
      const [newName, setNewName] = useState('');
      const [searchTerm, setSearchTerm] = useState('');

      const handleEdit = (conv) => {
        setEditingId(conv.id);
        setNewName(conv.name);
      };

      const handleSaveName = (id) => {
        if (newName.trim()) {
          renameConversation(id, newName.trim());
          toast({title: "Conversation renommée", description: `Nouveau nom : "${newName.trim()}"`});
        }
        setEditingId(null);
      };

      const handleDelete = (id) => {
        const conversationName = conversations.find(c => c.id === id)?.name || "cette conversation";
        deleteConversation(id);
        toast({title: "Conversation supprimée", description: `"${conversationName}" a été supprimée.`, variant: "destructive"});
        
        const remainingConversations = conversations.filter(c => c.id !== id);
        if (activeChatIdFromParams === id) {
          if (remainingConversations.length > 0) { 
            const nextConversation = remainingConversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
            if (nextConversation) navigate(`/app/chat/${nextConversation.id}`);
            else navigate('/app/chat'); // fallback if sorting issue
          } else { 
            navigate('/app/chat'); 
          }
        }
      };
      
      const handleOrganize = (convId, projectId) => {
          toast({
              title: "Organisation (Bientôt disponible)",
              description: `La conversation sera bientôt déplaçable dans le projet "${projectId || 'Nouveau Projet'}".`
          });
      };

      const handleSelectConversation = (convId) => {
        if (editingId !== convId) {
          setActiveConversationId(convId);
          navigate(`/app/chat/${convId}`);
        }
      };
      
      const filteredConversations = conversations
        .filter(conv => 
          (conv.name || `Discussion ${conv.id.substring(0,4)}`).toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));


      return (
        <div className="flex flex-col h-full">
          <div className="p-1 mb-1.5">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input 
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-8 text-xs focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <ScrollArea className="flex-grow -mr-2 pr-2">
            {conversations.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground p-4">Aucune discussion pour le moment.</p>
            ) : filteredConversations.length === 0 && searchTerm ? (
              <p className="text-center text-xs text-muted-foreground p-4">Aucune discussion ne correspond à "{searchTerm}".</p>
            ) : (
              <motion.div layout className="space-y-0.5">
                <AnimatePresence initial={false}>
                  {filteredConversations.map((conv) => (
                    <ConversationItem
                      key={conv.id}
                      conv={conv}
                      activeChatId={activeChatIdFromParams}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                      onOrganize={handleOrganize}
                      onSelect={handleSelectConversation}
                      isEditing={editingId === conv.id}
                      newName={newName}
                      setNewName={setNewName}
                      handleSaveName={handleSaveName}
                      editingId={editingId}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </ScrollArea>
        </div>
      );
    };

    export default ConversationList;