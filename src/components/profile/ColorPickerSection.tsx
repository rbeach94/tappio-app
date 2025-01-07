import { useState } from "react";
import { ColorPicker } from "./ColorPicker";

interface ColorPickerSectionProps {
  profile: any;
  onColorChange: (updates: any) => void;
}

export const ColorPickerSection = ({ profile, onColorChange }: ColorPickerSectionProps) => {
  const [showColorPicker, setShowColorPicker] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div className="grid gap-6">
        <div className="relative">
          <ColorPicker
            label="Background Color"
            color={profile.background_color || '#3C8C7C'}
            onChange={(color) => onColorChange({ background_color: color })}
            isOpen={showColorPicker === 'background'}
            onToggle={() => setShowColorPicker(showColorPicker === 'background' ? null : 'background')}
            onClose={() => setShowColorPicker(null)}
          />
        </div>
        
        <div className="relative">
          <ColorPicker
            label="Text Color"
            color={profile.text_color || '#FFFFFF'}
            onChange={(color) => onColorChange({ text_color: color })}
            isOpen={showColorPicker === 'text'}
            onToggle={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')}
            onClose={() => setShowColorPicker(null)}
          />
        </div>

        <div className="relative">
          <ColorPicker
            label="Button Color"
            color={profile.button_color || '#8899ac'}
            onChange={(color) => onColorChange({ button_color: color })}
            isOpen={showColorPicker === 'button'}
            onToggle={() => setShowColorPicker(showColorPicker === 'button' ? null : 'button')}
            onClose={() => setShowColorPicker(null)}
          />
        </div>

        <div className="relative">
          <ColorPicker
            label="Button Text Color"
            color={profile.button_text_color || '#000000'}
            onChange={(color) => onColorChange({ button_text_color: color })}
            isOpen={showColorPicker === 'buttonText'}
            onToggle={() => setShowColorPicker(showColorPicker === 'buttonText' ? null : 'buttonText')}
            onClose={() => setShowColorPicker(null)}
          />
        </div>
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
        <button
          className="w-full px-4 py-2 rounded transition-colors"
          style={{ 
            backgroundColor: profile.button_color || '#8899ac',
            color: profile.button_text_color || '#000000'
          }}
        >
          Example Button
        </button>
      </div>
    </div>
  );
};