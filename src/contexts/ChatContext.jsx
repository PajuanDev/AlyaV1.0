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
      }
      try {
        const [convRes, projRes] = await Promise.all([
          fetch(`${API_URL}/api/conversations`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/api/projects`, { headers: { Authorization: `Bearer ${token}` } })
        ]);
        const convs = await convRes.json();
        const projs = await projRes.json();
        setConversations(convs);
        setProjects(projs);
        setActiveConversationId(convs[0]?._id || null);
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoadingConversation(false);
      }
    };
    setIsLoadingConversation(true);
    fetchData();
  }, [user, token]);

  const createConversation = useCallback(async (name = 'Nouvelle Conversation', projectId = null) => {
    if (!token) return null;
    const res = await fetch(`${API_URL}/api/conversations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name, projectId, messages: [], settings: { enableHistory: true, aiModel: 'alya-standard', temperature: 0.7 }, archived: false })
    });
    const conv = await res.json();
    setConversations(prev => [conv, ...prev]);
    setActiveConversationId(conv._id);
    toast({ title: 'Conversation créée' });
    return conv._id;
  }, [token]);

  const deleteConversation = useCallback(async (id) => {
    if (!token) return;
    await fetch(`${API_URL}/api/conversations/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setConversations(prev => prev.filter(c => c._id !== id));
  }, [token]);

  const renameConversation = useCallback(async (id, newName) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newName })
    });
    const conv = await res.json();
    setConversations(prev => prev.map(c => c._id === id ? conv : c));
  }, [token]);

  const updateConversationSettings = useCallback(async (id, newSettings) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ settings: newSettings })
    });
    const conv = await res.json();
    setConversations(prev => prev.map(c => c._id === id ? conv : c));
  }, [token]);

  const archiveConversation = useCallback(async (id, archiveStatus) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/conversations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ archived: archiveStatus })
    });
    const conv = await res.json();
    setConversations(prev => prev.map(c => c._id === id ? conv : c));
  }, [token]);

  const assignConversationToProject = useCallback(async (conversationId, projectId) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/conversations/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ projectId })
    });
    const conv = await res.json();
    setConversations(prev => prev.map(c => c._id === conversationId ? conv : c));
  }, [token]);

  const addMessage = useCallback(async (conversationId, sender, text, attachments = [], isThinking = false) => {
    if (!token) return null;
    const res = await fetch(`${API_URL}/api/conversations/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ $push: { messages: { sender, text, attachments, isThinking, timestamp: new Date(), id: uuidv4(), isEdited: false } } })
    });
    const conv = await res.json();
    setConversations(prev => prev.map(c => c._id === conversationId ? conv : c));
    return conv.messages[conv.messages.length - 1]?.id;
  }, [token]);

  const updateMessage = useCallback(async (conversationId, messageId, newText, isThinking = false) => {
    if (!token) return;
    const conv = conversations.find(c => c._id === conversationId);
    if (!conv) return;
    const messages = conv.messages.map(m => m.id === messageId ? { ...m, text: newText, isThinking, timestamp: new Date() } : m);
    await fetch(`${API_URL}/api/conversations/${conversationId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ messages })
    });
    setConversations(prev => prev.map(c => c._id === conversationId ? { ...c, messages } : c));
  }, [token, conversations]);

  const editUserMessage = useCallback(async (conversationId, messageId, newText) => {
    if (!token) return;
    await updateMessage(conversationId, messageId, newText);
  }, [updateMessage, token]);

  const getConversationById = useCallback((id) => {
    return conversations.find(conv => conv._id === id);
  }, [conversations]);

  const activeConversation = conversations.find(conv => conv._id === activeConversationId);

  const createProject = useCallback(async (name) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    });
    const proj = await res.json();
    setProjects(prev => [proj, ...prev]);
    toast({ title: 'Projet créé' });
    return proj._id;
  }, [token]);

  const renameProject = useCallback(async (id, newName) => {
    if (!token) return;
    const res = await fetch(`${API_URL}/api/projects/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: newName })
    });
    const proj = await res.json();
    setProjects(prev => prev.map(p => p._id === id ? proj : p));
  }, [token]);

  const deleteProject = useCallback(async (id) => {
    if (!token) return;
    await fetch(`${API_URL}/api/projects/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    setProjects(prev => prev.filter(p => p._id !== id));
    setConversations(prev => prev.map(c => c.projectId === id ? { ...c, projectId: null } : c));
  }, [token]);

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
