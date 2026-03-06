import { Outlet } from '@tanstack/react-router';
import NavBar from '../components/NavBar';
import ProfileSetupModal from '../components/ProfileSetupModal';

export default function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t-4 border-border bg-card py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} • Built with ❤️ using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                window.location.hostname
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-bold"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
      <ProfileSetupModal />
    </div>
  );
}
