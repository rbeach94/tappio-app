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
        <div className="relative">
          <Button
            className="w-full p-6 bg-black text-white hover:bg-black/90 flex flex-col items-center gap-2"
            onClick={() => setShowColorPicker('background')}
          >
            <span>Background</span>
            <span>Color</span>
            <div 
              className="w-6 h-6 rounded border border-white mt-1"
              style={{ backgroundColor: profile.background_color || '#3C8C7C' }}
            />
          </Button>
          {showColorPicker === 'background' && (
            <ColorPicker
              label="Background Color"
              color={profile.background_color}
              onChange={(color) => onColorChange({ background_color: color })}
              isOpen={true}
              onToggle={() => setShowColorPicker(null)}
              onClose={() => setShowColorPicker(null)}
            />
          )}
        </div>
        
        <div className="relative">
          <Button
            className="w-full p-6 bg-black text-white hover:bg-black/90 flex flex-col items-center gap-2"
            onClick={() => setShowColorPicker('text')}
          >
            <span>Text</span>
            <span>Color</span>
            <div 
              className="w-6 h-6 rounded border border-white mt-1"
              style={{ backgroundColor: profile.text_color || '#FFFFFF' }}
            />
          </Button>
          {showColorPicker === 'text' && (
            <ColorPicker
              label="Text Color"
              color={profile.text_color}
              onChange={(color) => onColorChange({ text_color: color })}
              isOpen={true}
              onToggle={() => setShowColorPicker(null)}
              onClose={() => setShowColorPicker(null)}
            />
          )}
        </div>

        <div className="relative">
          <Button
            className="w-full p-6 bg-black text-white hover:bg-black/90 flex flex-col items-center gap-2"
            onClick={() => setShowColorPicker('button')}
          >
            <span>Button</span>
            <span>Color</span>
            <div 
              className="w-6 h-6 rounded border border-white mt-1"
              style={{ backgroundColor: profile.button_color || '#8899ac' }}
            />
          </Button>
          {showColorPicker === 'button' && (
            <ColorPicker
              label="Button Color"
              color={profile.button_color}
              onChange={(color) => onColorChange({ button_color: color })}
              isOpen={true}
              onToggle={() => setShowColorPicker(null)}
              onClose={() => setShowColorPicker(null)}
            />
          )}
        </div>

        <div className="relative">
          <Button
            className="w-full p-6 bg-black text-white hover:bg-black/90 flex flex-col items-center gap-2"
            onClick={() => setShowColorPicker('buttonText')}
          >
            <span>Button Text</span>
            <span>Color</span>
            <div 
              className="w-6 h-6 rounded border border-white mt-1"
              style={{ backgroundColor: profile.button_text_color || '#000000' }}
            />
          </Button>
          {showColorPicker === 'buttonText' && (
            <ColorPicker
              label="Button Text Color"
              color={profile.button_text_color}
              onChange={(color) => onColorChange({ button_text_color: color })}
              isOpen={true}
              onToggle={() => setShowColorPicker(null)}
              onClose={() => setShowColorPicker(null)}
            />
          )}
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
    </div>
  );
};