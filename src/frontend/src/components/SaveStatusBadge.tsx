import { Badge } from '@/components/ui/badge';
import { Check, Clock, Loader2 } from 'lucide-react';

interface SaveStatusBadgeProps {
  status: 'saved' | 'unsaved' | 'saving';
}

export default function SaveStatusBadge({ status }: SaveStatusBadgeProps) {
  if (status === 'saved') {
    return (
      <Badge variant="outline" className="border-2 font-bold">
        <Check className="mr-1 h-3 w-3" />
        Saved
      </Badge>
    );
  }

  if (status === 'saving') {
    return (
      <Badge variant="outline" className="border-2 font-bold">
        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
        Saving...
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-2 font-bold border-destructive text-destructive">
      <Clock className="mr-1 h-3 w-3" />
      Unsaved Changes
    </Badge>
  );
}
