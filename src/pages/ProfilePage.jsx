import React, { useState, useEffect, useRef } from 'react';
    import useAuth from '@/hooks/useAuth';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { toast } from '@/components/ui/use-toast';
    import { motion } from 'framer-motion';
    import { User, Mail, Key, Edit3, Loader2, Camera, Save, X, ShieldCheck, Briefcase, Activity, Link as LinkIcon } from 'lucide-react';
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
    import { useNavigate, Link } from 'react-router-dom';

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1, duration: 0.4 } }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };
    
    const ProfileInfoField = ({ icon: Icon, label, value, isEditing, onChange, id, placeholder, type = "text", required = false, disabled = false }) => (
        <div className="space-y-1.5">
            <Label htmlFor={id} className="text-sm font-medium flex items-center text-muted-foreground">
                <Icon className="mr-2 h-4 w-4" /> {label}
            </Label>
            {isEditing ? (
                <Input id={id} value={value} onChange={onChange} placeholder={placeholder} type={type} required={required} className="bg-background border-border focus:border-primary" disabled={disabled} />
            ) : (
                <Input id={`${id}-display`} value={value || "-"} disabled className="bg-muted/30 border-transparent cursor-default" />
            )}
        </div>
    );

    const ProfileSection = ({ user, updateUserProfile, authLoading }) => {
        const [name, setName] = useState('');
        const [email, setEmail] = useState('');
        const [avatarUrl, setAvatarUrl] = useState('');
        const [tempAvatarUrl, setTempAvatarUrl] = useState('');
        const [role, setRole] = useState('');
        const [isEditingProfile, setIsEditingProfile] = useState(false);
        const fileInputRef = useRef(null);

        useEffect(() => {
            if (user) {
              setName(user.name || '');
              setEmail(user.email || '');
              const currentAvatar = user.avatarUrl || `https://avatar.vercel.sh/${user.email || 'user'}.png?size=128&background=1a1a1a&text=fff`;
              setAvatarUrl(currentAvatar);
              setTempAvatarUrl(currentAvatar);
              setRole(user.preferences?.role || '');
            }
        }, [user]);
        
        const handleProfileUpdate = async (e) => {
            e.preventDefault();
            try {
              await updateUserProfile({ name, avatarUrl: tempAvatarUrl, preferences: { ...user.preferences, role } });
              setAvatarUrl(tempAvatarUrl);
              toast({ title: "Profil mis à jour", description: "Vos informations ont été sauvegardées avec succès." });
              setIsEditingProfile(false);
            } catch (error) {
              toast({ title: "Erreur de mise à jour", description: error.message || "Impossible de sauvegarder les modifications.", variant: "destructive" });
            }
        };
        
        const handleAvatarUpload = (event) => {
            const file = event.target.files[0];
            if (file) {
              // Simulate upload and get URL. In a real app, upload to a service.
              const reader = new FileReader();
              reader.onloadend = () => {
                setTempAvatarUrl(reader.result);
              };
              reader.readAsDataURL(file);
              toast({title: "Avatar sélectionné", description: "N'oubliez pas de sauvegarder les changements."});
            }
        };

        const cancelEditProfile = () => {
            setIsEditingProfile(false);
            if(user) {
                setName(user.name || '');
                const currentAvatar = user.avatarUrl || `https://avatar.vercel.sh/${user.email || 'user'}.png?size=128&background=1a1a1a&text=fff`;
                setTempAvatarUrl(currentAvatar);
                setRole(user.preferences?.role || '');
            }
        };

        return (
             <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/70 mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
                <form onSubmit={handleProfileUpdate}>
                    <CardHeader className="bg-card/70 dark:bg-muted/10 border-b border-border/60 p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative group">
                        <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-primary/20 shadow-lg ring-2 ring-primary/10">
                            <AvatarImage src={isEditingProfile ? tempAvatarUrl : avatarUrl} alt={user?.name} />
                            <AvatarFallback className="text-5xl bg-muted text-muted-foreground">{user?.name ? user.name.charAt(0).toUpperCase() : 'P'}</AvatarFallback>
                        </Avatar>
                        {isEditingProfile && (
                            <>
                                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden"/>
                                <Button 
                                    type="button"
                                    variant="outline" 
                                    size="icon"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute bottom-1 right-1 h-9 w-9 rounded-full bg-background/90 hover:bg-accent border-2 border-primary/30 shadow-md group-hover:scale-110 transition-transform"
                                    aria-label="Changer l'avatar"
                                >
                                    <Camera className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                                </Button>
                            </>
                        )}
                        </div>
                        <div className="text-center sm:text-left flex-grow">
                        <CardTitle className="text-2xl sm:text-3xl font-bold text-foreground">{isEditingProfile ? name : user?.name}</CardTitle>
                        <CardDescription className="text-base text-muted-foreground">{email}</CardDescription>
                        {role && !isEditingProfile && <p className="text-sm text-primary font-medium mt-1">{role}</p>}
                        </div>
                        {!isEditingProfile && (
                             <Button type="button" onClick={() => setIsEditingProfile(true)} disabled={authLoading} variant="outline" className="sm:ml-auto">
                                <Edit3 className="mr-2 h-4 w-4" /> Modifier
                            </Button>
                        )}
                    </div>
                    </CardHeader>
                    <CardContent className="space-y-6 p-5 sm:p-6">
                        <ProfileInfoField icon={User} label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} id="name" isEditing={isEditingProfile} required={true} />
                        <ProfileInfoField icon={Mail} label="Adresse e-mail (non modifiable)" value={email} id="email" isEditing={false} disabled={true} />
                        <ProfileInfoField icon={Briefcase} label="Poste / Rôle" value={role} onChange={(e) => setRole(e.target.value)} id="role" placeholder="Ex: Développeur, Chef de projet..." isEditing={isEditingProfile} />
                    </CardContent>
                    {isEditingProfile && (
                        <CardFooter className="bg-muted/30 dark:bg-muted/10 border-t border-border/60 p-5 flex justify-end space-x-3">
                            <Button type="button" variant="ghost" onClick={cancelEditProfile} disabled={authLoading}>
                                <X className="mr-1.5 h-4 w-4" /> Annuler
                            </Button>
                            <Button type="submit" disabled={authLoading} className="btn-primary-solid">
                                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                                Sauvegarder
                            </Button>
                        </CardFooter>
                    )}
                </form>
                </Card>
            </motion.div>
        );
    };
    
    const PasswordSettingsSection = ({ authLoading }) => {
        const [currentPassword, setCurrentPassword] = useState('');
        const [newPassword, setNewPassword] = useState('');
        const [confirmPassword, setConfirmPassword] = useState('');
        const { changePassword } = useAuth();

        const handlePasswordUpdate = async (e) => {
            e.preventDefault();
            if (newPassword !== confirmPassword) {
              toast({ title: "Erreur", description: "Les nouveaux mots de passe ne correspondent pas.", variant: "destructive" });
              return;
            }
            if (newPassword.length < 8) {
               toast({ title: "Erreur", description: "Le nouveau mot de passe doit comporter au moins 8 caractères.", variant: "destructive" });
              return;
            }
            // Add more password strength checks if needed (uppercase, number, special char)
            try {
              if (typeof changePassword === 'function') {
                await changePassword(currentPassword, newPassword); 
                 toast({ title: "Mot de passe mis à jour", description: "Votre mot de passe a été changé avec succès." });
              } else {
                console.warn("changePassword function not available in AuthContext. Simulating success.");
                await new Promise(res => setTimeout(res, 1000)); // Simulate async
                toast({ title: "Mot de passe mis à jour (Simulation)", description: "Votre mot de passe a été changé avec succès." });
              }
              setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
            } catch (error) {
              toast({ title: "Erreur de mise à jour", description: error.message || "Impossible de changer le mot de passe.", variant: "destructive" });
            }
        };
        
        return (
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/70 mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
                    <form onSubmit={handlePasswordUpdate}>
                        <CardHeader className="border-b border-border/60 p-5 sm:p-6 bg-card/70 dark:bg-muted/10">
                          <CardTitle className="flex items-center text-xl"><ShieldCheck className="mr-2.5 h-5 w-5 text-primary" /> Changer le mot de passe</CardTitle>
                          <CardDescription className="text-sm">Mettez à jour votre mot de passe régulièrement pour plus de sécurité.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 p-5 sm:p-6">
                            <ProfileInfoField icon={Key} label="Mot de passe actuel" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} id="current-password" type="password" isEditing={true} required={true} />
                            <ProfileInfoField icon={Key} label="Nouveau mot de passe" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} id="new-password" type="password" isEditing={true} required={true} placeholder="Au moins 8 caractères" />
                            <ProfileInfoField icon={Key} label="Confirmer le nouveau mot de passe" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} id="confirm-password" type="password" isEditing={true} required={true} />
                        </CardContent>
                        <CardFooter className="bg-muted/30 dark:bg-muted/10 border-t border-border/60 p-5 flex justify-end space-x-3">
                            <Button type="submit" disabled={authLoading} className="btn-primary-solid">
                                {authLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
                                Mettre à jour le mot de passe
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </motion.div>
        );
    };
    
    const ActivitySection = () => {
         const mockActivities = [
            { id: 1, type: "Connexion", date: "Aujourd'hui à 14:32", device: "Chrome sur Windows", ip: "192.168.1.10 (Simulé)" },
            { id: 2, type: "Nouvelle conversation créée", date: "Hier à 10:05", device: "Application Mobile", details: "Projet Marketing Q3" },
            { id: 3, type: "Fichier importé", date: "Il y a 2 jours", device: "Chrome sur Windows", details: "rapport_ventes.pdf"},
            { id: 4, type: "Intégration ajoutée", date: "Il y a 3 jours", device: "Safari sur macOS", details: "Google Calendar" },
          ];

        return (
            <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/70 mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
                    <CardHeader className="border-b border-border/60 p-5 sm:p-6 bg-card/70 dark:bg-muted/10">
                        <CardTitle className="flex items-center text-xl"><Activity className="mr-2.5 h-5 w-5 text-primary" /> Activité Récente</CardTitle>
                        <CardDescription className="text-sm">Historique de vos connexions et actions importantes (simulé).</CardDescription>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 space-y-2.5">
                        {mockActivities.map(activity => (
                            <motion.div 
                                key={activity.id} 
                                className="flex flex-col sm:flex-row justify-between sm:items-center text-sm p-3 rounded-lg bg-muted/40 dark:bg-muted/20 hover:bg-accent/30 dark:hover:bg-accent/15 transition-colors"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div>
                                    <p className="font-medium text-foreground">{activity.type}</p>
                                    <p className="text-xs text-muted-foreground">{activity.device} {activity.ip ? `- ${activity.ip}` : ''} {activity.details ? `- ${activity.details}` : ''}</p>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1 sm:mt-0">{activity.date}</p>
                            </motion.div>
                        ))}
                         <p className="text-xs text-muted-foreground text-center pt-3">Ceci est une simulation. L'activité réelle n'est pas enregistrée dans cette démo.</p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    };
    
    const LinkedAccountsSection = () => {
        const socialLinks = [
            { name: "Google", icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg", connected: true },
            { name: "Microsoft", icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/microsoft.svg", connected: false },
            { name: "GitHub", icon: "https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/github.svg", connected: false },
        ];
        return (
             <motion.div variants={itemVariants}>
                <Card className="overflow-hidden shadow-xl border-border/70 mt-4 transform hover:shadow-primary/10 transition-shadow duration-300">
                    <CardHeader className="border-b border-border/60 p-5 sm:p-6 bg-card/70 dark:bg-muted/10">
                        <CardTitle className="flex items-center text-xl"><LinkIcon className="mr-2.5 h-5 w-5 text-primary" /> Comptes Liés</CardTitle>
                        <CardDescription className="text-sm">Gérez les connexions à vos comptes tiers pour une authentification simplifiée (simulé).</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 sm:p-6 space-y-3">
                        {socialLinks.map(link => (
                            <div key={link.name} className="flex items-center justify-between p-3 rounded-lg bg-muted/40 dark:bg-muted/20">
                                <div className="flex items-center">
                                    <img src={link.icon} alt={`${link.name} logo`} className="h-6 w-6 mr-3" />
                                    <span className="font-medium text-foreground">{link.name}</span>
                                </div>
                                <Button 
                                    variant={link.connected ? "destructiveOutline" : "outline"} 
                                    size="sm"
                                    onClick={() => toast({title: `${link.connected ? "Déconnexion" : "Connexion"} ${link.name} (Bientôt)`, description: `La gestion des comptes liés sera bientôt disponible.`})}
                                >
                                    {link.connected ? "Déconnecter" : "Connecter"}
                                </Button>
                            </div>
                        ))}
                        <p className="text-xs text-muted-foreground text-center pt-2">Cette fonctionnalité est en cours de développement.</p>
                    </CardContent>
                </Card>
            </motion.div>
        );
    }


    const ProfilePage = () => {
      const { user, updateUserProfile, loading: authLoading } = useAuth();
      const navigate = useNavigate();

      return (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6 md:space-y-8 max-w-3xl mx-auto pb-10 px-2 sm:px-0"
        >
          <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground pt-2 flex items-center">
             <User className="mr-3 h-8 w-8 text-primary"/> Mon Profil
          </motion.h1>

          <Tabs defaultValue="profile" className="w-full">
            <motion.div variants={itemVariants}>
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1.5 bg-muted/50 rounded-lg">
                    <TabsTrigger value="profile" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Informations</TabsTrigger>
                    <TabsTrigger value="password" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Mot de Passe</TabsTrigger>
                    <TabsTrigger value="activity" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Activité</TabsTrigger>
                    <TabsTrigger value="linked_accounts" className="py-2.5 text-xs sm:text-sm data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all">Comptes Liés</TabsTrigger>
                </TabsList>
            </motion.div>

            <TabsContent value="profile">
                <ProfileSection user={user} updateUserProfile={updateUserProfile} authLoading={authLoading} />
            </TabsContent>
            <TabsContent value="password">
                <PasswordSettingsSection authLoading={authLoading} />
            </TabsContent>
            <TabsContent value="activity">
                <ActivitySection />
            </TabsContent>
            <TabsContent value="linked_accounts">
                <LinkedAccountsSection />
            </TabsContent>
          </Tabs>
        </motion.div>
      );
    };

    export default ProfilePage;