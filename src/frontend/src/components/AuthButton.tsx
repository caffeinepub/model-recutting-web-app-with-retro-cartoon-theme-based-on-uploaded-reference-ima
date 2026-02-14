import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut } from 'lucide-react';

export default function AuthButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (error: unknown) {
        console.error('Login error:', error);
        if (error instanceof Error && error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <Button
      onClick={handleAuth}
      disabled={disabled}
      size="sm"
      variant={isAuthenticated ? 'outline' : 'default'}
      className={
        isAuthenticated
          ? 'font-bold'
          : 'retro-button bg-secondary text-secondary-foreground font-bold'
      }
    >
      {isAuthenticated ? (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </>
      ) : (
        <>
          <LogIn className="mr-2 h-4 w-4" />
          {loginStatus === 'logging-in' ? 'Signing In...' : 'Sign In (Internet Identity)'}
        </>
      )}
    </Button>
  );
}
