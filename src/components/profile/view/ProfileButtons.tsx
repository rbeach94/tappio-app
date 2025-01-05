import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

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
  const handleButtonClick = async (button: { id: string, action_type: string, action_value: string }) => {
    // Record the button click
    console.log('Recording button click:', { buttonId: button.id, profileId: profile.id });
    const { error } = await supabase
      .from('profile_button_clicks')
      .insert({
        button_id: button.id,
        profile_id: profile.id
      });

    if (error) {
      console.error('Error recording button click:', error);
    }

    // Perform the button action
    switch (button.action_type) {
      case 'link':
        window.open(button.action_value, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:${button.action_value}`;
        break;
      case 'call':
        window.location.href = `tel:${button.action_value}`;
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
          onClick={() => handleButtonClick(button)}
        >
          {button.label}
        </Button>
      ))}
    </div>
  );
};