import { useState } from "react";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface LogoUploadProps {
  profileId: string;
  logoUrl?: string | null;
  onLogoUpdate: (url: string) => void;
}

export const LogoUpload = ({ profileId, logoUrl, onLogoUpdate }: LogoUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("User not authenticated");
      }

      const fileExt = file.name.split('.').pop();
      // Use user ID as the first folder name to match RLS policy
      const fileName = `${user.id}/${profileId}/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('Tappio Profiles')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Error uploading logo:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('Tappio Profiles')
        .getPublicUrl(fileName);

      onLogoUpdate(publicUrl);
      
      toast({
        title: "Logo uploaded",
        description: "Your logo has been updated successfully.",
      });
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: "Upload failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="text-center">
      {logoUrl ? (
        <div className="relative group">
          <img 
            src={logoUrl} 
            alt="Business Logo" 
            className="w-32 h-32 mx-auto object-contain rounded-lg"
          />
          <label 
            htmlFor="logo-upload"
            className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-lg"
          >
            <span className="text-white">
              {uploading ? "Uploading..." : "Change Logo"}
            </span>
          </label>
          <input
            id="logo-upload"
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            disabled={uploading}
          />
        </div>
      ) : (
        <div className="w-32 h-32 mx-auto border-2 border-dashed rounded-lg flex items-center justify-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="hidden"
            id="logo-upload"
            disabled={uploading}
          />
          <label 
            htmlFor="logo-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <Plus className="w-8 h-8 mb-2" />
            <span>{uploading ? "Uploading..." : "Add Logo"}</span>
          </label>
        </div>
      )}
    </div>
  );
};