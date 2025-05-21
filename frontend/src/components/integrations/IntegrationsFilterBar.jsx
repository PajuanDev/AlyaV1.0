import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Search, Filter, X } from 'lucide-react';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuCheckboxItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger as DropdownTrigger,
    } from "@/components/ui/dropdown-menu";

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const IntegrationsFilterBar = ({ 
        searchTerm, 
        setSearchTerm, 
        selectedCategories, 
        toggleCategory, 
        setSelectedCategories,
        selectedStatuses, 
        toggleStatus, 
        setSelectedStatuses,
        resetFilters,
        uniqueCategories,
        uniqueStatuses
    }) => (
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4 items-center p-4 bg-card/50 rounded-lg border">
            <div className="relative flex-grow w-full md:w-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="text"
                    placeholder="Rechercher des intégrations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 text-base"
                />
            </div>
            <DropdownMenu>
                <DropdownTrigger asChild>
                    <Button variant="outline" className="h-11 w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" /> Catégories ({selectedCategories.length})
                    </Button>
                </DropdownTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filtrer par catégorie</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {uniqueCategories.map(category => (
                        <DropdownMenuCheckboxItem
                            key={category}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => toggleCategory(category)}
                        >
                            {category}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem 
                        checked={selectedCategories.length === uniqueCategories.length} 
                        onCheckedChange={() => selectedCategories.length === uniqueCategories.length ? setSelectedCategories([]) : setSelectedCategories(uniqueCategories)}
                    >
                        {selectedCategories.length === uniqueCategories.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
                <DropdownTrigger asChild>
                    <Button variant="outline" className="h-11 w-full md:w-auto">
                        <Filter className="mr-2 h-4 w-4" /> Statuts ({selectedStatuses.length})
                    </Button>
                </DropdownTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Filtrer par statut</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {uniqueStatuses.map(status => (
                        <DropdownMenuCheckboxItem
                            key={status}
                            checked={selectedStatuses.includes(status)}
                            onCheckedChange={() => toggleStatus(status)}
                        >
                            {status.replace('_', ' ')}
                        </DropdownMenuCheckboxItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem 
                        checked={selectedStatuses.length === uniqueStatuses.length} 
                        onCheckedChange={() => selectedStatuses.length === uniqueStatuses.length ? setSelectedStatuses([]) : setSelectedStatuses(uniqueStatuses)}
                    >
                        {selectedStatuses.length === uniqueStatuses.length ? 'Tout désélectionner' : 'Tout sélectionner'}
                    </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
            </DropdownMenu>
            {(searchTerm || selectedCategories.length < uniqueCategories.length || selectedStatuses.length < uniqueStatuses.length) && (
                <Button variant="ghost" onClick={resetFilters} className="h-11 w-full md:w-auto">
                    <X className="mr-2 h-4 w-4" /> Réinitialiser
                </Button>
            )}
        </motion.div>
    );

    export default IntegrationsFilterBar;