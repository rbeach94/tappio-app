import { AddCardDialog } from "./AddCardDialog";
import { UseMutationResult } from "@tanstack/react-query";

interface DashboardActionsProps {
  isAddingCard: boolean;
  setIsAddingCard: (value: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
}

export const DashboardActions = ({
  isAddingCard,
  setIsAddingCard,
  assignCodeMutation,
}: DashboardActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Your Tappio Cards & Review Plaques</h2>
      <AddCardDialog
        isOpen={isAddingCard}
        onOpenChange={setIsAddingCard}
        assignCodeMutation={assignCodeMutation}
        onAddCard={() => setIsAddingCard(false)}
      />
    </div>
  );
};