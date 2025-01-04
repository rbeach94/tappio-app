import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ButtonFormProps {
  buttonColor: string;
  buttonTextColor: string;
  onSubmit: (formData: FormData) => void;
}

export const ButtonForm = ({ buttonColor, buttonTextColor, onSubmit }: ButtonFormProps) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        onSubmit(formData);
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