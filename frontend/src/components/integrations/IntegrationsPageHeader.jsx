import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose, DialogTrigger } from '@/components/ui/dialog';
    import { PlusCircle, SlidersHorizontal } from 'lucide-react';

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };

    const IntegrationsPageHeader = () => (
        <motion.div variants={itemVariants}>
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
                <div className="flex-grow">
                    <h1 className="text-4xl font-extrabold tracking-tight flex items-center">
                        <SlidersHorizontal className="mr-3 h-8 w-8 text-primary" /> Intégrations
                    </h1>
                    <p className="text-muted-foreground mt-1">Connectez Alya à vos services et outils préférés pour un workflow unifié.</p>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button size="lg" className="shadow-lg hover:shadow-primary/30 transition-shadow"><PlusCircle className="mr-2 h-5 w-5" /> Ajouter</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                        <DialogTitle>Ajouter une nouvelle intégration</DialogTitle>
                        <DialogDescription>
                            Connectez un nouveau service à Alya. (Fonctionnalité en développement)
                        </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-muted-foreground">
                                De nouvelles intégrations sont ajoutées régulièrement. Si vous ne voyez pas celle que vous cherchez,
                                elle pourrait être disponible bientôt.
                            </p>
                        </div>
                        <DialogFooter>
                           <DialogClose asChild><Button variant="outline">Fermer</Button></DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </motion.div>
    );

    export default IntegrationsPageHeader;