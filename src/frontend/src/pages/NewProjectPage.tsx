import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useCreateRecutsProject } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import ModelUploadPanel from '../features/upload/ModelUploadPanel';
import ModelViewport from '../features/viewer/ModelViewport';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { LoadedModel } from '../features/viewer/ModelLoader';
import { DEFAULT_RECUT_STATE } from '../features/recut/recutTypes';

export default function NewProjectPage() {
  const navigate = useNavigate();
  const createProject = useCreateRecutsProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loadedModel, setLoadedModel] = useState<LoadedModel | null>(null);

  const handleModelLoaded = (model: LoadedModel) => {
    setLoadedModel(model);
    toast.success('Model loaded successfully!');
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a project name');
      return;
    }

    if (!loadedModel) {
      toast.error('Please upload a 3D model');
      return;
    }

    try {
      const projectId = await createProject.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        recutsSettings: {
          cutPlaneAngle: DEFAULT_RECUT_STATE.cutPlane.angle,
          cutPlaneOffset: DEFAULT_RECUT_STATE.cutPlane.offset,
          showReferenceModel: DEFAULT_RECUT_STATE.showReferenceModel,
          showSectionHelper: DEFAULT_RECUT_STATE.showSectionHelper
        }
      });

      toast.success('Project created successfully!');
      navigate({ to: '/editor/$projectId', params: { projectId: projectId.toString() } });
    } catch (error) {
      console.error('Failed to create project:', error);
      toast.error('Failed to create project');
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-black mb-8">Create New Project</h1>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="retro-card">
            <CardHeader>
              <CardTitle className="font-display">Project Details</CardTitle>
              <CardDescription>Give your project a name and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-bold">
                  Project Name *
                </Label>
                <Input
                  id="name"
                  placeholder="My Awesome Model"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border-2"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description" className="font-bold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Optional description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border-2"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <ModelUploadPanel onModelLoaded={handleModelLoaded} />

          <Button
            onClick={handleCreate}
            disabled={createProject.isPending || !name.trim() || !loadedModel}
            className="retro-button w-full bg-primary text-primary-foreground font-bold"
            size="lg"
          >
            <Plus className="mr-2 h-5 w-5" />
            {createProject.isPending ? 'Creating...' : 'Create Project & Open Editor'}
          </Button>
        </div>

        <div>
          <Card className="retro-card h-full">
            <CardHeader>
              <CardTitle className="font-display">Model Preview</CardTitle>
              <CardDescription>
                {loadedModel ? 'Your model is ready!' : 'Upload a model to see preview'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ModelViewport model={loadedModel?.scene ?? null} className="w-full h-[500px]" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
