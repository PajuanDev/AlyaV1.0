import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Button } from '@/components/ui/button';
    import { PlaySquare, Zap, SlidersHorizontal, MessageSquare, Search, Globe, Users, Loader2, Lightbulb, ChevronRight, BookOpen, HelpCircle } from 'lucide-react';
    import { Link, useParams } from 'react-router-dom';

    const allTutorials = [
      {
        id: "first-automation",
        title: "Configurer votre Première Automatisation",
        description: "Apprenez pas à pas comment créer une automatisation simple mais puissante pour gagner du temps au quotidien. Exemple : un rappel automatique pour votre stand-up meeting quotidien.",
        icon: <Zap className="h-6 w-6 text-primary" />,
        duration: "5 min",
        category: "Automatisations",
        level: "Débutant",
        videoUrl: "https://www.example.com/video/first-automation" // Placeholder
      },
      {
        id: "connect-slack",
        title: "Intégrer Slack à Alya pour une Communication Fluide",
        description: "Connectez Slack à Alya pour recevoir des notifications importantes, envoyer des messages et exécuter des commandes Alya directement depuis vos canaux Slack.",
        icon: <SlidersHorizontal className="h-6 w-6 text-blue-500" />,
        duration: "3 min",
        category: "Intégrations",
        level: "Débutant",
        videoUrl: "https://www.example.com/video/connect-slack"
      },
      {
        id: "advanced-chat",
        title: "Maîtriser les Commandes de Chat Avancées",
        description: "Découvrez des astuces et des commandes spéciales (@mentions, #tags, /commandes) pour interagir plus efficacement et rapidement avec Alya dans l'interface de chat.",
        icon: <MessageSquare className="h-6 w-6 text-green-500" />,
        duration: "7 min",
        category: "Chat & Communication",
        level: "Intermédiaire",
        videoUrl: "https://www.example.com/video/advanced-chat"
      },
      {
        id: "web-monitoring",
        title: "Mettre en Place une Veille Informationnelle Efficace",
        description: "Utilisez la puissance d'Alya pour surveiller des sujets clés, des concurrents ou des tendances sur le web. Recevez des alertes et des résumés pertinents directement dans Alya.",
        icon: <Globe className="h-6 w-6 text-purple-500" />,
        duration: "6 min",
        category: "Recherche & Veille",
        level: "Intermédiaire",
        videoUrl: "https://www.example.com/video/web-monitoring"
      },
      {
        id: "team-collaboration",
        title: "Optimiser la Collaboration en Équipe avec Alya",
        description: "Découvrez comment partager des conversations, assigner des tâches générées par Alya et collaborer sur des projets en utilisant Alya comme hub central (certaines fonctionnalités de collaboration avancée sont en développement).",
        icon: <Users className="h-6 w-6 text-orange-500" />,
        duration: "4 min",
        category: "Collaboration",
        level: "Tous niveaux",
        videoUrl: "https://www.example.com/video/team-collaboration"
      },
      {
        id: "understanding-proactivity",
        title: "Comprendre les Suggestions Proactives d'Alya",
        description: "Alya apprend de vos habitudes pour vous offrir des suggestions personnalisées. Ce tutoriel explique comment cela fonctionne et comment en tirer le meilleur parti.",
        icon: <Lightbulb className="h-6 w-6 text-yellow-500" />,
        duration: "3 min",
        category: "Fonctionnalités IA",
        level: "Débutant",
        videoUrl: "https://www.example.com/video/proactivity"
      }
    ];
    
    const categories = ["Tous", "Automatisations", "Intégrations", "Chat & Communication", "Recherche & Veille", "Collaboration", "Fonctionnalités IA"];
    const levels = ["Tous", "Débutant", "Intermédiaire", "Avancé"];


    const TutorialsPage = () => {
      const { tutorialId } = useParams(); // To potentially display a specific tutorial
      const [searchTerm, setSearchTerm] = useState('');
      const [filteredTutorials, setFilteredTutorials] = useState(allTutorials);
      const [isSearching, setIsSearching] = useState(false);
      const [activeCategory, setActiveCategory] = useState("Tous");
      const [activeLevel, setActiveLevel] = useState("Tous");
      const searchInputRef = useRef(null);

      useEffect(() => {
        performFilter(searchTerm, activeCategory, activeLevel);
      }, [searchTerm, activeCategory, activeLevel]);

      // If a tutorialId is provided, you could scroll to it or highlight it
      // For now, this example focuses on filtering.

      const performFilter = (term, category, level) => {
        setIsSearching(true);
        setTimeout(() => {
            let results = allTutorials;
            if (category !== "Tous") {
                results = results.filter(tut => tut.category === category);
            }
            if (level !== "Tous") {
                 results = results.filter(tut => tut.level === level || tut.level === "Tous niveaux");
            }
            if (term.trim()) {
                const lowerTerm = term.toLowerCase();
                results = results.filter(
                    tut =>
                    tut.title.toLowerCase().includes(lowerTerm) ||
                    tut.description.toLowerCase().includes(lowerTerm) ||
                    tut.category.toLowerCase().includes(lowerTerm)
                );
            }
            setFilteredTutorials(results);
            setIsSearching(false);
        }, 250);
      };

      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };

      const handleCategoryChange = (category) => {
        setActiveCategory(category);
      };
      
      const handleLevelChange = (level) => {
        setActiveLevel(level);
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
      };

      const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } }
      };

      return (
        <motion.div 
          className="space-y-8 max-w-5xl mx-auto pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center pt-8">
            <PlaySquare className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">Tutoriels Alya</h1>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Apprenez à maîtriser toutes les facettes d'Alya avec nos guides interactifs et vidéo.
            </p>
          </motion.div>
          
          <motion.div 
            variants={itemVariants} 
            className="sticky top-[60px] md:top-[68px] z-30 bg-background/90 dark:bg-background/80 backdrop-blur-lg py-3.5 px-3 rounded-b-xl shadow-md border-b border-border space-y-3"
          >
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                 {isSearching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />}
                <Input 
                ref={searchInputRef}
                type="text" 
                placeholder="Rechercher un tutoriel (ex: Slack, automatisation...)" 
                className="w-full pl-10 pr-10 py-2.5 text-base rounded-lg border-2 bg-card focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                />
            </div>
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:justify-center">
                <div className="flex flex-wrap gap-2 items-center sm:justify-center">
                    <span className="text-xs font-medium self-center mr-1 text-muted-foreground hidden sm:inline">Catégories:</span>
                    {categories.map(cat => (
                        <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => handleCategoryChange(cat)}  className={`transition-all text-xs ${activeCategory === cat ? 'btn-primary-solid shadow-md' : 'border-border hover:bg-accent/80 dark:hover:bg-accent/50'}`}>{cat}</Button>
                    ))}
                </div>
                <div className="flex flex-wrap gap-2 items-center sm:justify-center">
                    <span className="text-xs font-medium self-center mr-1 text-muted-foreground hidden sm:inline">Niveaux:</span>
                    {levels.map(lvl => (
                        <Button key={lvl} variant={activeLevel === lvl ? "default" : "outline"} size="sm" onClick={() => handleLevelChange(lvl)}  className={`transition-all text-xs ${activeLevel === lvl ? 'btn-primary-solid shadow-md' : 'border-border hover:bg-accent/80 dark:hover:bg-accent/50'}`}>{lvl}</Button>
                    ))}
                </div>
            </div>
          </motion.div>


          {filteredTutorials.length > 0 ? (
            <motion.div 
                className="grid md:grid-cols-2 gap-x-5 gap-y-6 px-1 sm:px-2"
                variants={containerVariants}
            >
                {filteredTutorials.map((tutorial) => (
                <motion.div key={tutorial.id} variants={itemVariants}>
                    <Card className="h-full flex flex-col hover:shadow-xl hover:border-primary/50 dark:hover:border-primary/70 transition-all duration-200 ease-out transform hover:-translate-y-1 bg-card/80 backdrop-blur-sm border border-border/70 group">
                    <CardHeader className="pb-3 pt-4 px-4">
                        <div className="flex items-start space-x-3.5 mb-2">
                        <div className="p-2.5 bg-primary/10 rounded-lg flex-shrink-0">{tutorial.icon}</div>
                        <div className="flex-grow">
                            <CardTitle className="text-md lg:text-lg font-semibold leading-tight group-hover:text-primary transition-colors">{tutorial.title}</CardTitle>
                            <div className="mt-1.5 flex items-center gap-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground font-medium">{tutorial.level}</span>
                                <span className="text-xs text-muted-foreground">{tutorial.category}</span>
                            </div>
                        </div>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-grow pb-3 px-4">
                        <CardDescription className="text-sm leading-relaxed line-clamp-3">{tutorial.description}</CardDescription>
                    </CardContent>
                    <CardFooter className="pt-3 pb-4 px-4 border-t border-border/60 flex justify-between items-center">
                        <span className="text-xs font-medium text-muted-foreground">Durée: ~{tutorial.duration}</span>
                        <Button asChild variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10 h-auto p-1.5 rounded-md group-hover:underline">
                        {/* In a real app, link to /app/tutorials/${tutorial.id} for a dedicated page */}
                        <a href={tutorial.videoUrl} target="_blank" rel="noopener noreferrer">
                            Voir le tutoriel <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </a>
                        </Button>
                    </CardFooter>
                    </Card>
                </motion.div>
                ))}
            </motion.div>
            ) : (
                 <motion.div 
                    variants={itemVariants} 
                    className="text-center py-12 px-4 bg-card/60 rounded-xl border border-dashed border-border/70 shadow-sm"
                    initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }}
                >
                    <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">Aucun tutoriel trouvé</h3>
                    <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        Ajustez vos filtres ou essayez d'autres mots-clés.
                        <br/>De nouveaux tutoriels sont ajoutés régulièrement pour vous aider !
                    </p>
                     <Button variant="outline" size="sm" className="mt-6" onClick={() => { setSearchTerm(''); setActiveCategory('Tous'); setActiveLevel('Tous'); searchInputRef.current?.focus();}}>
                        Réinitialiser les filtres
                    </Button>
                </motion.div>
            )}
          
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-muted-foreground mb-2">Besoin d'une référence rapide ?</p>
             <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Button asChild variant="outline" className="border-primary/70 text-primary hover:bg-primary/10 hover:text-primary">
                    <Link to="/app/documentation"><BookOpen className="mr-2 h-4 w-4"/> Explorer la Documentation</Link>
                </Button>
                 <Button asChild variant="outline" className="border-foreground/30 text-foreground/80 hover:bg-accent/80">
                    <Link to="/app/faq"><HelpCircle className="mr-2 h-4 w-4"/> Consulter la FAQ</Link>
                </Button>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    export default TutorialsPage;