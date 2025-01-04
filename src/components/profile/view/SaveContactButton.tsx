import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";

interface SaveContactButtonProps {
  profile: Tables<"nfc_profiles">;
}

export const SaveContactButton = ({ profile }: SaveContactButtonProps) => {
  const generateVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.full_name || ''}
ORG:${profile.company || ''}
TITLE:${profile.job_title || ''}
TEL:${profile.phone || ''}
EMAIL:${profile.email || ''}
URL:${profile.website || ''}
NOTE:${profile.bio || ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${profile.full_name || 'contact'}.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button 
      onClick={generateVCard}
      className="w-full"
      style={{ 
        backgroundColor: profile.button_color || '#8899ac',
        color: profile.button_text_color || '#FFFFFF'
      }}
    >
      Save My Contact
    </Button>
  );
};