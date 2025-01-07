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
import QRCode from 'qrcode';

interface AvailableCodesTableProps {
  codes: NFCCode[];
  onDownloadCSV: () => void;
}

const AvailableCodesTable = ({ codes, onDownloadCSV }: AvailableCodesTableProps) => {
  const availableCodes = codes.filter(code => !code.assigned_to).slice(0, 10);

  const handleQRDownload = async (url: string) => {
    try {
      // Generate QR code as SVG
      const qrSvg = await QRCode.toString(url, {
        type: 'svg',
        margin: 1,
        width: 300
      });

      // Convert SVG to EPS-like format (since direct EPS conversion isn't available)
      const eps = `%!PS-Adobe-3.0 EPSF-3.0
%%BoundingBox: 0 0 300 300
%%EndComments
/m { moveto } def
/l { lineto } def
${qrSvg
  .replace(/<svg[^>]*>/, '')
  .replace(/<\/svg>/, '')
  .replace(/<path[^d]*d="([^"]*)"[^>]*>/g, '$1')
  .replace(/M/g, 'm')
  .replace(/L/g, 'l')
  .replace(/Z/g, 'closepath')}
stroke
showpage
%%EOF`;

      // Create and download the EPS file
      const blob = new Blob([eps], { type: 'application/postscript' });
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `qr-code-${url.split('/').pop()}.eps`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

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
            <TableHead>QR</TableHead>
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
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleQRDownload(`${window.location.origin}/c/${code.code}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download QR
                </Button>
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