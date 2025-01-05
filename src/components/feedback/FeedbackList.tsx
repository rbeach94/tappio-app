import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type FeedbackStatus = "new" | "in_consideration" | "in_production" | "done";

interface Feedback {
  id: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  created_at: string;
}

export const FeedbackList = () => {
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["feedback"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Feedback[];
    },
  });

  const updateStatus = async (id: string, status: FeedbackStatus) => {
    setUpdating(id);
    try {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    } finally {
      setUpdating(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {feedback?.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded-lg space-y-2 bg-background"
        >
          <h3 className="font-semibold">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {new Date(item.created_at).toLocaleDateString()}
            </span>
            <Select
              value={item.status}
              onValueChange={(value: FeedbackStatus) =>
                updateStatus(item.id, value)
              }
              disabled={updating === item.id}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="in_consideration">In Consideration</SelectItem>
                <SelectItem value="in_production">In Production</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      ))}
    </div>
  );
};