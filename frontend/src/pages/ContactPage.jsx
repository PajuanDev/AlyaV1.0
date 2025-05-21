import React, { useState } from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { Label } from '@/components/ui/label';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Mail, Send, Loader2, Building, UserCircle } from 'lucide-react';
    import { toast } from '@/components/ui/use-toast';
    import { Link } from 'react-router-dom';

    const ContactPage = () => {
      const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: '',
      });
      const [isLoading, setIsLoading] = useState(false);

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        toast({
          title: "Message Envoyé !",
          description: "Merci de nous avoir contactés. Nous reviendrons vers vous bientôt.",
        });
        setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background text-foreground py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="w-full max-w-2xl"
          >
            <motion.div variants={itemVariants} className="text-center mb-10">
              <Mail className="h-16 w-16 text-primary mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-3">Contactez-Nous</h1>
              <p className="text-lg text-muted-foreground">
                Une question, une suggestion, ou besoin d'aide ? Notre équipe est là pour vous.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="shadow-xl border-border/50">
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>Remplissez le formulaire ci-dessous et nous vous répondrons dans les plus brefs délais.</CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                  <CardContent className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-5">
                      <div className="space-y-1.5">
                        <Label htmlFor="name" className="flex items-center"><UserCircle className="mr-2 h-4 w-4 text-muted-foreground" />Nom complet</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Votre nom" required />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground" />Adresse e-mail</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Votre e-mail" required />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="company" className="flex items-center"><Building className="mr-2 h-4 w-4 text-muted-foreground" />Entreprise (Optionnel)</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} placeholder="Nom de votre entreprise" />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="subject" className="flex items-center"><Send className="mr-2 h-4 w-4 text-muted-foreground transform rotate-[-45deg]" />Sujet</Label>
                      <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} placeholder="Sujet de votre message" required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Écrivez votre message ici..." required className="min-h-[120px]" />
                    </div>
                    <Button type="submit" className="w-full btn-primary-solid" disabled={isLoading}>
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Envoyer le Message
                    </Button>
                  </CardContent>
                </form>
              </Card>
            </motion.div>
            
            <motion.div variants={itemVariants} className="text-center mt-10">
                <Button variant="outline" asChild>
                    <Link to="/">Retour à l'accueil</Link>
                </Button>
            </motion.div>
          </motion.div>
        </div>
      );
    };

    export default ContactPage;