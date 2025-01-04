import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface ProfileButtonsProps {
  buttons: Tables<"profile_buttons">[];
  buttonColor: string;
  buttonTextColor: string;
  onDelete: (buttonId: string) => void;
  onButtonClick: (button: Tables<"profile_buttons">) => void;
  onAdd?: (buttonData: any) => void; // Added onAdd as optional prop
}

export const ProfileButtons = ({ 
  buttons, 
  buttonColor, 
  buttonTextColor, 
  onDelete, 
  onButtonClick,
  onAdd 
}: ProfileButtonsProps) => {
  return (
    <div className="space-y-4">
      {buttons?.map((button) => (
        <div key={button.id} className="flex gap-2">
          <Button
            className="flex-1"
            style={{ 
              backgroundColor: buttonColor,
              color: buttonTextColor
            }}
            onClick={() => onButtonClick(button)}
          >
            {button.label}
          </Button>
          <Button
            variant="destructive"
            onClick={() => onDelete(button.id)}
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
};