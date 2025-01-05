import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, ClipboardList } from "lucide-react";
import AvailableCodesTable from './AvailableCodesTable';
import type { NFCCode } from '@/pages/AdminDashboard';

interface ReviewCodeManagementProps {
  reviewCodes: NFCCode[];
  isGenerating: boolean;
  onGenerateCodes: (count: number) => void;
  onDownloadCSV: () => void;
}

const ReviewCodeManagement = ({ 
  reviewCodes, 
  isGenerating, 
  onGenerateCodes, 
  onDownloadCSV 
}: ReviewCodeManagementProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="w-5 h-5" />
          Review Code Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Button
              onClick={() => onGenerateCodes(10)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Generate 10 Codes
            </Button>
            <Button
              onClick={() => onGenerateCodes(25)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Generate 25 Codes
            </Button>
            <Button
              onClick={() => onGenerateCodes(100)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Generate 100 Codes
            </Button>
          </div>
          {reviewCodes && (
            <AvailableCodesTable 
              codes={reviewCodes} 
              onDownloadCSV={onDownloadCSV}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCodeManagement;