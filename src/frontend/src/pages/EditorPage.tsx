import { useState, useEffect } from 'react';
import { useParams, useNavigate } from '@tanstack/react-router';
import { useGetRecutsProjectById, useUpdateRecutsProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ModelUploadPanel from '../features/upload/ModelUploadPanel';
import PlaneCutControls from '../features/recut/PlaneCutControls';
import RecutPreview from '../features/recut/RecutPreview';
import ExportPanel from '../features/export/ExportPanel';
import SaveStatusBadge from '../components/SaveStatusBadge';
import ErrorBoundary from '../components/ErrorBoundary';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { LoadedModel } from '../features/viewer/ModelLoader';
import { DEFAULT_RECUT_STATE, type RecutState } from '../features/recut/recutTypes';
import { performRecut, type RecutResult } from '../features/recut/RecutEngine';

export default function EditorPage() {
  const { projectId } = useParams({ from: '/editor/$projectId' });
  const navigate = useNavigate();
  const { data: project, isLoading } = useGetRecutsProjectById(BigInt(projectId));
  const updateProject = useUpdateRecutsProject();

  const [loadedModel, setLoadedModel] = useState<LoadedModel | null>(null);
  const [recutState, setRecutState] = useState<RecutState>(DEFAULT_RECUT_STATE);
  const [recutResult, setRecutResult] = useState<RecutResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'unsaved' | 'saving'>('saved');

  useEffect(() => {
    if (project) {
      setRecutState({
        cutPlane: {
          angle: project.recutsSettings.cutPlaneAngle,
          offset: project.recutsSettings.cutPlaneOffset
        },
        visibility: { part1: true, part2: true },
        showReferenceModel: project.recutsSettings.showReferenceModel,
        showSectionHelper: project.recutsSettings.showSectionHelper
      });
    }
  }, [project]);

  useEffect(() => {
    if (loadedModel?.originalMesh) {
      const result = performRecut(
        loadedModel.originalMesh,
        recutState.cutPlane.angle,
        recutState.cutPlane.offset
      );
      setRecutResult(result);
    }
  }, [loadedModel, recutState.cutPlane]);

  const handleStateChange = (newState: RecutState) => {
    setRecutState(newState);
    setSaveStatus('unsaved');
  };

  const handleSave = async () => {
    if (!project) return;

    setSaveStatus('saving');

    try {
      await updateProject.mutateAsync({
        projectId: project.id,
        name: project.name,
        description: project.description,
        recutsSettings: {
          cutPlaneAngle: recutState.cutPlane.angle,
          cutPlaneOffset: recutState.cutPlane.offset,
          showReferenceModel: recutState.showReferenceModel,
          showSectionHelper: recutState.showSectionHelper
        }
      });
      setSaveStatus('saved');
      toast.success('Project saved successfully!');
    } catch (error) {
      console.error('Failed to save project:', error);
      toast.error('Failed to save project');
      setSaveStatus('unsaved');
    }
  };

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
    <div
      className="min-h-screen py-8 px-4"
      style={{
        backgroundImage: 'url(/assets/generated/retro-pattern.dim_1024x1024.png)',
        backgroundSize: '200px 200px',
        backgroundRepeat: 'repeat',
        backgroundBlendMode: 'overlay',
        backgroundColor: 'oklch(var(--background))'
      }}
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate({ to: '/dashboard' })}
              variant="outline"
              size="sm"
              className="font-bold border-2"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-display font-black">{project.name}</h1>
              {project.description && (
                <p className="text-muted-foreground">{project.description}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SaveStatusBadge status={saveStatus} />
            <Button
              onClick={handleSave}
              disabled={saveStatus === 'saving' || saveStatus === 'saved'}
              className="retro-button bg-primary text-primary-foreground font-bold"
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr_350px] gap-6">
          <div className="space-y-6">
            {!loadedModel && (
              <ModelUploadPanel onModelLoaded={(model) => setLoadedModel(model)} />
            )}

            <ErrorBoundary>
              <Card className="retro-card">
                <CardHeader>
                  <CardTitle className="font-display">3D Viewport</CardTitle>
                  <CardDescription>
                    {loadedModel ? 'Adjust controls to cut your model' : 'Upload a model to begin'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecutPreview
                    recutResult={recutResult}
                    visibility={recutState.visibility}
                    showReferenceModel={recutState.showReferenceModel}
                    showSectionHelper={recutState.showSectionHelper}
                    referenceModel={loadedModel?.scene ?? null}
                    className="w-full h-[600px]"
                  />
                </CardContent>
              </Card>
            </ErrorBoundary>
          </div>

          <div className="space-y-6">
            <PlaneCutControls
              state={recutState}
              onChange={handleStateChange}
              onReset={() => {
                setRecutState(DEFAULT_RECUT_STATE);
                setSaveStatus('unsaved');
              }}
              disabled={!loadedModel}
            />

            <ExportPanel recutResult={recutResult} projectName={project.name} />
          </div>
        </div>
      </div>
    </div>
  );
}
