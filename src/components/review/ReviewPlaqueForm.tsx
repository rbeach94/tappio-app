import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";

export const ReviewPlaqueForm = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    websiteUrl: "",
  });

  useEffect(() => {
    const fetchPlaqueData = async () => {
      if (!code) return;

      const { data, error } = await supabase
        .from("nfc_codes")
        .select("*")
        .eq("code", code)
        .single();

      if (error) {
        console.error("Error fetching plaque data:", error);
        toast.error("Failed to fetch plaque data");
        return;
      }

      if (data) {
        setFormData({
          businessName: data.title || "",
          websiteUrl: data.redirect_url || "",
        });
      }
    };

    fetchPlaqueData();
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    if (!formData.businessName.trim()) {
      toast.error("Please enter a name for the review plaque");
      return;
    }
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("nfc_codes")
        .update({
          title: formData.businessName,
          redirect_url: formData.websiteUrl,
        })
        .eq("code", code);

      if (error) throw error;

      toast.success("Review plaque updated successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error("Error updating review plaque:", error);
      toast.error("Failed to update review plaque");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium mb-1">
              Name of Review Plaque <span className="text-red-500">*</span>
            </label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              required
              placeholder="Enter the name for your review plaque"
            />
            <p className="text-sm text-muted-foreground mt-1">
              This name will be displayed on your dashboard and review URL
            </p>
          </div>

          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium mb-1">
              Website URL
            </label>
            <Input
              id="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={(e) =>
                setFormData({ ...formData, websiteUrl: e.target.value })
              }
              placeholder="Enter your website URL (optional)"
            />
          </div>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Review Plaque"}
        </Button>
      </form>
    </div>
  );
};