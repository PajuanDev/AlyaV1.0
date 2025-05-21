import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import {
  LogIn,
  UserPlus,
  Mail,
  KeyRound,
  Loader2,
} from 'lucide-react';
import { useAuth } from '@/auth/AuthContext';              // ← nouveau hook
import { toast } from '@/components/ui/use-toast';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, user } = useAuth();             // ← register remplace signup
  const [isLoginMode, setIsLoginMode] = useState(true);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  /* --------------------------------------------------------------------- */
  /* Redirection si déjà connecté                                          */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('action') === 'signup') setIsLoginMode(false);

    if (user) {
      navigate('/app/dashboard');
      // ou: user.onboardingCompleted ? '/app/dashboard' : '/onboarding/welcome'
    }
  }, [user, navigate, location.search]);

  /* --------------------------------------------------------------------- */
  /* Soumission formulaire                                                 */
  /* --------------------------------------------------------------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (isLoginMode) {
      /* ---------- Connexion ---------- */
      try {
        await login(email, password);
        toast({ title: 'Connexion réussie', description: 'Bienvenue !' });
      } catch (err) {
        toast({
          title: 'Erreur de connexion',
          description:
            err.response?.data?.message || 'Identifiants invalides.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    } else {
      /* ---------- Inscription ---------- */
      if (password !== confirmPassword) {
        toast({
          title: "Les mots de passe ne correspondent pas",
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      if (!fullName.trim()) {
        toast({
          title: 'Le nom complet est requis',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      try {
        await register(email, password, fullName);
        toast({
          title: 'Inscription réussie',
          description: 'Bienvenue sur Alya !',
        });
      } catch (err) {
        toast({
          title: "Erreur d'inscription",
          description:
            err.response?.data?.message || 'Impossible de créer le compte.',
          variant: 'destructive',
        });
        setIsLoading(false);
      }
    }
  };

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
  };

  /* --------------------------------------------------------------------- */
  /* Animations Framer Motion                                              */
  /* --------------------------------------------------------------------- */
  const cardVariants = {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'backOut' } },
  };

  const inputVariants = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 150 } },
  };

  /* --------------------------------------------------------------------- */
  /* Render                                                                */
  /* --------------------------------------------------------------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <motion.div variants={cardVariants} initial="initial" animate="animate">
        <Card className="w-full max-w-md shadow-2xl border-border/30">
          {/* ---------- Header ---------- */}
          <CardHeader className="text-center">
            <motion.img
              src="/logo.svg"
              alt="Alya Logo"
              className="w-20 h-20 mx-auto mb-4"
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 100, delay: 0.2 }}
            />
            <CardTitle className="text-3xl font-bold">
              {isLoginMode ? 'Connexion à Alya' : 'Créer un Compte Alya'}
            </CardTitle>
            <CardDescription>
              {isLoginMode
                ? 'Accédez à votre copilote IA intelligent.'
                : 'Rejoignez Alya et boostez votre productivité.'}
            </CardDescription>
          </CardHeader>

          {/* ---------- Formulaire ---------- */}
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-5">
              {!isLoginMode && (
                <motion.div className="space-y-1.5" variants={inputVariants}>
                  <Label htmlFor="fullName" className="flex items-center">
                    <UserPlus className="mr-2 h-4 w-4 text-muted-foreground" />
                    Nom complet
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Votre nom et prénom"
                    required={!isLoginMode}
                  />
                </motion.div>
              )}

              <motion.div className="space-y-1.5" variants={inputVariants}>
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" /> Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@exemple.com"
                  required
                />
              </motion.div>

              <motion.div className="space-y-1.5" variants={inputVariants}>
                <Label htmlFor="password" className="flex items-center">
                  <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
              </motion.div>

              {!isLoginMode && (
                <motion.div className="space-y-1.5" variants={inputVariants}>
                  <Label
                    htmlFor="confirmPassword"
                    className="flex items-center"
                  >
                    <KeyRound className="mr-2 h-4 w-4 text-muted-foreground" />
                    Confirmer le mot de passe
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required={!isLoginMode}
                  />
                </motion.div>
              )}
            </CardContent>

            {/* ---------- Footer ---------- */}
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full btn-primary-solid"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : isLoginMode ? (
                  <LogIn className="mr-2 h-4 w-4" />
                ) : (
                  <UserPlus className="mr-2 h-4 w-4" />
                )}
                {isLoginMode ? 'Se Connecter' : 'Créer le Compte'}
              </Button>

              <Button
                type="button"
                variant="link"
                onClick={toggleMode}
                className="text-sm text-muted-foreground"
              >
                {isLoginMode
                  ? "Pas encore de compte ? S'inscrire"
                  : 'Déjà un compte ? Se connecter'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default AuthPage;
