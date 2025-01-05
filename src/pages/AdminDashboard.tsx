import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";
import AvailableCodesTable from "@/components/admin/AvailableCodesTable";
import RecentActivatedCodesCard from "@/components/admin/RecentActivatedCodesCard";
import ReviewCodeManagement from "@/components/admin/ReviewCodeManagement";

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

  // Fetch user role and ID
  const { data: userData, isLoading: roleLoading } = useQuery({
    queryKey: ["userData"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");
      
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      return {
        id: user.id,
        role: roles?.role
      };
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
    enabled: userData?.role === "admin",
  });

  // Fetch NFC codes
  const { data: nfcCodes, isLoading: codesLoading } = useQuery({
    queryKey: ["nfcCodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .eq("type", "profile")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NFCCode[];
    },
    enabled: userData?.role === "admin",
  });

  if (roleLoading || usersLoading || codesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (userData?.role !== "admin") {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        
        <div className="grid gap-6 md:grid-cols-2">
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

          {userData?.id && <ReviewCodeManagement adminId={userData.id} />}

          {nfcCodes && (
            <RecentActivatedCodesCard codes={nfcCodes} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;