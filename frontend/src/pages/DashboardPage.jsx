import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { useNavigate } from 'react-router-dom';
    import { BarChart3, MessageSquare, Zap, Settings, PlusCircle, ArrowRight, Lightbulb, CheckSquare, Clock, Rocket, Link2, BookOpen, HelpCircle, Video } from 'lucide-react';
    import useChat from '@/hooks/useChat';
    import { useAuth } from '@/auth/AuthContext';

    const containerVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.07, delayChildren: 0.1, duration: 0.3 } }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 15, scale: 0.95 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
    };

    const ProactiveSuggestionCardDashboard = ({ icon: Icon, title, description, buttonText, onClick, color = "text-primary" }) => (
        <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60 bg-card/80 backdrop-blur-sm h-full flex flex-col hover:border-primary/30">
                <CardHeader className="pb-3">
                    <div className="flex items-center mb-2">
                        <Icon className={`h-6 w-6 mr-2.5 ${color}`} />
                        <CardTitle className="text-md font-semibold">{title}</CardTitle>
                    </div>
                    <CardDescription className="text-xs">{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end">
                    <Button variant="outline" size="sm" className="w-full mt-2 border-primary/30 text-primary hover:bg-primary/10 hover:text-primary" onClick={onClick}>
                        {buttonText} <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                </CardContent>
            </Card>
        </motion.div>
    );


    const DashboardPage = () => {
      const navigate = useNavigate();
      const { conversations, createConversation, setActiveConversationId } = useChat();
      const { user } = useAuth();

      const recentConversations = conversations.slice(0, 3);
      const quickActions = [
        { title: "Nouvelle Discussion", icon: PlusCircle, action: () => { setActiveConversationId(null); navigate('/app/chat'); }, color: "text-primary" },
        { title: "Voir les Intégrations", icon: Zap, action: () => navigate('/app/integrations'), color: "text-green-500" },
        { title: "Explorer les Automatisations", icon: BarChart3, action: () => navigate('/app/automations'), color: "text-blue-500" },
        { title: "Paramètres du Compte", icon: Settings, action: () => navigate('/app/settings'), color: "text-purple-500" },
      ];

      const infoCards = [
        { title: "Discussions Actives", value: conversations.length, icon: MessageSquare, description: "Total des conversations en cours." },
        { title: "Tâches Automatisées (Simulé)", value: "12", icon: CheckSquare, description: "Automatisations actives pour vous." },
        { title: "Requêtes ce mois-ci (Simulé)", value: "237", icon: BarChart3, description: "Utilisation d'Alya ce mois-ci." },
      ];

      const proactiveSuggestions = [
        { icon: Rocket, title: "Automatiser vos rapports ?", description: "Laissez Alya compiler et envoyer vos rapports hebdomadaires automatiquement.", buttonText: "Explorer les automatisations", onClick: () => navigate('/app/automations'), color: "text-blue-500" },
        { icon: Link2, title: "Connecter votre calendrier ?", description: "Intégrez Google Calendar pour une gestion d'agenda transparente avec Alya.", buttonText: "Voir les intégrations", onClick: () => navigate('/app/integrations'), color: "text-green-500" },
        { icon: Lightbulb, title: "Optimiser votre workflow ?", description: "Découvrez comment Alya peut vous aider à structurer vos idées et projets.", buttonText: "Démarrer un brainstorming", onClick: () => { const newId = createConversation("Brainstorming Workflow"); if(newId) navigate(`/app/chat/${newId}`); }, color: "text-amber-500" },
      ];
      
      const resourceLinks = [
        { title: "Documentation", icon: BookOpen, action: () => navigate('/app/documentation'), description: "Guides et références API." },
        { title: "Tutoriels Vidéo", icon: Video, action: () => navigate('/app/tutorials'), description: "Apprenez en regardant." },
        { title: "FAQ", icon: HelpCircle, action: () => navigate('/app/faq'), description: "Réponses aux questions fréquentes." },
      ];

      return (
        <motion.div 
          className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tableau de Bord</h1>
              <p className="text-muted-foreground text-sm sm:text-base">Bienvenue, {user?.name || 'Utilisateur'} ! Voici un aperçu de votre activité.</p>
            </div>
            <Button className="mt-3 sm:mt-0 btn-primary-gradient shadow-lg hover:shadow-primary/40 transition-shadow" onClick={() => { setActiveConversationId(null); navigate('/app/chat'); }}>
              <PlusCircle className="mr-2 h-4 w-4" /> Démarrer une Discussion
            </Button>
          </motion.div>

          <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-3">
            {infoCards.map((card, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
                    <card.icon className="h-5 w-5 text-primary/70" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-foreground">{card.value}</div>
                    <p className="text-xs text-muted-foreground pt-1">{card.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants}>
            <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center">
                <Lightbulb className="mr-2.5 h-5 w-5 text-amber-500" /> Suggestions pour vous
            </h2>
            <motion.div variants={containerVariants} className="grid gap-4 md:grid-cols-3">
                {proactiveSuggestions.map((suggestion, index) => (
                    <ProactiveSuggestionCardDashboard key={index} {...suggestion} />
                ))}
            </motion.div>
          </motion.div>


          <motion.div variants={itemVariants} className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-lg"><MessageSquare className="mr-2 h-5 w-5 text-primary" /> Discussions Récentes</CardTitle>
                <CardDescription className="text-xs">Accédez rapidement à vos dernières conversations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentConversations.length > 0 ? recentConversations.map(conv => (
                  <motion.div 
                    key={conv.id} 
                    whileHover={{ scale: 1.02, x: 2 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-accent/80 dark:hover:bg-accent/50 cursor-pointer border border-transparent hover:border-primary/30"
                    onClick={() => navigate(`/app/chat/${conv.id}`)}
                  >
                    <span className="text-sm font-medium text-foreground truncate">{conv.name}</span>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.div>
                )) : (
                  <p className="text-sm text-muted-foreground p-2.5 text-center">Aucune discussion récente.</p>
                )}
                {conversations.length > 3 && (
                    <Button variant="link" className="text-xs p-0 h-auto mt-2 text-primary hover:text-primary/80" onClick={() => navigate('/app/chat')}>
                        Voir toutes les discussions ({conversations.length})
                    </Button>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center text-lg"><Zap className="mr-2 h-5 w-5 text-primary" /> Actions Rapides</CardTitle>
                <CardDescription className="text-xs">Lancez des actions courantes en un clic.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {quickActions.map(action => (
                  <motion.div 
                    key={action.title}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <Button variant="outline" className="w-full justify-start p-3 h-auto text-left border-border hover:border-primary/40 hover:bg-accent/80 dark:hover:bg-accent/50" onClick={action.action}>
                      <action.icon className={`mr-2.5 h-4 w-4 ${action.color}`} />
                      <span className="text-sm font-medium text-foreground">{action.title}</span>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border/60 bg-card/80 backdrop-blur-sm hover:border-primary/30">
                <CardHeader>
                    <CardTitle className="flex items-center text-lg"><BookOpen className="mr-2 h-5 w-5 text-primary" /> Ressources Utiles</CardTitle>
                    <CardDescription className="text-xs">Trouvez de l'aide et apprenez-en plus sur Alya.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {resourceLinks.map(link => (
                        <motion.div 
                            key={link.title}
                            whileHover={{ scale: 1.03, y: -2 }}
                            transition={{ type: "spring", stiffness: 300, damping: 15 }}
                        >
                            <Button variant="outline" className="w-full justify-start p-3 h-auto text-left border-border hover:border-primary/40 hover:bg-accent/80 dark:hover:bg-accent/50 flex flex-col items-start" onClick={link.action}>
                                <div className="flex items-center">
                                    <link.icon className="mr-2.5 h-4 w-4 text-primary/80" />
                                    <span className="text-sm font-medium text-foreground">{link.title}</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 pl-7">{link.description}</p>
                            </Button>
                        </motion.div>
                    ))}
                </CardContent>
            </Card>
          </motion.div>

        </motion.div>
      );
    };

    export default DashboardPage;