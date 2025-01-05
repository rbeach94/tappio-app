import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Link } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

interface ReviewPlaqueCardProps {
  plaque: {
    id: string;
    code: string;
    title?: string;
    description?: string;
    redirect_url?: string;
  };
}

export const ReviewPlaqueCard = ({ plaque }: ReviewPlaqueCardProps) => {
  const navigate = useNavigate();

  // Fetch visit count
  const { data: visitCount } = useQuery({
    queryKey: ['plaque-visits', plaque.id],
    queryFn: async () => {
      console.log('Fetching visit count for plaque:', plaque.id);
      const { count, error } = await supabase
        .from('profile_visits')
        .select('*', { count: 'exact', head: true })
        .eq('profile_id', plaque.id);
      
      if (error) {
        console.error('Error fetching visit count:', error);
        throw error;
      }
      
      return count || 0;
    },
  });

  const handleEditClick = async () => {
    console.log('Updating review plaque URL:', plaque.id);
    
    // Update the plaque URL
    const { error } = await supabase
      .from('nfc_codes')
      .update({ 
        is_active: true,
        redirect_url: plaque.redirect_url 
      })
      .eq('id', plaque.id);

    if (error) {
      console.error('Error updating plaque URL:', error);
      toast.error("Failed to update plaque URL");
      return;
    }

    console.log('Successfully updated plaque URL');
    navigate(`/plaque/${plaque.id}`);
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Review Plaque {plaque.code}
        </CardTitle>
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => window.open(`/c/${plaque.code}`, '_blank')}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleEditClick}
          >
            <Link className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-1">
            <p className="text-lg font-medium">
              {plaque.title || "Unnamed Plaque"}
            </p>
            {plaque.description && (
              <p className="text-sm text-muted-foreground">
                {plaque.description}
              </p>
            )}
          </div>
          
          <div className="text-center pt-2">
            <p className="text-2xl font-bold">{visitCount || 0}</p>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};