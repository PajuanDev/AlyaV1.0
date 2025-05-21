import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { LifeBuoy, BookOpen, MessageSquare as MessageSquareQuestion, Wrench, Mail, ArrowRight } from 'lucide-react';

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.1 }
      }
    };

    const itemVariants = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
    };

    const helpSections = [
      {
        title: "Premiers Pas avec Alya",
        description: "Apprenez les bases pour bien démarrer et configurer votre espace de travail.",
        icon: <BookOpen className="h-8 w-8 text-primary mb-3" />,
        link: "/app/tutorials",
        cta: "Voir les tutoriels"
      },
      {
        title: "Foire Aux Questions (FAQ)",
        description: "Trouvez des réponses rapides aux questions les plus courantes sur Alya.",
        icon: <MessageSquareQuestion className="h-8 w-8 text-primary mb-3" />,
        link: "/app/faq",
        cta: "Consulter la FAQ"
      },
      {
        title: "Guides d'Intégration",
        description: "Connectez Alya à vos outils préférés grâce à nos guides détaillés.",
        icon: <Wrench className="h-8 w-8 text-primary mb-3" />,
        link: "/app/integrations", 
        cta: "Explorer les intégrations"
      },
      {
        title: "Contacter le Support",
        description: "Besoin d'une aide personnalisée ? Notre équipe est là pour vous aider.",
        icon: <Mail className="h-8 w-8 text-primary mb-3" />,
        link: "/contact",
        cta: "Envoyer un message"
      }
    ];

    const DocumentationPage = () => {
      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 dark:to-muted/5 text-foreground py-10 px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <LifeBuoy className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 pb-2">
                Documentation & Centre d'Aide
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mt-3">
                Trouvez toutes les informations nécessaires pour maîtriser Alya et optimiser votre productivité.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              className="grid md:grid-cols-2 gap-6 lg:gap-8"
            >
              {helpSections.map((section) => (
                <motion.div key={section.title} variants={itemVariants}>
                  <Card className="h-full flex flex-col rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-300 bg-card/80 backdrop-blur-sm border-border/30">
                    <CardHeader className="items-center text-center pt-6">
                      {section.icon}
                      <CardTitle className="text-xl lg:text-2xl font-semibold">{section.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow text-center">
                      <CardDescription className="text-sm text-muted-foreground leading-relaxed">
                        {section.description}
                      </CardDescription>
                    </CardContent>
                    <div className="p-6 mt-auto">
                      <Button asChild className="w-full btn-primary-solid group">
                        <Link to={section.link}>
                          {section.cta}
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={itemVariants} className="text-center mt-16">
              <p className="text-muted-foreground mb-2">Vous ne trouvez pas ce que vous cherchez ?</p>
              <Button variant="outline" asChild className="hover:bg-accent hover:text-accent-foreground">
                <Link to="/contact">Discuter avec un expert</Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    };

    export default DocumentationPage;