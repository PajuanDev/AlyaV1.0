import React from 'react';
    import { motion } from 'framer-motion';
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
    import { Button } from '@/components/ui/button';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuLabel,
      DropdownMenuSeparator,
      DropdownMenuTrigger,
      DropdownMenuGroup,
    } from "@/components/ui/dropdown-menu";
    import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
    import { User, Settings, LogOut, ChevronDown, Sun, Moon, CreditCard, LifeBuoy } from 'lucide-react';
    import { useAuth } from '@/auth/AuthContext';
    import { useTheme } from '@/contexts/ThemeProvider';
    import { useNavigate } from 'react-router-dom';

    const UserProfileDropdown = () => {
      const { user, logout } = useAuth();
      const { theme, setTheme } = useTheme();
      const navigate = useNavigate();

      const handleLogout = () => {
        logout();
        navigate('/auth');
      };

      const getInitials = (name) => {
        if (!name) return "?";
        const names = name.split(' ');
        if (names.length === 1) return names[0].charAt(0).toUpperCase();
        return names[0].charAt(0).toUpperCase() + names[names.length - 1].charAt(0).toUpperCase();
      };

      if (!user) {
        return null; 
      }
      
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 px-2 py-1 h-auto rounded-full hover:bg-muted/80 dark:hover:bg-muted/50 focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-background">
              <Avatar className="h-7 w-7">
                <AvatarImage src={user.avatarUrl || `https://avatar.vercel.sh/${user.email}.png`} alt={user.name || user.email} />
                <AvatarFallback className="bg-primary/20 text-primary text-xs font-semibold">
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium hidden sm:inline text-foreground">{user.name || user.email.split('@')[0]}</span>
              <ChevronDown className="h-3 w-3 text-muted-foreground hidden sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{user.name || "Utilisateur"}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate('/app/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/app/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
               <DropdownMenuItem onClick={() => navigate('/pricing')}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Abonnement</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
              <span>{theme === "dark" ? "Mode Clair" : "Mode Sombre"}</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/app/documentation')}>
              <LifeBuoy className="mr-2 h-4 w-4" />
              <span>Support & Docs</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:bg-destructive/10 focus:text-destructive dark:focus:text-red-400">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    };

    export default UserProfileDropdown;