import React, { useState, useEffect, useRef } from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { Input } from '@/components/ui/input';
    import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
    import { Button } from '@/components/ui/button';
    import { HelpCircle, Search, ChevronDown, Loader2, Lightbulb, FileText } from 'lucide-react';
    import { Link } from 'react-router-dom';

    const allFaqData = [
      {
        id: 'what-is-alya',
        question: "Qu'est-ce qu'Alya AI ?",
        answer: "Alya AI est un assistant intelligent avancé conçu pour les professionnels exigeants et les startups innovantes. Elle vous aide à optimiser votre productivité en automatisant des tâches complexes, en gérant intelligemment vos communications, en accédant rapidement à l'information pertinente et bien plus, le tout via une interface de chat intuitive, personnalisable et intégrée à vos outils existants.",
        category: "Général",
        keywords: ["alya", "assistant", "ia", "intelligence artificielle", "productivité"]
      },
      {
        id: 'connect-apps',
        question: "Comment puis-je connecter mes applications (Slack, Gmail, Trello, HubSpot, etc.) ?",
        answer: "Connecter vos applications tierces est simple et sécurisé. Rendez-vous sur la page 'Intégrations' de votre tableau de bord. Alya supporte la connexion via OAuth 2.0 (recommandé) ou clé API, selon le service. Suivez simplement les instructions détaillées pour chaque intégration. Des tutoriels vidéo et guides pas-à-pas sont disponibles pour les connexions les plus courantes dans notre section 'Tutoriels'.",
        category: "Intégrations",
        keywords: ["slack", "gmail", "trello", "hubspot", "oauth", "api", "connexion", "intégration"]
      },
      {
        id: 'data-security',
        question: "La sécurité de mes données est-elle garantie avec Alya ?",
        answer: "Absolument. La sécurité et la confidentialité de vos données sont notre priorité absolue. Nous utilisons des protocoles de chiffrement robustes (AES-256) pour les données au repos et en transit, des serveurs sécurisés en Europe (conforme RGPD), et des mesures de sécurité multicouches pour protéger vos informations. Pour plus de détails techniques, consultez notre politique de confidentialité exhaustive et la section sécurité de notre documentation.",
        category: "Sécurité",
        keywords: ["sécurité", "confidentialité", "données", "rgpd", "chiffrement", "protection"]
      },
      {
        id: 'free-plan',
        question: "Puis-je utiliser Alya gratuitement pour tester ses capacités ?",
        answer: "Oui, Alya propose un plan Gratuit ('Découverte') qui vous permet d'explorer les fonctionnalités de base, de réaliser un nombre limité d'automatisations et d'évaluer son potentiel pour votre activité. Pour des fonctionnalités avancées (recherche web illimitée, nombre d'intégrations supérieur, support prioritaire, etc.), vous pouvez opter pour nos plans Pro ou Entreprise. Consultez la page 'Abonnements' pour un comparatif détaillé et transparent.",
        category: "Abonnements",
        keywords: ["gratuit", "plan", "abonnement", "prix", "essai", "découverte"]
      },
      {
        id: 'how-automations-work',
        question: "Comment fonctionnent les automatisations intelligentes d'Alya ?",
        answer: "Les automatisations vous permettent de définir des déclencheurs (ex: un email reçu avec un certain mot-clé, un événement calendrier à venir, un nouveau fichier dans un dossier spécifique) et des actions correspondantes (ex: créer une tâche Trello, envoyer une notification Slack, générer un brouillon d'email). Alya peut également analyser vos habitudes et votre workflow pour vous suggérer proactivement des automatisations pertinentes et personnalisées, vous faisant gagner un temps précieux.",
        category: "Automatisations",
        keywords: ["automatisation", "workflow", "tâches", "déclencheur", "action", "productivité"]
      },
      {
        id: 'voice-commands',
        question: "Alya peut-elle comprendre des commandes vocales et répondre oralement ?",
        answer: "Oui, Alya intègre une reconnaissance vocale de pointe pour que vous puissiez dicter vos requêtes et commandes de manière naturelle. La synthèse vocale pour les réponses d'Alya est également disponible (désactivable dans les paramètres), vous permettant une interaction entièrement mains libres si vous le souhaitez, idéal en déplacement ou pour le multitâche.",
        category: "Fonctionnalités",
        keywords: ["vocal", "voix", "commande", "dictée", "synthèse", "accessibilité"]
      },
      {
        id: 'file-analysis',
        question: "Quels types de fichiers Alya peut-elle analyser et comment ?",
        answer: "Alya peut analyser une grande variété de formats de fichiers : PDF (y compris scannés avec OCR), documents Word (.docx, .doc), feuilles de calcul Excel (.xlsx, .xls), présentations PowerPoint (.pptx), images (.png, .jpg avec OCR), et fichiers texte (.txt, .md). Elle peut en extraire le contenu, le structurer, le résumer, répondre à vos questions spécifiques sur ces documents, et même utiliser ces informations pour des automatisations.",
        category: "Fonctionnalités",
        keywords: ["fichier", "analyse", "pdf", "word", "excel", "ocr", "document", "extraction"]
      },
      {
        id: 'customization',
        question: "Puis-je personnaliser le comportement et les réponses d'Alya ?",
        answer: "Oui, la personnalisation est au cœur d'Alya. Lors de l'onboarding et à tout moment dans les paramètres de votre profil, vous pouvez définir vos préférences : ton des réponses d'Alya (formel, amical, concis...), vos domaines d'intérêt principaux, vos outils favoris, et les intégrations prioritaires. Alya apprend continuellement de vos interactions pour s'adapter dynamiquement à votre style de travail et à vos besoins spécifiques.",
        category: "Personnalisation",
        keywords: ["personnalisation", "préférences", "comportement", "ton", "adaptation", "ia"]
      },
    ];
    
    const categories = ["Tous", "Général", "Intégrations", "Sécurité", "Abonnements", "Automatisations", "Fonctionnalités", "Personnalisation"];

    const FAQPage = () => {
      const [searchTerm, setSearchTerm] = useState('');
      const [filteredFaqs, setFilteredFaqs] = useState(allFaqData);
      const [isSearching, setIsSearching] = useState(false);
      const [activeCategory, setActiveCategory] = useState("Tous");
      const searchInputRef = useRef(null);


      useEffect(() => {
        performSearch(searchTerm, activeCategory);
      }, [searchTerm, activeCategory]);
      
      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
      
      const handleCategoryChange = (category) => {
        setActiveCategory(category);
      }

      const performSearch = (term, category) => {
        setIsSearching(true);
        // Simulate API delay for better UX
        setTimeout(() => {
            let results = allFaqData;
            if (category !== "Tous") {
                results = results.filter(faq => faq.category === category);
            }
            if (term.trim()) {
                const lowerTerm = term.toLowerCase();
                results = results.filter(
                    faq =>
                    faq.question.toLowerCase().includes(lowerTerm) ||
                    faq.answer.toLowerCase().includes(lowerTerm) ||
                    (faq.keywords && faq.keywords.some(kw => kw.toLowerCase().includes(lowerTerm)))
                );
            }
            setFilteredFaqs(results);
            setIsSearching(false);
        }, 250); 
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.1 } }
      };

      const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 12 } }
      };

      return (
        <motion.div 
          className="space-y-8 max-w-4xl mx-auto pb-16"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center pt-8">
            <HelpCircle className="h-16 w-16 md:h-20 md:w-20 text-primary mx-auto mb-4 opacity-90" />
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">Foire Aux Questions</h1>
            <p className="mt-3 text-md sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Trouvez rapidement les réponses à vos interrogations les plus fréquentes sur Alya AI.
            </p>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="sticky top-[60px] md:top-[68px] z-30 bg-background/90 dark:bg-background/80 backdrop-blur-lg py-3.5 px-3 rounded-b-xl shadow-md border-b border-border"
          >
            <div className="relative mb-3">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                {isSearching && <Loader2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-primary animate-spin" />}
                <Input 
                ref={searchInputRef}
                type="text" 
                placeholder="Rechercher une question, un mot-clé..." 
                className="w-full pl-10 pr-10 py-2.5 text-base rounded-lg border-2 bg-card focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-sm"
                value={searchTerm}
                onChange={handleSearchChange}
                />
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
                {categories.map(cat => (
                    <Button 
                        key={cat} 
                        variant={activeCategory === cat ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => handleCategoryChange(cat)}  
                        className={`transition-all text-xs sm:text-sm ${activeCategory === cat ? 'btn-primary-solid shadow-md' : 'border-border hover:bg-accent/80 dark:hover:bg-accent/50'}`}
                    >
                        {cat}
                    </Button>
                ))}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="px-1 sm:px-2">
            {filteredFaqs.length > 0 ? (
                 <Card className="bg-card/80 backdrop-blur-sm shadow-lg border-border/70">
                    <CardContent className="p-3 sm:p-5">
                        <Accordion type="single" collapsible className="w-full">
                        {filteredFaqs.map((item) => (
                            <AccordionItem value={item.id} key={item.id} className="border-b border-border/60 last:border-b-0">
                            <AccordionTrigger className="text-left hover:no-underline text-base font-semibold py-4 pr-2 group focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-card rounded-md">
                                <span className="flex-1">{item.question}</span>
                                <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180 group-data-[state=open]:text-primary" />
                            </AccordionTrigger>
                            <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4 pl-1 pr-2 prose-sm dark:prose-invert max-w-none">
                                {item.answer.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
                            </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </CardContent>
                </Card>
            ) : (
                 <motion.div 
                    variants={itemVariants} 
                    className="text-center py-12 px-4 bg-card/60 rounded-xl border border-dashed border-border/70 shadow-sm"
                    initial={{ opacity: 0, y:10 }} animate={{ opacity:1, y:0 }}
                >
                    <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-xl font-semibold text-foreground">Aucune question trouvée</h3>
                    <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                        {searchTerm ? `Nous n'avons pas trouvé de réponse pour "${searchTerm}"` : `Aucune question dans la catégorie "${activeCategory}" pour le moment.`}
                        <br/>Essayez d'élargir votre recherche, de sélectionner "Tous" ou consultez notre documentation complète.
                    </p>
                     <Button variant="outline" size="sm" className="mt-6" onClick={() => { setSearchTerm(''); setActiveCategory('Tous'); searchInputRef.current?.focus();}}>
                        Réinitialiser la recherche
                    </Button>
                </motion.div>
            )}
          </motion.div>
          
          <motion.div variants={itemVariants} className="text-center mt-12">
            <p className="text-muted-foreground mb-2">Vous ne trouvez pas ce que vous cherchez ?</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3">
                <Button asChild variant="outline" className="border-primary/70 text-primary hover:bg-primary/10 hover:text-primary">
                    <Link to="/app/documentation"><FileText className="mr-2 h-4 w-4"/> Explorer la Documentation</Link>
                </Button>
                <Button asChild variant="default" className="btn-primary-solid">
                    <Link to="/contact">Contacter le Support</Link>
                </Button>
            </div>
          </motion.div>
        </motion.div>
      );
    };

    export default FAQPage;