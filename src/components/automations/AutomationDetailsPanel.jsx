import React from 'react';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Zap, Play, Pause, Edit3, Trash2, History, AlertTriangle, CheckCircle2, Clock, X } from 'lucide-react';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Separator } from '@/components/ui/separator';
    import { motion } from 'framer-motion';
    import { formatDistanceToNow } from 'date-fns';
    import { fr } from 'date-fns/locale';
    import { Card, CardContent } from '@/components/ui/card';

    const DetailRow = ({ label, value, icon: Icon }) => (
      <div className="flex items-start space-x-3 py-2.5">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />}
        <div className="flex-grow">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <p className="text-sm text-foreground">{value || '-'}</p>
        </div>
      </div>
    );

    const MockExecutionLog = ({ log }) => {
        const Icon = log.status === 'success' ? CheckCircle2 : log.status === 'failure' ? AlertTriangle : Clock;
        const color = log.status === 'success' ? 'text-green-500' : log.status === 'failure' ? 'text-red-500' : 'text-yellow-500';
        const date = new Date(log.timestamp);
        return (
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center space-x-3 py-2.5 border-b border-border/50 last:border-b-0"
            >
                <Icon className={`h-4 w-4 ${color} flex-shrink-0`} />
                <div className="flex-grow">
                    <p className={`text-xs font-medium ${color}`}>{log.message}</p>
                    <p className="text-[0.7rem] text-muted-foreground">
                        {formatDistanceToNow(date, { addSuffix: true, locale: fr })}
                    </p>
                </div>
            </motion.div>
        )
    }

    const AutomationDetailsPanel = ({ isOpen, onOpenChange, automation, onEdit, onDelete, onToggleStatus }) => {
      if (!automation) return null;

      const mockHistory = [
        { id: 'h1', status: 'success', message: 'Exécutée avec succès.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
        { id: 'h2', status: 'success', message: 'Exécutée avec succès.', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
        { id: 'h3', status: 'failure', message: 'Échec : API externe indisponible.', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString() },
        { id: 'h4', status: 'pending', message: 'Planifiée pour exécution.', timestamp: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() },
      ].sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));


      return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent className="sm:max-w-md w-full flex flex-col p-0 bg-card border-l border-border">
            <SheetHeader className="p-4 sm:p-6 border-b border-border/70 bg-muted/30 dark:bg-muted/20">
              <div className="flex items-center space-x-3">
                <Zap className={`h-6 w-6 ${automation.status === 'active' ? 'text-green-500' : 'text-yellow-500'}`} />
                <div>
                  <SheetTitle className="text-lg sm:text-xl font-semibold text-foreground">{automation.name}</SheetTitle>
                  <SheetDescription className="text-xs sm:text-sm text-muted-foreground">
                    Détails et historique de l'automatisation.
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>
            
            <ScrollArea className="flex-grow">
                <div className="p-4 sm:p-6 space-y-4">
                    <div className="space-y-1">
                        <Badge variant={automation.status === 'active' ? 'default' : 'outline'} className={`text-xs ${automation.status === 'active' ? 'bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30' : 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-500/30'}`}>
                          {automation.status === 'active' ? 'Active' : 'En Pause'}
                        </Badge>
                         {automation.category && <Badge variant="secondary" className="ml-2 text-xs">{automation.category}</Badge>}
                    </div>

                    <Card className="bg-background/50 shadow-sm">
                        <CardContent className="p-3 divide-y divide-border/50">
                            <DetailRow label="Déclencheur" value={automation.trigger} />
                            <DetailRow label="Actions" value={automation.actions} />
                            <DetailRow label="Dernière exécution" value={automation.lastRun} />
                        </CardContent>
                    </Card>
                    
                    <div>
                        <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center">
                            <History className="h-4 w-4 mr-2 text-primary" /> Historique d'exécution (Simulé)
                        </h4>
                        <Card className="bg-background/50 shadow-sm">
                           <CardContent className="p-3 max-h-[200px] overflow-y-auto custom-scrollbar">
                                {mockHistory.length > 0 ? mockHistory.map(log => (
                                    <MockExecutionLog key={log.id} log={log} />
                                )) : <p className="text-xs text-muted-foreground text-center py-4">Aucun historique disponible.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </ScrollArea>

            <SheetFooter className="p-4 sm:p-6 border-t border-border/70 bg-muted/30 dark:bg-muted/20 flex flex-row sm:flex-row sm:justify-between gap-2">
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(automation)}>
                        <Edit3 className="h-3.5 w-3.5 mr-1.5" /> Modifier
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onToggleStatus(automation.id)}>
                        {automation.status === 'active' ? <Pause className="h-3.5 w-3.5 mr-1.5" /> : <Play className="h-3.5 w-3.5 mr-1.5" />}
                        {automation.status === 'active' ? 'Pause' : 'Activer'}
                    </Button>
                </div>
                 <SheetClose asChild>
                    <Button variant="ghost" size="sm" className="sm:ml-auto">
                        <X className="h-3.5 w-3.5 mr-1.5" /> Fermer
                    </Button>
                </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      );
    };

    export default AutomationDetailsPanel;