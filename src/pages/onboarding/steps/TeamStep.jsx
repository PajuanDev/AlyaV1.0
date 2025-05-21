import React from 'react';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
    import { motion } from 'framer-motion';
    import { Users, UserCheck, Briefcase } from 'lucide-react';

    const itemVariants = {
        hidden: { opacity: 0, x: -15 },
        visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
    };

    const TeamStep = ({ data, onChange }) => {
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
            <Label htmlFor="teamSize" className="flex items-center text-base font-medium mb-1.5">
                <Users className="mr-2 h-5 w-5 text-primary/80" /> Taille de votre équipe directe
            </Label>
             <Select name="teamSize" onValueChange={(value) => handleSelectChange('teamSize', value)} value={data?.teamSize || ''}>
              <SelectTrigger><SelectValue placeholder="Sélectionnez la taille de votre équipe" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="just-me">Je travaille seul(e)</SelectItem>
                <SelectItem value="2-5">Petite équipe (2-5 personnes)</SelectItem>
                <SelectItem value="6-10">Équipe moyenne (6-10 personnes)</SelectItem>
                <SelectItem value="11-20">Grande équipe (11-20 personnes)</SelectItem>
                <SelectItem value="21+">Très grande équipe ou département (21+)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">Avec combien de collègues travaillez-vous le plus étroitement ?</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="role" className="flex items-center text-base font-medium mb-1.5">
                <UserCheck className="mr-2 h-5 w-5 text-primary/80" /> Votre rôle principal dans l'équipe
            </Label>
            <Input id="role" name="role" value={data?.role || ''} onChange={handleChange} placeholder="Ex: Chef de projet, Développeur Full-Stack, Responsable Marketing..." />
            <p className="text-xs text-muted-foreground mt-1">Cela aide Alya à comprendre vos responsabilités et vos besoins spécifiques.</p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Label htmlFor="collaborationTools" className="flex items-center text-base font-medium mb-1.5">
                <Briefcase className="mr-2 h-5 w-5 text-primary/80" /> Outils de collaboration favoris (Optionnel)
            </Label>
            <Input id="collaborationTools" name="collaborationTools" value={data?.collaborationTools || ''} onChange={handleChange} placeholder="Ex: Slack, Microsoft Teams, Asana, Jira, Figma..." />
            <p className="text-xs text-muted-foreground mt-1">Mentionnez les outils que votre équipe utilise quotidiennement pour collaborer.</p>
          </motion.div>
        </motion.div>
      );
    };

    export default TeamStep;