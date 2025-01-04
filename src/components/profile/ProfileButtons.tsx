import { Button } from "@/components/ui/button";
import { ProfileButton } from "@/hooks/useProfileButtons";
import { Trash2 } from "lucide-react";

interface ProfileButtonsProps {
  buttons: ProfileButton[];
  onDelete: (id: string) => void;
  isDeleting: boolean;
}

export const ProfileButtons = ({ buttons, onDelete, isDeleting }: ProfileButtonsProps) => {
  return (
    <div className="space-y-4">
      {buttons.map((button) => (
        <div key={button.id} className="flex items-center justify-between p-4 bg-card rounded-lg">
          <div>
            <h3 className="font-medium">{button.label}</h3>
            <p className="text-sm text-muted-foreground">
              {button.action_type}: {button.action_value}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(button.id)}
            disabled={isDeleting}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  );
};