import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added this import
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  console.log('Profile component mounted with id:', id);

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

  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
      const { error } = await supabase
        .from('nfc_profiles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved successfully.",
      });
    },
  });

  const addButton = useMutation({
    mutationFn: async (buttonData: {
      label: string;
      action_type: 'link' | 'email' | 'call';
      action_value: string;
    }) => {
      const { error } = await supabase
        .from('profile_buttons')
        .insert({
          profile_id: id,
          ...buttonData,
          sort_order: profile?.profile_buttons?.length || 0,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast({
        title: "Button added",
        description: "New button has been added successfully.",
      });
    },
  });

  const deleteButton = useMutation({
    mutationFn: async (buttonId: string) => {
      const { error } = await supabase
        .from('profile_buttons')
        .delete()
        .eq('id', buttonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast({
        title: "Button deleted",
        description: "The button has been removed successfully.",
      });
    },
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
        <p className="text-gray-600 mb-4">There was an error loading your profile. Please try again later.</p>
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
        <LogoUpload 
          profileId={profile.id}
          logoUrl={profile.logo_url}
          onLogoUpdate={(url) => updateProfile.mutate({ logo_url: url })}
        />

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

        <ProfileForm
          profile={profile}
          onUpdate={updateProfile.mutate}
          onSave={generateVCard}
          showColorPicker={showColorPicker}
          setShowColorPicker={setShowColorPicker}
        />

        {/* Custom Buttons */}
        <div className="space-y-4">
          {profile.profile_buttons?.map((button) => (
            <div key={button.id} className="flex gap-2">
              <Button
                className="flex-1"
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
              <Button
                variant="destructive"
                onClick={() => deleteButton.mutate(button.id)}
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {/* Add Button Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            addButton.mutate({
              label: formData.get('label') as string,
              action_type: formData.get('action_type') as 'link' | 'email' | 'call',
              action_value: formData.get('action_value') as string,
            });
            (e.target as HTMLFormElement).reset();
          }}
          className="space-y-4"
        >
          <Input name="label" placeholder="Button Label" required className="text-black" />
          <select name="action_type" required className="w-full p-2 rounded border text-black">
            <option value="link">Link</option>
            <option value="email">Email</option>
            <option value="call">Call</option>
          </select>
          <Input name="action_value" placeholder="URL/Email/Phone" required className="text-black" />
          <Button 
            type="submit" 
            className="w-full"
            style={{ 
              backgroundColor: profile.button_color || '#8899ac',
              color: profile.button_text_color || '#FFFFFF'
            }}
          >
            Add Button
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Profile;