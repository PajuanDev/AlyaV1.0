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
    import { Loader2, Sparkles, Bot } from 'lucide-react';
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

    const ChatMessagesList = React.memo(({ messages, onEditRequest, onStopGenerating, onResendEdited, conversationId }) => (
        <ScrollArea className="flex-grow p-3 md:p-4" id="chat-scroll-area">
            <motion.div layout className="space-y-1">
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <ChatMessage 
                      key={msg.id} 
                      message={msg} 
                      isUser={msg.sender === 'user'} 
                      onEditRequest={onEditRequest}
                      onStopGenerating={onStopGenerating}
                      onResendEdited={onResendEdited}
                      conversationId={conversationId}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
        </ScrollArea>
    ));


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
        const [activeSuggestion, setActiveSuggestion] = useState(null);
        const [suggestionVisible, setSuggestionVisible] = useState(false);
        const messageCountSinceLastSuggestion = useRef(0);
        const aiResponseTimers = useRef({});
        const [editingMessageText, setEditingMessageText] = useState('');
        const [showNewChatStart, setShowNewChatStart] = useState(false);
        const [activeThinkingMessageId, setActiveThinkingMessageId] = useState(null);


        const scrollToBottom = useCallback((behavior = 'smooth') => {
            setTimeout(() => {
              const scrollArea = document.getElementById('chat-scroll-area');
              if (scrollArea) {
                  const viewport = scrollArea.querySelector('[data-radix-scroll-area-viewport]');
                  if (viewport) {
                    viewport.scrollTo({ top: viewport.scrollHeight, behavior });
                  }
              }
            }, 50);
        }, []);
        
        useEffect(() => {
            if (location.pathname === '/app/chat' && !chatId) {
                setShowNewChatStart(true);
                setCurrentConversation(null);
                setActiveConversationId(null);
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
            }
             messageCountSinceLastSuggestion.current = 0;
             setActiveSuggestion(null);
             setSuggestionVisible(false);
        }, [chatId, conversations, getConversationById, navigate, isLoadingConversation, setActiveConversationId, location.pathname]);
        
        useEffect(() => {
            if (!showNewChatStart && currentConversation?.messages?.length) {
                scrollToBottom('auto');
                const userMessagesCount = currentConversation.messages.filter(m => m.sender === 'user').length;
                if (userMessagesCount > 0 && userMessagesCount % 3 === 0 && messageCountSinceLastSuggestion.current >=3 && !suggestionVisible && !isSending) {
                    const randomSuggestion = proactiveSuggestionsSamples[Math.floor(Math.random() * proactiveSuggestionsSamples.length)];
                    setActiveSuggestion(randomSuggestion);
                    setSuggestionVisible(true);
                    messageCountSinceLastSuggestion.current = 0; 
                }
            }
        }, [currentConversation?.messages, suggestionVisible, showNewChatStart, scrollToBottom, isSending]);
        
        const handleStopGenerating = useCallback((messageIdToStop) => {
            if (aiResponseTimers.current[messageIdToStop]) {
                clearTimeout(aiResponseTimers.current[messageIdToStop]);
                delete aiResponseTimers.current[messageIdToStop];
            }
            const conversationIdForStop = currentConversation?.id || chatId;
            if (conversationIdForStop && messageIdToStop) {
                updateMessage(conversationIdForStop, messageIdToStop, "Génération arrêtée par l'utilisateur.", false);
            }
            setIsSending(false); 
            setActiveThinkingMessageId(null);
            toast({ title: "Génération arrêtée", description: "Alya a cessé de générer une réponse." });
        }, [chatId, updateMessage, currentConversation?.id]);

        const handleSendMessage = useCallback(async (text, isResend = false, originalMessageId = null, conversationIdToUse, attachedFiles = []) => {
            
            const targetConversationId = conversationIdToUse || chatId;

            if (!targetConversationId || (!text.trim() && attachedFiles.length === 0)) {
                 if (isSending && activeThinkingMessageId) {
                    handleStopGenerating(activeThinkingMessageId);
                }
                return;
            }

            if (isSending && activeThinkingMessageId) {
                handleStopGenerating(activeThinkingMessageId);
                return;
            }


            setIsSending(true);
            if (suggestionVisible) {
                setSuggestionVisible(false);
                setActiveSuggestion(null);
            }
        
            if (isResend && originalMessageId) {
                editUserMessage(targetConversationId, originalMessageId, text);
            } else {
                addMessage(targetConversationId, 'user', text, attachedFiles);
            }
            messageCountSinceLastSuggestion.current +=1;
            scrollToBottom('auto');
            
            const thinkingMessageId = addMessage(targetConversationId, 'ai', '', [], true); 
            setActiveThinkingMessageId(thinkingMessageId);
            scrollToBottom('auto');
        
            const timerId = setTimeout(() => {
                const aiResponseText = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                updateMessage(targetConversationId, thinkingMessageId, aiResponseText, false);
                setIsSending(false);
                setActiveThinkingMessageId(null);
                scrollToBottom();
                delete aiResponseTimers.current[thinkingMessageId];
            }, 1200 + Math.random() * 1300);
            aiResponseTimers.current[thinkingMessageId] = timerId;
        }, [addMessage, chatId, editUserMessage, scrollToBottom, suggestionVisible, updateMessage, isSending, activeThinkingMessageId, handleStopGenerating]);

        const handleStartConversationFromWelcome = useCallback((newConvId, initialMessage, attachedFiles = []) => {
            handleSendMessage(initialMessage, false, null, newConvId, attachedFiles);
            navigate(`/app/chat/${newConvId}`, { replace: true });
            setShowNewChatStart(false);
        }, [navigate, handleSendMessage]);

        const handleEditRequest = useCallback((messageId, currentText) => {
            setEditingMessageText(currentText); 
        }, []);

        const handleResendEditedMessage = useCallback((conversationId, messageId, newText) => {
            handleSendMessage(newText, true, messageId, conversationId);
            setEditingMessageText(''); 
        }, [handleSendMessage]);


        const handleSuggestionAccept = useCallback((suggestionId, actionType) => {
            const suggestion = proactiveSuggestionsSamples.find(s => s.id === suggestionId);
            toast({ title: `Action: ${suggestion?.title || 'Suggestion acceptée'}`, description: `Simulation: Alya va ${actionType || 'procéder'}.`});
            setSuggestionVisible(false);
            setActiveSuggestion(null);
            messageCountSinceLastSuggestion.current = 0;
            
            if(!chatId) return;

            addMessage(chatId, 'user', `Je suis intéressé(e) par : "${suggestion?.title}"`);
            const thinkingMsgId = addMessage(chatId, 'ai', '', [], true);
            setActiveThinkingMessageId(thinkingMsgId);
             const timerId = setTimeout(() => {
                updateMessage(chatId, thinkingMsgId, `Parfait ! Concernant "${suggestion?.title}", voici ce que je peux faire... (simulation)`, false);
                setIsSending(false);
                setActiveThinkingMessageId(null);
                scrollToBottom();
                delete aiResponseTimers.current[thinkingMsgId];
            }, 1000);
            aiResponseTimers.current[thinkingMsgId] = timerId;
        }, [addMessage, chatId, scrollToBottom, updateMessage]);

        const handleSuggestionDismiss = useCallback((suggestionId) => {
            setSuggestionVisible(false);
            setActiveSuggestion(null);
            messageCountSinceLastSuggestion.current = 0; 
        }, []);

        const chatPageContent = () => {
            if (showNewChatStart) {
                return <NewChatStartPage 
                            onStartConversation={handleStartConversationFromWelcome} 
                            chatInputLayoutId="chat-input-area" 
                        />;
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
                <>
                  <ChatMessagesList
                    messages={currentConversation.messages}
                    onEditRequest={handleEditRequest}
                    onStopGenerating={activeThinkingMessageId ? () => handleStopGenerating(activeThinkingMessageId) : undefined}
                    onResendEdited={handleResendEditedMessage}
                    conversationId={chatId}
                  />
                     {activeSuggestion && suggestionVisible && (
                        <ProactiveSuggestionCard
                            suggestion={activeSuggestion}
                            onAccept={handleSuggestionAccept}
                            onDismiss={handleSuggestionDismiss}
                            onVisibleChange={setSuggestionVisible}
                        />
                    )}
                  <ChatInput 
                    layoutId="chat-input-area"
                    onSendMessage={(text, isResend, originalMessageId, _convId, attachedFilesParam) => handleSendMessage(text, isResend, originalMessageId, chatId, attachedFilesParam)}
                    isSending={isSending} 
                    activeConversationId={chatId}
                    initialText={editingMessageText}
                    clearInitialText={() => setEditingMessageText('')}
                    onStopGenerating={activeThinkingMessageId ? () => handleStopGenerating(activeThinkingMessageId) : undefined}
                    activeThinkingMessageId={activeThinkingMessageId}
                  />
                </>
            );
        }

        return (
            <motion.div 
              className="flex flex-col h-full bg-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={showNewChatStart ? 'new-chat' : (chatId || 'empty-chat')}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="flex flex-col h-full"
                    >
                        {chatPageContent()}
                    </motion.div>
                </AnimatePresence>
            </motion.div>
        );
    };

    export default ChatPage;