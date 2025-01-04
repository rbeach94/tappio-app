interface ProfileBioProps {
  bio?: string | null;
}

export const ProfileBio = ({ bio }: ProfileBioProps) => {
  if (!bio) return null;
  
  return (
    <div className="prose max-w-none text-center">
      <p>{bio}</p>
    </div>
  );
};