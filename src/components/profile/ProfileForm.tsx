import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";

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
    onUpdate(localProfile);
    onSave();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          value={localProfile.full_name || ''}
          onChange={(e) => handleChange({ full_name: e.target.value })}
          placeholder="Full Name"
          className="text-black"
        />
        <Input
          value={localProfile.job_title || ''}
          onChange={(e) => handleChange({ job_title: e.target.value })}
          placeholder="Job Title"
          className="text-black"
        />
        <Input
          value={localProfile.company || ''}
          onChange={(e) => handleChange({ company: e.target.value })}
          placeholder="Company"
          className="text-black"
        />
        <Input
          value={localProfile.email || ''}
          onChange={(e) => handleChange({ email: e.target.value })}
          placeholder="Email"
          type="email"
          className="text-black"
        />
        <Input
          value={localProfile.phone || ''}
          onChange={(e) => handleChange({ phone: e.target.value })}
          placeholder="Phone"
          type="tel"
          className="text-black"
        />
        <Input
          value={localProfile.website || ''}
          onChange={(e) => handleChange({ website: e.target.value })}
          placeholder="Website"
          type="url"
          className="text-black"
        />
        <Textarea
          value={localProfile.bio || ''}
          onChange={(e) => handleChange({ bio: e.target.value })}
          placeholder="Add your bio here..."
          className="min-h-[100px] text-black"
        />
      </div>

      <div className="flex flex-wrap -mx-1">
        <ColorPicker
          label="Background Color"
          color={localProfile.background_color || '#15202B'}
          onChange={(color) => handleChange({ background_color: color })}
          isOpen={showColorPicker === 'background'}
          onToggle={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
        />
        <ColorPicker
          label="Text Color"
          color={localProfile.text_color || '#FFFFFF'}
          onChange={(color) => handleChange({ text_color: color })}
          isOpen={showColorPicker === 'text'}
          onToggle={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
        />
        <ColorPicker
          label="Button Color"
          color={localProfile.button_color || '#8899ac'}
          onChange={(color) => handleChange({ button_color: color })}
          isOpen={showColorPicker === 'button'}
          onToggle={() => setShowColorPicker(showColorPicker === 'button' ? null : 'button')}
        />
        <ColorPicker
          label="Button Text Color"
          color={localProfile.button_text_color || '#000000'}
          onChange={(color) => handleChange({ button_text_color: color })}
          isOpen={showColorPicker === 'buttonText'}
          onToggle={() => setShowColorPicker(showColorPicker === 'buttonText' ? null : 'buttonText')}
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