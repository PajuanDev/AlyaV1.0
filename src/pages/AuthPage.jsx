import React, { useState, useEffect } from 'react';
    import { useNavigate, useLocation } from 'react-router-dom';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { motion } from 'framer-motion';
    import { LogIn, UserPlus, Mail, KeyRound, Building, Loader2 } from 'lucide-react';
    import useAuth from '@/hooks/useAuth';
    import { toast } from '@/components/ui/use-toast';

    const AuthPage = () => {
      const navigate = useNavigate();
      const location = useLocation();
      const { login, signup, user } = useAuth();
      const [isLoginMode, setIsLoginMode] = useState(true);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [confirmPassword, setConfirmPassword] = useState('');
      const [name, setName] = useState(''); 
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get('action') === 'signup') {
          setIsLoginMode(false);
        }
        if (user) {
          navigate(user.onboardingCompleted ? '/app/dashboard' : '/onboarding/welcome');
        }
      }, [user, navigate, location.search]);

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (isLoginMode) {
          try {
            await login(email, password);
            toast({ title: "Connexion réussie!", description: "Bienvenue à nouveau." });
            // Redirection handled by useEffect
          } catch (error) {
            toast({ title: "Erreur de connexion", description: error.message || "Veuillez vérifier vos identifiants.", variant: "destructive" });
            setIsLoading(false);
          }
        } else {
          if (password !== confirmPassword) {
            toast({ title: "Erreur d'inscription", description: "Les mots de passe ne correspondent pas.", variant: "destructive" });
            setIsLoading(false);
            return;
          }
          if (!name.trim()) {
             toast({ title: "Erreur d'inscription", description: "Le nom est requis.", variant: "destructive" });
             setIsLoading(false);
             return;
          }
          try {
            await signup(email, password, name);
            toast({ title: "Inscription réussie!", description: "Bienvenue! Redirection vers l'onboarding..." });
            // Redirection handled by useEffect, it will now go to /onboarding/welcome
          } catch (error) {
            toast({ title: "Erreur d'inscription", description: error.message || "Impossible de créer le compte.", variant: "destructive" });
            setIsLoading(false);
          }
        }
        // setIsLoading(false) is handled in useEffect after redirection or in catch block
      };

      const toggleMode = () => {
        setIsLoginMode(!isLoginMode);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        setName('');
      };
      
      const cardVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: "backOut" } }
      };
      
      const inputVariants = {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 150 } }
      };

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
          <motion.div variants={cardVariants} initial="initial" animate="animate">
            <Card className="w-full max-w-md shadow-2xl border-border/30">
              <CardHeader className="text-center">
                <motion.img 
                    src="/logo.svg" 
                    alt="Alya Logo" 
                    className="w-20 h-20 mx-auto mb-4"
                    initial={{ rotate: -180, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                />
                <CardTitle className="text-3xl font-bold">{isLoginMode ? 'Connexion à Alya' : 'Créer un Compte Alya'}</CardTitle>
                <CardDescription>
                  {isLoginMode ? 'Accédez à votre copilote IA intelligent.' : 'Rejoignez Alya et boostez votre productivité.'}
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-5">
                  {!isLoginMode && (
                    <motion.div className="space-y-1.5" variants={inputVariants}>
                      <Label htmlFor="name" className="flex items-center"><UserPlus className="mr-2 h-4 w-4 text-muted-foreground" /> Nom complet</Label>
                      <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom et prénom" required={!isLoginMode} />
                    </motion.div>
                  )}
                  <motion.div className="space-y-1.5" variants={inputVariants}>
                    <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="vous@exemple.com" required />
                  </motion.div>
                  <motion.div className="space-y-1.5" variants={inputVariants}>
                    <Label htmlFor="password" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Mot de passe</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                  </motion.div>
                  {!isLoginMode && (
                    <motion.div className="space-y-1.5" variants={inputVariants}>
                      <Label htmlFor="confirmPassword" className="flex items-center"><KeyRound className="mr-2 h-4 w-4 text-muted-foreground" /> Confirmer le mot de passe</Label>
                      <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" required={!isLoginMode} />
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <Button type="submit" className="w-full btn-primary-solid" disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        isLoginMode ? <LogIn className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    {isLoginMode ? 'Se Connecter' : 'Créer le Compte'}
                  </Button>
                  <Button type="button" variant="link" onClick={toggleMode} className="text-sm text-muted-foreground">
                    {isLoginMode ? 'Pas encore de compte ? S\'inscrire' : 'Déjà un compte ? Se connecter'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </motion.div>
        </div>
      );
    };

    export default AuthPage;