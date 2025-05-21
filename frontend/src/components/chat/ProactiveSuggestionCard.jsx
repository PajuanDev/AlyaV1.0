import React from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Sparkles, Lightbulb, Zap, X } from 'lucide-react';
    import { motion, AnimatePresence } from 'framer-motion';

    const suggestionIcons = {
      default: Sparkles,
      idea: Lightbulb,
      action: Zap,
    };

    const ProactiveSuggestionCard = ({ suggestion, onAccept, onDismiss, onVisibleChange }) => {
      const [isVisible, setIsVisible] = React.useState(true);

      React.useEffect(() => {
        if (typeof onVisibleChange === 'function') {
          onVisibleChange(isVisible);
        }
      }, [isVisible, onVisibleChange]);

      const handleDismiss = (e) => {
        e.stopPropagation();
        setIsVisible(false);
        if (onDismiss) onDismiss(suggestion.id);
      };
      
      const handleAccept = (e) => {
        e.stopPropagation();
        setIsVisible(false);
        if (onAccept) onAccept(suggestion.id, suggestion.actionType);
      }

      const IconComponent = suggestionIcons[suggestion.iconType] || suggestionIcons.default;

      return (
        <AnimatePresence>
          {isVisible && (
            <motion.div 
                initial={{opacity:0, y:20, scale: 0.95}} 
                animate={{opacity:1, y:0, scale: 1}} 
                exit={{opacity:0, y:10, scale: 0.9, transition: {duration: 0.2}}}
                transition={{delay:0.1, type: 'spring', stiffness:200, damping:25}}
                className="mx-1 md:mx-2 mb-3"
            >
             <Card className="border-primary/30 bg-gradient-to-br from-primary/5 via-background to-background shadow-lg relative overflow-hidden backdrop-blur-sm hover:shadow-primary/10 transition-shadow duration-300">
                <Button variant="ghost" size="icon" onClick={handleDismiss} className="absolute top-2.5 right-2.5 h-7 w-7 text-muted-foreground hover:text-foreground z-10">
                    <X className="h-4 w-4" />
                </Button>
                <CardHeader className="pb-2.5 pt-4 pr-10">
                    <CardTitle className="text-primary flex items-center text-sm font-semibold">
                        <IconComponent className="mr-2 h-4 w-4" /> {suggestion.title || "Suggestion d'Alya"}
                    </CardTitle>
                </CardHeader>
                <CardContent className="pb-4">
                    <p className="text-xs text-foreground/80 mb-3">{suggestion.description}</p>
                    <div className="flex space-x-2">
                        <Button size="sm" className="btn-primary-solid flex-1 h-8 text-xs" onClick={handleAccept}>
                            {suggestion.acceptLabel || "Oui, allons-y !"}
                        </Button>
                        <Button size="sm" variant="outline" className="border-border hover:bg-muted flex-1 h-8 text-xs" onClick={handleDismiss}>
                           {suggestion.dismissLabel || "Plus tard"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
            </motion.div>
          )}
        </AnimatePresence>
      );
    };

    export default ProactiveSuggestionCard;