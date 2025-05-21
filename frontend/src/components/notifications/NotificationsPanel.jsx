import React from 'react';
    import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
    import { Button } from '@/components/ui/button';
    import { ScrollArea } from '@/components/ui/scroll-area';
    import { BellRing, CheckCheck, Trash2, X } from 'lucide-react';
    import { Badge } from '@/components/ui/badge';
    import useNotifications from '@/hooks/useNotifications';
    import { useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';

    const NotificationItem = ({ notification, onMarkAsRead, onDelete, onNavigate, isLast }) => {
      const navigate = useNavigate();
      const notificationsHook = useNotifications(); 

      const handleClick = () => {
        if (notification.link) {
          navigate(notification.link);
        }
        if (!notification.read) {
            onMarkAsRead(notification.id);
        }
        if (onNavigate) onNavigate(); 
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
          className={`flex items-start space-x-3 p-3 rounded-lg transition-colors duration-150 group
            ${notification.read ? 'bg-transparent hover:bg-muted/40 dark:hover:bg-muted/20' : 'bg-primary/5 hover:bg-primary/10 dark:bg-primary/10 dark:hover:bg-primary/15 border-l-2 border-primary shadow-sm'}
            ${isLast ? '' : 'border-b border-border/30 dark:border-border/20'}`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        >
          <div className="flex-shrink-0 mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
            {notification.icon ? React.cloneElement(notification.icon, { className: "h-5 w-5"}) : <BellRing className="h-5 w-5 text-muted-foreground" />}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{notification.title}</h4>
                <div className="flex items-center space-x-1">
                    {!notification.read && (
                        <Button variant="ghost" size="xs" className="h-6 w-6 p-0 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onMarkAsRead(notification.id); }} aria-label="Marquer comme lu">
                            <CheckCheck className="h-3.5 w-3.5" />
                        </Button>
                    )}
                    <Button variant="ghost" size="xs" className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity" onClick={(e) => { e.stopPropagation(); onDelete(notification.id); }} aria-label="Supprimer la notification">
                        <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">{notification.description}</p>
            <div className="flex items-center justify-between mt-1.5">
                <Badge variant={notification.read ? "outline" : "secondary"} className={`text-xs py-0.5 px-1.5 border-border/70 ${notification.read ? 'opacity-70' : ''}`}>{notification.category}</Badge>
                <p className="text-xs text-muted-foreground/80">
                    {notificationsHook.formatDistanceToNow(notification.date)}
                </p>
            </div>
          </div>
        </motion.div>
      );
    };

    const NotificationsPanel = ({ isOpen, onOpenChange }) => {
      const { 
        notifications, 
        unreadCount, 
        markAsRead, 
        markAllAsRead, 
        deleteNotification,
        clearAllNotifications,
      } = useNotifications();
      
      return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
          <SheetContent className="w-full sm:max-w-md p-0 flex flex-col bg-card border-l border-border shadow-2xl">
            <SheetHeader className="p-4 border-b border-border sticky top-0 bg-card z-10">
              <div className="flex justify-between items-center">
                <SheetTitle className="text-xl font-semibold flex items-center text-foreground">
                  <BellRing className="mr-2 h-5 w-5 text-primary" />
                  Notifications
                  {unreadCount > 0 && 
                    <Badge variant="default" className="ml-2 bg-primary text-primary-foreground animate-pulse">
                        {unreadCount}
                    </Badge>}
                </SheetTitle>
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
                        <X className="h-5 w-5" />
                    </Button>
                </SheetClose>
              </div>
              {notifications.length > 0 && (
                <SheetDescription className="text-xs text-muted-foreground mt-0.5">
                    {unreadCount > 0 ? `Vous avez ${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}.` : "Toutes les notifications sont lues."}
                </SheetDescription>
              )}
            </SheetHeader>
            
            <ScrollArea className="flex-grow custom-scrollbar">
              <div className="p-1.5 space-y-0">
                <AnimatePresence>
                {notifications.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-16 px-4"
                  >
                    <BellRing className="mx-auto h-16 w-16 text-muted-foreground/30 mb-4" />
                    <p className="mt-2 text-md font-medium text-muted-foreground">Boîte de réception vide</p>
                    <p className="text-sm text-muted-foreground/80">Vos notifications importantes apparaîtront ici.</p>
                  </motion.div>
                ) : (
                  notifications.map((notif, index) => (
                    <NotificationItem 
                        key={notif.id} 
                        notification={notif} 
                        onMarkAsRead={markAsRead} 
                        onDelete={deleteNotification}
                        onNavigate={() => onOpenChange(false)}
                        isLast={index === notifications.length -1}
                    />
                  ))
                )}
                </AnimatePresence>
              </div>
            </ScrollArea>
            
            {notifications.length > 0 && (
                <SheetFooter className="p-3 border-t border-border bg-muted/30 dark:bg-muted/10 flex flex-row justify-between items-center gap-2">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10" 
                    onClick={clearAllNotifications}
                >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Tout effacer
                </Button>
                <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs border-border/70" 
                    onClick={markAllAsRead}
                    disabled={unreadCount === 0}
                >
                    <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                    Tout marquer comme lu
                </Button>
                </SheetFooter>
            )}
          </SheetContent>
        </Sheet>
      );
    };

    export default NotificationsPanel;