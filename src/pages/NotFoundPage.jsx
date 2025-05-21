import React from 'react';
    import { Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { AlertTriangle } from 'lucide-react';
    import { motion } from 'framer-motion';

    const NotFoundPage = () => {
      return (
        <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center text-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.5,
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            <AlertTriangle className="h-24 w-24 text-destructive mx-auto mb-6" />
            <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-3xl font-semibold text-foreground mb-3">Page non trouvée</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
              Oups ! Il semble que la page que vous cherchez n'existe pas ou a été déplacée.
            </p>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/app/dashboard">Retour au Tableau de Bord</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/">Page d'Accueil</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      );
    };

    export default NotFoundPage;