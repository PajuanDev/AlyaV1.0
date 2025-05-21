import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { motion } from 'framer-motion';
    import { Building, Users, Briefcase } from 'lucide-react';

    const itemVariants = {
        hidden: { opacity: 0, x: -15 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    const CompanyStep = ({ data, onChange }) => {
      const handleChange = (e) => {
        onChange({ ...data, [e.target.name]: e.target.value });
      };
      const handleSelectChange = (name, value) => {
        onChange({ ...data, [name]: value });
      };

      return (
        <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 }}}}
        >
          <motion.div variants={itemVariants}>
            <Label htmlFor="companyName" className="flex items-center text-base font-medium mb-1.5">
                <Building className="mr-2 h-5 w-5 text-primary/80" /> Nom de votre entreprise/projet
            </Label>
            <Input id="companyName" name="companyName" value={data?.companyName || ''} onChange={handleChange} placeholder="Ex: Innovatech Solutions, Projet Alpha..." />
            <p className="text-xs text-muted-foreground mt-1">Cela nous aide à personnaliser les suggestions d'Alya.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="companySize" className="flex items-center text-base font-medium mb-1.5">
                <Users className="mr-2 h-5 w-5 text-primary/80" /> Taille de l'entreprise
            </Label>
            <Select name="companySize" onValueChange={(value) => handleSelectChange('companySize', value)} value={data?.companySize || ''}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez une taille" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="solo">Indépendant / Solo</SelectItem>
                <SelectItem value="1-10">Très Petite Entreprise (1-10 employés)</SelectItem>
                <SelectItem value="11-50">Petite Entreprise (11-50 employés)</SelectItem>
                <SelectItem value="51-200">Moyenne Entreprise (51-200 employés)</SelectItem>
                <SelectItem value="201-1000">Grande Entreprise (201-1000 employés)</SelectItem>
                <SelectItem value="1000+">Très Grande Entreprise (1000+ employés)</SelectItem>
              </SelectContent>
            </Select>
             <p className="text-xs text-muted-foreground mt-1">Utile pour adapter les fonctionnalités collaboratives.</p>
          </motion.div>

           <motion.div variants={itemVariants}>
            <Label htmlFor="industry" className="flex items-center text-base font-medium mb-1.5">
                <Briefcase className="mr-2 h-5 w-5 text-primary/80" /> Secteur d'activité principal
            </Label>
            <Input id="industry" name="industry" value={data?.industry || ''} onChange={handleChange} placeholder="Ex: Logiciels SaaS, Conseil en Stratégie, E-commerce B2C, Santé..." />
            <p className="text-xs text-muted-foreground mt-1">Alya peut adapter ses connaissances et suggestions à votre domaine spécifique.</p>
          </motion.div>
        </motion.div>
      );
    };

    export default CompanyStep;