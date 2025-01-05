import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ContactInfoProps {
  defaultValues: {
    email?: string | null;
    phone?: string | null;
    website?: string | null;
  };
}

export const ContactInfo = ({ defaultValues }: ContactInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          defaultValue={defaultValues.email || ''}
          placeholder="Email"
          type="email"
          className="text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          defaultValue={defaultValues.phone || ''}
          placeholder="Phone"
          type="tel"
          className="text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="website">Website</Label>
        <Input
          id="website"
          name="website"
          defaultValue={defaultValues.website || ''}
          placeholder="Website"
          type="text"
          className="text-black"
        />
      </div>
    </div>
  );
};