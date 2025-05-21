import React from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
    import { Calendar } from "@/components/ui/calendar";
    import { format } from "date-fns";
    import { fr } from "date-fns/locale";
    import { BellRing } from 'lucide-react';

    const ConversationReminder = ({ reminderDate, setReminderDate }) => (
      <div className="space-y-2">
        <Label htmlFor="reminder-date" className="text-sm font-medium text-foreground flex items-center">
          <BellRing className="mr-2 h-4 w-4 text-muted-foreground" /> Définir un rappel
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${!reminderDate && "text-muted-foreground"} bg-background border-border hover:bg-accent/50`}
            >
              {reminderDate ? format(reminderDate, "PPP à HH:mm", { locale: fr }) : <span>Choisir une date et heure</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={reminderDate}
              onSelect={(date) => {
                const currentHours = reminderDate ? reminderDate.getHours() : new Date().getHours();
                const currentMinutes = reminderDate ? reminderDate.getMinutes() : new Date().getMinutes();
                if (date) {
                  date.setHours(currentHours);
                  date.setMinutes(currentMinutes);
                }
                setReminderDate(date);
              }}
              initialFocus
              locale={fr}
            />
            {reminderDate && (
              <div className="p-3 border-t border-border">
                <Label className="text-xs">Heure du rappel</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="time"
                    defaultValue={format(reminderDate, "HH:mm")}
                    onChange={(e) => {
                      const [hours, minutes] = e.target.value.split(':').map(Number);
                      const newDate = new Date(reminderDate);
                      newDate.setHours(hours);
                      newDate.setMinutes(minutes);
                      setReminderDate(newDate);
                    }}
                    className="bg-background border-border focus:border-primary"
                  />
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>
        {reminderDate && (
          <Button variant="link" size="sm" className="text-xs text-destructive p-0 h-auto mt-1" onClick={() => setReminderDate(null)}>
            Effacer le rappel
          </Button>
        )}
      </div>
    );

    export default ConversationReminder;