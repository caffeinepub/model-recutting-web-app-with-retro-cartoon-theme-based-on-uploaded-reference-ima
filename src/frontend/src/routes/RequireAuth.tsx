import { ReactNode } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';

interface RequireAuthProps {
  children: ReactNode;
}

export default function RequireAuth({ children }: RequireAuthProps) {
  const { identity, login, isLoggingIn } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-4">
        <Card className="retro-card max-w-md w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-display">Sign In Required</CardTitle>
            <CardDescription className="text-lg">
              You need to sign in to access this feature
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center gap-4">
            <p className="text-center text-muted-foreground">
              Sign in with Internet Identity to create and manage your 3D model projects. Internet Identity is a secure, privacy-focused authentication system for the Internet Computer.
            </p>
            <Button
              onClick={login}
              disabled={isLoggingIn}
              size="lg"
              className="retro-button bg-primary text-primary-foreground hover:bg-primary/90 font-bold text-lg"
            >
              <LogIn className="mr-2 h-5 w-5" />
              {isLoggingIn ? 'Signing In...' : 'Sign In (Internet Identity)'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
