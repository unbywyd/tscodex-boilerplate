import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import DocsIndex from './pages/DocsIndex';
import DocViewer from './pages/DocViewer';
import PrototypePage from './pages/Prototype';
import PrismaSchemaPage from './pages/PrismaSchema';
import AboutPage from './pages/About';

function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;

