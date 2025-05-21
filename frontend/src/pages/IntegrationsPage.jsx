import React, { useState, useMemo, useCallback } from 'react';
    import { motion } from 'framer-motion';
    import { toast } from '@/components/ui/use-toast';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { SlidersHorizontal, Lightbulb, Slack, Mail, Trello, Users, FileText, Calendar, Github, Database, ZoomIn as Zoom } from 'lucide-react';

    import IntegrationsPageHeader from '@/components/integrations/IntegrationsPageHeader';
    import ProactiveIntegrationSuggestion from '@/components/integrations/ProactiveIntegrationSuggestion';
    import IntegrationsFilterBar from '@/components/integrations/IntegrationsFilterBar';
    import IntegrationsGrid from '@/components/integrations/IntegrationsGrid';

    const initialIntegrationsData = [
      { id: 'slack', name: 'Slack', description: 'Notifications, messages et actions rapides via Slack.', connected: true, icon: Slack, category: 'Communication', authMethod: 'OAuth', status: 'popular', color: 'text-pink-500' },
      { id: 'gmail', name: 'Gmail', description: 'Gestion d\'emails et automatisations basées sur les emails.', connected: false, icon: Mail, category: 'Email', authMethod: 'OAuth', status: 'recommended', color: 'text-red-500' },
      { id: 'trello', name: 'Trello', description: 'Création de cartes Trello et suivi de projets.', connected: true, icon: Trello, category: 'Gestion de Projet', authMethod: 'API Key', apiKeyHelpText: 'Trouvez votre clé API Trello dans la section Power-Ups de vos paramètres de board.', manageUrl: 'https://trello.com/app-key', status: 'active' , color: 'text-blue-500'},
      { id: 'hubspot', name: 'HubSpot', description: 'Synchro CRM, création de transactions, suivi de leads.', connected: false, icon: Users, category: 'CRM', authMethod: 'OAuth', status: 'beta', color: 'text-orange-500' },
      { id: 'notion', name: 'Notion', description: 'Recherche, création et màj de pages Notion.', connected: false, icon: FileText, category: 'Productivité', authMethod: 'OAuth', status: 'new', color: 'text-gray-700 dark:text-gray-300' },
      { id: 'gcalendar', name: 'Google Calendar', description: 'Gestion d\'agenda, création d\'événements et rappels.', connected: true, icon: Calendar, category: 'Productivité', authMethod: 'OAuth', manageUrl: 'https://calendar.google.com/calendar/u/0/r/settings', status: 'popular', color: 'text-blue-400' },
      { id: 'github', name: 'GitHub', description: 'Suivi d\'issues, PRs et activités de dépôts GitHub.', connected: false, icon: Github, category: 'Développement', authMethod: 'OAuth', status: 'recommended', color: 'text-purple-500' },
      { id: 'drive', name: 'Google Drive', description: 'Accès, recherche et gestion de fichiers Drive.', connected: false, icon: Database, category: 'Stockage Fichier', authMethod: 'OAuth', status: 'active', color: 'text-green-500' },
      { id: 'zoom', name: 'Zoom', description: 'Planification de réunions Zoom, rappels et appels.', connected: false, icon: Zoom, category: 'Communication', authMethod: 'OAuth', status: 'coming_soon', color: 'text-sky-500' },
    ];
    
    const uniqueCategories = [...new Set(initialIntegrationsData.map(item => item.category))];
    const uniqueStatuses = [...new Set(initialIntegrationsData.map(item => item.status).filter(s => s && s && s !== 'active'))];

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const IntegrationsPage = () => {
      const [integrations, setIntegrations] = useState(initialIntegrationsData);
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategories, setSelectedCategories] = useState([...uniqueCategories]); 
      const [selectedStatuses, setSelectedStatuses] = useState([...uniqueStatuses]);
      const [loadingStates, setLoadingStates] = useState({});

      const handleConnect = useCallback(async (id, apiKey = null) => {
        setLoadingStates(prev => ({ ...prev, [id]: true }));
        
        console.log(`Connecting ${id} ${apiKey ? `with API key: ${apiKey}` : 'using OAuth'}`);

        return new Promise(resolve => {
          setTimeout(() => {
            setIntegrations(prev => prev.map(int => int.id === id ? { ...int, connected: true } : int));
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            const integrationName = initialIntegrationsData.find(i => i.id === id)?.name || 'L\'intégration';
            toast({ title: "Intégration connectée", description: `${integrationName} a été connecté.` });
            resolve();
          }, 1000);
        });
      }, []);

      const handleDisconnect = useCallback(async (id) => {
        setLoadingStates(prev => ({ ...prev, [id]: true }));
         return new Promise(resolve => {
          setTimeout(() => {
            setIntegrations(prev => prev.map(int => int.id === id ? { ...int, connected: false } : int));
            setLoadingStates(prev => ({ ...prev, [id]: false }));
            const integrationName = initialIntegrationsData.find(i => i.id === id)?.name || 'L\'intégration';
            toast({ title: "Intégration déconnectée", description: `${integrationName} a été déconnecté.`, variant: "destructive" });
            resolve();
          }, 500);
        });
      }, []);

      const handleManageIntegration = (id) => {
        const integration = integrations.find(int => int.id === id);
        if (integration && integration.manageUrl) {
          window.open(integration.manageUrl, '_blank');
        } else {
          toast({ title: "Gestion non disponible", description: `Pas d'URL de gestion pour ${integration?.name}.`, variant: "default" });
        }
      };
      
      const toggleCategory = (category) => {
        setSelectedCategories(prev => 
          prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
        );
      };
      
      const toggleStatus = (status) => {
        setSelectedStatuses(prev =>
          prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
        );
      };

      const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategories([...uniqueCategories]);
        setSelectedStatuses([...uniqueStatuses]);
      };

      const filteredIntegrations = useMemo(() => integrations.filter(integration => {
        const nameMatch = integration.name.toLowerCase().includes(searchTerm.toLowerCase());
        const descMatch = integration.description.toLowerCase().includes(searchTerm.toLowerCase());
        const categoryMatch = selectedCategories.length === uniqueCategories.length || selectedCategories.includes(integration.category);
        
        const statusIsActive = integration.status === 'active';
        const statusIsSelected = selectedStatuses.length === uniqueStatuses.length || selectedStatuses.includes(integration.status);
        const statusMatch = statusIsActive || statusIsSelected;

        return (nameMatch || descMatch) && categoryMatch && statusMatch;
      }), [integrations, searchTerm, selectedCategories, selectedStatuses]);

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
      };

      const popularNotConnected = useMemo(() => {
        return initialIntegrationsData.filter(int => int.status === 'popular' && !integrations.find(i => i.id === int.id)?.connected).slice(0,1);
      }, [integrations]);


      return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <IntegrationsPageHeader />
          <IntegrationsFilterBar 
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            setSelectedCategories={setSelectedCategories}
            selectedStatuses={selectedStatuses}
            toggleStatus={toggleStatus}
            setSelectedStatuses={setSelectedStatuses}
            resetFilters={resetFilters}
            uniqueCategories={uniqueCategories}
            uniqueStatuses={uniqueStatuses}
          />
          
          {popularNotConnected.length > 0 && popularNotConnected[0].icon && (
            <ProactiveIntegrationSuggestion
                title={`Connectez ${popularNotConnected[0].name} pour plus de puissance !`}
                description={`Intégrez ${popularNotConnected[0].name} pour ${popularNotConnected[0].description.toLowerCase().substring(0, 60)}...`}
                buttonText={`Connecter ${popularNotConnected[0].name}`}
                onClick={() => {
                    const targetCard = document.getElementById(`integration-${popularNotConnected[0].id}`);
                    if (targetCard) {
                        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetCard.classList.add('animate-pulse_custom');
                        setTimeout(() => targetCard.classList.remove('animate-pulse_custom'), 2500);
                    }
                }}
                icon={popularNotConnected[0].icon}
            />
          )}

          {filteredIntegrations.length > 0 ? (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 mb-4">
                <TabsTrigger value="all">Tout ({filteredIntegrations.length})</TabsTrigger>
                <TabsTrigger value="connected">Connectées ({filteredIntegrations.filter(i => i.connected).length})</TabsTrigger>
                <TabsTrigger value="disconnected">Disponibles ({filteredIntegrations.filter(i => !i.connected).length})</TabsTrigger>
              </TabsList>
              <TabsContent value="all">
                <IntegrationsGrid 
                    integrations={filteredIntegrations} 
                    onConnect={handleConnect} 
                    onDisconnect={handleDisconnect} 
                    onManage={handleManageIntegration} 
                    loadingStates={loadingStates}
                    filterType="all"
                />
              </TabsContent>
              <TabsContent value="connected">
                <IntegrationsGrid 
                    integrations={filteredIntegrations} 
                    onConnect={handleConnect} 
                    onDisconnect={handleDisconnect} 
                    onManage={handleManageIntegration} 
                    loadingStates={loadingStates}
                    filterType="connected"
                />
              </TabsContent>
              <TabsContent value="disconnected">
                 <IntegrationsGrid 
                    integrations={filteredIntegrations} 
                    onConnect={handleConnect} 
                    onDisconnect={handleDisconnect} 
                    onManage={handleManageIntegration} 
                    loadingStates={loadingStates}
                    filterType="disconnected"
                />
              </TabsContent>
            </Tabs>
          ) : (
             <motion.div 
                variants={itemVariants} 
                className="text-center py-16 text-muted-foreground"
            >
                <SlidersHorizontal className="mx-auto h-16 w-16 opacity-50 mb-4" />
                <h3 className="text-xl font-semibold">Aucune intégration trouvée</h3>
                <p className="mt-1">Essayez d'ajuster vos filtres de recherche ou de catégorie.</p>
            </motion.div>
          )}
        </motion.div>
      );
    };
    
    export default IntegrationsPage;