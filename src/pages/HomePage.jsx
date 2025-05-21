import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { motion } from 'framer-motion';
    import { BrainCircuit, Zap, MessageSquare, Globe, UploadCloud, Settings2, Sparkles } from 'lucide-react';
    import AlyaLogo from '@/components/AlyaLogo';

    const AnimatedTitle = ({ text, className }) => {
      const words = text.split(" ");
      const container = {
        hidden: { opacity: 0 },
        visible: (i = 1) => ({
          opacity: 1,
          transition: { staggerChildren: 0.12, delayChildren: i * 0.04 },
        }),
      };
      const child = {
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
          },
        },
        hidden: {
          opacity: 0,
          y: 20,
          transition: {
            type: "spring",
            damping: 12,
            stiffness: 100,
          },
        },
      };

      return (
        <motion.h1
          className={`flex overflow-hidden ${className}`}
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {words.map((word, index) => (
            <motion.span
              key={index}
              variants={child}
              className="mr-[0.25em] last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>
      );
    };


    const HomePage = () => {
      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.2 }
        }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 12 } }
      };
      
      const floatingIconVariants = (delay = 0, distance = 8) => ({
        initial: { y: 0, opacity: 0 },
        animate: {
          y: [`-${distance}px`, `${distance}px`, `-${distance}px`],
          opacity: [0.05, 0.15, 0.05],
          transition: {
            duration: 4 + delay * 0.5,
            ease: "easeInOut",
            repeat: Infinity,
            delay: delay * 0.5,
            opacity: { duration: 2, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5}
          }
        }
      });


      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background text-foreground flex flex-col items-center justify-center p-6 overflow-hidden relative">
          
          <motion.div className="absolute top-[15%] left-[10%] text-primary" variants={floatingIconVariants(0.5, 10)} initial="initial" animate="animate">
            <BrainCircuit size={70} />
          </motion.div>
          <motion.div className="absolute bottom-[15%] right-[10%] text-accent" variants={floatingIconVariants(1, 12)} initial="initial" animate="animate">
            <Zap size={60} />
          </motion.div>
           <motion.div className="absolute top-[25%] right-[20%] text-primary/70" variants={floatingIconVariants(1.5, 8)} initial="initial" animate="animate">
            <Globe size={50} />
          </motion.div>
           <motion.div className="absolute bottom-[25%] left-[20%] text-accent/70" variants={floatingIconVariants(0.8, 9)} initial="initial" animate="animate">
            <MessageSquare size={55} />
          </motion.div>


          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 z-10 flex flex-col items-center"
          >
            <motion.div 
              variants={itemVariants}
              className="inline-block p-0 mb-8" 
            >
              <AlyaLogo className="h-32 w-32 md:h-40 md:w-40" animated={true} iconOnly={true} />
            </motion.div>
            
            <AnimatedTitle text="Alya AI" className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-5 text-primary" />
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8"
            >
              Votre copilote IA intelligent, conçu pour amplifier la productivité et catalyser l'innovation au sein des équipes modernes et des startups.
            </motion.p>
             <motion.div variants={itemVariants}>
                <Button asChild size="lg" className="px-10 py-6 text-lg btn-primary-gradient shadow-lg hover:shadow-primary/30 transform hover:scale-105">
                  <Link to="/auth?action=signup"><Sparkles className="mr-2 h-5 w-5" /> Découvrir Alya Gratuitement</Link>
                </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mb-12 z-10"
          >
            <FeatureCard
              icon={<BrainCircuit className="h-8 w-8 text-primary" />}
              title="IA Contextuelle & Proactive"
              description="Alya apprend, s'adapte et anticipe vos besoins pour des suggestions et actions sur-mesure."
              variants={itemVariants}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-primary" />}
              title="Automatisation Intelligente"
              description="Déléguez vos tâches répétitives. Alya identifie et propose des automatisations pertinentes."
              variants={itemVariants}
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-primary" />}
              title="Recherche Web & Veille"
              description="Accès direct à l'information du web, résumés pertinents et alertes en temps réel."
              variants={itemVariants}
            />
             <FeatureCard
              icon={<MessageSquare className="h-8 w-8 text-primary" />}
              title="Communication Fluide"
              description="Dialogue naturel, support vocal, et gestion avancée de vos conversations."
              variants={itemVariants}
            />
            <FeatureCard
              icon={<UploadCloud className="h-8 w-8 text-primary" />}
              title="Gestion de Fichiers Intégrée"
              description="Importez, analysez et exploitez le contenu de vos documents directement avec Alya."
              variants={itemVariants}
            />
            <FeatureCard
              icon={<Settings2 className="h-8 w-8 text-primary" />}
              title="Intégrations Tierces"
              description="Connectez Alya à vos outils existants (Slack, Gmail, Trello, etc.) pour un workflow unifié."
              variants={itemVariants}
            />
          </motion.div>
          
          <motion.div 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col sm:flex-row items-center gap-4 z-10 mb-16"
          >
            <Button asChild variant="outline" size="lg" className="px-8 py-6 text-md border-primary/50 text-primary hover:bg-primary/10 transform hover:scale-105">
              <Link to="/pricing">Voir les plans d'abonnement</Link>
            </Button>
             <Button asChild variant="link" size="lg" className="text-md text-muted-foreground hover:text-primary transform hover:scale-105">
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </motion.div>
          
          <motion.footer 
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            className="text-sm text-muted-foreground z-10 mt-auto pb-6 pt-4"
          >
            © {new Date().getFullYear()} Alya AI by Hostinger Horizons. Tous droits réservés.
          </motion.footer>
        </div>
      );
    };

    const FeatureCard = ({ icon, title, description, variants }) => (
      <motion.div 
        variants={variants}
        className="bg-card/80 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-primary/10 transition-all duration-300 ease-out border border-border/30 transform hover:-translate-y-1.5"
        whileHover={{ scale: 1.03 }}
      >
        <div className="flex justify-center items-center mb-4 w-14 h-14 bg-primary/10 text-primary rounded-full mx-auto">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-1.5 text-center">{title}</h3>
        <p className="text-xs text-muted-foreground text-center leading-relaxed">{description}</p>
      </motion.div>
    );

    export default HomePage;