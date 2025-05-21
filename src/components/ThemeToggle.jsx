import React from "react"
    import { Moon, Sun } from "lucide-react"
    import { useTheme } from "@/contexts/ThemeProvider"
    import { Button } from "@/components/ui/button"
    import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

    export function ThemeToggle() {
      const { theme, setTheme } = useTheme()

      const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
      };

      return (
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={toggleTheme}>
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Changer de thème</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Passer en mode {theme === "light" ? "sombre" : "clair"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    }