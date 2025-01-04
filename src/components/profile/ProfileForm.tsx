import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";

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
  const [localProfile, setLocalProfile] = useState(profile);

  const handleChange = (updates: Partial<Tables<"nfc_profiles">>) => {
    setLocalProfile(prev => ({ ...prev, ...updates }));
  };

  const handleSave = () => {
    console.log('Saving profile changes:', localProfile);
    onUpdate(localProfile);
    onSave();
  };

  const SocialField = ({ icon: Icon, label, field }: { icon: any, label: string, field: keyof Tables<"nfc_profiles"> }) => (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-500" />
      <Input
        value={localProfile[field] || ''}
        onChange={(e) => handleChange({ [field]: e.target.value })}
        placeholder={`${label} URL`}
        className="flex-1 text-black"
      />
    </div>
  );

  return (
    <div className="space-y-6 py-12">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            value={localProfile.full_name || ''}
            onChange={(e) => handleChange({ full_name: e.target.value })}
            placeholder="Full Name"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            value={localProfile.job_title || ''}
            onChange={(e) => handleChange({ job_title: e.target.value })}
            placeholder="Job Title"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            value={localProfile.company || ''}
            onChange={(e) => handleChange({ company: e.target.value })}
            placeholder="Company"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={localProfile.email || ''}
            onChange={(e) => handleChange({ email: e.target.value })}
            placeholder="Email"
            type="email"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={localProfile.phone || ''}
            onChange={(e) => handleChange({ phone: e.target.value })}
            placeholder="Phone"
            type="tel"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            value={localProfile.website || ''}
            onChange={(e) => handleChange({ website: e.target.value })}
            placeholder="Website"
            type="url"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={localProfile.bio || ''}
            onChange={(e) => handleChange({ bio: e.target.value })}
            placeholder="Add your bio here..."
            className="min-h-[100px] text-black"
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Social Media</h3>
        <SocialField
          icon={Facebook}
          label="Facebook"
          field="facebook_url"
        />
        <SocialField
          icon={Instagram}
          label="Instagram"
          field="instagram_url"
        />
        <SocialField
          icon={Twitter}
          label="X (Twitter)"
          field="twitter_url"
        />
        <SocialField
          icon={Youtube}
          label="YouTube"
          field="youtube_url"
        />
        <SocialField
          icon={Linkedin}
          label="LinkedIn"
          field="linkedin_url"
        />
      </div>

      <Button 
        onClick={handleSave}
        className="w-full"
        variant="outline"
      >
        Save Changes
      </Button>
    </div>
  );
};