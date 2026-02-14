import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import AuthButton from './AuthButton';
import { Home, FolderOpen, Plus, HelpCircle } from 'lucide-react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

export default function NavBar() {
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();

  return (
    <nav className="border-b-4 border-border bg-card sticky top-0 z-50 shadow-retro-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <img src="/assets/generated/app-logo.dim_512x512.png" alt="Logo" className="h-12 w-12" />
            <span className="font-display text-2xl font-black text-primary">ModelCut</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/' })}
              className="font-bold"
            >
              <Home className="mr-2 h-4 w-4" />
              Home
            </Button>

            {identity && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate({ to: '/dashboard' })}
                  className="font-bold"
                >
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Projects
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate({ to: '/new-project' })}
                  className="retro-button bg-primary text-primary-foreground font-bold"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/help' })}
              className="font-bold"
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Help
            </Button>

            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
}
