import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useProfileData = (id: string) => {
  const queryClient = useQueryClient();

  const { data: profile, isLoading: profileLoading, error: profileError } = useQuery({
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

  const { data: buttons, isLoading: buttonsLoading, error: buttonsError } = useQuery({
    queryKey: ['profile_buttons', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profile_buttons')
        .select('*')
        .eq('profile_id', id)
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching buttons:', error);
        throw error;
      }

      return data;
    },
    enabled: !!id,
  });

  const updateProfile = useMutation({
    mutationFn: async (updates: any) => {
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

  const addButton = useMutation({
    mutationFn: async (buttonData: any) => {
      const { error } = await supabase
        .from('profile_buttons')
        .insert({
          profile_id: id,
          ...buttonData,
          sort_order: buttons?.length || 0,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', id] });
      toast({
        title: "Button added",
        description: "New button has been added successfully.",
      });
    },
    onError: (error) => {
      console.error('Error adding button:', error);
      toast.error("Failed to add button");
    },
  });

  const deleteButton = useMutation({
    mutationFn: async (buttonId: string) => {
      const { error } = await supabase
        .from('profile_buttons')
        .delete()
        .eq('id', buttonId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile_buttons', id] });
      toast({
        title: "Button deleted",
        description: "The button has been removed successfully.",
      });
    },
    onError: (error) => {
      console.error('Error deleting button:', error);
      toast.error("Failed to delete button");
    },
  });

  return {
    profile,
    buttons,
    isLoading: profileLoading || buttonsLoading,
    error: profileError || buttonsError,
    updateProfile,
    addButton,
    deleteButton,
  };
};