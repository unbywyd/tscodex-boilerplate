import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/Home';
import DocsIndex from './pages/DocsIndex';
import DocViewer from './pages/DocViewer';
import PrototypePage from './pages/Prototype';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/docs" element={<DocsIndex />} />
          <Route path="/docs/*" element={<DocViewer />} />
          <Route path="/prototype/*" element={<PrototypePage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

