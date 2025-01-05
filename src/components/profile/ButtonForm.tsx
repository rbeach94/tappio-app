import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ButtonFormProps {
  buttonColor: string;
  buttonTextColor: string;
  onSubmit: (formData: FormData) => void;
}

export const ButtonForm = ({ buttonColor, buttonTextColor, onSubmit }: ButtonFormProps) => {
  const formatUrl = (actionType: string, value: string): string => {
    if (actionType !== 'link') return value;
    if (!value || value.trim() === '') return value;
    const trimmedValue = value.trim();
    if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
      return trimmedValue;
    }
    return `https://${trimmedValue}`;
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const actionType = formData.get('action_type')?.toString() || '';
        const actionValue = formData.get('action_value')?.toString() || '';
        
        // Create a new FormData object with the formatted URL
        const processedFormData = new FormData();
        processedFormData.append('label', formData.get('label') || '');
        processedFormData.append('action_type', actionType);
        processedFormData.append('action_value', formatUrl(actionType, actionValue));
        
        onSubmit(processedFormData);
        (e.target as HTMLFormElement).reset();
      }}
      className="space-y-4"
    >
      <Input name="label" placeholder="Button Label" required className="text-black" />
      <select name="action_type" required className="w-full p-2 rounded border text-black">
        <option value="link">Link</option>
        <option value="email">Email</option>
        <option value="call">Call</option>
      </select>
      <Input name="action_value" placeholder="URL/Email/Phone" required className="text-black" />
      <Button 
        type="submit" 
        className="w-full"
        style={{ 
          backgroundColor: buttonColor,
          color: buttonTextColor
        }}
      >
        Add Button
      </Button>
    </form>
  );
};