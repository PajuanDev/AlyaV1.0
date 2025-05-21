import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Sparkles, Zap, ArrowRight } from 'lucide-react';
    import { useAuth } from '@/auth/AuthContext';

    const PricingTeaserBox = ({ isCollapsed }) => {
      const navigate = useNavigate();
      const { user } = useAuth();

      const userPlan = user?.plan || 'Gratuit';
      let planFeatures = ['Accès limité IA', '1 intégration'];
      let planIcon = <Zap className="h-5 w-5 text-primary" />;

      if (userPlan === 'Pro') {
        planFeatures = ['Accès complet IA', '10 intégrations', 'Automatisations illimitées'];
        planIcon = <Sparkles className="h-5 w-5 text-yellow-500" />;
      } else if (userPlan === 'Equipe') {
         planFeatures = ['Fonctionnalités Pro', 'Collaboration', 'Support prioritaire'];
         planIcon = <Sparkles className="h-5 w-5 text-green-500" />;
      } else if (userPlan === 'Entreprise') {
        planFeatures = ['Tout Pro', 'Support dédié', 'SLA'];
        planIcon = <Sparkles className="h-5 w-5 text-blue-500" />;
      }


      const handleClick = () => {
        navigate('/pricing');
      };

      if (isCollapsed) {
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mt-2"
          >
            <Button variant="ghost" size="icon" onClick={handleClick} className="w-10 h-10 rounded-lg bg-gradient-to-tr from-primary/10 to-primary/20 hover:from-primary/20 hover:to-primary/30 text-primary">
              {planIcon}
            </Button>
          </motion.div>
        );
      }

      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="mt-2"
        >
          <Card 
            onClick={handleClick} 
            className="bg-gradient-to-br from-muted/30 to-muted/50 dark:from-muted/20 dark:to-muted/40 hover:shadow-lg hover:border-primary/30 transition-all duration-300 cursor-pointer border border-border/50 rounded-xl overflow-hidden"
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  {planIcon}
                  <CardTitle className="text-sm font-semibold text-foreground">Plan {userPlan}</CardTitle>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
              <ul className="space-y-0.5">
                {planFeatures.slice(0, 2).map((feature, index) => (
                  <li key={index} className="flex items-center text-xs text-muted-foreground">
                    <Zap size={12} className="mr-1.5 text-primary/70 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button variant="link" size="sm" className="p-0 h-auto text-xs mt-1.5 text-primary hover:text-primary/80">
                Voir tous les plans
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default PricingTeaserBox;