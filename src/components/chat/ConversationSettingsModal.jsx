import React, { useState, useEffect } from 'react';
    import { Dialog, DialogContent } from '@/components/ui/dialog';
    import { toast } from '@/components/ui/use-toast';
    import useChat from '@/hooks/useChat';

    import ConversationSettingsHeader from './ConversationSettingsHeader';
    import ConversationNameInput from './ConversationNameInput';
    import ConversationSystemPrompt from './ConversationSystemPrompt';
    import ConversationPinSwitch from './ConversationPinSwitch';
    import ConversationReminder from './ConversationReminder';
    import ConversationMembers from './ConversationMembers';
    import ConversationActions from './ConversationActions';

    const ConversationSettingsModal = ({ isOpen, onOpenChange, conversation }) => {
      const { updateConversation, deleteConversation, archiveConversation } = useChat();
      const [name, setName] = useState('');
      const [systemPrompt, setSystemPrompt] = useState('');
      const [isPinned, setIsPinned] = useState(false);
      const [reminderDate, setReminderDate] = useState(null);

      useEffect(() => {
        if (conversation) {
          setName(conversation.name);
          setSystemPrompt(conversation.systemPrompt || '');
          setIsPinned(conversation.isPinned || false);
          setReminderDate(conversation.reminderDate ? new Date(conversation.reminderDate) : null);
        } else {
          setName('');
          setSystemPrompt('');
          setIsPinned(false);
          setReminderDate(null);
        }
      }, [conversation]);

      if (!conversation) return null;

      const handleSave = () => {
        updateConversation(conversation.id, { 
            name, 
            systemPrompt,
            isPinned,
            reminderDate: reminderDate ? reminderDate.toISOString() : null,
        });
        toast({ title: 'Paramètres sauvegardés', description: 'Les modifications de la conversation ont été enregistrées.' });
        onOpenChange(false);
      };

      const handleDelete = () => {
        deleteConversation(conversation.id);
        toast({ title: 'Conversation supprimée', description: `La conversation "${conversation.name}" a été supprimée.`, variant: 'destructive' });
        onOpenChange(false);
      };
      
      const handleArchive = () => {
        archiveConversation(conversation.id, true);
        toast({ title: 'Conversation archivée', description: `La conversation "${conversation.name}" a été archivée.` });
        onOpenChange(false);
      };

      return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[525px] bg-card border-border shadow-2xl rounded-lg p-0">
            <ConversationSettingsHeader />
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
              <ConversationNameInput name={name} setName={setName} />
              <ConversationSystemPrompt systemPrompt={systemPrompt} setSystemPrompt={setSystemPrompt} />
              <ConversationPinSwitch isPinned={isPinned} setIsPinned={setIsPinned} />
              <ConversationReminder reminderDate={reminderDate} setReminderDate={setReminderDate} />
              <ConversationMembers />
            </div>
            <ConversationActions
              conversationName={name}
              onArchive={handleArchive}
              onDelete={handleDelete}
              onSave={handleSave}
              onCancel={() => onOpenChange(false)}
            />
          </DialogContent>
        </Dialog>
      );
    };

    export default ConversationSettingsModal;