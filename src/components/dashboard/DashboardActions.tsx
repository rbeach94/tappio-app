import { AddCardDialog } from "./AddCardDialog";
import { AddReviewPlaqueDialog } from "./AddReviewPlaqueDialog";
import { UseMutationResult } from "@tanstack/react-query";

interface DashboardActionsProps {
  isAddingCard: boolean;
  setIsAddingCard: (value: boolean) => void;
  isAddingPlaque: boolean;
  setIsAddingPlaque: (value: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
}

export const DashboardActions = ({
  isAddingCard,
  setIsAddingCard,
  isAddingPlaque,
  setIsAddingPlaque,
  assignCodeMutation,
}: DashboardActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Your Tappio Cards & Review Plaques</h2>
      <div className="flex gap-2">
        <AddCardDialog
          isOpen={isAddingCard}
          onOpenChange={setIsAddingCard}
          assignCodeMutation={assignCodeMutation}
          onAddCard={() => setIsAddingCard(false)}
        />
        <AddReviewPlaqueDialog
          isOpen={isAddingPlaque}
          onOpenChange={setIsAddingPlaque}
          assignCodeMutation={assignCodeMutation}
          onAddPlaque={() => setIsAddingPlaque(false)}
        />
      </div>
    </div>
  );
};