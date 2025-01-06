import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import type { NFCCode } from '@/pages/AdminDashboard';

interface AvailableCodesTableProps {
  codes: NFCCode[];
  onDownloadCSV: () => void;
}

const AvailableCodesTable = ({ codes, onDownloadCSV }: AvailableCodesTableProps) => {
  const availableCodes = codes.filter(code => !code.assigned_to).slice(0, 10);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Available Codes</h3>
        <Button onClick={onDownloadCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download CSV
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>URL</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {availableCodes.map((code) => (
            <TableRow key={code.id}>
              <TableCell className="font-mono">
                <a 
                  href={`/c/${code.code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-blue-600 hover:underline"
                >
                  {code.code}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </TableCell>
              <TableCell>
                <a 
                  href={code.url || ''} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {code.url}
                </a>
              </TableCell>
              <TableCell>{new Date(code.created_at).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AvailableCodesTable;