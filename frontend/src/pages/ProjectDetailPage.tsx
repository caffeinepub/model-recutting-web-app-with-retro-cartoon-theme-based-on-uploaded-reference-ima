import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetRecutsProjectById } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Loader2 } from 'lucide-react';

export default function ProjectDetailPage() {
  const { projectId } = useParams({ from: '/project/$projectId' });
  const navigate = useNavigate();
  const { data: project, isLoading } = useGetRecutsProjectById(BigInt(projectId));

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="retro-card max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="font-display">Project Not Found</CardTitle>
            <CardDescription>The requested project could not be found</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              className="retro-button w-full bg-primary text-primary-foreground font-bold"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button
        onClick={() => navigate({ to: '/dashboard' })}
        variant="outline"
        size="sm"
        className="mb-6 font-bold border-2"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>

      <Card className="retro-card max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-display">{project.name}</CardTitle>
          <CardDescription className="text-base">
            {project.description || 'No description provided'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-bold text-lg">Cut Settings</h3>
            <div className="bg-muted p-4 rounded border-2 border-border space-y-1">
              <p>
                <span className="font-bold">Angle:</span> {project.recutsSettings.cutPlaneAngle}°
              </p>
              <p>
                <span className="font-bold">Offset:</span>{' '}
                {project.recutsSettings.cutPlaneOffset.toFixed(2)}
              </p>
              <p>
                <span className="font-bold">Reference Model:</span>{' '}
                {project.recutsSettings.showReferenceModel ? 'Visible' : 'Hidden'}
              </p>
              <p>
                <span className="font-bold">Section Helper:</span>{' '}
                {project.recutsSettings.showSectionHelper ? 'Visible' : 'Hidden'}
              </p>
            </div>
          </div>

          <Button
            onClick={() => navigate({ to: '/editor/$projectId', params: { projectId: projectId } })}
            className="retro-button w-full bg-primary text-primary-foreground font-bold"
            size="lg"
          >
            <Edit className="mr-2 h-5 w-5" />
            Open in Editor
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
