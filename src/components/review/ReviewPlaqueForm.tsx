import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useParams } from "react-router-dom";

export const ReviewPlaqueForm = () => {
  const navigate = useNavigate();
  const { code } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    businessName: "",
    location: "",
    description: "",
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
          location: "",  // Location is not stored yet
          description: data.description || "",
          websiteUrl: data.redirect_url || "",
        });
      }
    };

    fetchPlaqueData();
  }, [code]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("nfc_codes")
        .update({
          title: formData.businessName,
          description: formData.description,
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
              Business Name
            </label>
            <Input
              id="businessName"
              value={formData.businessName}
              onChange={(e) =>
                setFormData({ ...formData, businessName: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium mb-1">
              Location
            </label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-1">
              Description
            </label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
            />
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
              required
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