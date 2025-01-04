import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2, PencilIcon } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
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
      setCode("");
      setIsAddingCard(false);
      refetchProfiles();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleAddCard = async () => {
    if (!code) {
      toast.error("Please enter a code");
      return;
    }
    assignCodeMutation.mutate(code);
  };

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
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button>Add Tappio Card</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Tappio Card</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Input
                  placeholder="Enter your 6-character code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  maxLength={6}
                />
                <Button 
                  onClick={handleAddCard}
                  disabled={assignCodeMutation.isPending}
                  className="w-full"
                >
                  {assignCodeMutation.isPending ? (
                    <>
                      <Loader2 className="animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Card"
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
              <Card key={profile.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Tappio Card {profile.nfc_codes?.code}
                  </CardTitle>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    <p className="text-lg font-medium">
                      {profile.full_name || "Unnamed Profile"}
                    </p>
                    {profile.job_title && (
                      <p className="text-sm text-muted-foreground">
                        {profile.job_title}
                      </p>
                    )}
                    {profile.company && (
                      <p className="text-sm text-muted-foreground">
                        {profile.company}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;