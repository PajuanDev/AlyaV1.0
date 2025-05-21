import React, { useState, useEffect } from 'react';
    import { useNavigate, useParams, Link } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion, AnimatePresence } from 'framer-motion';
    import { toast } from '@/components/ui/use-toast';
    import { Check, ChevronLeft, ChevronRight, Loader2, User, Briefcase, Users, Sparkles, SkipForward, Smile, Building, Users2, Brain } from 'lucide-react';
    import { useAuth } from '@/auth/AuthContext';
    import WelcomeStep from './steps/WelcomeStep';
    import CompanyStep from './steps/CompanyStep';
    import TeamStep from './steps/TeamStep';
    import PreferencesStep from './steps/PreferencesStep';
    import FinishStep from './steps/FinishStep';

    const stepsConfig = [
      { id: 'welcome', title: 'Bienvenue chez Alya !', icon: <Smile className="h-5 w-5" />, component: WelcomeStep, isSkippable: false, isMandatory: true, description: "Préparez-vous à découvrir votre nouvel assistant IA." },
      { id: 'company', title: 'Votre Organisation', icon: <Building className="h-5 w-5" />, component: CompanyStep, isSkippable: true, isMandatory: false, description: "Aidez Alya à comprendre votre contexte professionnel." },
      { id: 'team', title: 'Votre Équipe', icon: <Users2 className="h-5 w-5" />, component: TeamStep, isSkippable: true, isMandatory: false, description: "Décrivez votre rôle et vos collaborations." },
      { id: 'preferences', title: 'Préférences IA', icon: <Brain className="h-5 w-5" />, component: PreferencesStep, isSkippable: true, isMandatory: false, description: "Personnalisez le comportement d'Alya." },
      { id: 'finish', title: 'Configuration Terminée', icon: <Check className="h-5 w-5" />, component: FinishStep, isSkippable: false, isMandatory: true, description: "Votre espace Alya est prêt !" },
    ];

    const OnboardingStepPage = () => {
      const { stepId } = useParams();
      const navigate = useNavigate();
      const { user, updateUserProfile, updateOnboardingData, onboardingData, loading: authLoading } = useAuth();
      
      const [currentStepIndex, setCurrentStepIndex] = useState(0);
      const [isLoading, setIsLoading] = useState(false); // For step transition / final submit loading
      const [localFormData, setLocalFormData] = useState({});

      useEffect(() => {
        const stepIndex = stepsConfig.findIndex(s => s.id === stepId);
        if (stepIndex !== -1) {
          setCurrentStepIndex(stepIndex);
          // Initialize local form data from AuthContext if available for this step
          setLocalFormData(onboardingData?.[stepsConfig[stepIndex].id] || {});
        } else {
          // Invalid stepId, redirect to the first step
          navigate('/onboarding/welcome', { replace: true }); 
        }
      }, [stepId, onboardingData, navigate]);
      
      // Update localFormData if onboardingData changes (e.g., from another tab, though unlikely for localStorage)
      useEffect(() => {
        if (stepsConfig[currentStepIndex] && onboardingData) {
            const currentStepKey = stepsConfig[currentStepIndex].id;
            // Only update if the data in context is different to prevent overwriting local changes
            if (JSON.stringify(onboardingData[currentStepKey]) !== JSON.stringify(localFormData)) {
                 setLocalFormData(onboardingData[currentStepKey] || {});
            }
        }
      }, [currentStepIndex, onboardingData]);


      const handleDataChange = (stepData) => {
        setLocalFormData(prevData => ({ ...prevData, ...stepData }));
      };
      
      // Persist current step's local data to AuthContext before navigating
      const persistCurrentStepData = () => {
          if (stepsConfig[currentStepIndex] && typeof updateOnboardingData === 'function') {
            const currentStepKey = stepsConfig[currentStepIndex].id;
            updateOnboardingData({ [currentStepKey]: localFormData });
          } else if (typeof updateOnboardingData !== 'function') {
            console.error("updateOnboardingData is not a function in persistCurrentStepData");
            toast({ title: "Erreur interne", description: "Impossible de sauvegarder les données de l'étape.", variant: "destructive" });
          }
      };


      const navigateToStep = (index) => {
        persistCurrentStepData();
        if (index >= 0 && index < stepsConfig.length) {
          navigate(`/onboarding/${stepsConfig[index].id}`);
        }
      };

      const nextStep = () => {
        if (currentStepIndex < stepsConfig.length - 1) {
          navigateToStep(currentStepIndex + 1);
        }
      };

      const prevStep = () => {
        if (currentStepIndex > 0) {
          navigateToStep(currentStepIndex - 1);
        }
      };
      
      const skipStep = () => {
        if (stepsConfig[currentStepIndex]?.isSkippable) {
          toast({ title: `Étape "${stepsConfig[currentStepIndex].title}" passée.`, duration: 2000});
          nextStep(); // Persists empty/current data for the skipped step and moves on
        }
      };

      const handleFinalSubmit = async () => {
        setIsLoading(true);
        persistCurrentStepData(); // Persist data of the 'finish' step if any (though unlikely)
        
        try {
          // The final onboardingData should now be up-to-date in AuthContext
          // We can pass it directly or let updateUserProfile fetch it from context if designed that way
          await updateUserProfile({ onboardingCompleted: true, preferences: onboardingData, name: onboardingData?.welcome?.name || user.name }); 
          toast({ title: "Onboarding Terminé !", description: "Bienvenue ! Votre environnement Alya est prêt à l'emploi.", duration: 4000 });
          navigate('/app/dashboard');
        } catch (error) {
          toast({ title: "Erreur de finalisation", description: error.message || "Impossible de finaliser l'onboarding.", variant: "destructive" });
        } finally {
          setIsLoading(false);
        }
      };
      
      const CurrentStepComponent = stepsConfig[currentStepIndex]?.component;
      const currentStepConfig = stepsConfig[currentStepIndex];

      if (!currentStepConfig || authLoading && !user) { // Show loader if auth is loading and no user yet, or if config is missing
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Préparation de votre embarquement...</p>
            </div>
        );
      }

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/10 to-background p-4 overflow-hidden">
          <motion.div
            key={currentStepIndex} // Ensure re-render on step change for main container animation
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="w-full max-w-xl md:max-w-2xl"
          >
            <Card className="shadow-2xl overflow-hidden border-border/70">
              <CardHeader className="bg-card/60 border-b border-border/60 p-5">
                <div className="flex items-center justify-center space-x-1 sm:space-x-1.5 mb-5">
                  {stepsConfig.map((step, index) => (
                    <React.Fragment key={step.id}>
                      <motion.div
                        initial={false}
                        animate={{ 
                            scale: currentStepIndex === index ? 1.1 : 1, 
                            opacity: currentStepIndex >= index ? 1 : 0.5 
                        }}
                        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                        className={`p-2.5 rounded-full cursor-pointer transition-colors duration-200 ${currentStepIndex === index ? 'bg-primary text-primary-foreground shadow-lg' : 'bg-muted hover:bg-muted/80'}`}
                        onClick={() => index < currentStepIndex ? navigateToStep(index) : null} // Allow navigation to previous steps
                        title={step.title}
                      >
                        {step.icon}
                      </motion.div>
                      {index < stepsConfig.length - 1 && (
                        <div className={`h-1 flex-1 bg-muted rounded-full overflow-hidden transition-all duration-300 ${currentStepIndex > index ? 'opacity-100' : 'opacity-50'}`}>
                           <motion.div 
                            className="h-1 bg-primary rounded-full"
                            initial={{ width: "0%" }}
                            animate={{ width: currentStepIndex > index ? '100%' : (currentStepIndex === index ? '50%' : '0%')}}
                            transition={{ duration: 0.5, ease: "circOut" }}
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
                <CardTitle className="text-center text-2xl sm:text-3xl font-bold tracking-tight text-foreground">{currentStepConfig.title}</CardTitle>
                <CardDescription className="text-center text-muted-foreground mt-1">
                  {currentStepConfig.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="min-h-[290px] py-6 px-4 sm:px-6 flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepConfig.id} // Key by step ID for transition
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="w-full"
                  >
                    {CurrentStepComponent && <CurrentStepComponent user={user} data={localFormData} onChange={handleDataChange} />}
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-2 border-t border-border/60 pt-5 pb-5 px-4 sm:px-6 bg-card/60">
                <Button variant="outline" onClick={prevStep} disabled={currentStepIndex === 0 || isLoading} className="border-border hover:bg-accent/80 dark:hover:bg-accent/50">
                  <ChevronLeft className="mr-1.5 h-4 w-4" /> Précédent
                </Button>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 items-center">
                    {currentStepConfig.isSkippable && currentStepConfig.id !== 'finish' && (
                        <Button variant="ghost" onClick={skipStep} disabled={isLoading} className="text-muted-foreground hover:text-primary hover:bg-accent/50">
                            Passer cette étape <SkipForward className="ml-1.5 h-4 w-4" />
                        </Button>
                    )}
                    {currentStepConfig.id !== 'finish' ? (
                    <Button onClick={nextStep} disabled={isLoading} className="btn-primary-solid w-full sm:w-auto shadow-md">
                        Suivant <ChevronRight className="ml-1.5 h-4 w-4" />
                    </Button>
                    ) : (
                    <Button onClick={handleFinalSubmit} disabled={isLoading || authLoading} className="btn-primary-solid w-full sm:w-auto shadow-lg">
                        {(isLoading || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Terminer et Lancer Alya
                    </Button>
                    )}
                </div>
              </CardFooter>
            </Card>
             <p className="mt-6 text-center text-sm">
                <Link to="/app/dashboard" className="text-muted-foreground hover:text-primary underline transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded">
                    Passer l'onboarding et aller au tableau de bord
                </Link>
            </p>
          </motion.div>
        </div>
      );
    };

    export default OnboardingStepPage;