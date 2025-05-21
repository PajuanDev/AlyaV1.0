import React from 'react';
    import { motion } from 'framer-motion';
    import IntegrationCard from '@/components/integrations/IntegrationCard';

    const IntegrationsGrid = ({ integrations, onConnect, onDisconnect, onManage, loadingStates, filterType }) => {
        const integrationsToDisplay = filterType === 'all' 
            ? integrations 
            : (filterType === 'connected' ? integrations.filter(i => i.connected) : integrations.filter(i => !i.connected));

        if (integrationsToDisplay.length === 0) {
            return <p className="col-span-full text-center text-muted-foreground py-8">Aucune intégration ne correspond à vos filtres pour cette catégorie.</p>;
        }

        return (
            <motion.div 
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
                initial="hidden"
                animate="visible"
            >
                {integrationsToDisplay.map(integration => (
                <IntegrationCard 
                    key={integration.id} 
                    integration={integration} 
                    onConnect={onConnect}
                    onDisconnect={onDisconnect}
                    onManage={onManage}
                    isConnected={integration.connected}
                    isLoading={loadingStates[integration.id] || false}
                />
                ))}
            </motion.div>
        );
    };

    export default IntegrationsGrid;