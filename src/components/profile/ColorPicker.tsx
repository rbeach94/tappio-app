import { Button } from "@/components/ui/button";
import { ChromePicker } from 'react-color';
import { X } from "lucide-react";

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  onClose?: () => void; // Added onClose as optional prop
}

export const ColorPicker = ({ label, color, onChange, isOpen, onToggle, onClose }: ColorPickerProps) => {
  return (
    <div className="w-1/2 px-1">
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
        <div className="absolute z-10 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex justify-end mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                onToggle();
                onClose?.(); // Optional chaining since onClose is optional
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