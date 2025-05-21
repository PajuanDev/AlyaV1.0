import React from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Zap, Edit3, Trash2, Play, Pause, ChevronRight } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Badge } from '@/components/ui/badge';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const itemVariants = {
      hidden: { opacity: 0, y: 20, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness:150, damping: 20} }
    };

    const AutomationCard = ({ automation, onToggleStatus, onEdit, onDelete, onClick }) => {
      return (
        <motion.div variants={itemVariants} layout>
          <Card 
            className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 ease-out glassmorphism cursor-pointer group"
            onClick={() => onClick(automation)}
            tabIndex={0}
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') onClick(automation); }}
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <CardTitle className="text-lg font-semibold flex items-center mb-1 group-hover:text-primary transition-colors">
                    <Zap className={`mr-2 h-5 w-5 flex-shrink-0 ${automation.status === 'active' ? 'text-green-500 animate-pulse_custom' : 'text-yellow-500'}`} 
                         style={automation.status === 'active' ? {"--custom-pulse-color": "var(--tw-prose-green-500)"} : {}} /> 
                    {automation.name}
                  </CardTitle>
                  <Badge variant={automation.status === 'active' ? 'default' : 'outline'} className={`${automation.status === 'active' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'}`}>
                      {automation.status === 'active' ? 'Active' : 'En Pause'}
                  </Badge>
                  {automation.category && <Badge variant="secondary" className="ml-2">{automation.category}</Badge>}
                </div>
                 <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={(e) => { e.stopPropagation(); onToggleStatus(automation.id);}} 
                    className="ml-auto flex-shrink-0 h-8 w-8 text-muted-foreground hover:text-primary"
                    aria-label={automation.status === 'active' ? "Mettre en pause" : "Activer"}
                 >
                    {automation.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-grow space-y-2 text-sm">
              <div><strong className="font-medium text-foreground/80">Déclencheur :</strong> <span className="text-muted-foreground line-clamp-1">{automation.trigger}</span></div>
              <div><strong className="font-medium text-foreground/80">Actions :</strong> <span className="text-muted-foreground line-clamp-1">{automation.actions}</span></div>
              <div className="text-xs text-muted-foreground pt-1">Dernière exécution: {automation.lastRun}</div>
            </CardContent>
            <CardFooter className="flex justify-between items-center border-t pt-4">
                <div className="flex space-x-2">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => { e.stopPropagation(); onEdit(automation);}}
                        aria-label="Modifier l'automatisation"
                    >
                        <Edit3 className="h-4 w-4 mr-1.5" /> Modifier
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Supprimer l'automatisation"
                        >
                            <Trash2 className="h-4 w-4 mr-1.5" /> Supprimer
                        </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous sûr de vouloir supprimer cette automatisation ?</AlertDialogTitle>
                            <AlertDialogDescription>
                            Cette action est irréversible. L'automatisation "{automation.name}" sera définitivement supprimée.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => { e.stopPropagation(); onDelete(automation.id);}} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
                        </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors opacity-70 group-hover:opacity-100" />
            </CardFooter>
          </Card>
        </motion.div>
      );
    };

    export default AutomationCard;