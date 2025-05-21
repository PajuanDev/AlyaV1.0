import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Label } from '@/components/ui/label';
    import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
    import { Users } from 'lucide-react';

    const mockMembers = [
      { id: '1', name: 'Alice Wonderland', avatarUrl: 'https://avatar.vercel.sh/alice.png', role: 'Propriétaire' },
      { id: '2', name: 'Bob The Builder', avatarUrl: 'https://avatar.vercel.sh/bob.png', role: 'Éditeur' },
      { id: '3', name: 'Charlie Chaplin', avatarUrl: 'https://avatar.vercel.sh/charlie.png', role: 'Lecteur' },
    ];

    const ConversationMembers = () => (
      <div className="space-y-3 pt-2">
        <Label className="text-sm font-medium text-foreground flex items-center">
          <Users className="mr-2 h-4 w-4 text-muted-foreground" /> Membres (Simulation)
        </Label>
        <div className="space-y-2">
          {mockMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/30 dark:hover:bg-muted/20 transition-colors">
              <div className="flex items-center space-x-2">
                <Avatar className="h-7 w-7">
                  <AvatarImage src={member.avatarUrl} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs font-medium text-foreground">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role}</p>
                </div>
              </div>
              {member.role !== 'Propriétaire' && (
                <Button variant="ghost" size="xs" className="text-xs text-muted-foreground hover:text-destructive">Retirer</Button>
              )}
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-2 text-xs">
          Inviter des membres (Bientôt)
        </Button>
      </div>
    );

    export default ConversationMembers;