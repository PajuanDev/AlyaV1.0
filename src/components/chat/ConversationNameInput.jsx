import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { MessageSquare } from 'lucide-react';

    const ConversationNameInput = ({ name, setName }) => (
      <div className="space-y-2">
        <Label htmlFor="conv-name" className="text-sm font-medium text-foreground flex items-center">
          <MessageSquare className="mr-2 h-4 w-4 text-muted-foreground" /> Nom de la conversation
        </Label>
        <Input
          id="conv-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-background border-border focus:border-primary"
        />
      </div>
    );

    export default ConversationNameInput;