import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { exportPartAsGLB, generatePartFilename } from './glbExport';
import type { RecutResult } from '../recut/RecutEngine';
import { toast } from 'sonner';

interface ExportPanelProps {
  recutResult: RecutResult | null;
  projectName: string;
}

export default function ExportPanel({ recutResult, projectName }: ExportPanelProps) {
  const [exporting, setExporting] = useState<number | null>(null);

  const hasValidCut = recutResult?.hasValidCut ?? false;

  const handleExport = async (partNumber: 1 | 2) => {
    if (!recutResult) return;

    setExporting(partNumber);

    try {
      const part = partNumber === 1 ? recutResult.part1 : recutResult.part2;
      const filename = generatePartFilename(projectName, partNumber);
      await exportPartAsGLB(part, filename);
      toast.success(`Part ${partNumber} exported successfully!`);
    } catch (error) {
      console.error('Export failed:', error);
      toast.error(`Failed to export Part ${partNumber}`);
    } finally {
      setExporting(null);
    }
  };

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <Download className="h-5 w-5" />
          Export Parts
        </CardTitle>
        <CardDescription>Download the cut parts as GLB files</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={() => handleExport(1)}
          disabled={!hasValidCut || exporting !== null}
          className="retro-button w-full bg-primary text-primary-foreground font-bold"
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting === 1 ? 'Exporting...' : 'Export Part 1'}
        </Button>
        <Button
          onClick={() => handleExport(2)}
          disabled={!hasValidCut || exporting !== null}
          className="retro-button w-full bg-secondary text-secondary-foreground font-bold"
        >
          <Download className="mr-2 h-4 w-4" />
          {exporting === 2 ? 'Exporting...' : 'Export Part 2'}
        </Button>
        {!hasValidCut && (
          <p className="text-sm text-muted-foreground text-center">
            Perform a cut to enable export
          </p>
        )}
      </CardContent>
    </Card>
  );
}
