import React, { useState, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
    import { Label } from '@/components/ui/label';
    import { Input } from '@/components/ui/input';
    import { Textarea } from '@/components/ui/textarea';
    import { SlidersHorizontal } from 'lucide-react';
    import { toast } from '@/components/ui/use-toast';

    const AutomationFormDialog = ({ isOpen, onClose, onSave, initialData }) => {
        const [name, setName] = useState('');
        const [trigger, setTrigger] = useState('');
        const [actions, setActions] = useState('');
        const [category, setCategory] = useState('');

        useEffect(() => {
            if (isOpen && initialData) {
                setName(initialData.name || '');
                setTrigger(initialData.trigger || '');
                setActions(initialData.actions || '');
                setCategory(initialData.category || '');
            } else if (isOpen && !initialData) {
                 setName(''); 
                 setTrigger(''); 
                 setActions(''); 
                 setCategory('');
            }
        }, [initialData, isOpen]);

        const handleSubmit = (e) => {
            e.preventDefault();
            if (!name.trim() || !trigger.trim() || !actions.trim()) {
                toast({title: "Champs requis", description: "Veuillez remplir le nom, le déclencheur et les actions.", variant:"destructive"});
                return;
            }
            onSave({ name, trigger, actions, category });
            onClose(); // Close dialog on successful save
        };

        return (
             <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-2xl flex items-center">
                            <SlidersHorizontal className="mr-2 h-6 w-6 text-primary"/>
                            {initialData ? "Modifier l'automatisation" : "Créer une nouvelle automatisation"}
                        </DialogTitle>
                        <DialogDescription>
                           Configurez les détails de votre tâche automatisée pour qu'Alya travaille pour vous.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-5 py-6 px-1">
                            <div className="space-y-1.5">
                                <Label htmlFor="auto-form-name" className="text-base">Nom de l'automatisation</Label>
                                <Input id="auto-form-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Rapport hebdomadaire" className="text-base" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="auto-form-category" className="text-base">Catégorie (optionnel)</Label>
                                <Input id="auto-form-category" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Ex: Marketing, Ventes" className="text-base" />
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="auto-form-trigger" className="text-base">Déclencheur</Label>
                                <Textarea id="auto-form-trigger" value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="Ex: Tous les lundis à 9h00, À la réception d'un email contenant '[Urgent]'" className="text-base min-h-[80px]" />
                                <p className="text-xs text-muted-foreground">Décrivez quand cette automatisation doit se lancer.</p>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="auto-form-actions" className="text-base">Actions à effectuer</Label>
                                <Textarea id="auto-form-actions" value={actions} onChange={(e) => setActions(e.target.value)} placeholder="Ex: Envoyer un email à equipe@example.com, Créer une tâche dans Trello, Publier sur Slack #annonces" className="text-base min-h-[100px]" />
                                 <p className="text-xs text-muted-foreground">Décrivez ce qu'Alya doit faire.</p>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0 pt-4">
                            <DialogClose asChild>
                                <Button type="button" variant="outline">Annuler</Button>
                            </DialogClose>
                            <Button type="submit" className="btn-primary-solid">{initialData ? "Sauvegarder" : "Créer"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        );
    };

    export default AutomationFormDialog;