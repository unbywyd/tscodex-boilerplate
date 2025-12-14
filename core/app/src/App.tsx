import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import EventToast from './components/EventToast';
import { DocProvider } from './components/documented';
import { ErrorBoundary } from './components/ErrorBoundary';
import { loadEvents } from './lib/docs-loader';
import { registerEvents } from './lib/events';
import { Skeleton, Container } from './components/ui';
import { CustomHomePage } from '@prototype/config/nav';

// Lazy load pages for better performance
const DefaultHomePage = lazy(() => import('./pages/Home'));
const DocsIndex = lazy(() => import('./pages/DocsIndex'));
const DocViewer = lazy(() => import('./pages/DocViewer'));
const PrototypePage = lazy(() => import('./pages/Prototype'));
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

function App() {
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

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <div>
          <DocProvider>
            <EventToast />
            <Layout>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/docs" element={<DocsIndex />} />
                  <Route path="/docs/*" element={<DocViewer />} />
                  <Route path="/prototype/*" element={<PrototypePage />} />
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
          </DocProvider>
        </div>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;

