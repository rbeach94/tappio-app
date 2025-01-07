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

interface AddTappioDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
  onAdd: () => void;
}

export const AddTappioDialog = ({ 
  isOpen, 
  onOpenChange, 
  assignCodeMutation, 
  onAdd 
}: AddTappioDialogProps) => {
  const [code, setCode] = useState("");
  const isReviewCode = code.length === 8;
  const isCardCode = code.length === 6;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Tappio</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tappio Item</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter your 6 or 8-character code"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={8}
          />
          <p className="text-sm text-muted-foreground">
            {isCardCode && "This code will add a Tappio Card"}
            {isReviewCode && "This code will add a Review Plaque"}
            {!isCardCode && !isReviewCode && "Enter a 6-digit code for a Tappio Card or an 8-digit code for a Review Plaque"}
          </p>
          <Button 
            onClick={() => {
              assignCodeMutation.mutate(code);
              onAdd();
            }}
            disabled={assignCodeMutation.isPending || (!isCardCode && !isReviewCode)}
            className="w-full"
          >
            {assignCodeMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Item"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};