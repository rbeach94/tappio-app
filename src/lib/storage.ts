import { supabase } from "@/integrations/supabase/client";

export const createBucket = async () => {
  const { data, error } = await supabase.storage.createBucket('logos', {
    public: true,
    fileSizeLimit: 1024 * 1024 * 2, // 2MB
  });
  
  if (error) {
    console.error('Error creating bucket:', error);
    return;
  }
  
  console.log('Bucket created successfully:', data);
};