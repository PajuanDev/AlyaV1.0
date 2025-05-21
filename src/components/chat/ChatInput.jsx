import React, { useState, useRef, useEffect } from 'react';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Send, FileUp, Mic, Loader2, Paperclip, X, CornerDownLeft, Square } from 'lucide-react';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { toast } from '@/components/ui/use-toast';
    import { motion, AnimatePresence } from 'framer-motion';

    const ChatInput = ({ 
        onSendMessage, 
        isSending, 
        activeConversationId, 
        initialText = '', 
        clearInitialText, 
        layoutId,
        onStopGenerating,
        activeThinkingMessageId
    }) => {
      const [inputText, setInputText] = useState('');
      const [isListening, setIsListening] = useState(false);
      const [attachedFiles, setAttachedFiles] = useState([]);
      const textareaRef = useRef(null);
      const fileInputRef = useRef(null);

      useEffect(() => {
        if (initialText) {
            setInputText(initialText);
            textareaRef.current?.focus();
        }
      }, [initialText]);

      useEffect(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
          const scrollHeight = textareaRef.current.scrollHeight;
          const maxHeight = attachedFiles.length > 0 ? 80 : 100; 
          textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`; 
        }
      }, [inputText, attachedFiles]);

      const handleStopOrSend = () => {
        if (isSending && onStopGenerating && activeThinkingMessageId) {
            onStopGenerating(activeThinkingMessageId);
        } else if (inputText.trim() || attachedFiles.length > 0) {
            onSendMessage(inputText, false, null, activeConversationId, attachedFiles);
            setInputText('');
            setAttachedFiles([]);
            if (clearInitialText) clearInitialText();
            textareaRef.current?.focus();
        }
      };

      const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleStopOrSend();
        }
      };

      const handleVoiceInput = () => {
        setIsListening(!isListening);
        if (!isListening) {
          toast({ title: "Dictée Vocale Activée (Simulation)", description: "Parlez maintenant pour transcrire votre message..." });
          setTimeout(() => {
            const voiceSamples = ["Pouvez-vous me donner un résumé de l'actualité tech ?", "Créer une tâche pour appeler le client X demain.", "Quel temps fait-il à Paris ?"];
            setInputText(prev => prev + voiceSamples[Math.floor(Math.random() * voiceSamples.length)]);
            setIsListening(false);
            toast({ title: "Texte Transcrit", description: "Votre message a été ajouté à la zone de texte." });
            textareaRef.current?.focus();
          }, 2500);
        } else {
          toast({ title: "Dictée Vocale Stoppée" });
        }
      };
      
      const triggerFileInput = () => {
        fileInputRef.current?.click();
      };

      const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
         if (files.length > 0 && activeConversationId) {
            const newFiles = files.slice(0, 3 - attachedFiles.length); 
            setAttachedFiles(prev => [...prev, ...newFiles]);
            newFiles.forEach(file => {
                 toast({ title: "Fichier Prêt (Simulation)", description: `"${file.name}" sera analysé par Alya.` });
            });
        } else if (!activeConversationId && files.length > 0) {
             const newFiles = files.slice(0, 3 - attachedFiles.length); 
            setAttachedFiles(prev => [...prev, ...newFiles]);
            newFiles.forEach(file => {
                 toast({ title: "Fichier Prêt (Simulation)", description: `"${file.name}" sera joint au premier message.` });
            });
        }
        if (fileInputRef.current) fileInputRef.current.value = ""; 
      };

      const removeAttachedFile = (fileName) => {
        setAttachedFiles(prev => prev.filter(file => file.name !== fileName));
      };


      return (
        <TooltipProvider delayDuration={200}>
        <motion.div 
            layoutId={layoutId}
            className="p-2.5 md:p-3 border-t bg-background/95 backdrop-blur-sm sticky bottom-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "circOut" }}
        >
          <AnimatePresence>
            {attachedFiles.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                animate={{ opacity: 1, height: 'auto', marginBottom: '0.5rem' }}
                exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                className="px-1 flex flex-wrap gap-1.5"
              >
                {attachedFiles.map(file => (
                  <motion.div
                    key={file.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className="flex items-center text-xs bg-muted/70 text-muted-foreground rounded-full pl-2.5 pr-1 py-0.5 shadow-sm"
                  >
                    <Paperclip className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate max-w-[100px] sm:max-w-[150px]">{file.name}</span>
                    <Button variant="ghost" size="icon" className="h-5 w-5 ml-1 rounded-full hover:bg-destructive/20" onClick={() => removeAttachedFile(file.name)}>
                      <X className="h-3 w-3" />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-end space-x-1.5 sm:space-x-2">
            <input type="file" ref={fileInputRef} onChange={handleFileChange} multiple className="hidden" accept="image/*,application/pdf,.doc,.docx,.txt,.csv" />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={triggerFileInput} className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg">
                  <FileUp className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Joindre un fichier (max 3)</p></TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleVoiceInput} className={`text-muted-foreground hover:text-primary transition-colors flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-lg ${isListening ? 'text-destructive animate-pulse_custom' : ''}`}>
                  <Mic className="h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{isListening ? "Arrêter la dictée" : "Dicter un message"}</p></TooltipContent>
            </Tooltip>

            <Textarea
              ref={textareaRef}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={initialText ? "Modifiez votre message..." : "Écrivez votre message à Alya..."}
              className="flex-grow p-2.5 sm:p-3 resize-none text-sm max-h-[100px] min-h-[40px] sm:min-h-[44px] rounded-lg border-input focus:border-primary transition-colors duration-150 bg-background focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:ring-offset-0"
              rows={1}
              disabled={isSending && !activeThinkingMessageId} 
            />
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  type="submit" 
                  size="icon" 
                  onClick={handleStopOrSend} 
                  disabled={(!isSending && !inputText.trim() && attachedFiles.length === 0) && (!initialText.trim())}
                  className="btn-primary-solid rounded-lg w-9 h-9 sm:w-10 sm:h-10 flex-shrink-0 transition-opacity duration-150 ease-in-out hover:opacity-90 active:scale-95"
                >
                  {isSending ? <Square className="h-4 w-4 sm:h-5 sm:w-5" /> : (initialText ? <CornerDownLeft className="h-4 w-4 sm:h-5 sm:h-5" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />)}
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>{isSending ? "Arrêter la génération" : (initialText ? "Sauvegarder (Entrée)" : "Envoyer (Entrée)")}</p></TooltipContent>
            </Tooltip>
          </div>
        </motion.div>
        </TooltipProvider>
      );
    };

    export default ChatInput;