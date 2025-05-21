import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '@/auth/AuthContext';      // ← NOUVEL import
import { toast } from '@/components/ui/use-toast';

const ChatContext = createContext(null);

/* -------------------------------------------------------------------------- */
/* Données d'exemple (messages / projets)                                     */
/* -------------------------------------------------------------------------- */
const initialConversationsData = [
  {
    id: 'welcome-chat',
    name: 'Bienvenue sur Alya',
    messages: [
      {
        id: uuidv4(),
        sender: 'ai',
        text: "Bonjour ! Je suis Alya, votre assistante IA. Comment puis-je vous aider aujourd’hui ?",
        timestamp: new Date().toISOString(),
        isThinking: false,
        isEdited: false,
        attachments: [],
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: { enableHistory: true, aiModel: 'alya-standard', temperature: 0.7 },
    projectId: null,
    archived: false,
  },
];

const initialProjectsData = [
  { id: 'proj1', name: 'Marketing Q3' },
  { id: 'proj2', name: 'Développement Produit X' },
  { id: 'proj3', name: 'Recherche UX IA' },
];

/* -------------------------------------------------------------------------- */
/* Helpers localStorage                                                       */
/* -------------------------------------------------------------------------- */
const loadFromLocalStorage = (key, defaultValue, userId) => {
  if (!userId) return defaultValue;
  const stored = localStorage.getItem(`${key}_${userId}`);
  if (!stored) return defaultValue;
  try {
    return JSON.parse(stored);
  } catch (err) {
    console.error(`Failed to parse ${key}`, err);
    return defaultValue;
  }
};

const saveToLocalStorage = (key, value, userId) => {
  if (!userId) return;
  localStorage.setItem(`${key}_${userId}`, JSON.stringify(value));
};

/* Normalise la structure d’une conversation */
const normalizeConversation = (conv) => ({
  ...conv,
  settings: conv.settings || {
    enableHistory: true,
    aiModel: 'alya-standard',
    temperature: 0.7,
  },
  projectId: conv.projectId === undefined ? null : conv.projectId,
  archived: conv.archived ?? false,
  messages: (conv.messages || []).map((m) => ({
    ...m,
    attachments: m.attachments || [],
  })),
});

/* -------------------------------------------------------------------------- */
/* Provider                                                                   */
/* -------------------------------------------------------------------------- */
export const ChatProvider = ({ children }) => {
  const { user } = useAuth();                       // ← nouveau hook
  const [conversations, setConversations] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);

  /* Charge les données quand l'utilisateur change ----------------------- */
  useEffect(() => {
    setIsLoadingConversation(true);

    if (user) {
      const loadedConvs = loadFromLocalStorage(
        'alyaConversations',
        initialConversationsData,
        user.id,
      ).map(normalizeConversation);
      setConversations(loadedConvs);

      const loadedProjects = loadFromLocalStorage(
        'alyaProjects',
        initialProjectsData,
        user.id,
      );
      setProjects(loadedProjects);

      const lastActive = localStorage.getItem(`lastActiveConv_${user.id}`);
      if (lastActive && loadedConvs.find((c) => c.id === lastActive)) {
        setActiveConversationId(lastActive);
      } else {
        const firstRelevant =
          loadedConvs
            .filter((c) => !c.archived)
            .sort(
              (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
            )[0] || loadedConvs[0];
        if (firstRelevant) {
          setActiveConversationId(firstRelevant.id);
          localStorage.setItem(
            `lastActiveConv_${user.id}`,
            firstRelevant.id,
          );
        }
      }
    } else {
      /* Pas connecté → reset */
      setConversations([]);
      setProjects([]);
      setActiveConversationId(null);
    }

    setIsLoadingConversation(false);
  }, [user]);

  /* Persistance ---------------------------------------------------------- */
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
      localStorage.setItem(
        `lastActiveConv_${user.id}`,
        activeConversationId,
      );
    }
  }, [activeConversationId, user, isLoadingConversation]);

  /* Helpers ---------------------------------------------------------------- */
  const updateConversationsState = (updater) => {
    setConversations((prev) =>
      updater(prev).sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
      ),
    );
  };

  /* Actions conversation --------------------------------------------------- */
  const createConversation = useCallback(
    (name = 'Nouvelle Conversation', projectId = null) => {
      if (!user) return null;
      const newConv = normalizeConversation({
        id: uuidv4(),
        name,
        messages: [
          {
            id: uuidv4(),
            sender: 'ai',
            text: 'Nouvelle conversation initiée. Comment puis-je vous aider ?',
            timestamp: new Date().toISOString(),
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        projectId,
      });
      updateConversationsState((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      toast({
        title: 'Conversation créée',
        description: `"${name}" a été ajoutée.`,
      });
      return newConv.id;
    },
    [user],
  );

  const deleteConversation = useCallback(
    (id) => {
      if (!user) return;
      const convToDelete = conversations.find((c) => c.id === id);
      updateConversationsState((prev) => prev.filter((c) => c.id !== id));

      if (activeConversationId === id) {
        const next = conversations
          .filter((c) => c.id !== id && !c.archived)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
          ?.id;
        setActiveConversationId(next || null);
      }
      toast({
        title: 'Conversation supprimée',
        description: `"${convToDelete?.name}" a été supprimée.`,
        variant: 'destructive',
      });
    },
    [user, conversations, activeConversationId],
  );

  const renameConversation = useCallback(
    (id, newName) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, name: newName, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    },
    [user],
  );

  const updateConversationSettings = useCallback(
    (id, newSettings) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === id
            ? {
                ...c,
                settings: { ...c.settings, ...newSettings },
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [user],
  );

  const archiveConversation = useCallback(
    (id, archive) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, archived: archive, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
      if (archive && activeConversationId === id) {
        const next = conversations
          .filter((c) => c.id !== id && !c.archived)
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0]
          ?.id;
        setActiveConversationId(next || null);
      }
    },
    [user, conversations, activeConversationId],
  );

  const assignConversationToProject = useCallback(
    (conversationId, projectId) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? { ...c, projectId, updatedAt: new Date().toISOString() }
            : c,
        ),
      );
    },
    [user],
  );

  /* Messages -------------------------------------------------------------- */
  const addMessage = useCallback(
    (
      conversationId,
      sender,
      text,
      attachments = [],
      isThinking = false,
    ) => {
      if (!user) return null;
      const msg = {
        id: uuidv4(),
        sender,
        text,
        timestamp: new Date().toISOString(),
        isThinking,
        isEdited: false,
        attachments,
      };
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, msg],
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
      return msg.id;
    },
    [user],
  );

  const updateMessage = useCallback(
    (conversationId, messageId, newText, isThinking = false) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId
                    ? {
                        ...m,
                        text: newText,
                        isThinking,
                        timestamp: new Date().toISOString(),
                      }
                    : m,
                ),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [user],
  );

  const editUserMessage = useCallback(
    (conversationId, messageId, newText) => {
      if (!user) return;
      updateConversationsState((prev) =>
        prev.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === messageId && m.sender === 'user'
                    ? {
                        ...m,
                        text: newText,
                        timestamp: new Date().toISOString(),
                        isEdited: true,
                      }
                    : m,
                ),
                updatedAt: new Date().toISOString(),
              }
            : c,
        ),
      );
    },
    [user],
  );

  /* Projets --------------------------------------------------------------- */
  const createProject = useCallback(
    (name) => {
      if (!user) return;
      const newProject = { id: `proj${Date.now()}`, name };
      setProjects((prev) => [newProject, ...prev]);
      toast({
        title: 'Projet créé',
        description: `Le projet "${name}" a été ajouté.`,
      });
      return newProject.id;
    },
    [user],
  );

  const renameProject = useCallback(
    (id, newName) => {
      if (!user) return;
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, name: newName } : p)),
      );
      toast({
        title: 'Projet renommé',
        description: `Nouveau nom : "${newName}".`,
      });
    },
    [user],
  );

  const deleteProject = useCallback(
    (id) => {
      if (!user) return;
      const projToDel = projects.find((p) => p.id === id);
      setProjects((prev) => prev.filter((p) => p.id !== id));
      updateConversationsState((prev) =>
        prev.map((c) => (c.projectId === id ? { ...c, projectId: null } : c)),
      );
      toast({
        title: 'Projet supprimé',
        description: `Le projet "${projToDel?.name}" a été supprimé.`,
        variant: 'destructive',
      });
    },
    [user, projects],
  );

  /* Helpers --------------------------------------------------------------- */
  const getConversationById = useCallback(
    (id) => conversations.find((c) => c.id === id),
    [conversations],
  );

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId,
  );

  /* Provider value -------------------------------------------------------- */
  const value = {
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
    deleteProject,
  };

  return (
    <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
  );
};

/* Hook */
export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
};

export default ChatContext;
