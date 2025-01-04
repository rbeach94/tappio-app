import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  const generateVCard = () => {
    if (!profile) return;
    
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name || ''}
ORG:${profile.company || ''}
TITLE:${profile.job_title || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email || ''}
URL:${profile.website || ''}
NOTE:${profile.bio || ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.full_name || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        {/* Logo */}
        {profile.logo_url && (
          <div className="text-center">
            <img 
              src={profile.logo_url} 
              alt="Business Logo" 
              className="w-32 h-32 mx-auto object-contain rounded-lg"
            />
          </div>
        )}

        {/* Profile Information */}
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold">{profile.full_name}</h1>
          {profile.job_title && <p className="text-lg">{profile.job_title}</p>}
          {profile.company && <p className="text-lg">{profile.company}</p>}
          {profile.email && <p>{profile.email}</p>}
          {profile.phone && <p>{profile.phone}</p>}
          {profile.website && <p>{profile.website}</p>}
        </div>

        {/* Save Contact Button */}
        <Button 
          onClick={generateVCard}
          className="w-full"
          style={{ 
            backgroundColor: profile.button_color || '#8899ac',
            color: profile.button_text_color || '#FFFFFF'
          }}
        >
          Save My Contact
        </Button>

        {/* Custom Buttons */}
        <div className="space-y-4">
          {profile.profile_buttons?.map((button) => (
            <Button
              key={button.id}
              className="w-full"
              style={{ 
                backgroundColor: profile.button_color || '#8899ac',
                color: profile.button_text_color || '#FFFFFF'
              }}
              onClick={() => {
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
              }}
            >
              {button.label}
            </Button>
          ))}
        </div>

        {/* Bio */}
        {profile.bio && (
          <div className="prose max-w-none">
            <p>{profile.bio}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfile;