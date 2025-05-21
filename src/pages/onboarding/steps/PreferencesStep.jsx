import React from 'react';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { Checkbox } from '@/components/ui/checkbox';
    import { motion } from 'framer-motion';
    import { Target, Palette, SlidersHorizontal, Zap } from 'lucide-react';

    const itemVariants = {
        hidden: { opacity: 0, x: -15 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };
    
    const availableIntegrations = [
        { id: 'slack', label: 'Slack (Communication)' },
        { id: 'gmail', label: 'Gmail (Emails)' },
        { id: 'trello', label: 'Trello (Gestion de tâches)' },
        { id: 'gcalendar', label: 'Google Calendar (Agenda)' },
        { id: 'notion', label: 'Notion (Knowledge Base)' },
        { id: 'hubspot', label: 'HubSpot (CRM)' },
        { id: 'drive', label: 'Google Drive (Fichiers)' },
    ];

    const PreferencesStep = ({ data, onChange }) => {
      const handleChange = (e) => {
        onChange({ ...data, [e.target.name]: e.target.value });
      };
      const handleSelectChange = (name, value) => {
        onChange({ ...data, [name]: value });
      };
      const handleCheckboxChange = (integrationId) => {
        const currentIntegrations = data?.preferredIntegrations || [];
        const newIntegrations = currentIntegrations.includes(integrationId)
          ? currentIntegrations.filter(id => id !== integrationId)
          : [...currentIntegrations, integrationId];
        onChange({ ...data, preferredIntegrations: newIntegrations });
      };


      return (
        <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 }}}}
        >
          <motion.div variants={itemVariants}>
            <Label htmlFor="mainGoals" className="flex items-center text-base font-medium mb-1.5">
                <Target className="mr-2 h-5 w-5 text-primary/80" /> Vos objectifs principaux avec Alya
            </Label>
            <Textarea 
                id="mainGoals" 
                name="mainGoals" 
                value={data?.mainGoals || ''} 
                onChange={handleChange} 
                placeholder="Ex: Gagner du temps sur les tâches répétitives, mieux organiser mes projets, centraliser mes informations, améliorer la communication d'équipe..." 
                className="min-h-[90px]" 
            />
            <p className="text-xs text-muted-foreground mt-1">Plus vous êtes précis, mieux Alya pourra s'adapter et vous aider.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="aiTone" className="flex items-center text-base font-medium mb-1.5">
                <Palette className="mr-2 h-5 w-5 text-primary/80" /> Ton préféré pour les réponses d'Alya
            </Label>
            <Select name="aiTone" onValueChange={(value) => handleSelectChange('aiTone', value)} value={data?.aiTone || 'neutre'}>
              <SelectTrigger><SelectValue placeholder="Choisissez un ton" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="neutre">Neutre et Professionnel</SelectItem>
                <SelectItem value="amical">Amical et Concis</SelectItem>
                <SelectItem value="detaille">Détaillé et Formel</SelectItem>
                <SelectItem value="creatif">Créatif et Inspirant</SelectItem>
                <SelectItem value="direct">Direct et Factuel</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Alya s'exprimera selon votre préférence.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label className="flex items-center text-base font-medium mb-2">
                <Zap className="mr-2 h-5 w-5 text-primary/80" /> Intégrations que vous utilisez fréquemment (Optionnel)
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                {availableIntegrations.map(integration => (
                    <div key={integration.id} className="flex items-center space-x-2.5 p-1.5 hover:bg-accent/50 dark:hover:bg-accent/30 rounded-md transition-colors">
                        <Checkbox 
                            id={`integration-${integration.id}`} 
                            checked={(data?.preferredIntegrations || []).includes(integration.id)}
                            onCheckedChange={() => handleCheckboxChange(integration.id)}
                        />
                        <Label htmlFor={`integration-${integration.id}`} className="font-normal text-sm cursor-pointer">{integration.label}</Label>
                    </div>
                ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">Alya pourra prioriser les suggestions et automatisations liées à ces outils.</p>
          </motion.div>
        </motion.div>
      );
    };

    export default PreferencesStep;