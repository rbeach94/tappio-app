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

interface AddReviewPlaqueDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  assignCodeMutation: UseMutationResult<any, Error, string>;
  onAddPlaque: () => void;
}

export const AddReviewPlaqueDialog = ({ 
  isOpen, 
  onOpenChange, 
  assignCodeMutation, 
  onAddPlaque 
}: AddReviewPlaqueDialogProps) => {
  const [code, setCode] = useState("");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Review Plaque</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Review Plaque</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <Input
            placeholder="Enter your 8-character code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={8}
          />
          <Button 
            onClick={() => {
              assignCodeMutation.mutate(code);
              onAddPlaque();
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
              "Add Plaque"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};