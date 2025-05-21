import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import { Textarea } from '@/components/ui/textarea';
    import { Bot, User, Edit3, Save, X, Clock, Paperclip, Image as ImageIcon, FileText, Loader2 } from 'lucide-react';
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
    import { format } from 'date-fns';
    import { fr } from 'date-fns/locale';

    const TypingIndicator = () => (
        <motion.div 
            className="flex items-center space-x-1.5 p-2 bg-card rounded-lg shadow-sm"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
        >
            <motion.div
                className="w-2 h-2 bg-primary/70 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0 }}
            />
            <motion.div
                className="w-2 h-2 bg-primary/70 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
            />
            <motion.div
                className="w-2 h-2 bg-primary/70 rounded-full"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            />
        </motion.div>
    );

    const AttachmentChip = ({ attachment }) => {
        let Icon = FileText; 
        if (attachment.type?.startsWith('image/')) Icon = ImageIcon;

        return (
            <a 
                href={attachment.url || '#'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-1.5 mr-1.5 inline-flex items-center text-xs bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground rounded-md px-2 py-1 transition-colors duration-150 shadow-sm border border-border/50"
            >
                <Icon className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" />
                <span className="truncate max-w-[150px] sm:max-w-[200px]">{attachment.name || 'Fichier joint'}</span>
            </a>
        );
    };

    const ChatMessage = React.memo(({ message, isUser, onEditRequest, onStopGenerating, onResendEdited, conversationId }) => {
        const [isEditing, setIsEditing] = useState(false);
        const [editedText, setEditedText] = useState(String(message.text || ''));
        const textareaRef = useRef(null);

        useEffect(() => {
            setEditedText(String(message.text || ''));
        }, [message.text]);
        
        useEffect(() => {
            if (isEditing && textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
              textareaRef.current.focus();
              textareaRef.current.setSelectionRange(editedText.length, editedText.length);
            }
        }, [isEditing, editedText]);

        const handleEdit = () => {
            setIsEditing(true);
            if (onEditRequest) onEditRequest(message.id, String(message.text || ''));
        };

        const handleCancelEdit = () => {
            setIsEditing(false);
            setEditedText(String(message.text || ''));
        };

        const handleSaveEdit = () => {
            if (onResendEdited && String(editedText || '').trim() !== String(message.text || '').trim()) {
                onResendEdited(conversationId, message.id, String(editedText || ''));
            }
            setIsEditing(false);
        };
        
        const handleTextareaKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSaveEdit();
            } else if (e.key === 'Escape') {
                handleCancelEdit();
            }
        };

        const safeText = String(message.text || '');
        const safeAttachments = Array.isArray(message.attachments) ? message.attachments : [];

        const messageVariants = {
            hidden: { opacity: 0, y: 10, scale: 0.95 },
            visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] } }
        };

        const avatarComponent = (
            <Avatar className={`h-8 w-8 shadow-sm border border-border/30 ${isUser ? 'ml-2' : 'mr-2'}`}>
                <AvatarImage src={isUser ? '/user-avatar.png' : '/alya-avatar.png'} alt={isUser ? 'Utilisateur' : 'Alya AI'} />
                <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {isUser ? <User size={16} /> : <Bot size={16} />}
                </AvatarFallback>
            </Avatar>
        );

        return (
            <TooltipProvider delayDuration={300}>
            <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                layout
                className={`flex items-start space-x-0 py-2.5 group ${isUser ? 'justify-end' : 'justify-start'}`}
            >
                {!isUser && avatarComponent}
                <div className={`flex flex-col max-w-[85%] sm:max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
                    <div 
                        className={`px-3.5 py-2.5 rounded-2xl shadow-md relative transition-colors duration-200
                            ${isUser ? 'bg-primary/90 text-primary-foreground rounded-br-md' 
                                     : 'bg-card text-card-foreground border border-border/50 rounded-bl-md dark:bg-slate-800 dark:border-slate-700'}
                            ${message.isThinking ? 'animate-pulse_custom_bg' : ''}`}
                    >
                         {message.isThinking ? <TypingIndicator /> : 
                            (isEditing && isUser ? (
                                <>
                                    <Textarea 
                                        ref={textareaRef}
                                        value={editedText} 
                                        onChange={(e) => setEditedText(e.target.value)} 
                                        onKeyDown={handleTextareaKeyDown}
                                        className="text-sm bg-background text-foreground placeholder-muted-foreground border-border focus:ring-primary p-2 min-h-[60px] w-full resize-none focus-visible:ring-1 focus-visible:ring-offset-0"
                                        rows={1}
                                        autoFocus
                                    />
                                    <div className="mt-2 flex justify-end space-x-1.5">
                                        <Button variant="ghost" size="icon" onClick={handleCancelEdit} className="h-7 w-7 text-muted-foreground hover:text-destructive"><X size={16}/></Button>
                                        <Button variant="ghost" size="icon" onClick={handleSaveEdit} className="h-7 w-7 text-muted-foreground hover:text-green-600"><Save size={16}/></Button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                        {safeText}
                                    </p>
                                    {safeAttachments.length > 0 && (
                                        <div className="mt-1.5 flex flex-wrap">
                                            {safeAttachments.map((att, idx) => <AttachmentChip key={idx} attachment={att} />)}
                                        </div>
                                    )}
                                </>
                            ))
                        }
                        {!isUser && message.text && message.isThinking === false && onStopGenerating && typeof onStopGenerating === 'function' && (
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" onClick={() => onStopGenerating(message.id)} className="absolute -top-2 -right-2 h-6 w-6 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Loader2 size={14} className="animate-spin" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top"><p>Arrêter la génération</p></TooltipContent>
                            </Tooltip>
                        )}
                        {isUser && !isEditing && message.text && (
                            <div className="absolute -top-2.5 -left-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                    <Button variant="outline" size="icon" onClick={handleEdit} className="h-7 w-7 bg-card hover:bg-accent rounded-full shadow-md border-border/60">
                                        <Edit3 size={14} className="text-muted-foreground" />
                                    </Button>
                                    </TooltipTrigger>
                                    <TooltipContent side="top"><p>Modifier le message</p></TooltipContent>
                                </Tooltip>
                            </div>
                        )}
                    </div>
                    <div className={`text-xs text-muted-foreground mt-1.5 px-1 flex items-center ${isUser ? 'flex-row-reverse' : ''}`}>
                        <Clock size={12} className={isUser ? "ml-1" : "mr-1"} />
                        <span>{format(new Date(message.timestamp), 'HH:mm', { locale: fr })}</span>
                        {message.isEdited && <span className="text-xs text-muted-foreground/70 italic ml-1.5">(modifié)</span>}
                    </div>
                </div>
                {isUser && avatarComponent}
            </motion.div>
            </TooltipProvider>
        );
    });

    export default ChatMessage;