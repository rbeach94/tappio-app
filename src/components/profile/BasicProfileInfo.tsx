import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface BasicProfileInfoProps {
  defaultValues: {
    full_name?: string | null;
    job_title?: string | null;
    company?: string | null;
    bio?: string | null;
  };
}

export const BasicProfileInfo = ({ defaultValues }: BasicProfileInfoProps) => {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={defaultValues.full_name || ''}
          placeholder="Full Name"
          className="text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          name="job_title"
          defaultValue={defaultValues.job_title || ''}
          placeholder="Job Title"
          className="text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          defaultValue={defaultValues.company || ''}
          placeholder="Company"
          className="text-black"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          name="bio"
          defaultValue={defaultValues.bio || ''}
          placeholder="Add your bio here..."
          className="min-h-[100px] text-black"
        />
      </div>
    </div>
  );
};