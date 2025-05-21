import React, { useEffect, useRef, useState, useCallback } from 'react';
    import { useParams, useNavigate, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import ChatMessage from '@/components/chat/ChatMessage';
    import ChatInput from '@/components/chat/ChatInput';
    import ProactiveSuggestionCard from '@/components/chat/ProactiveSuggestionCard';
    import NewChatStartPage from '@/pages/chat/NewChatStartPage';
    import useChat from '@/hooks/useChat';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { Button } from '@/components/ui/button';
    import { MessageCircle, AlertTriangle, Loader2, Sparkles, Bot } from 'lucide-react';
    import { toast } from '@/components/ui/use-toast';

    const aiResponses = [
        "Absolument ! Je peux vous aider avec ça.",
        "Intéressant. Pouvez-vous m'en dire plus ?",
        "Je suis en train de chercher cette information pour vous.",
        "C'est une excellente question. Laissez-moi vérifier.",
        "Voici ce que j'ai trouvé : ...",
        "Je peux vous aider à rédiger un email, planifier une tâche, ou rechercher sur le web. Que souhaitez-vous faire ?",
        "Je suis là pour vous assister !",
        "J'apprends continuellement. N'hésitez pas à me donner des retours.",
        "D'accord, je prends note de cela.",
        "Comment puis-je vous être utile aujourd'hui ?"
    ];
    
    const proactiveSuggestionsSamples = [
      { id: 'summary-1', title: 'Synthétiser ?', description: 'Voulez-vous un résumé rapide des derniers échanges ?', acceptLabel: "Oui, résume", dismissLabel: "Non merci", iconType: 'idea', actionType: 'summarize' },
      { id: 'task-1', title: 'Action à suivre ?', description: 'Puis-je créer une tâche à partir de votre dernière demande ?', acceptLabel: "Créer tâche", dismissLabel: "Ignorer", iconType: 'action', actionType: 'create_task' },
      { id: 'email-1', title: 'Brouillon d\'e-mail ?', description: 'Souhaitez-vous que je prépare un e-mail basé sur ce sujet ?', acceptLabel: "Rédiger e-mail", dismissLabel: "Pas besoin", iconType: 'action', actionType: 'draft_email' },
      { id: 'details-1', title: 'Plus de détails ?', description: 'Voulez-vous que je recherche des informations complémentaires ?', acceptLabel: "Chercher plus", dismissLabel: "Ça ira", iconType: 'idea', actionType: 'find_details' },
    ];

    const EmptyChatPlaceholder = ({ onStartNew }) => (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: 'spring', stiffness: 150, damping: 20, delay: 0.1 }}
                className="p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-3xl shadow-xl border border-dashed border-primary/20 max-w-md"
            >
                <Bot className="h-16 w-16 text-primary mx-auto mb-6 opacity-80" />
                <h2 className="text-2xl font-bold text-foreground mb-3">Bienvenue sur Alya Chat !</h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                    Il semble que vous n'ayez pas encore de conversation active. <br/>
                    Commencez par sélectionner une discussion existante ou lancez-en une nouvelle.
                </p>
                <Button onClick={onStartNew} className="btn-primary-gradient shadow-lg hover:shadow-primary/30">
                    <Sparkles className="mr-2 h-4 w-4" /> Démarrer une nouvelle discussion
                </Button>
            </motion.div>
        </div>
    );


    const ChatPage = () => {
        const { chatId } = useParams();
        const navigate = useNavigate();
        const location = useLocation();
        const { 
          conversations, 
          getConversationById, 
          addMessage, 
          updateMessage,
          editUserMessage,
          isLoadingConversation, 
          setActiveConversationId 
        } = useChat();
        
        const [currentConversation, setCurrentConversation] = useState(null);
        const [isSending, setIsSending] = useState(false);
        const [activeThinkingMessageId, setActiveThinkingMessageId] = useState(null);
        const [activeSuggestion, setActiveSuggestion] = useState(null);
        const [suggestionVisible, setSuggestionVisible] = useState(false);
        const messageCountSinceLastSuggestion = useRef(0);
        const scrollAreaRef = useRef(null);
        const [editingMessageText, setEditingMessageText] = useState('');
        const aiResponseTimers = useRef({});
        const [showNewChatStart, setShowNewChatStart] = useState(false);


        useEffect(() => {
            if (location.pathname === '/app/chat' && !chatId) {
                setShowNewChatStart(true);
                setCurrentConversation(null);
                setActiveConversationId(null);
                setActiveThinkingMessageId(null);
                return;
            }

            if (chatId) {
                setShowNewChatStart(false);
                setActiveConversationId(chatId);
                const conv = getConversationById(chatId);
                setCurrentConversation(conv);
                if (!conv && !isLoadingConversation && conversations.length > 0) {
                    toast({ title: "Conversation non trouvée", description: "Redirection vers la dernière conversation.", variant: "destructive" });
                    const lastConv = conversations.filter(c => !c.archived).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || conversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
                    if (lastConv) navigate(`/app/chat/${lastConv.id}`); else navigate('/app/chat');
                } else if (!conv && !isLoadingConversation && conversations.length === 0) {
                    navigate('/app/chat'); 
                }
            } else if (conversations.length > 0 && !isLoadingConversation) {
                const lastConv = conversations.filter(c => !c.archived).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] || conversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
                if (lastConv) navigate(`/app/chat/${lastConv.id}`, { replace: true }); else navigate('/app/chat');
            } else if (!isLoadingConversation) {
                setShowNewChatStart(true);
                setCurrentConversation(null);
                setActiveConversationId(null);
                setActiveThinkingMessageId(null);
            }
             messageCountSinceLastSuggestion.current = 0;
             setActiveSuggestion(null);
             setSuggestionVisible(false);
        }, [chatId, conversations, getConversationById, navigate, isLoadingConversation, setActiveConversationId, location.pathname]);
        
        useEffect(() => {
            if (!showNewChatStart) scrollToBottom('auto');
            if (currentConversation?.messages) {
                const userMessagesCount = currentConversation.messages.filter(m => m.sender === 'user').length;
                if (userMessagesCount > 0 && userMessagesCount % 3 === 0 && messageCountSinceLastSuggestion.current >=3 && !suggestionVisible) {
                    const randomSuggestion = proactiveSuggestionsSamples[Math.floor(Math.random() * proactiveSuggestionsSamples.length)];
                    setActiveSuggestion(randomSuggestion);
                    setSuggestionVisible(true);
                    messageCountSinceLastSuggestion.current = 0; 
                }
            }
        }, [currentConversation?.messages, suggestionVisible, showNewChatStart]);

        const scrollToBottom = (behavior = 'smooth') => {
            setTimeout(() => {
              const viewport = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
              if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior });
              }
            }, 50);
        };
        
        const handleSendMessage = async (text, isResend = false, originalMessageId = null, conversationIdToUse = chatId, attachedFiles = []) => {
            if (!conversationIdToUse || (!text.trim() && attachedFiles.length === 0)) return;
            
            const safeText = typeof text === 'string' ? text : '';

            setIsSending(true);
            if (suggestionVisible) {
                setSuggestionVisible(false);
                setActiveSuggestion(null);
            }
        
            if (isResend && originalMessageId) {
                editUserMessage(conversationIdToUse, originalMessageId, safeText);
            } else {
                addMessage(conversationIdToUse, 'user', safeText, attachedFiles);
            }
            messageCountSinceLastSuggestion.current +=1;
            scrollToBottom('auto');
            
            if (attachedFiles.length > 0) {
                attachedFiles.forEach(file => {
                    addMessage(conversationIdToUse, 'ai', `J'analyse le fichier "${file.name}". Je peux en extraire le texte, le résumer ou répondre à vos questions à son sujet.`);
                });
                scrollToBottom('auto');
            }

            const thinkingMessageId = addMessage(conversationIdToUse, 'ai', '', [], true); 
            setActiveThinkingMessageId(thinkingMessageId);
            scrollToBottom('auto');
        
            const timerId = setTimeout(() => {
                const aiResponseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                updateMessage(conversationIdToUse, thinkingMessageId, aiResponseText, [], false);
                setIsSending(false);
                setActiveThinkingMessageId(null);
                scrollToBottom();
                delete aiResponseTimers.current[thinkingMessageId];
            }, 1200 + Math.random() * 1300);
            aiResponseTimers.current[thinkingMessageId] = timerId;
        };

        const handleStartConversationFromWelcome = (newConvId, initialMessage, attachedFiles = []) => {
            navigate(`/app/chat/${newConvId}`, { replace: true });
            setShowNewChatStart(false);
            setTimeout(() => {
                handleSendMessage(initialMessage, false, null, newConvId, attachedFiles);
            }, 100);
        };

        const handleStopGenerating = (messageIdToStop) => {
            if (!messageIdToStop) return;
            if (aiResponseTimers.current[messageIdToStop]) {
                clearTimeout(aiResponseTimers.current[messageIdToStop]);
                delete aiResponseTimers.current[messageIdToStop];
            }
            updateMessage(chatId, messageIdToStop, "Génération arrêtée par l'utilisateur.", [], false);
            setIsSending(false); 
            setActiveThinkingMessageId(null);
            toast({ title: "Génération arrêtée", description: "Alya a cessé de générer une réponse." });
        };

        const handleEditRequest = (messageId, currentText) => {
            setEditingMessageText(String(currentText || '')); 
        };

        const handleResendEditedMessage = (conversationId, messageId, newText) => {
            handleSendMessage(newText, true, messageId, conversationId);
            setEditingMessageText(''); 
        };


        const handleSuggestionAccept = (suggestionId, actionType) => {
            const suggestion = proactiveSuggestionsSamples.find(s => s.id === suggestionId);
            toast({ title: `Action: ${suggestion?.title || 'Suggestion acceptée'}`, description: `Simulation: Alya va ${actionType || 'procéder'}.`});
            setSuggestionVisible(false);
            setActiveSuggestion(null);
            messageCountSinceLastSuggestion.current = 0;
            
            addMessage(chatId, 'user', `Je suis intéressé(e) par : "${suggestion?.title}"`);
            const thinkingMsgId = addMessage(chatId, 'ai', '', [], true);
            setActiveThinkingMessageId(thinkingMsgId);
             const timerId = setTimeout(() => {
                updateMessage(chatId, thinkingMsgId, `Parfait ! Concernant "${suggestion?.title}", voici ce que je peux faire... (simulation)`, [], false);
                setActiveThinkingMessageId(null);
                delete aiResponseTimers.current[thinkingMsgId];
            }, 1000);
            aiResponseTimers.current[thinkingMsgId] = timerId;

        };

        const handleSuggestionDismiss = (suggestionId) => {
            setSuggestionVisible(false);
            setActiveSuggestion(null);
            messageCountSinceLastSuggestion.current = 0; 
        };

        if (showNewChatStart) {
            return <NewChatStartPage onStartConversation={handleStartConversationFromWelcome} />;
        }

        if (isLoadingConversation && !currentConversation) {
            return (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                    <p className="text-lg">Chargement de la conversation...</p>
                </div>
            );
        }

        if (!currentConversation) {
             return (
                <EmptyChatPlaceholder onStartNew={() => navigate('/app/chat')} />
            );
        }
        
        return (
            <div className="flex flex-col h-full bg-transparent">
              <ScrollArea className="flex-grow p-3 md:p-4" ref={scrollAreaRef}>
                <AnimatePresence initial={false}>
                  {currentConversation.messages.map((msg) => (
                    <ChatMessage 
                        key={msg.id} 
                        message={msg} 
                        isUser={msg.sender === 'user'} 
                        onEditRequest={handleEditRequest}
                        onStopGenerating={() => handleStopGenerating(msg.id)}
                        onResendEdited={handleResendEditedMessage}
                        conversationId={chatId}
                    />
                  ))}
                </AnimatePresence>
                 {activeSuggestion && suggestionVisible && (
                    <ProactiveSuggestionCard
                        suggestion={activeSuggestion}
                        onAccept={handleSuggestionAccept}
                        onDismiss={handleSuggestionDismiss}
                        onVisibleChange={setSuggestionVisible}
                    />
                )}
              </ScrollArea>
              <ChatInput 
                onSendMessage={(text, isResend, originalMessageId, convId, files) => handleSendMessage(text, isResend, originalMessageId, convId, files)} 
                isSending={isSending && !!activeThinkingMessageId} 
                activeConversationId={chatId}
                initialText={editingMessageText}
                clearInitialText={() => setEditingMessageText('')}
                layoutId="chat-input-main"
                onStopGenerating={() => handleStopGenerating(activeThinkingMessageId)}
                activeThinkingMessageId={activeThinkingMessageId}
              />
            </div>
        );
    };

    export default ChatPage;