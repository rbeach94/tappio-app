import { Button } from "@/components/ui/button";
import { ChromePicker } from 'react-color';
import { X } from "lucide-react";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void;
}

export const ColorPicker = ({ label, color, onChange, isOpen, onToggle, onClose }: ColorPickerProps) => {
  return (
    <div className="w-1/2 px-1 relative">
      <Button
        onClick={onToggle}
        className="w-full mb-2"
        style={{
          backgroundColor: color,
          color: '#000000'
        }}
      >
        {label}
      </Button>
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%-0.5rem)] z-50 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onToggle();
                onClose?.();
              }}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ChromePicker
            color={color}
            onChange={(color) => onChange(color.hex)}
          />
        </div>
      )}
    </div>
  );
};