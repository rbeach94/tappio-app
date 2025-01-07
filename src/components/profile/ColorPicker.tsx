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
    <div className="flex items-center space-x-4 w-full relative">
      <label className="block text-sm font-medium mb-2 dark:text-white">
        {label}
      </label>
      <div 
        onClick={onToggle}
        className="w-10 h-10 rounded border cursor-pointer flex items-center justify-center"
        style={{ backgroundColor: color }}
      />
      {isOpen && (
        <div className="absolute left-0 top-[calc(100%+0.5rem)] z-50 bg-white p-2 rounded-lg shadow-lg">
          <div className="flex justify-end mb-2">
            <button
              type="button"
              onClick={() => {
                onToggle();
                onClose?.();
              }}
              className="inline-flex flex-shrink-0 justify-center items-center h-8 w-8 rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-white transition-all text-sm dark:focus:ring-gray-700 dark:focus:ring-offset-gray-800"
            >
              <X className="h-4 w-4" />
            </button>
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