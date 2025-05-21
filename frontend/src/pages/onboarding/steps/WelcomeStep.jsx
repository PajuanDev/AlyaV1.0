import React, { useEffect } from 'react';
    import { motion } from 'framer-motion';
    import { Sparkles, HeartHandshake as Handshake } from 'lucide-react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';

    const WelcomeStep = ({ user, data, onChange }) => {
      // Initialize local name from user or persisted onboarding data
      const initialName = data?.name || user?.name || '';
      
      useEffect(() => {
        // Ensure that if data.name is empty but user.name exists, it's prefilled.
        if (!data?.name && user?.name) {
          onChange({ ...data, name: user.name });
        }
      }, [user, data, onChange]);


      const handleNameChange = (e) => {
        onChange({ ...data, name: e.target.value });
      };
      
      const displayName = data?.name || user?.name || 'Cher Utilisateur';

      return (
        <motion.div 
          className="text-center space-y-5 py-2"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "circOut" }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 150 }}
          >
            <Handshake className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto opacity-90" />
          </motion.div>
          
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Bonjour, {displayName} !</h2>
          
          <p className="text-muted-foreground text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Nous sommes ravis de vous accueillir à bord d'Alya.
            Quelques étapes rapides pour personnaliser votre assistant IA et optimiser votre productivité.
          </p>

           <motion.div 
                className="max-w-sm mx-auto text-left pt-2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
            >
                <Label htmlFor="onboardingName" className="text-sm font-medium text-muted-foreground">Confirmez ou modifiez votre nom d'affichage :</Label>
                <Input 
                    id="onboardingName" 
                    name="name" 
                    value={data?.name || ''} 
                    onChange={handleNameChange} 
                    placeholder="Votre nom complet" 
                    className="mt-1.5 text-sm"
                />
            </motion.div>

          <motion.div 
            className="flex justify-center items-center space-x-2 text-primary pt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Sparkles className="h-5 w-5" />
            <span className="font-medium">Commençons votre personnalisation !</span>
          </motion.div>
        </motion.div>
      );
    };

    export default WelcomeStep;