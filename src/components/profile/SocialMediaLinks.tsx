import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Linkedin, X, Youtube } from "lucide-react";

interface SocialMediaLinksProps {
  defaultValues: {
    facebook_url?: string | null;
    instagram_url?: string | null;
    twitter_url?: string | null;
    youtube_url?: string | null;
    linkedin_url?: string | null;
  };
}

export const SocialMediaLinks = ({ defaultValues }: SocialMediaLinksProps) => {
  const SocialField = ({ icon: Icon, label, field }) => (
    <div className="flex items-center space-x-2">
      <Icon className="h-5 w-5 text-gray-500" />
      <Input
        name={field}
        defaultValue={defaultValues[field] || ''}
        placeholder={`${label} URL`}
        className="flex-1 text-black"
      />
    </div>
  );

  return (
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
        icon={X}
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
  );
};