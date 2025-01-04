import { useProfileData } from "@/hooks/useProfileData";
import { Card } from "@/components/ui/card";
import { ButtonForm } from "@/components/profile/ButtonForm";
import { ProfileButtons } from "@/components/profile/ProfileButtons";
import { toast } from "sonner";
import { NewProfileButton } from "@/hooks/useProfileButtons";

const Profile = () => {
  const {
    profile,
    buttons,
    addButton,
    deleteButton,
    isLoading,
    isDeleting,
  } = useProfileData("your-profile-id"); // Make sure to pass the correct profile ID

  const handleAddButton = (buttonData: Omit<NewProfileButton, 'profile_id'>) => {
    if (!profile?.id) {
      toast.error("Profile not found");
      return;
    }

    const newButton: NewProfileButton = {
      ...buttonData,
      profile_id: profile.id,
    };

    addButton.mutate(newButton);
  };

  const handleDeleteButton = (id: string) => {
    deleteButton.mutate(id);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="p-6 space-y-6">
        <h2 className="text-2xl font-bold">Profile Buttons</h2>
        <ButtonForm
          onSubmit={handleAddButton}
          isLoading={addButton.isPending}
        />
        <ProfileButtons
          buttons={buttons || []}
          onDelete={handleDeleteButton}
          isDeleting={isDeleting}
        />
      </Card>
    </div>
  );
};

export default Profile;