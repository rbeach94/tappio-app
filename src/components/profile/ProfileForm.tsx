import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ColorPicker } from "./ColorPicker";
import { useState, useRef } from "react";
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

  const SocialField = ({ icon: Icon, label, field }) => (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-500" />
      <Input
        name={field}
        defaultValue={profile[field] || ''}
        placeholder={`${label} URL`}
        className="flex-1 text-black"
      />
    </div>
  );

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 py-12">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile.full_name || ''}
            placeholder="Full Name"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="job_title">Job Title</Label>
          <Input
            id="job_title"
            name="job_title"
            defaultValue={profile.job_title || ''}
            placeholder="Job Title"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            name="company"
            defaultValue={profile.company || ''}
            placeholder="Company"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            defaultValue={profile.email || ''}
            placeholder="Email"
            type="email"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            defaultValue={profile.phone || ''}
            placeholder="Phone"
            type="tel"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            name="website"
            defaultValue={profile.website || ''}
            placeholder="Website"
            type="url"
            className="text-black"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            name="bio"
            defaultValue={profile.bio || ''}
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
        type="submit"
        className="w-full"
        variant="outline"
      >
        Save Changes
      </Button>
    </form>
  );
};