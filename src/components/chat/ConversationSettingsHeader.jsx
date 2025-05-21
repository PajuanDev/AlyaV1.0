import React from 'react';
    import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
    import { Edit3 } from 'lucide-react';

    const ConversationSettingsHeader = () => (
      <DialogHeader className="p-6 border-b border-border">
        <DialogTitle className="text-2xl font-semibold flex items-center text-foreground">
          <Edit3 className="mr-3 h-6 w-6 text-primary" />
          Paramètres de la Conversation
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground mt-1">
          Gérez les détails et les préférences de cette conversation.
        </DialogDescription>
      </DialogHeader>
    );

    export default ConversationSettingsHeader;