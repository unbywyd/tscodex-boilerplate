import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import DocsIndex from './pages/DocsIndex';
import DocViewer from './pages/DocViewer';
import PrototypePage from './pages/Prototype';
import PrismaSchemaPage from './pages/PrismaSchema';
import AboutPage from './pages/About';
import EventToast from './components/EventToast';
import { DocProvider } from './components/documented';
import { loadEvents } from './lib/docs-loader';
import { registerEvents } from './lib/events';

function App() {
  // Load and register events from docs on mount
  useEffect(() => {
    loadEvents().then(events => {
      if (events.length > 0) {
        registerEvents(events)
      }
    })
  }, [])

  return (
    <BrowserRouter>
      <DocProvider>
        <EventToast />
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/docs" element={<DocsIndex />} />
            <Route path="/docs/*" element={<DocViewer />} />
            <Route path="/prototype/*" element={<PrototypePage />} />
            <Route path="/schema" element={<PrismaSchemaPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </DocProvider>
    </BrowserRouter>
  );
}

export default App;

