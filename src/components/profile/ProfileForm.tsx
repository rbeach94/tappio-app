import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { useRef } from "react";
import { BasicProfileInfo } from "./BasicProfileInfo";
import { ContactInfo } from "./ContactInfo";
import { SocialMediaLinks } from "./SocialMediaLinks";
import { ColorPickerSection } from "./ColorPickerSection";
import { Link } from "react-router-dom";

interface ProfileFormProps {
  profile: Tables<"nfc_profiles">;
  onUpdate: (updates: Partial<Tables<"nfc_profiles">>) => void;
  onSave: () => void;
  showColorPicker: string | null;
  setShowColorPicker: (value: string | null) => void;
}

export const ProfileForm = ({ 
  profile, 
  onUpdate, 
  onSave,
  showColorPicker,
  setShowColorPicker 
}: ProfileFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);

  const formatUrl = (url: string | null) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const updates: Partial<Tables<"nfc_profiles">> = {
      full_name: formData.get('full_name')?.toString() || null,
      job_title: formData.get('job_title')?.toString() || null,
      company: formData.get('company')?.toString() || null,
      email: formData.get('email')?.toString() || null,
      phone: formData.get('phone')?.toString() || null,
      website: formatUrl(formData.get('website')?.toString() || null),
      bio: formData.get('bio')?.toString() || null,
      facebook_url: formatUrl(formData.get('facebook_url')?.toString() || null),
      instagram_url: formatUrl(formData.get('instagram_url')?.toString() || null),
      twitter_url: formatUrl(formData.get('twitter_url')?.toString() || null),
      youtube_url: formatUrl(formData.get('youtube_url')?.toString() || null),
      linkedin_url: formatUrl(formData.get('linkedin_url')?.toString() || null),
    };

    onUpdate(updates);
    onSave();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 py-12">
      <div className="sticky top-0 z-50 bg-background py-4 shadow-md">
        <div className="flex gap-4 px-4">
          <Button 
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            Save Changes
          </Button>
          <Link 
            to={`/profile/${profile.id}/view`}
            className="flex-1"
          >
            <Button 
              type="button"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              View Profile
            </Button>
          </Link>
        </div>
      </div>

      <BasicProfileInfo defaultValues={profile} />
      <ContactInfo defaultValues={profile} />
      <SocialMediaLinks defaultValues={profile} />
      
      <div className="pt-8 border-t">
        <h2 className="text-lg font-semibold mb-6">Appearance Settings</h2>
        <ColorPickerSection 
          profile={profile}
          onColorChange={onUpdate}
        />
      </div>
    </form>
  );
};