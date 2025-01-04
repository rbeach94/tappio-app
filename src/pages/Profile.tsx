import { useParams } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Navigation } from "@/components/navigation/Navigation";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileButtons } from "@/components/profile/ProfileButtons";
import { ColorPickerSection } from "@/components/profile/ColorPickerSection";
import { useProfileData } from "@/hooks/useProfileData";

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
  } = useProfileData(id);

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
          <ProfileHeader profile={profile} />
          
          <div className="grid gap-8">
            <ColorPickerSection
              profile={profile}
              onColorChange={(updates) => updateProfile.mutate(updates)}
            />

            <ProfileForm
              profile={profile}
              onSave={(updates) => updateProfile.mutate(updates)}
            />

            <ProfileButtons
              buttons={buttons || []}
              buttonColor={profile.button_color || '#8899ac'}
              buttonTextColor={profile.button_text_color || '#000000'}
              onDelete={(buttonId) => deleteButton.mutate(buttonId)}
              onAdd={(buttonData) => addButton.mutate(buttonData)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;