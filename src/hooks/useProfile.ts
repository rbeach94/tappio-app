import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tables } from "@/integrations/supabase/types";

export const useProfile = (id: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useQuery({
    queryKey: ['profile', id],
    queryFn: async () => {
      console.log('Fetching profile data for id:', id);
      const { data, error } = await supabase
        .from('nfc_profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: Partial<Tables<"nfc_profiles">>) => {
      const { error } = await supabase
        .from('nfc_profiles')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', id] });
      toast.success("Profile updated successfully!");
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
      toast.error("Failed to update profile");
    },
  });

  return {
    profile,
    isLoading,
    error,
    updateProfile,
  };
};