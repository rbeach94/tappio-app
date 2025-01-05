import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { FeedbackList } from "@/components/feedback/FeedbackList";

const Feedback = () => {
  const { data: userRole } = useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .single();
      return roles?.role;
    },
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold">Feedback</h1>
        
        {userRole === "admin" ? (
          <FeedbackList />
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              We value your feedback! Please let us know how we can improve your
              experience.
            </p>
            <FeedbackForm />
          </div>
        )}
      </div>
    </div>
  );
};

export default Feedback;