import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NewProfileButton } from "@/hooks/useProfileButtons";

interface ButtonFormProps {
  onSubmit: (buttonData: Omit<NewProfileButton, 'profile_id'>) => void;
  isLoading?: boolean;
}

export const ButtonForm = ({ onSubmit, isLoading }: ButtonFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const buttonData = {
      label: formData.get('label') as string,
      action_type: formData.get('action_type') as string,
      action_value: formData.get('action_value') as string,
    };
    onSubmit(buttonData);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          name="label"
          placeholder="Button Label"
          required
        />
      </div>
      <div className="space-y-2">
        <Select name="action_type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select action type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">URL</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="email">Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Input
          type="text"
          name="action_value"
          placeholder="Action Value (URL, phone number, or email)"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Adding..." : "Add Button"}
      </Button>
    </form>
  );
};