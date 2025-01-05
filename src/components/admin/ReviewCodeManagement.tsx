import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Database } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { NFCCode } from "@/pages/AdminDashboard";

interface ReviewCodeManagementProps {
  adminId: string;
}

const ReviewCodeManagement = ({ adminId }: ReviewCodeManagementProps) => {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch review codes
  const { data: reviewCodes, isLoading: codesLoading } = useQuery({
    queryKey: ["reviewCodes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .eq("type", "review")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as NFCCode[];
    },
  });

  // Generate codes mutation
  const generateCodesMutation = useMutation({
    mutationFn: async (count: number) => {
      const { data, error } = await supabase
        .rpc('generate_nfc_codes', { 
          count: count,
          admin_id: adminId,
          code_type: 'review'
        });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviewCodes"] });
      toast.success("Review codes generated successfully");
    },
    onError: (error) => {
      console.error("Error generating review codes:", error);
      toast.error("Failed to generate review codes");
    },
    onSettled: () => {
      setIsGenerating(false);
    },
  });

  const handleGenerateCodes = async (count: number) => {
    setIsGenerating(true);
    generateCodesMutation.mutate(count);
  };

  const handleDownloadCSV = () => {
    if (!reviewCodes) return;

    const availableCodes = reviewCodes.filter(code => !code.assigned_to);
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
    a.setAttribute("download", `review-codes-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Review Code Management
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
          {reviewCodes && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Available Review Codes</h3>
                <Button onClick={handleDownloadCSV} variant="outline" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              </div>
              <div className="border rounded-lg">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-2 text-left">Code</th>
                      <th className="px-4 py-2 text-left">URL</th>
                      <th className="px-4 py-2 text-left">Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviewCodes
                      .filter(code => !code.assigned_to)
                      .slice(0, 10)
                      .map((code) => (
                        <tr key={code.id} className="border-b">
                          <td className="px-4 py-2 font-mono">{code.code}</td>
                          <td className="px-4 py-2">
                            {code.url && (
                              <a
                                href={code.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {code.url}
                              </a>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            {new Date(code.created_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCodeManagement;