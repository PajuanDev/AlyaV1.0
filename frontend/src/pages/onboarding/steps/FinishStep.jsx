import React from 'react';
    import { motion } from 'framer-motion';
    import { CheckCircle, Rocket, Award } from 'lucide-react';

    const FinishStep = ({ user }) => {
      return (
        <motion.div 
          className="text-center space-y-5 py-4"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: 'spring', stiffness: 150, damping: 15, delay: 0.1 }}
        >
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring', stiffness: 180, damping: 10 }}
          >
            <Award className="h-20 w-20 md:h-24 md:w-24 text-primary mx-auto opacity-90" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Félicitations, {user?.name || 'Utilisateur'} !</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Votre configuration personnalisée est terminée. Alya est maintenant prête à transformer votre productivité.
          </p>
          <motion.div
            className="flex justify-center items-center space-x-2 text-green-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <CheckCircle className="h-6 w-6" />
            <span className="font-medium">Votre espace de travail est optimisé !</span>
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <Rocket className="h-10 w-10 md:h-12 md:w-12 text-primary/80 mx-auto mt-3" />
          </motion.div>
          <p className="text-sm text-muted-foreground pt-1">
            Cliquez sur "Terminer et Lancer Alya" pour accéder à votre tableau de bord intelligent.
          </p>
        </motion.div>
      );
    };

    export default FinishStep;