import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { AlertTriangle, CheckCircle2, ExternalLink, Settings, Info, Loader2 } from 'lucide-react';
    import {
      Dialog,
      DialogContent,
      DialogDescription,
      DialogHeader,
      DialogTitle,
      DialogFooter,
      DialogClose,
      DialogTrigger,
    } from "@/components/ui/dialog";
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { toast } from '@/components/ui/use-toast';

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const IntegrationCard = ({ integration, onConnect, onDisconnect, onManage, isConnected, isLoading }) => {
      const IconComponent = integration.icon;
      const [apiKey, setApiKey] = React.useState('');

      const handleConnectWithApiKey = (e) => {
        e.preventDefault();
        if (!apiKey.trim()) {
          toast({ title: "Clé API requise", description: "Veuillez entrer une clé API valide.", variant: "destructive" });
          return;
        }
        onConnect(integration.id, apiKey);
      };

      const renderAuthButton = () => {
        if (integration.authMethod === 'API Key' && !isConnected) {
          return (
            <Dialog>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10"
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Configurer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configurer {integration.name}</DialogTitle>
                  <DialogDescription>
                    Veuillez entrer votre clé API pour {integration.name}.
                    {integration.apiKeyHelpText && (
                      <p className="text-xs text-muted-foreground mt-1">{integration.apiKeyHelpText}</p>
                    )}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleConnectWithApiKey}>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor={`api-key-${integration.id}`} className="text-right">
                        Clé API
                      </Label>
                      <Input
                        id={`api-key-${integration.id}`}
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="col-span-3"
                        placeholder="Entrez votre clé API"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild><Button type="button" variant="outline">Annuler</Button></DialogClose>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                      Connecter
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          );
        }
        return (
          <Button 
            variant="outline" 
            className="w-full border-primary text-primary hover:bg-primary/10"
            onClick={() => onConnect(integration.id)}
            disabled={isLoading}
          >
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
            Connecter
          </Button>
        );
      };

      const renderStatusBadge = () => {
        if (integration.status === 'beta') return <Badge variant="outline" className="bg-yellow-100 text-yellow-700 border-yellow-300">Beta</Badge>;
        if (integration.status === 'new') return <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">Nouveau</Badge>;
        if (integration.status === 'popular') return <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-300">Populaire</Badge>;
        if (integration.status === 'recommended') return <Badge variant="outline" className="bg-green-100 text-green-700 border-green-300">Recommandé</Badge>;
        if (integration.status === 'coming_soon') return <Badge variant="secondary">Bientôt</Badge>;
        return null;
      };

      return (
        <motion.div 
          id={`integration-${integration.id}`}
          variants={itemVariants}
          className={`bg-card p-6 rounded-xl shadow-lg border flex flex-col justify-between transition-all hover:shadow-xl hover:border-primary/30 ${integration.connected ? 'border-green-500/50' : 'border-border'}`}
        >
          <div>
            <div className="flex justify-between items-start mb-3">
              {IconComponent && <IconComponent className={`h-10 w-10 mb-3 ${integration.color || 'text-primary'}`} />}
              <div className="flex flex-col items-end space-y-1">
                {renderStatusBadge()}
                {isConnected && <Badge className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="h-3 w-3 mr-1"/>Connecté</Badge>}
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-1 text-card-foreground">{String(integration.name)}</h3>
            <p className="text-sm text-muted-foreground mb-4 h-16 overflow-hidden">{String(integration.description)}</p>
          </div>
          
          <div className="mt-auto space-y-2">
            {isConnected ? (
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => onDisconnect(integration.id)}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <AlertTriangle className="mr-2 h-4 w-4" />}
                  Déconnecter
                </Button>
                {integration.manageUrl && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => onManage(integration.id)}
                    title="Gérer l'intégration"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ) : (
              renderAuthButton()
            )}
             {integration.status === 'coming_soon' && !isConnected && (
              <Button variant="ghost" disabled className="w-full text-muted-foreground">
                <Info className="mr-2 h-4 w-4" /> Bientôt disponible
              </Button>
            )}
            {integration.learnMoreUrl && (
                <Button variant="link" className="w-full text-xs text-muted-foreground justify-start px-0" asChild>
                    <a href={integration.learnMoreUrl} target="_blank" rel="noopener noreferrer">
                        En savoir plus <ExternalLink className="ml-1 h-3 w-3"/>
                    </a>
                </Button>
            )}
          </div>
        </motion.div>
      );
    };

    export default IntegrationCard;