import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { AddCardDialog } from "@/components/dashboard/AddCardDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAddingCard, setIsAddingCard] = useState(false);

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
      const { data: profiles, error } = await supabase
        .from("nfc_profiles")
        .select(`
          *,
          nfc_codes (
            code
          )
        `);

      if (error) throw error;
      return profiles;
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

      // Create initial profile
      const { error: profileError } = await supabase
        .from("nfc_profiles")
        .insert({
          user_id: user.id,
          code_id: codeRecord.id
        });

      if (profileError) throw profileError;

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

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast.success("Successfully logged out!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen p-4 md:p-8 page-transition">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <div className="flex gap-4">
            {userRole === "admin" && (
              <Button onClick={() => navigate("/admin")} variant="outline">
                Admin Dashboard
              </Button>
            )}
            <Button onClick={handleLogout} variant="outline">
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Your Tappio Cards</h2>
          <AddCardDialog
            isOpen={isAddingCard}
            onOpenChange={setIsAddingCard}
            assignCodeMutation={assignCodeMutation}
            onAddCard={() => setIsAddingCard(false)}
          />
        </div>

        {profilesLoading ? (
          <div className="flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : profiles?.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              You haven't added any Tappio cards yet. Click "Add Tappio Card" to get started.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles?.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;