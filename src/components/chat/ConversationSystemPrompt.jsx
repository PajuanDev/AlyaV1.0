import React from 'react';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Palette } from 'lucide-react';

    const ConversationSystemPrompt = ({ systemPrompt, setSystemPrompt }) => (
      <div className="space-y-2">
        <Label htmlFor="system-prompt" className="text-sm font-medium text-foreground flex items-center">
          <Palette className="mr-2 h-4 w-4 text-muted-foreground" /> Personnalité de l'IA (Prompt Système)
        </Label>
        <Textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
          placeholder="Ex: Tu es un expert en marketing digital spécialisé dans les startups..."
          className="min-h-[100px] bg-background border-border focus:border-primary"
        />
        <p className="text-xs text-muted-foreground">Définissez le comportement et le rôle de l'IA pour cette conversation.</p>
      </div>
    );

    export default ConversationSystemPrompt;