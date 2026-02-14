import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InlineErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export default function InlineError({ title = 'Error', message, onRetry }: InlineErrorProps) {
  return (
    <Alert variant="destructive" className="border-2">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle className="font-bold">{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <p>{message}</p>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            size="sm"
            className="mt-3 font-bold"
          >
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
