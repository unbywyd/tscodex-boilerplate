import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './components/AppProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { loadEvents } from './lib/docs-loader';
import { registerEvents } from './lib/events';
import { Skeleton, Container } from './components/ui';
import { CustomHomePage } from '@prototype/config/nav';
import { Home } from 'lucide-react';

// Lazy load pages for better performance
const DefaultHomePage = lazy(() => import('./pages/Home'));
const DocsIndex = lazy(() => import('./pages/DocsIndex'));
const DocViewer = lazy(() => import('./pages/DocViewer'));
const PrototypePage = lazy(() => import('@prototype/pages'));
const PrismaSchemaPage = lazy(() => import('./pages/PrismaSchema'));
const AboutPage = lazy(() => import('./pages/About'));
const ChallengePage = lazy(() => import('./pages/Challenge'));
const GetStartedPage = lazy(() => import('./pages/GetStarted'));
const InterviewPage = lazy(() => import('./pages/Interview'));
const UIKitPage = lazy(() => import('./pages/uikit'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Use custom home page if provided, otherwise default
const HomePage = CustomHomePage || DefaultHomePage;

// Loading fallback component
function PageLoader() {
  return (
    <Container size="lg" className="py-8 space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-6 w-96" />
      <Skeleton className="h-96 w-full" />
    </Container>
  );
}

// Subtle back-to-home button for prototype pages
// Positioned to not interfere with mobile prototypes
function PrototypeBackButton() {
  return (
    <Link
      to="/"
      className="fixed top-2 left-2 z-[9999] p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm opacity-40 hover:opacity-100 transition-opacity"
      title="Back to Home"
    >
      <Home className="h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

// App content with conditional Layout
function AppContent() {
  const location = useLocation();
  const isPrototype = location.pathname.startsWith('/prototype');

  // Load and register events from docs on mount
  useEffect(() => {
    loadEvents()
      .then(events => {
        if (events.length > 0) {
          registerEvents(events)
        }
      })
      .catch(() => {
        // Silently fail - events are optional
      })
  }, [])

  // Prototype routes - no Layout, just minimal back button
  if (isPrototype) {
    return (
      <AppProvider>
        <PrototypeBackButton />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/prototype/*" element={<PrototypePage />} />
          </Routes>
        </Suspense>
      </AppProvider>
    );
  }

  // Regular routes with full Layout
  return (
    <AppProvider>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/docs/*" element={<DocViewer />} />
            <Route path="/schema" element={<PrismaSchemaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/ui-kit/*" element={<UIKitPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </AppProvider>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

