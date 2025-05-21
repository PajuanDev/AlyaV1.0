import React, { useState, useRef } from 'react';
    import { useNavigate } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Bot, Sparkles, FileText, BrainCircuit, MessageSquarePlus, Zap } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import ChatInput from '@/components/chat/ChatInput';
    import useChat from '@/hooks/useChat';
    import AlyaLogo from '@/components/AlyaLogo';

    const suggestionCards = [
      {
        icon: <FileText className="h-5 w-5 text-primary" />,
        title: "Analyser un document",
        description: "Importez un PDF ou un texte pour en extraire les points clés.",
        prompt: "Peux-tu analyser ce document et me donner un résumé ?",
        action: "upload_doc"
      },
      {
        icon: <BrainCircuit className="h-5 w-5 text-primary" />,
        title: "Brainstormer des idées",
        description: "Lancez une session de brainstorming sur un nouveau projet.",
        prompt: "Aidons-moi à brainstormer des idées pour un nouveau service de livraison écologique.",
        action: "brainstorm"
      },
      {
        icon: <MessageSquarePlus className="h-5 w-5 text-primary" />,
        title: "Rédiger un e-mail",
        description: "Préparez rapidement un e-mail professionnel ou créatif.",
        prompt: "Rédige un e-mail de suivi pour un client potentiel après une démonstration.",
        action: "draft_email"
      },
      {
        icon: <Zap className="h-5 w-5 text-primary" />,
        title: "Planifier une tâche",
        description: "Organisez votre travail en créant des tâches intelligentes.",
        prompt: "Crée une tâche pour finaliser la présentation marketing avant vendredi.",
        action: "create_task"
      },
    ];

    const NewChatStartPage = ({ onStartConversation }) => {
      const { createConversation } = useChat();
      const navigate = useNavigate();
      const [initialMessage, setInitialMessage] = useState('');
      const [attachedFilesForNewChat, setAttachedFilesForNewChat] = useState([]);

      const handleSuggestionClick = (prompt) => {
        setInitialMessage(prompt);
      };

      const handleSendMessage = (text, isResend, originalMessageId, convId, files) => {
        const messageText = typeof text === 'string' ? text : '';
        const newConversationId = createConversation(messageText.substring(0, 30) || "Nouvelle Discussion");
        if (newConversationId) {
          onStartConversation(newConversationId, messageText, files);
        }
      };
      
      const clearInitialText = () => {
        setInitialMessage('');
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.07, delayChildren: 0.1 }
        }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 120, damping: 15 } }
      };

      return (
        <motion.div 
          className="flex flex-col h-full items-center justify-between p-4 md:p-6 bg-gradient-to-br from-background via-accent/5 to-background"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="flex-grow flex flex-col items-center justify-center w-full max-w-3xl">
            <motion.div variants={itemVariants} className="mb-4 md:mb-6">
               <AlyaLogo className="h-16 w-auto md:h-20 text-primary" animated />
            </motion.div>
            <motion.h1 variants={itemVariants} className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-center">
              Bonjour ! Comment puis-je vous aider aujourd'hui ?
            </motion.h1>
            <motion.p variants={itemVariants} className="text-muted-foreground text-sm md:text-base mb-6 md:mb-8 text-center max-w-lg">
              Commencez par écrire votre message ci-dessous ou choisissez l'une de nos suggestions.
            </motion.p>

            <motion.div 
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full mb-6 md:mb-8"
            >
              {suggestionCards.map((card) => (
                <motion.div key={card.title} variants={itemVariants} className="w-full">
                  <Card 
                    className="hover:shadow-lg hover:border-primary/30 transition-all duration-200 cursor-pointer h-full bg-card/70 backdrop-blur-sm border-border/50"
                    onClick={() => handleSuggestionClick(card.prompt)}
                  >
                    <CardHeader className="flex flex-row items-center space-x-3 pb-2 pt-4 px-4">
                      {card.icon}
                      <CardTitle className="text-sm font-semibold leading-tight">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground pb-4 px-4 leading-snug">
                      {card.description}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <div className="w-full max-w-3xl sticky bottom-0">
            <ChatInput
                onSendMessage={(text, _isResend, _originalMessageId, _convId, files) => handleSendMessage(text, false, null, null, files)}
                isSending={false} 
                initialText={initialMessage}
                clearInitialText={clearInitialText}
                layoutId="chat-input-main"
            />
          </div>
        </motion.div>
      );
    };

    export default NewChatStartPage;