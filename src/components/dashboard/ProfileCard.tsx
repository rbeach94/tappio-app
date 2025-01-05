import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
      </CardContent>
    </Card>
  );
};