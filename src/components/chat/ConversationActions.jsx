import React from 'react';
    import { Button } from '@/components/ui/button';
    import { DialogFooter } from '@/components/ui/dialog';
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";
    import { Trash2, Archive } from 'lucide-react';

    const ConversationActions = ({ conversationName, onArchive, onDelete, onSave, onCancel }) => (
      <DialogFooter className="p-4 border-t border-border bg-muted/30 dark:bg-muted/20 flex flex-col-reverse sm:flex-row sm:justify-between">
        <div className="flex items-center space-x-2 mt-2 sm:mt-0">
          <Button variant="outline" onClick={onArchive} className="w-full sm:w-auto text-xs">
            <Archive className="mr-2 h-3.5 w-3.5" /> Archiver
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full sm:w-auto text-xs">
                <Trash2 className="mr-2 h-3.5 w-3.5" /> Supprimer
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Vraiment supprimer cette conversation ?</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible et supprimera définitivement la conversation "{conversationName}".
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={onDelete} className="bg-destructive hover:bg-destructive/90">Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" onClick={onCancel} className="w-full sm:w-auto text-xs">Annuler</Button>
          <Button onClick={onSave} className="w-full sm:w-auto text-xs btn-primary-solid">Sauvegarder</Button>
        </div>
      </DialogFooter>
    );

    export default ConversationActions;