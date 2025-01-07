import { AddTappioDialog } from "./AddTappioDialog";
import { UseMutationResult } from "@tanstack/react-query";

interface DashboardActionsProps {
  isAddingItem: boolean;
  setIsAddingItem: (value: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
}

export const DashboardActions = ({
  isAddingItem,
  setIsAddingItem,
  assignCodeMutation,
}: DashboardActionsProps) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-semibold">Your Tappio Cards & Review Plaques</h2>
      <div className="flex gap-2">
        <AddTappioDialog
          isOpen={isAddingItem}
          onOpenChange={setIsAddingItem}
          assignCodeMutation={assignCodeMutation}
          onAdd={() => setIsAddingItem(false)}
        />
      </div>
    </div>
  );
};