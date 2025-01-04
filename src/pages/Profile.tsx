import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileButtons } from "@/components/profile/ProfileButtons";
import { ColorPickerSection } from "@/components/profile/ColorPickerSection";
import { ButtonForm } from "@/components/profile/ButtonForm";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { useProfileData } from "@/hooks/useProfileData";
import { Tables } from "@/integrations/supabase/types";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  if (!id) return null;

  const {
    profile,
    buttons,
    isLoading,
    error,
    updateProfile,
    addButton,
    deleteButton,
    reorderButtons,
  } = useProfileData(id);

  const handleButtonClick = (button: any) => {
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

  const handleFormSubmit = async (formData: FormData) => {
    const buttonData = {
      label: formData.get('label'),
      action_type: formData.get('action_type'),
      action_value: formData.get('action_value'),
    };
    addButton.mutate(buttonData);
  };

  const handleReorder = (reorderedButtons: Tables<"profile_buttons">[]) => {
    reorderButtons.mutate(
      reorderedButtons.map((button, index) => ({
        id: button.id,
        sort_order: index,
      }))
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading profile</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <ProfileHeader 
            profile={profile}
            isLoading={isLoading}
            error={error}
          />

          <LogoUpload
            profileId={profile.id}
            logoUrl={profile.logo_url}
            onLogoUpdate={(url) => updateProfile.mutate({ logo_url: url })}
          />
          
          <div className="grid gap-8">
            <ColorPickerSection
              profile={profile}
              onColorChange={(updates) => updateProfile.mutate(updates)}
            />

            <ProfileForm
              profile={profile}
              onUpdate={updateProfile.mutate}
              onSave={() => {}}
              showColorPicker={null}
              setShowColorPicker={() => {}}
            />

            <div className="space-y-6">
              <ButtonForm
                buttonColor={profile.button_color || '#8899ac'}
                buttonTextColor={profile.button_text_color || '#000000'}
                onSubmit={handleFormSubmit}
              />

              <ProfileButtons
                buttons={buttons || []}
                buttonColor={profile.button_color || '#8899ac'}
                buttonTextColor={profile.button_text_color || '#000000'}
                onDelete={(buttonId) => deleteButton.mutate(buttonId)}
                onButtonClick={handleButtonClick}
                onReorder={handleReorder}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;