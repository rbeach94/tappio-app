import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ProfileCard } from "./ProfileCard";
import { ReviewPlaqueCard } from "./ReviewPlaqueCard";

interface DashboardContentProps {
  isLoading: boolean;
  profiles?: any[];
  reviewPlaques?: any[];
}

export const DashboardContent = ({ 
  isLoading, 
  profiles, 
  reviewPlaques 
}: DashboardContentProps) => {
  const hasNoItems = (!profiles || profiles.length === 0) && (!reviewPlaques || reviewPlaques.length === 0);

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (hasNoItems) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          You haven't added any Tappio cards or review plaques yet. Click "Add Tappio Card" to get started.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {profiles?.map((profile) => (
        <ProfileCard key={profile.id} profile={profile} />
      ))}
      {reviewPlaques?.map((plaque) => (
        <ReviewPlaqueCard key={plaque.id} plaque={plaque} />
      ))}
    </div>
  );
};