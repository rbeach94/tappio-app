import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ProfileCardProps {
  profile: {
    id: string;
    nfc_codes?: {
      code: string;
    };
    full_name?: string;
    job_title?: string;
    company?: string;
  };
}

export const ProfileCard = ({ profile }: ProfileCardProps) => {
  const navigate = useNavigate();

  // Fetch visit count
  const { data: visitCount } = useQuery({
    queryKey: ['profile-visits', profile.id],
    queryFn: async () => {
      console.log('Fetching visit count for profile:', profile.id);
      const { count, error } = await supabase
        .from('profile_visits')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id);
      
      if (error) {
        console.error('Error fetching visit count:', error);
        throw error;
      }
      
      return count || 0;
    },
  });

  // Fetch click count
  const { data: clickCount } = useQuery({
    queryKey: ['profile-clicks', profile.id],
    queryFn: async () => {
      console.log('Fetching click count for profile:', profile.id);
      const { count, error } = await supabase
        .from('profile_button_clicks')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', profile.id);
      
      if (error) {
        console.error('Error fetching click count:', error);
        throw error;
      }
      
      return count || 0;
    },
  });

  const handleEditClick = async () => {
    console.log('Updating NFC code URL for profile:', profile.id);
    
    // Update the NFC code URL with the profile ID
    const { error } = await supabase
      .from('nfc_codes')
      .update({ 
        url: profile.id,
        is_active: true 
      })
      .eq('code', profile.nfc_codes?.code);

    if (error) {
      console.error('Error updating NFC code URL:', error);
      toast.error("Failed to update NFC code URL");
      return;
    }

    console.log('Successfully updated NFC code URL');
    navigate(`/profile/${profile.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Tappio Card {profile.nfc_codes?.code}
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/profile/${profile.id}/view`)}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleEditClick}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium">
              {profile.full_name || "Unnamed Profile"}
            </p>
            {profile.job_title && (
              <p className="text-sm text-muted-foreground">
                {profile.job_title}
              </p>
            )}
            {profile.company && (
              <p className="text-sm text-muted-foreground">
                {profile.company}
              </p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="text-center">
              <p className="text-2xl font-bold">{visitCount || 0}</p>
              <p className="text-xs text-muted-foreground">Profile Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{clickCount || 0}</p>
              <p className="text-xs text-muted-foreground">Button Clicks</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};