import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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
  user_id: string;
  profiles: {
    email: string | null;
  } | null;
}

interface FeedbackListProps {
  isAdmin?: boolean;
}

export const FeedbackList = ({ isAdmin = false }: FeedbackListProps) => {
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["feedback", isAdmin],
    queryFn: async () => {
      let query = supabase
        .from("feedback")
        .select(
          isAdmin
            ? "*, profiles!feedback_user_id_fkey(email)"
            : "*"
        );

      if (!isAdmin) {
        query = query.eq("user_id", (await supabase.auth.getUser()).data.user?.id);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

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

  if (!feedback?.length) {
    return (
      <div className="text-center text-muted-foreground">
        {isAdmin
          ? "No feedback submissions yet"
          : "You haven't submitted any feedback yet"}
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
            <div className="space-y-1">
              <span className="text-sm text-muted-foreground">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
              {isAdmin && item.profiles?.email && (
                <p className="text-sm text-muted-foreground">
                  Submitted by: {item.profiles.email}
                </p>
              )}
            </div>
            {isAdmin && (
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
            )}
            {!isAdmin && (
              <span className="text-sm px-2 py-1 bg-muted rounded-md">
                {item.status}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};