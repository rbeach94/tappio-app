import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UseMutationResult } from "@tanstack/react-query";

interface AddCardDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
  onAddCard: () => void;
}

export const AddCardDialog = ({ 
  isOpen, 
  onOpenChange, 
  assignCodeMutation, 
  onAddCard 
}: AddCardDialogProps) => {
  const [code, setCode] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Tappio Card</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tappio Card</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter your 6-character code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
          <Button 
            onClick={() => {
              assignCodeMutation.mutate(code);
              onAddCard();
            }}
            disabled={assignCodeMutation.isPending}
            className="w-full"
          >
            {assignCodeMutation.isPending ? (
              <>
                <Loader2 className="animate-spin" />
                Adding...
              </>
            ) : (
              "Add Card"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};