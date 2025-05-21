import React, { useState, useCallback, useEffect } from 'react';
    import { v4 as uuidv4 } from 'uuid';
    import { formatDistanceToNow } from 'date-fns';
    import { fr } from 'date-fns/locale';
    import { Settings2, BellRing, MessageSquare, Zap, AlertTriangle } from 'lucide-react';

    const initialMockNotifications = [
      { id: uuidv4(), type: 'new_feature', title: 'Analyse de PDF améliorée', description: 'Découvrez notre nouvelle capacité d\'analyse de documents PDF complexes.', date: new Date(Date.now() - 1000 * 60 * 30).toISOString(), read: false, icon: <Settings2 className="h-5 w-5 text-blue-500" />, category: 'Fonctionnalité', link: '/app/documentation#pdf-analysis' },
      { id: uuidv4(), type: 'integration_update', title: 'Google Drive connecté', description: 'Votre intégration Google Drive est maintenant active et supporte les dossiers partagés.', date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), read: false, icon: <BellRing className="h-5 w-5 text-green-500" />, category: 'Intégration', link: '/app/integrations#drive' },
      { id: uuidv4(), type: 'conversation_reminder', title: 'Rappel: Projet Alpha', description: 'N\'oubliez pas de finaliser le rapport pour le Projet Alpha.', date: new Date(Date.now() - 1000 * 60 * 5).toISOString(), read: false, icon: <MessageSquare className="h-5 w-5 text-yellow-500" />, category: 'Conversation', link: '/app/chat/conv2' },
      { id: uuidv4(), type: 'automation_success', title: 'Automatisation "Rapport Hebdo" OK', description: 'Votre automatisation "Rapport Hebdomadaire Ventes" a été exécutée avec succès.', date: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(), read: true, icon: <Zap className="h-5 w-5 text-purple-500" />, category: 'Automatisation', link: '/app/automations#auto1' },
      { id: uuidv4(), type: 'security_alert', title: 'Connexion inhabituelle détectée', description: 'Une connexion a été détectée depuis un nouvel emplacement. Veuillez vérifier.', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), read: true, icon: <AlertTriangle className="h-5 w-5 text-red-500" />, category: 'Sécurité', link: '/app/settings#security' },
    ];
    
    const useNotifications = () => {
      const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('alya-notifications');
        if (savedNotifications) {
            try {
                const parsed = JSON.parse(savedNotifications);
                return parsed.map(n => ({
                    ...n,
                    date: new Date(n.date), 
                    icon: n.icon ? React.cloneElement(eval(n.iconString), { className: "h-5 w-5", style:{color: n.iconColor || 'currentColor'}}) : <BellRing className="h-5 w-5 text-gray-500" />
                }));
            } catch (error) {
                console.error("Failed to parse notifications from localStorage", error);
                localStorage.removeItem('alya-notifications');
            }
        }
        return initialMockNotifications.map(n => ({...n, date: new Date(n.date) }));
      });

      useEffect(() => {
        localStorage.setItem('alya-notifications', JSON.stringify(
            notifications.map(n => ({
                ...n,
                date: n.date.toISOString(),
                iconString: n.icon ? n.icon.type.name : 'BellRing',
                iconColor: n.icon && n.icon.props.className ? n.icon.props.className.match(/text-(.*?)-(\d+)/)?.[0] : 'text-gray-500'
            }))
        ));
      }, [notifications]);

      const addNotification = useCallback((notification) => {
        const iconElement = notification.icon || <BellRing className="h-5 w-5 text-gray-500" />;
        const newNotification = { 
            ...notification, 
            id: uuidv4(), 
            date: new Date(), 
            read: false,
            icon: iconElement,
        };
        setNotifications(prev => [newNotification, ...prev.slice(0, 19)]); 
      }, []);

      const markAsRead = useCallback((id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      }, []);

      const markAllAsRead = useCallback(() => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }, []);

      const deleteNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, []);

      const clearAllNotifications = useCallback(() => {
        setNotifications([]);
      }, []);
      
      const unreadCount = notifications.filter(n => !n.read).length;

      return {
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        formatDistanceToNow: (date) => formatDistanceToNow(new Date(date), { addSuffix: true, locale: fr }),
      };
    };

    export default useNotifications;