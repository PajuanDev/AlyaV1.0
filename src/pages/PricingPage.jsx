import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { CheckCircle, XCircle, Zap, Users, Briefcase, Building, Star } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Switch } from "@/components/ui/switch";
    import { Label } from "@/components/ui/label";

    const initialPlans = [
      {
        id: 'free',
        name: 'Gratuit',
        monthlyPrice: 0,
        annualPrice: 0,
        icon: <Zap className="h-8 w-8 text-primary mb-4" />,
        description: 'Découvrez les bases d\'Alya et commencez à automatiser.',
        features: [
          { text: 'Accès limité aux fonctionnalités IA', included: true },
          { text: '1 intégration active', included: true },
          { text: '5 automatisations', included: true },
          { text: 'Support communautaire', included: true },
          { text: 'Recherche web basique', included: true },
        ],
        cta: 'Commencer Gratuitement',
        link: '/auth?mode=signup',
        highlight: false,
      },
      {
        id: 'pro',
        name: 'Pro',
        monthlyPrice: 29,
        annualPrice: 24, 
        icon: <Star className="h-8 w-8 text-yellow-400 mb-4" />,
        description: 'Pour les pros et petites équipes cherchant à maximiser leur productivité.',
        features: [
          { text: 'Accès complet aux fonctionnalités IA', included: true },
          { text: '10 intégrations actives', included: true },
          { text: 'Automatisations illimitées', included: true },
          { text: 'Support prioritaire par email', included: true },
          { text: 'Recherche web avancée & veille', included: true },
          { text: 'Analyse de fichiers complète', included: true },
        ],
        cta: 'Choisir Pro',
        link: '/auth?mode=signup&plan=pro',
        highlight: true,
      },
      {
        id: 'team',
        name: 'Équipe',
        monthlyPrice: 79,
        annualPrice: 69,
        icon: <Users className="h-8 w-8 text-green-500 mb-4" />,
        description: 'Collaborez efficacement et optimisez les workflows de votre équipe.',
        features: [
          { text: 'Toutes les fonctionnalités Pro', included: true },
          { text: 'Jusqu\'à 5 utilisateurs inclus', included: true },
          { text: 'Espaces de travail partagés', included: true },
          { text: 'Gestion des rôles et permissions', included: true },
          { text: 'Support dédié équipe', included: true },
          { text: 'Historique étendu', included: true },
        ],
        cta: 'Choisir Équipe',
        link: '/auth?mode=signup&plan=team',
        highlight: false,
      },
      {
        id: 'enterprise',
        name: 'Entreprise',
        monthlyPrice: null, 
        annualPrice: null,
        icon: <Building className="h-8 w-8 text-blue-500 mb-4" />,
        description: 'Solutions sur mesure pour les grandes organisations avec des besoins spécifiques.',
        features: [
          { text: 'Toutes les fonctionnalités Équipe', included: true },
          { text: 'Utilisateurs et intégrations personnalisés', included: true },
          { text: 'Support dédié & SLA', included: true },
          { text: 'Onboarding personnalisé & formation', included: true },
          { text: 'Sécurité avancée & SSO', included: true },
          { text: 'Analytiques et rapports d\'utilisation', included: true },
        ],
        cta: 'Nous Contacter',
        link: '/contact',
        highlight: false,
      },
    ];

    const PricingPage = () => {
      const [isAnnual, setIsAnnual] = useState(false);

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

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10 dark:to-muted/5 text-foreground py-12 px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-7xl mx-auto"
          >
            <motion.div variants={itemVariants} className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 mb-4 pb-2">
                Des plans pour chaque ambition
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Choisissez l'abonnement Alya qui évolue avec vous. Simple, flexible et puissant.
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center justify-center space-x-3 mb-12">
              <Label htmlFor="billing-cycle" className={`text-base font-medium ${!isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Mensuel
              </Label>
              <Switch
                id="billing-cycle"
                checked={isAnnual}
                onCheckedChange={setIsAnnual}
                aria-label="Changer la période de facturation"
              />
              <Label htmlFor="billing-cycle" className={`text-base font-medium ${isAnnual ? 'text-primary' : 'text-muted-foreground'}`}>
                Annuel <span className="text-xs text-green-500 font-semibold">(Économisez ~15%)</span>
              </Label>
            </motion.div>

            <motion.div 
              variants={containerVariants}
              className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch"
            >
              {initialPlans.map((plan) => (
                <motion.div 
                  key={plan.id}
                  variants={itemVariants}
                  className={`flex ${plan.highlight ? 'lg:scale-105 z-10' : ''}`}
                >
                  <Card className={`flex flex-col w-full rounded-xl shadow-xl transition-all duration-300 ease-out ${plan.highlight ? 'border-2 border-primary ring-4 ring-primary/20 bg-card' : 'border-border/30 hover:shadow-primary/10 bg-card/80 backdrop-blur-sm'}`}>
                    <CardHeader className="text-center items-center pt-8 pb-4">
                      {plan.icon}
                      <CardTitle className="text-2xl lg:text-3xl font-bold">{plan.name}</CardTitle>
                      <div className="mt-2 h-16 flex flex-col justify-center items-center">
                        {plan.monthlyPrice === null ? (
                           <span className="text-3xl font-extrabold text-primary">Sur Devis</span>
                        ) : (
                          <>
                            <span className="text-4xl font-extrabold text-primary">
                              {isAnnual ? plan.annualPrice : plan.monthlyPrice}€
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {plan.monthlyPrice > 0 ? (isAnnual ? '/an (facturé annuellement)' : '/mois') : ''}
                            </span>
                          </>
                        )}
                      </div>
                      <CardDescription className="mt-2 text-sm h-12">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-2.5 px-6">
                      <ul className="space-y-2">
                        {plan.features.map((feature) => (
                          <li key={feature.text} className="flex items-start">
                            {feature.included ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
                            )}
                            <span className="text-xs text-foreground/80">{feature.text}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter className="p-6 mt-auto">
                      <Button asChild size="lg" className={`w-full text-base py-3 ${plan.highlight ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                        <Link to={plan.link + (isAnnual && plan.monthlyPrice > 0 ? '&billing=annual' : '')}>{plan.cta}</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center mt-16">
                <p className="text-muted-foreground">Vous avez des questions ou besoin d'un plan plus important ?</p>
                <Button variant="link" asChild className="text-primary text-lg hover:text-primary/80">
                    <Link to="/contact">Contactez notre équipe commerciale</Link>
                </Button>
            </motion.div>
             <motion.div variants={itemVariants} className="text-center mt-12">
                <Button variant="outline" asChild className="hover:bg-accent hover:text-accent-foreground">
                    <Link to="/">Retour à l'accueil</Link>
                </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    };

    export default PricingPage;