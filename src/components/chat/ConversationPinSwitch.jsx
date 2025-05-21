import React from 'react';
    import { Switch } from '@/components/ui/switch';
    import { Label } from '@/components/ui/label';
    import { Pin } from 'lucide-react';

    const ConversationPinSwitch = ({ isPinned, setIsPinned }) => (
      <div className="flex items-center justify-between p-3 rounded-md bg-muted/30 dark:bg-muted/20 border border-border/50">
        <Label htmlFor="pin-conversation" className="text-sm font-medium text-foreground flex items-center cursor-pointer">
          <Pin className="mr-2 h-4 w-4 text-muted-foreground" /> Épingler la conversation
        </Label>
        <Switch
          id="pin-conversation"
          checked={isPinned}
          onCheckedChange={setIsPinned}
        />
      </div>
    );

    export default ConversationPinSwitch;