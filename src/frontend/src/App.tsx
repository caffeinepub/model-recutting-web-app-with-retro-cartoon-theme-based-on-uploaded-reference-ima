import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AppLayout from './layouts/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import NewProjectPage from './pages/NewProjectPage';
import EditorPage from './pages/EditorPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import HelpPage from './pages/HelpPage';
import RequireAuth from './routes/RequireAuth';

const rootRoute = createRootRoute({
  component: AppLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: () => (
    <RequireAuth>
      <DashboardPage />
    </RequireAuth>
  )
});

const newProjectRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/new-project',
  component: () => (
    <RequireAuth>
      <NewProjectPage />
    </RequireAuth>
  )
});

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/editor/$projectId',
  component: () => (
    <RequireAuth>
      <EditorPage />
    </RequireAuth>
  )
});

const projectDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/project/$projectId',
  component: () => (
    <RequireAuth>
      <ProjectDetailPage />
    </RequireAuth>
  )
});

const helpRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/help',
  component: HelpPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  newProjectRoute,
  editorRoute,
  projectDetailRoute,
  helpRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
