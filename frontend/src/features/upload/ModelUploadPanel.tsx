import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileUp } from 'lucide-react';
import { loadModelFromFile, type LoadedModel } from '../viewer/ModelLoader';
import { MAX_UPLOAD_SIZE_BYTES, formatFileSize } from '../../config/uploadLimits';
import InlineError from '../../components/InlineError';

interface ModelUploadPanelProps {
  onModelLoaded: (model: LoadedModel, file: File) => void;
}

export default function ModelUploadPanel({ onModelLoaded }: ModelUploadPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    setError(null);

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      setError(
        `File size (${formatFileSize(file.size)}) exceeds the maximum allowed size of ${formatFileSize(MAX_UPLOAD_SIZE_BYTES)}`
      );
      return;
    }

    setLoading(true);

    try {
      const loadedModel = await loadModelFromFile(file);
      onModelLoaded(loadedModel, file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load model');
    } finally {
      setLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRetry = () => {
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  return (
    <Card className="retro-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-display">
          <FileUp className="h-5 w-5" />
          Upload 3D Model
        </CardTitle>
        <CardDescription>
          Supported formats: GLB, GLTF, OBJ • Max size: {formatFileSize(MAX_UPLOAD_SIZE_BYTES)}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && <InlineError message={error} onRetry={handleRetry} />}

        <input
          ref={fileInputRef}
          type="file"
          accept=".glb,.gltf,.obj"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={loading}
          className="retro-button w-full bg-primary text-primary-foreground font-bold"
          size="lg"
        >
          <Upload className="mr-2 h-5 w-5" />
          {loading ? 'Loading Model...' : 'Choose File'}
        </Button>
      </CardContent>
    </Card>
  );
}
