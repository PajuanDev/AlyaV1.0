import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Search } from 'lucide-react';

    const ConversationSearch = ({ searchTerm, setSearchTerm, isCollapsed }) => {
        if (isCollapsed) return null;

        return (
            <div className="p-1.5 mb-1">
                <div className="relative">
                    <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                    <Input 
                        type="text"
                        placeholder="Rechercher discussions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-8 h-8 text-xs focus:ring-1 focus:ring-primary"
                    />
                </div>
            </div>
        );
    };

    export default ConversationSearch;