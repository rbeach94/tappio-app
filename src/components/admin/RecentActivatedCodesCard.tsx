import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2 } from "lucide-react";
import type { NFCCode } from '@/pages/AdminDashboard';

interface RecentActivatedCodesCardProps {
  codes: NFCCode[];
}

const RecentActivatedCodesCard = ({ codes }: RecentActivatedCodesCardProps) => {
  const recentActivatedCodes = codes
    .filter(code => code.assigned_to && code.assigned_at)
    .sort((a, b) => new Date(b.assigned_at!).getTime() - new Date(a.assigned_at!).getTime())
    .slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          Recently Activated Codes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Activated At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivatedCodes.map((code) => (
              <TableRow key={code.id}>
                <TableCell className="font-mono">{code.code}</TableCell>
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
                <TableCell>
                  {new Date(code.assigned_at!).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecentActivatedCodesCard;