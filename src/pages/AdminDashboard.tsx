import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, DatabaseIcon, Users } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";
import AvailableCodesTable from "@/components/admin/AvailableCodesTable";

type UserWithRole = {
  id: string;
  email: string | null;
  role: Database["public"]["Enums"]["app_role"] | null;
};

export type NFCCode = {
  id: string;
  code: string;
  created_at: string;
  assigned_to: string | null;
  assigned_at: string | null;
  url: string | null;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch user role
  const { data: userRole, isLoading: roleLoading } = useQuery({
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

  // Fetch all users with their roles
  const { data: users, isLoading: usersLoading } = useQuery<UserWithRole[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select(`
          id,
          email
        `);

      if (error) throw error;

      const { data: roles } = await supabase
        .from("user_roles")
        .select("user_id, role");

      return (profiles || []).map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.id);
        return {
          id: profile.id,
          email: profile.email,
          role: userRole?.role || null
        };
      });
    },
    enabled: userRole === "admin",
  });

  // Fetch NFC codes
  const { data: nfcCodes, isLoading: codesLoading } = useQuery({
    queryKey: ["nfcCodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NFCCode[];
    },
    enabled: userRole === "admin",
  });

  const handleDownloadCSV = () => {
    if (!nfcCodes) return;

    const availableCodes = nfcCodes.filter(code => !code.assigned_to);
    const csvContent = [
      ["Code", "URL", "Created At"],
      ...availableCodes.map(code => [
        code.code,
        code.url,
        new Date(code.created_at).toLocaleDateString()
      ])
    ]
      .map(row => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `available-codes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Generate codes mutation
  const generateCodesMutation = useMutation({
    mutationFn: async (count: number) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .rpc('generate_nfc_codes', { 
          count: count,
          admin_id: user.id
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["nfcCodes"] });
      toast.success("NFC codes generated successfully");
    },
    onError: (error) => {
      console.error("Error generating codes:", error);
      toast.error("Failed to generate NFC codes");
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerateCodes = async (count: number) => {
    setIsGenerating(true);
    generateCodesMutation.mutate(count);
  };

  useEffect(() => {
    if (!roleLoading && userRole !== "admin") {
      navigate("/dashboard");
    }
  }, [roleLoading, userRole, navigate]);

  if (roleLoading || usersLoading || codesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DatabaseIcon className="w-5 h-5" />
                NFC Code Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => handleGenerateCodes(10)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Generate 10 Codes
                  </Button>
                  <Button
                    onClick={() => handleGenerateCodes(25)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Generate 25 Codes
                  </Button>
                  <Button
                    onClick={() => handleGenerateCodes(100)}
                    disabled={isGenerating}
                  >
                    {isGenerating ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    Generate 100 Codes
                  </Button>
                </div>
                {nfcCodes && (
                  <AvailableCodesTable 
                    codes={nfcCodes} 
                    onDownloadCSV={handleDownloadCSV}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                User Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users?.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.email}</p>
                      <p className="text-sm text-muted-foreground">
                        Role: {user.role || "user"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
