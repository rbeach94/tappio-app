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
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <Button
          className="w-full p-6 bg-black text-white hover:bg-black/90"
          onClick={() => setShowColorPicker('background')}
        >
          Background Color
          <div 
            className="ml-2 w-6 h-6 rounded border border-white"
            style={{ backgroundColor: profile.background_color || '#3C8C7C' }}
          />
        </Button>
        <Button
          className="w-full p-6 bg-black text-white hover:bg-black/90"
          onClick={() => setShowColorPicker('text')}
        >
          Text Color
          <div 
            className="ml-2 w-6 h-6 rounded border border-white"
            style={{ backgroundColor: profile.text_color || '#FFFFFF' }}
          />
        </Button>
        <Button
          className="w-full p-6 bg-black text-white hover:bg-black/90"
          onClick={() => setShowColorPicker('button')}
        >
          Button Color
          <div 
            className="ml-2 w-6 h-6 rounded border border-white"
            style={{ backgroundColor: profile.button_color || '#8899ac' }}
          />
        </Button>
        <Button
          className="w-full p-6 bg-black text-white hover:bg-black/90"
          onClick={() => setShowColorPicker('buttonText')}
        >
          Button Text Color
          <div 
            className="ml-2 w-6 h-6 rounded border border-white"
            style={{ backgroundColor: profile.button_text_color || '#000000' }}
          />
        </Button>
      </div>

      {/* Color Preview Section */}
      <div 
        className="p-6 rounded-lg"
        style={{ 
          backgroundColor: profile.background_color || '#3C8C7C',
          color: profile.text_color || '#FFFFFF'
        }}
      >
        <h3 className="text-lg font-semibold mb-4">Color Preview</h3>
        <p className="mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
        <Button
          className="w-full"
          style={{ 
            backgroundColor: profile.button_color || '#8899ac',
            color: profile.button_text_color || '#000000'
          }}
        >
          Example Button
        </Button>
      </div>

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