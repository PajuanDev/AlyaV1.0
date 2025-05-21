import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Switch } from '@/components/ui/switch';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { ThemeToggle } from '@/components/ThemeToggle';
    import { toast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { Bell, UserCog, Trash2, ShieldCheck, Eye, Languages, Palette, Mail, LayoutGrid, RotateCcw, CreditCard, Smartphone, Download, Sun, Info, SlidersHorizontal } from 'lucide-react';
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
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { useNavigate } from 'react-router-dom';
    import useAuth from '@/hooks/useAuth';


    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, duration: 0.3 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.98 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }
    };
    
    const SettingItem = ({ icon, labelText, description, controlElement, idSuffix = "" }) => {
       const IconComponent = icon;
       const elementId = controlElement?.props?.id || labelText.replace(/\s+/g, '-').toLowerCase() + idSuffix;
       return (
        <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3.5 rounded-lg hover:bg-muted/40 dark:hover:bg-muted/20 transition-colors duration-150 border-b border-border/40 last:border-b-0"
        >
            <div className="mb-2 sm:mb-0 sm:mr-4 flex-grow">
                <Label htmlFor={elementId} className="flex items-center text-sm font-medium cursor-pointer text-foreground">
                    <IconComponent className="mr-3 h-5 w-5 text-muted-foreground flex-shrink-0" /> {labelText}
                </Label>
                {description && <p className="text-xs text-muted-foreground/90 mt-1 ml-8 leading-relaxed">{description}</p>}
            </div>
            <div className="self-end sm:self-center flex-shrink-0">{controlElement}</div>
        </motion.div>
       )
    }

    const GeneralSettingsTab = ({ settings, handleSettingChange }) => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="shadow-xl border-border/70 overflow-hidden mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
            <CardHeader className="border-b border-border/60 bg-card/70 dark:bg-muted/10">
                <CardTitle className="flex items-center text-lg sm:text-xl"><UserCog className="mr-2.5 h-5 w-5 text-primary" /> Préférences Générales</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Gérez les paramètres généraux de votre expérience Alya.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0.5 p-2 sm:p-3">
                <SettingItem 
                    icon={Bell} 
                    labelText="Notifications de l'application"
                    description="Recevez des alertes pour les mentions et mises à jour importantes."
                    controlElement={
                        <Switch
                            id="notificationsEnabled"
                            checked={settings.notificationsEnabled}
                            onCheckedChange={(value) => handleSettingChange('notificationsEnabled', value, "Les notifications")}
                        />
                    }
                />
                <SettingItem 
                    icon={Eye} 
                    labelText="Suggestions Proactives d'Alya"
                    description="Permettez à Alya de vous proposer des actions contextuelles."
                    controlElement={
                        <Switch
                            id="proactiveSuggestions"
                            checked={settings.proactiveSuggestions}
                            onCheckedChange={(value) => handleSettingChange('proactiveSuggestions', value, "Les suggestions proactives")}
                        />
                    }
                />
                <SettingItem 
                    icon={Mail} 
                    labelText="Résumés hebdomadaires par e-mail"
                    description="Recevez un récapitulatif de votre activité chaque semaine."
                    controlElement={
                        <Switch
                            id="emailSummaries"
                            checked={settings.emailSummaries}
                            onCheckedChange={(value) => handleSettingChange('emailSummaries', value, "Les résumés par e-mail")}
                        />
                    }
                />
            </CardContent>
            </Card>
        </motion.div>
    );

    const AppearanceSettingsTab = ({ settings, handleSettingChange, handleResetTutorials }) => (
        <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="shadow-xl border-border/70 overflow-hidden mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
            <CardHeader className="border-b border-border/60 bg-card/70 dark:bg-muted/10">
                <CardTitle className="flex items-center text-lg sm:text-xl"><Palette className="mr-2.5 h-5 w-5 text-primary" /> Apparence</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Personnalisez l'interface d'Alya.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-0.5 p-2 sm:p-3">
                <SettingItem
                    icon={Languages}
                    labelText="Langue de l'interface"
                    description="Choisissez la langue d'affichage de l'application."
                    controlElement={
                        <Button variant="outline" size="sm" className="h-9" onClick={() => toast({title: "Multilingue (Bientôt)", description:"Le choix de la langue sera bientôt disponible."})}>
                            Français (Défaut)
                        </Button>
                    }
                />
                <SettingItem
                    icon={LayoutGrid}
                    labelText="Densité d'affichage"
                    description="Ajustez la compacité des éléments à l'écran."
                    controlElement={
                        <Select value={settings.displayDensity} onValueChange={(value) => handleSettingChange('displayDensity', value, "La densité d'affichage", false)}>
                            <SelectTrigger className="w-[160px] h-9 text-xs sm:text-sm bg-background">
                                <SelectValue placeholder="Densité" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="compact">Compacte</SelectItem>
                                <SelectItem value="normal">Normale</SelectItem>
                                <SelectItem value="comfortable">Confortable</SelectItem>
                            </SelectContent>
                        </Select>
                    }
                />
                <SettingItem
                    icon={Sun}
                    labelText="Thème d'affichage"
                    description="Passez du mode clair au mode sombre."
                    controlElement={<ThemeToggle />}
                    idSuffix="-theme"
                />
                <SettingItem
                    icon={RotateCcw}
                    labelText="Astuces et tutoriels"
                    description="Réaffichez les messages d'aide initiaux et les guides."
                    controlElement={
                        <Button variant="outline" size="sm" className="h-9" onClick={handleResetTutorials}>
                            Réinitialiser les astuces
                        </Button>
                    }
                />
            </CardContent>
            </Card>
        </motion.div>
    );

    const SecurityDataSettingsTab = ({ navigate, handleDeleteAccount }) => (
         <motion.div variants={containerVariants} initial="hidden" animate="visible">
            <Card className="shadow-xl border-border/70 overflow-hidden mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
            <CardHeader className="border-b border-border/60 bg-card/70 dark:bg-muted/10">
                <CardTitle className="flex items-center text-lg sm:text-xl"><ShieldCheck className="mr-2.5 h-5 w-5 text-primary" /> Sécurité & Données</CardTitle>
                <CardDescription className="text-xs sm:text-sm">Gérez la sécurité de votre compte et la confidentialité de vos données.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 p-2 sm:p-3">
                <SettingItem
                    icon={CreditCard}
                    labelText="Abonnement et Facturation"
                    description="Gérez votre plan Alya et vos informations de paiement."
                    controlElement={
                        <Button variant="outline" size="sm" className="h-9" onClick={() => navigate('/pricing')}>
                            Gérer l'abonnement
                        </Button>
                    }
                />
                <SettingItem
                    icon={Smartphone}
                    labelText="Appareils Connectés"
                    description="Visualisez et gérez les appareils ayant accès à votre compte."
                    controlElement={
                        <Button variant="outline" size="sm" className="h-9" onClick={() => toast({title: "Gestion des appareils (Bientôt)", description:"Cette fonctionnalité sera bientôt disponible."})}>
                            Voir les appareils
                        </Button>
                    }
                />
                <SettingItem
                    icon={Download}
                    labelText="Exporter mes données"
                    description="Téléchargez une archive de vos conversations et données."
                    controlElement={
                        <Button variant="outline" size="sm" className="h-9" onClick={() => toast({title: "Exportation en cours (Simulation)", description:"Un export de vos données sera bientôt disponible au format CSV."})}>
                            Demander un export
                        </Button>
                    }
                />
                 <SettingItem
                    icon={Trash2}
                    labelText="Supprimer mon compte"
                    description="Cette action est irréversible et supprimera toutes vos données."
                    controlElement={
                        <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" className="h-9">
                                Supprimer le compte
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Cette action est irréversible. Toutes vos données, conversations, intégrations et configurations seront définitivement supprimées.
                                Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction 
                                className="bg-destructive hover:bg-destructive/90 dark:bg-red-600 dark:hover:bg-red-700 text-destructive-foreground"
                                onClick={handleDeleteAccount}
                            >
                                Oui, supprimer mon compte
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                        </AlertDialog>
                    }
                />
            </CardContent>
            </Card>
        </motion.div>
    );


    const SettingsPage = () => {
      const navigate = useNavigate();
      const { logout } = useAuth();
      const [settings, setSettings] = useState(() => {
        const savedSettings = localStorage.getItem('alya-user-settings');
        return savedSettings ? JSON.parse(savedSettings) : {
            notificationsEnabled: true,
            proactiveSuggestions: true,
            emailSummaries: false,
            displayDensity: "normal",
            language: "fr",
        };
      });
      
      useEffect(() => {
        localStorage.setItem('alya-user-settings', JSON.stringify(settings));
      }, [settings]);
      
      const handleSettingChange = (key, value, settingName, isToggle = true) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        toast({
          title: "Paramètre mis à jour",
          description: isToggle ? `${settingName} ${value ? 'activé(e)s' : 'désactivé(e)s'}.` : `${settingName} défini sur "${value}".`,
          duration: 3000
        });
      };
      
      const handleResetTutorials = () => {
        localStorage.removeItem('onboardingCompleted'); // Example of resetting specific onboarding flags
        localStorage.removeItem('dismissedTooltips');
        toast({
          title: "Astuces réinitialisées",
          description: "Les messages d'aide et tutoriels s'afficheront à nouveau.",
          duration: 3000
        });
      };

      const handleDeleteAccount = () => {
        // In a real app, this would make an API call.
        // For simulation:
        toast({title: "Suppression de compte (Simulation)", description: "Votre compte et vos données ont été supprimés. Vous allez être déconnecté.", variant: "destructive", duration: 4000});
        setTimeout(() => {
            logout(); // Assuming logout clears local session data
            navigate('/auth');
        }, 4000);
      };

      return (
        <motion.div 
            className="space-y-6 md:space-y-8 max-w-3xl mx-auto pb-10 px-2 sm:px-0"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
          <motion.h1 variants={itemVariants} className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground pt-2 flex items-center">
             <SlidersHorizontal className="mr-3 h-7 w-7 text-primary"/>Paramètres
          </motion.h1>

          <Tabs defaultValue="general" className="w-full">
            <motion.div variants={itemVariants}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 gap-2 h-auto p-1.5 bg-muted/50 dark:bg-muted/20 rounded-lg">
                    <TabsTrigger value="general" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Général</TabsTrigger>
                    <TabsTrigger value="appearance" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Apparence</TabsTrigger>
                    <TabsTrigger value="security" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Sécurité & Données</TabsTrigger>
                </TabsList>
            </motion.div>

            <TabsContent value="general">
                <GeneralSettingsTab 
                    settings={settings}
                    handleSettingChange={handleSettingChange}
                />
            </TabsContent>

            <TabsContent value="appearance">
                <AppearanceSettingsTab 
                    settings={settings}
                    handleSettingChange={handleSettingChange}
                    handleResetTutorials={handleResetTutorials}
                />
            </TabsContent>
            
            <TabsContent value="security">
                <SecurityDataSettingsTab navigate={navigate} handleDeleteAccount={handleDeleteAccount} />
            </TabsContent>
          </Tabs>
           <motion.p variants={itemVariants} className="text-xs text-muted-foreground text-center pt-4 flex items-center justify-center">
                <Info className="h-3.5 w-3.5 mr-1.5" /> Les paramètres sont sauvegardés localement dans cette démo.
           </motion.p>
        </motion.div>
      );
    };

    export default SettingsPage;