import { Button } from "@/components/ui/button";
import { ChromePicker } from 'react-color';

interface ColorPickerProps {
  label: string;
  color: string;
  onChange: (color: string) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const ColorPicker = ({ label, color, onChange, isOpen, onToggle }: ColorPickerProps) => {
  return (
    <div>
      <Button
        onClick={onToggle}
        className="w-full mb-2"
      >
        {label}
      </Button>
      {isOpen && (
        <div className="absolute z-10">
          <ChromePicker
            color={color}
            onChange={(color) => onChange(color.hex)}
          />
        </div>
      )}
    </div>
  );
};