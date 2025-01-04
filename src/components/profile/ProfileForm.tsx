import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { ColorPicker } from "./ColorPicker";

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
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Input
          value={profile.full_name || ''}
          onChange={(e) => onUpdate({ full_name: e.target.value })}
          placeholder="Full Name"
          className="text-black"
        />
        <Input
          value={profile.job_title || ''}
          onChange={(e) => onUpdate({ job_title: e.target.value })}
          placeholder="Job Title"
          className="text-black"
        />
        <Input
          value={profile.company || ''}
          onChange={(e) => onUpdate({ company: e.target.value })}
          placeholder="Company"
          className="text-black"
        />
        <Input
          value={profile.email || ''}
          onChange={(e) => onUpdate({ email: e.target.value })}
          placeholder="Email"
          type="email"
          className="text-black"
        />
        <Input
          value={profile.phone || ''}
          onChange={(e) => onUpdate({ phone: e.target.value })}
          placeholder="Phone"
          type="tel"
          className="text-black"
        />
        <Input
          value={profile.website || ''}
          onChange={(e) => onUpdate({ website: e.target.value })}
          placeholder="Website"
          type="url"
          className="text-black"
        />
        <Textarea
          value={profile.bio || ''}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          placeholder="Add your bio here..."
          className="min-h-[100px] text-black"
        />
      </div>

      <div className="space-y-4">
        <ColorPicker
          label="Change Background Color"
          color={profile.background_color || '#15202B'}
          onChange={(color) => onUpdate({ background_color: color })}
          isOpen={showColorPicker === 'background'}
          onToggle={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
        />
        <ColorPicker
          label="Change Text Color"
          color={profile.text_color || '#FFFFFF'}
          onChange={(color) => onUpdate({ text_color: color })}
          isOpen={showColorPicker === 'text'}
          onToggle={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
        />
        <ColorPicker
          label="Change Button Color"
          color={profile.button_color || '#8899ac'}
          onChange={(color) => onUpdate({ button_color: color })}
          isOpen={showColorPicker === 'button'}
          onToggle={() => setShowColorPicker(showColorPicker === 'button' ? null : 'button')}
        />
        <ColorPicker
          label="Change Button Text Color"
          color={profile.button_text_color || '#FFFFFF'}
          onChange={(color) => onUpdate({ button_text_color: color })}
          isOpen={showColorPicker === 'buttonText'}
          onToggle={() => setShowColorPicker(showColorPicker === 'buttonText' ? null : 'buttonText')}
        />
      </div>

      <Button 
        onClick={onSave}
        className="w-full"
        variant="outline"
      >
        Save Changes
      </Button>
    </div>
  );
};