import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ColorPicker } from "./ColorPicker";

interface ColorPickerSectionProps {
  profile: any;
  onColorChange: (updates: any) => void;
}

export const ColorPickerSection = ({ profile, onColorChange }: ColorPickerSectionProps) => {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Button
        className="w-full p-6"
        style={{ backgroundColor: profile.background_color || '#3C8C7C' }}
        onClick={() => setShowColorPicker('background')}
      >
        Background Color
      </Button>
      <Button
        className="w-full p-6"
        style={{ backgroundColor: profile.text_color || '#FFFFFF' }}
        onClick={() => setShowColorPicker('text')}
      >
        Text Color
      </Button>
      <Button
        className="w-full p-6"
        style={{ backgroundColor: profile.button_color || '#8899ac' }}
        onClick={() => setShowColorPicker('button')}
      >
        Button Color
      </Button>
      <Button
        className="w-full p-6"
        style={{ backgroundColor: profile.button_text_color || '#000000' }}
        onClick={() => setShowColorPicker('buttonText')}
      >
        Button Text Color
      </Button>

      {showColorPicker && (
        <ColorPicker
          label={
            showColorPicker === 'background'
              ? 'Background Color'
              : showColorPicker === 'text'
              ? 'Text Color'
              : showColorPicker === 'button'
              ? 'Button Color'
              : 'Button Text Color'
          }
          color={
            showColorPicker === 'background'
              ? profile.background_color
              : showColorPicker === 'text'
              ? profile.text_color
              : showColorPicker === 'button'
              ? profile.button_color
              : profile.button_text_color
          }
          onChange={(color) => {
            const updates = {
              [showColorPicker === 'background'
                ? 'background_color'
                : showColorPicker === 'text'
                ? 'text_color'
                : showColorPicker === 'button'
                ? 'button_color'
                : 'button_text_color']: color,
            };
            onColorChange(updates);
          }}
          isOpen={true}
          onToggle={() => setShowColorPicker(null)}
          onClose={() => setShowColorPicker(null)}
        />
      )}
    </div>
  );
};