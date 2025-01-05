import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { DashboardContent } from "@/components/dashboard/DashboardContent";

const Dashboard = () => {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [isAddingPlaque, setIsAddingPlaque] = useState(false);

  // Fetch user role
  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      return roles?.role;
    },
  });

  // Fetch user's NFC profiles
  const { data: profiles, isLoading: profilesLoading, refetch: refetchProfiles } = useQuery({
    queryKey: ["nfcProfiles"],
    queryFn: async () => {
      console.log('Fetching user profiles');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data: profiles, error } = await supabase
        .from("nfc_profiles")
        .select(`
          *,
          nfc_codes (
            code
          )
        `)
        .eq('user_id', user.id); // Filter by the current user's ID

      if (error) {
        console.error('Error fetching profiles:', error);
        throw error;
      }
      return profiles;
    },
  });

  // Fetch user's review plaques
  const { data: reviewPlaques, isLoading: plaquesLoading } = useQuery({
    queryKey: ["reviewPlaques"],
    queryFn: async () => {
      const { data: plaques, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .eq("type", "review")
        .eq("assigned_to", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;
      return plaques;
    },
  });

  // Mutation to assign code to user
  const assignCodeMutation = useMutation({
    mutationFn: async (code: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      // First, get the code record
      const { data: codeRecord, error: codeError } = await supabase
        .from("nfc_codes")
        .select()
        .eq("code", code.toUpperCase())
        .single();

      if (codeError || !codeRecord) {
        throw new Error("Invalid code");
      }

      if (codeRecord.assigned_to) {
        throw new Error("Code already assigned");
      }

      // Assign the code to the user
      const { error: updateError } = await supabase
        .from("nfc_codes")
        .update({ 
          assigned_to: user.id,
          assigned_at: new Date().toISOString()
        })
        .eq("id", codeRecord.id);

      if (updateError) throw updateError;

      // Create initial profile if it's a profile type code
      if (codeRecord.type === 'profile') {
        const { error: profileError } = await supabase
          .from("nfc_profiles")
          .insert({
            user_id: user.id,
            code_id: codeRecord.id
          });

        if (profileError) throw profileError;
      }

      return codeRecord;
    },
    onSuccess: () => {
      toast.success("Card added successfully!");
      setIsAddingCard(false);
      refetchProfiles();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const isLoading = profilesLoading || plaquesLoading;

  return (
    <div className="min-h-screen p-4 md:p-8 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <DashboardHeader userRole={userRole} />
        
        <DashboardActions
          isAddingCard={isAddingCard}
          setIsAddingCard={setIsAddingCard}
          isAddingPlaque={isAddingPlaque}
          setIsAddingPlaque={setIsAddingPlaque}
          assignCodeMutation={assignCodeMutation}
        />

        <DashboardContent
          isLoading={isLoading}
          profiles={profiles}
          reviewPlaques={reviewPlaques}
        />
      </div>
    </div>
  );
};

export default Dashboard;