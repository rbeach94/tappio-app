import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { LogoUpload } from "@/components/profile/LogoUpload";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileButtons } from "@/components/profile/ProfileButtons";
import { ButtonForm } from "@/components/profile/ButtonForm";

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

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
            sort_order,
            created_at,
            profile_id
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

  const handleAddButton = (formData: FormData) => {
    addButton.mutate({
      label: formData.get('label') as string,
      action_type: formData.get('action_type') as 'link' | 'email' | 'call',
      action_value: formData.get('action_value') as string,
    });
  };

  return (
    <>
      <ProfileHeader isLoading={isLoading} error={error as Error} />
      
      {profile && (
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
                color: profile.button_text_color || '#000000'
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

            <ProfileButtons
              buttons={profile.profile_buttons}
              buttonColor={profile.button_color || '#8899ac'}
              buttonTextColor={profile.button_text_color || '#000000'}
              onDelete={(buttonId) => deleteButton.mutate(buttonId)}
              onButtonClick={handleButtonClick}
            />

            <ButtonForm
              buttonColor={profile.button_color || '#8899ac'}
              buttonTextColor={profile.button_text_color || '#000000'}
              onSubmit={handleAddButton}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;