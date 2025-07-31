import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

import { v4 as uuidv4 } from 'uuid';
import AuthContext from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

const ChatContext = createContext(null);
const API_URL = process.env.VITE_API_URL;

export const ChatProvider = ({ children }) => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !token) {
        setConversations([]);
        setProjects([]);
        setIsLoadingConversation(false);
        return;
=======
    import { v4 as uuidv4 } from 'uuid';
    import AuthContext from '@/contexts/AuthContext';
    import { toast } from '@/components/ui/use-toast';

    const ChatContext = createContext(null);

    const initialConversationsData = [
      {
        id: 'welcome-chat',
        name: 'Bienvenue sur Alya',
        messages: [
          { id: uuidv4(), sender: 'ai', text: 'Bonjour ! Je suis Alya, votre assistante IA. Comment puis-je vous aider aujourd\'hui ?', timestamp: new Date().toISOString(), isThinking: false, isEdited: false, attachments: [] },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        settings: { enableHistory: true, aiModel: 'alya-standard', temperature: 0.7 },
        projectId: null,
        archived: false,

      }
    ];

    const initialProjectsData = [
        { id: 'proj1', name: 'Marketing Q3' },
        { id: 'proj2', name: 'Développement Produit X' },
        { id: 'proj3', name: 'Recherche UX IA' },
    ];

    const loadFromLocalStorage = (key, defaultValue, userId) => {
      if (!userId) return defaultValue;
      const storedValue = localStorage.getItem(`${key}_${userId}`);
      if (storedValue) {
        try {
          return JSON.parse(storedValue);
        } catch (e) {
          console.error(`Failed to parse ${key} from localStorage:`, e);
          return defaultValue;
        }
      }
      return defaultValue;
    };

    const saveToLocalStorage = (key, value, userId) => {
      if (!userId) return;
      localStorage.setItem(`${key}_${userId}`, JSON.stringify(value));
    };

    const normalizeConversation = (conv) => ({
      ...conv,
      settings: conv.settings || { enableHistory: true, aiModel: 'alya-standard', temperature: 0.7 },
      projectId: conv.projectId === undefined ? null : conv.projectId,
      archived: conv.archived === undefined ? false : conv.archived,
      messages: (conv.messages || []).map(m => ({ ...m, attachments: m.attachments || [] })),
    });

    export const ChatProvider = ({ children }) => {
      const { user } = useContext(AuthContext);
      const [conversations, setConversations] = useState([]);
      const [projects, setProjects] = useState([]);
      const [activeConversationId, setActiveConversationId] = useState(null);
      const [isLoadingConversation, setIsLoadingConversation] = useState(true);

      useEffect(() => {
        setIsLoadingConversation(true);
        if (user) {
          const loadedConversations = loadFromLocalStorage('alyaConversations', initialConversationsData, user.id).map(normalizeConversation);
          setConversations(loadedConversations);
          
          const loadedProjects = loadFromLocalStorage('alyaProjects', initialProjectsData, user.id);
          setProjects(loadedProjects);

          const lastActiveId = localStorage.getItem(`lastActiveConv_${user.id}`);
          if (lastActiveId && loadedConversations.find(c => c.id === lastActiveId)) {
            setActiveConversationId(lastActiveId);
          } else {
            const firstRelevantConv = loadedConversations.filter(c => !c.archived).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0] 
                                   || loadedConversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
            if (firstRelevantConv) {
              setActiveConversationId(firstRelevantConv.id);
              localStorage.setItem(`lastActiveConv_${user.id}`, firstRelevantConv.id);
            }
          }
        } else {
          setConversations([]);
          setProjects([]);
          setActiveConversationId(null);
        }
        setIsLoadingConversation(false);
      }, [user]);
      
      useEffect(() => {
        if (user && !isLoadingConversation) {
          saveToLocalStorage('alyaConversations', conversations, user.id);
        }
      }, [conversations, user, isLoadingConversation]);

      useEffect(() => {
        if (user && !isLoadingConversation) {
          saveToLocalStorage('alyaProjects', projects, user.id);
        }
      }, [projects, user, isLoadingConversation]);

      useEffect(() => {
        if (user && activeConversationId && !isLoadingConversation) {
          localStorage.setItem(`lastActiveConv_${user.id}`, activeConversationId);
        }
      }, [activeConversationId, user, isLoadingConversation]);

      const updateConversationsState = (updater) => {
        setConversations(prev => updater(prev).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)));
      };

      const createConversation = useCallback((name = 'Nouvelle Conversation', projectId = null) => {
        if (!user) return null;
        const newConversation = normalizeConversation({
          id: uuidv4(),
          name,
          messages: [{ id: uuidv4(), sender: 'ai', text: 'Nouvelle conversation initiée. Comment puis-je vous aider ?', timestamp: new Date().toISOString() }],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          projectId,
        });
        updateConversationsState(prev => [newConversation, ...prev]);
        setActiveConversationId(newConversation.id);
        toast({ title: "Conversation créée", description: `"${name}" a été ajoutée.`});
        return newConversation.id;
      }, [user]);

      const deleteConversation = useCallback((id) => {
        if (!user) return;
        const convToDelete = conversations.find(c => c.id === id);
        updateConversationsState(prev => prev.filter(conv => conv.id !== id));
        if (activeConversationId === id) {
            const remainingConversations = conversations.filter(c => c.id !== id && !c.archived);
            const nextActive = remainingConversations.length > 0 ? remainingConversations.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0].id : null;
            setActiveConversationId(nextActive);
        }
        toast({ title: "Conversation supprimée", description: `"${convToDelete?.name}" a été supprimée.`, variant: "destructive"});
      }, [user, conversations, activeConversationId]);
      
      const renameConversation = useCallback((id, newName) => {
        if (!user) return;
        updateConversationsState(prev => prev.map(conv => conv.id === id ? { ...conv, name: newName, updatedAt: new Date().toISOString() } : conv));
      }, [user]);

      const updateConversationSettings = useCallback((id, newSettings) => {
        if (!user) return;
        updateConversationsState(prev => prev.map(conv => conv.id === id ? { ...conv, settings: {...conv.settings, ...newSettings}, updatedAt: new Date().toISOString() } : conv));
      }, [user]);

      const archiveConversation = useCallback((id, archiveStatus) => {
        if (!user) return;
        updateConversationsState(prev => prev.map(conv => conv.id === id ? { ...conv, archived: archiveStatus, updatedAt: new Date().toISOString() } : conv));
        if (archiveStatus && activeConversationId === id) {
            const nextActive = conversations.filter(c => c.id !== id && !c.archived).sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]?.id || null;
            setActiveConversationId(nextActive);
        }
      }, [user, conversations, activeConversationId]);
      
      const assignConversationToProject = useCallback((conversationId, projectId) => {
        if (!user) return;
        updateConversationsState(prev => prev.map(conv => conv.id === conversationId ? { ...conv, projectId, updatedAt: new Date().toISOString() } : conv));
      }, [user]);

      const addMessage = useCallback((conversationId, sender, text, attachments = [], isThinking = false) => {
        if (!user) return null;
        const newMessage = { id: uuidv4(), sender, text, timestamp: new Date().toISOString(), isThinking, isEdited: false, attachments };
        updateConversationsState(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { ...conv, messages: [...conv.messages, newMessage], updatedAt: new Date().toISOString() }
              : conv
          )
        );
        return newMessage.id;
      }, [user]);

      const updateMessage = useCallback((conversationId, messageId, newText, isThinking = false) => {
        if (!user) return;
         updateConversationsState(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? { 
                  ...conv, 
                  messages: conv.messages.map(msg => 
                    msg.id === messageId 
                    ? { ...msg, text: newText, isThinking, timestamp: new Date().toISOString() } 
                    : msg
                  ),
                  updatedAt: new Date().toISOString() 
                }
              : conv
          )
        );
      }, [user]);

      const editUserMessage = useCallback((conversationId, messageId, newText) => {
        if (!user) return;
        updateConversationsState(prev =>
          prev.map(conv =>
            conv.id === conversationId
              ? {
                  ...conv,
                  messages: conv.messages.map(msg =>
                    msg.id === messageId && msg.sender === 'user'
                      ? { ...msg, text: newText, timestamp: new Date().toISOString(), isEdited: true }
                      : msg
                  ),
                  updatedAt: new Date().toISOString()
                }
              : conv
          )
        );
      }, [user]);
      
      const getConversationById = useCallback((id) => {
        return conversations.find(conv => conv.id === id);
      }, [conversations]);
      
      const activeConversation = conversations.find(conv => conv.id === activeConversationId);

      const createProject = useCallback((name) => {
        if (!user) return;
        const newProject = { id: `proj${Date.now()}`, name };
        setProjects(prev => [newProject, ...prev]);
        toast({ title: "Projet créé", description: `Le projet "${name}" a été ajouté.` });
        return newProject.id;
      }, [user]);
    
      const renameProject = useCallback((id, newName) => {
        if (!user) return;
        setProjects(prev => prev.map(p => p.id === id ? { ...p, name: newName } : p));
        toast({ title: "Projet renommé", description: `Nouveau nom : "${newName}".` });
      }, [user]);
    
      const deleteProject = useCallback((id) => {
        if (!user) return;
        const projectToDelete = projects.find(p => p.id === id);
        setProjects(prev => prev.filter(p => p.id !== id));
        updateConversationsState(prevConvs => prevConvs.map(c => c.projectId === id ? { ...c, projectId: null } : c));
        toast({ title: "Projet supprimé", description: `Le projet "${projectToDelete?.name}" et ses conversations associées ont été mis à jour.`, variant: "destructive" });
      }, [user, projects]);


      return (
        <ChatContext.Provider value={{ 
          conversations, 
          projects,
          activeConversationId, 
          setActiveConversationId, 
          createConversation, 
          deleteConversation,
          renameConversation,
          updateConversationSettings,
          archiveConversation,
          assignConversationToProject,
          addMessage,
          updateMessage,
          editUserMessage,
          activeConversation,
          getConversationById,
          isLoadingConversation,
          createProject,
          renameProject,
          deleteProject
        }}>
          {children}
        </ChatContext.Provider>
      );
    };

    export default ChatContext;