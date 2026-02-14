import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useGetRecutsProjectsByCaller, useDeleteRecutsProject } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { FolderOpen, Plus, Trash2, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data: projects, isLoading } = useGetRecutsProjectsByCaller();
  const deleteProject = useDeleteRecutsProject();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<bigint | null>(null);

  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      await deleteProject.mutateAsync(projectToDelete);
      toast.success('Project deleted successfully');
      setDeleteDialogOpen(false);
      setProjectToDelete(null);
    } catch (error) {
      console.error('Failed to delete project:', error);
      toast.error('Failed to delete project');
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-display font-black mb-2">My Projects</h1>
          <p className="text-muted-foreground text-lg">
            Manage your 3D model cutting projects
          </p>
        </div>
        <Button
          onClick={() => navigate({ to: '/new-project' })}
          className="retro-button bg-primary text-primary-foreground font-bold"
          size="lg"
        >
          <Plus className="mr-2 h-5 w-5" />
          New Project
        </Button>
      </div>

      {!projects || projects.length === 0 ? (
        <Card className="retro-card">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-24 w-24 text-muted-foreground mb-4" />
            <h3 className="text-2xl font-display font-bold mb-2">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Create your first project to start cutting 3D models
            </p>
            <Button
              onClick={() => navigate({ to: '/new-project' })}
              className="retro-button bg-primary text-primary-foreground font-bold"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card key={project.id.toString()} className="retro-card">
              <CardHeader>
                <CardTitle className="font-display">{project.name}</CardTitle>
                <CardDescription>{project.description || 'No description'}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  onClick={() => navigate({ to: '/editor/$projectId', params: { projectId: project.id.toString() } })}
                  className="retro-button w-full bg-primary text-primary-foreground font-bold"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Open Editor
                </Button>
                <Button
                  onClick={() => {
                    setProjectToDelete(project.id);
                    setDeleteDialogOpen(true);
                  }}
                  variant="outline"
                  className="w-full font-bold border-2"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="retro-card">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">Delete Project?</AlertDialogTitle>
            <AlertDialogDescription className="text-base">
              This action cannot be undone. This will permanently delete the project.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="font-bold">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="retro-button bg-destructive text-destructive-foreground font-bold"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
