import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link2 } from 'lucide-react';

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
    };
    
    const ProactiveIntegrationSuggestion = ({ title, description, buttonText, onClick, icon: IconComponent }) => (
        <motion.div 
            variants={itemVariants} 
            className="p-5 bg-gradient-to-r from-primary/5 via-accent/5 to-secondary/5 rounded-xl border border-dashed border-primary/20"
        >
            <div className="flex items-start md:items-center space-x-4">
                {IconComponent && <IconComponent className="h-10 w-10 text-primary flex-shrink-0 mt-1 md:mt-0" />}
                <div>
                    <h3 className="text-lg font-semibold text-primary">{String(title)}</h3>
                    <p className="text-sm text-muted-foreground mt-1 mb-3 leading-relaxed">{String(description)}</p>
                    <Button variant="outline" size="sm" onClick={onClick} className="border-primary/40 text-primary hover:bg-primary/10">
                        {String(buttonText)} <Link2 className="ml-2 h-4 w-4" />
                    </Button>
                </div>
            </div>
        </motion.div>
    );

    export default ProactiveIntegrationSuggestion;