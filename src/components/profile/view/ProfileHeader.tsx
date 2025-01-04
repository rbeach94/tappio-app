import { Tables } from "@/integrations/supabase/types";

interface ProfileHeaderProps {
  profile: Tables<"nfc_profiles">;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
  return (
    <div className="space-y-4 text-center">
      {profile.logo_url && (
        <div className="text-center">
          <img 
            src={profile.logo_url} 
            alt="Business Logo" 
            className="w-32 h-32 mx-auto object-contain rounded-lg"
          />
        </div>
      )}
      <h1 className="text-2xl font-bold">{profile.full_name}</h1>
      {profile.job_title && <p className="text-lg">{profile.job_title}</p>}
      {profile.company && <p className="text-lg">{profile.company}</p>}
      {profile.email && <p>{profile.email}</p>}
      {profile.phone && <p>{profile.phone}</p>}
      {profile.website && <p>{profile.website}</p>}
    </div>
  );
};