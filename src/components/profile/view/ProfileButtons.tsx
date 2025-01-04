import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface ProfileButtonsProps {
  profile: Tables<"nfc_profiles">;
  buttons?: {
    id: string;
    label: string;
    action_type: string;
    action_value: string;
  }[];
}

export const ProfileButtons = ({ profile, buttons }: ProfileButtonsProps) => {
  const handleButtonClick = (action_type: string, action_value: string) => {
    switch (action_type) {
      case 'link':
        window.open(action_value, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${action_value}`;
        break;
      case 'call':
        window.location.href = `tel:${action_value}`;
        break;
    }
  };

  return (
    <div className="space-y-4">
      {buttons?.map((button) => (
        <Button
          key={button.id}
          className="w-full"
          style={{ 
            backgroundColor: profile.button_color || '#8899ac',
            color: profile.button_text_color || '#FFFFFF'
          }}
          onClick={() => handleButtonClick(button.action_type, button.action_value)}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};