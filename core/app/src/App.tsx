import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AppProvider } from './components/AppProvider';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Skeleton, Container } from './components/ui';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/Home'));
const DocsIndex = lazy(() => import('./pages/DocsIndex'));
const DocViewer = lazy(() => import('./pages/DocViewer'));
const PlatformsPage = lazy(() => import('./pages/Platforms'));
const PrismaSchemaPage = lazy(() => import('./pages/PrismaSchema'));
const AboutPage = lazy(() => import('./pages/About'));
const ChallengePage = lazy(() => import('./pages/Challenge'));
const GetStartedPage = lazy(() => import('./pages/GetStarted'));
const InterviewPage = lazy(() => import('./pages/Interview'));
const NotFound = lazy(() => import('./pages/NotFound'));
const PrototypePage = lazy(() => import('./pages/Prototype'));

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

// App content with Layout
function AppContent() {
  return (
    <AppProvider>
      <Layout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/docs/*" element={<DocViewer />} />
            <Route path="/platforms" element={<PlatformsPage />} />
            <Route path="/platforms/:platformId" element={<PlatformsPage />} />
            <Route path="/schema" element={<PrismaSchemaPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/challenge" element={<ChallengePage />} />
            <Route path="/get-started" element={<GetStartedPage />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview/:platformId" element={<InterviewPage />} />
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
        <Routes>
          {/* Prototype page - fullscreen without Layout */}
          <Route
            path="/prototype"
            element={
              <Suspense fallback={<PageLoader />}>
                <PrototypePage />
              </Suspense>
            }
          />
          {/* All other pages with Layout */}
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

export default App;
