import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileHeader } from "@/components/profile/view/ProfileHeader";
import { SaveContactButton } from "@/components/profile/view/SaveContactButton";
import { ProfileButtons } from "@/components/profile/view/ProfileButtons";
import { ProfileBio } from "@/components/profile/view/ProfileBio";

const ViewProfile = () => {
  const { id } = useParams<{ id: string }>();
  console.log('ViewProfile component mounted with id:', id);

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      console.log('Fetching profile data for id:', id);
      const { data, error } = await supabase
        .from('nfc_profiles')
        .select(`
          *,
          profile_buttons (
            id,
            label,
            action_type,
            action_value,
            sort_order
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      console.log('Profile data received:', data);
      return data;
    },
    enabled: !!id,
  });

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Profile</h1>
        <p className="text-gray-600 mb-4">There was an error loading this profile. Please try again later.</p>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p className="text-sm text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
        <p className="text-gray-600 mb-4">The profile you're looking for doesn't exist or you don't have permission to view it.</p>
        <Button 
          onClick={() => window.location.href = '/dashboard'}
          variant="outline"
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen p-4"
      style={{
        backgroundColor: profile.background_color || '#15202B',
        color: profile.text_color || '#FFFFFF',
      }}
    >
      <div className="max-w-md mx-auto space-y-6">
        <ProfileHeader profile={profile} />
        <SaveContactButton profile={profile} />
        <ProfileButtons profile={profile} buttons={profile.profile_buttons} />
        <ProfileBio bio={profile.bio} />
      </div>
    </div>
  );
};

export default ViewProfile;