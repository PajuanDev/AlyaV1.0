import React, { useState } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { PlusCircle, Zap, Brain, Lightbulb, CalendarClock, MailCheck, Info } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';
    import { toast } from '@/components/ui/use-toast';
    import AutomationCard from '@/components/automations/AutomationCard';
    import AutomationFormDialog from '@/components/automations/AutomationFormDialog';
    import AutomationDetailsPanel from '@/components/automations/AutomationDetailsPanel';
    
    const mockAutomations = [
      { id: 'auto1', name: 'Rappel quotidien: Stand-up meeting', trigger: 'Chaque jour à 9h00', actions: 'Envoyer notification Slack #general', status: 'active', lastRun: 'Aujourd\'hui à 9:00', category: 'Rappels' },
      { id: 'auto2', name: 'Email "Urgent" vers Trello', trigger: 'Nouveau mail avec "Urgent" dans l\'objet', actions: 'Créer une tâche Trello dans "À faire"', status: 'active', lastRun: 'Hier à 15:32', category: 'Gestion de Tâches' },
      { id: 'auto3', name: 'Résumé de PDF importé', trigger: 'Nouveau PDF importé dans le chat', actions: 'Extraire texte et générer résumé', status: 'paused', lastRun: 'Il y a 3 jours', category: 'Traitement de Fichiers' },
      { id: 'auto4', name: 'Veille concurrentielle', trigger: 'Nouvel article sur "concurrent X"', actions: 'Notifier canal #veille & résumer', status: 'active', lastRun: 'Aujourd\'hui à 11:15', category: 'Veille Stratégique' },
    ];

    const ProactiveAutomationSuggestion = ({ title, description, buttonText, onClick, icon: Icon }) => (
        <motion.div 
            variants={itemVariants} 
            className="p-5 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-dashed border-primary/20 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-start md:items-center space-x-4">
                <Icon className="h-10 w-10 text-primary flex-shrink-0 mt-1 md:mt-0" />
                <div>
                    <h3 className="text-lg font-semibold text-primary">{title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3 leading-relaxed">{description}</p>
                    <Button variant="outline" size="sm" onClick={onClick} className="border-primary/40 text-primary hover:bg-primary/10">
                        {buttonText} <Zap className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: {type: 'spring', stiffness:150, damping: 20} }
    };

    const AutomationPage = () => {
      const navigate = useNavigate();
      const [automations, setAutomations] = useState(mockAutomations);
      const [isFormOpen, setIsFormOpen] = useState(false);
      const [editingAutomation, setEditingAutomation] = useState(null); 
      const [selectedAutomation, setSelectedAutomation] = useState(null);
      const [isDetailsPanelOpen, setIsDetailsPanelOpen] = useState(false);


      const handleToggleStatus = (id) => {
        setAutomations(prev => prev.map(auto => 
          auto.id === id ? { ...auto, status: auto.status === 'active' ? 'paused' : 'active' } : auto
        ));
        const targetAuto = automations.find(a => a.id === id);
        toast({ title: `Automatisation "${targetAuto.name}" ${targetAuto.status !== 'active' ? 'activée' : 'mise en pause'}.` });
        if (selectedAutomation && selectedAutomation.id === id) {
            setSelectedAutomation(prev => ({...prev, status: prev.status === 'active' ? 'paused' : 'active'}));
        }
      };

      const handleDelete = (id) => {
        const targetAuto = automations.find(a => a.id === id);
        setAutomations(prev => prev.filter(auto => auto.id !== id));
        toast({ title: `Automatisation "${targetAuto.name}" supprimée.`, variant: "destructive"});
        if(selectedAutomation && selectedAutomation.id === id) {
            setIsDetailsPanelOpen(false);
            setSelectedAutomation(null);
        }
      };

      const handleOpenForm = (automation = null) => {
        setEditingAutomation(automation);
        setIsFormOpen(true);
        if (isDetailsPanelOpen) setIsDetailsPanelOpen(false);
      };
      
      const handleSaveAutomation = (formData) => {
        if (editingAutomation) { 
          const updatedAutomations = automations.map(auto => auto.id === editingAutomation.id ? {...auto, ...formData, id: editingAutomation.id} : auto);
          setAutomations(updatedAutomations);
          toast({title: "Automatisation modifiée", description: `"${formData.name}" a été mise à jour.`});
           if (selectedAutomation && selectedAutomation.id === editingAutomation.id) {
                setSelectedAutomation(updatedAutomations.find(a => a.id === editingAutomation.id));
            }
        } else { 
          const newAutomation = {...formData, id: `auto${Date.now()}`, status: 'active', lastRun: 'Jamais', category: formData.category || 'Général'};
          setAutomations(prev => [newAutomation, ...prev]);
          toast({title: "Automatisation créée", description: `"${formData.name}" a été ajoutée.`});
        }
        setIsFormOpen(false);
        setEditingAutomation(null);
      };

      const handleCardClick = (automation) => {
        setSelectedAutomation(automation);
        setIsDetailsPanelOpen(true);
      };
      
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
      };

      const proactiveAutomationIdeas = [
        { icon: CalendarClock, title: "Rappels intelligents", description: "Ne manquez plus jamais une échéance. Alya peut vous rappeler des tâches importantes basées sur votre calendrier ou vos discussions.", buttonText: "Créer un rappel", onClick: () => handleOpenForm({ name: "Nouveau Rappel Intelligent", trigger: "Basé sur le calendrier", actions: "Notifier via Slack/Email" }) },
        { icon: MailCheck, title: "Gestion d'emails simplifiée", description: "Automatisez le tri, la réponse ou la création de tâches à partir de vos emails entrants pour garder votre boîte de réception organisée.", buttonText: "Automatiser mes emails", onClick: () => handleOpenForm({ name: "Tri d'emails automatique", trigger: "Nouvel email de [Client X]", actions: "Créer une tâche et notifier" }) },
      ];


      return (
        <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.div variants={itemVariants}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
              <div className="flex-grow">
                <h1 className="text-4xl font-extrabold tracking-tight flex items-center">
                    <Zap className="mr-3 h-8 w-8 text-primary" /> Automatisations
                </h1>
                <p className="text-muted-foreground mt-1">Créez, planifiez et gérez les tâches automatisées d'Alya pour optimiser votre workflow.</p>
              </div>
              <Button size="lg" onClick={() => handleOpenForm()} className="btn-primary-solid shadow-lg hover:shadow-primary/30">
                <PlusCircle className="mr-2 h-5 w-5" /> Nouvelle Automatisation
              </Button>
            </div>
          </motion.div>
          
          <AutomationFormDialog 
            isOpen={isFormOpen} 
            onClose={() => { setIsFormOpen(false); setEditingAutomation(null);}} 
            onSave={handleSaveAutomation}
            initialData={editingAutomation}
          />
          
          <AutomationDetailsPanel
            isOpen={isDetailsPanelOpen}
            onOpenChange={setIsDetailsPanelOpen}
            automation={selectedAutomation}
            onEdit={() => {
                handleOpenForm(selectedAutomation);
            }}
            onDelete={() => handleDelete(selectedAutomation.id)}
            onToggleStatus={() => handleToggleStatus(selectedAutomation.id)}
          />


          {automations.length === 0 && (
            <motion.div variants={itemVariants} className="text-center py-16 bg-card/50 rounded-xl border border-dashed">
              <Zap className="mx-auto h-16 w-16 text-muted-foreground opacity-50 mb-4" />
              <h3 className="text-xl font-semibold text-foreground">Aucune automatisation pour le moment</h3>
              <p className="mt-2 text-muted-foreground">Libérez la puissance d'Alya en créant votre première tâche automatisée.</p>
              <Button onClick={() => handleOpenForm()} className="mt-6 btn-primary-solid">
                <PlusCircle className="mr-2 h-4 w-4" /> Créer ma première automatisation
              </Button>
            </motion.div>
          )}

          <motion.div 
            className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            variants={containerVariants}
          >
            <AnimatePresence>
            {automations.map(auto => (
              <AutomationCard 
                key={auto.id}
                automation={auto}
                onToggleStatus={handleToggleStatus}
                onEdit={handleOpenForm}
                onDelete={handleDelete}
                onClick={() => handleCardClick(auto)}
              />
            ))}
            </AnimatePresence>
          </motion.div>
          
          <motion.div variants={itemVariants} className="mt-10 space-y-6">
            <h2 className="text-2xl font-semibold text-foreground flex items-center">
                <Lightbulb className="mr-3 h-6 w-6 text-amber-500" /> Idées d'Automatisations
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {proactiveAutomationIdeas.map((idea, index) => (
                    <ProactiveAutomationSuggestion key={index} {...idea} />
                ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-12 p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-dashed border-primary/20">
            <div className="flex items-start md:items-center space-x-4">
              <Brain className="h-10 w-10 text-primary flex-shrink-0 mt-1 md:mt-0" />
              <div>
                <h3 className="text-xl font-semibold text-primary">Laissez Alya vous inspirer !</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  Alya apprend de vos habitudes et peut vous suggérer des automatisations personnalisées pour gagner encore plus de temps. 
                  Activez les suggestions proactives dans les <Button variant="link" size="sm" className="p-0 h-auto text-sm text-primary hover:underline" onClick={() => navigate('/app/settings')}>paramètres</Button> pour découvrir des optimisations sur mesure.
                </p>
              </div>
            </div>
          </motion.div>
          
           <p className="text-xs text-muted-foreground text-center pt-4 flex items-center justify-center">
                <Info className="h-3.5 w-3.5 mr-1.5" /> Les automatisations et leur exécution sont simulées dans cette démo.
           </p>
        </motion.div>
      );
    };

    export default AutomationPage;