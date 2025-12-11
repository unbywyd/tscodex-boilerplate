import { lazy, Suspense, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getRenderer } from '../../lib/render-config';
import { Tabs, TabsList, TabsTrigger, TabsContent, Button } from '../ui';
import TomlCodeRenderer from './TomlCodeRenderer';
import ShareButton from './ShareButton';
import { loadDocFile } from '../../lib/docs-loader';
import type { DocFile } from '../../lib/docs-loader';

// Lazy load MermaidDiagram to avoid loading mermaid library for non-mermaid pages
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

interface TomlRendererProps {
  content: any;
  folderPath?: string;
  filePath?: string;
}

// Recursively find all mermaid fields in content
function findMermaidFields(obj: any, path: string = ''): { path: string; code: string; title?: string }[] {
  const results: { path: string; code: string; title?: string }[] = [];

  if (!obj || typeof obj !== 'object') return results;

  for (const [key, value] of Object.entries(obj)) {
    const currentPath = path ? `${path}.${key}` : key;

    if (key === 'mermaid' && typeof value === 'string') {
      // Found a mermaid string field
      results.push({ path: currentPath, code: value });
    } else if (key === 'mermaid' && typeof value === 'object' && value !== null) {
      // Found a mermaid object with code and optional title
      const mermaidObj = value as { code?: string; title?: string };
      if (mermaidObj.code) {
        results.push({ path: currentPath, code: mermaidObj.code, title: mermaidObj.title });
      }
    } else if (typeof value === 'object' && value !== null) {
      // Recurse into nested objects
      results.push(...findMermaidFields(value, currentPath));
    }
  }

  return results;
}

export default function TomlRenderer({ content, folderPath = '*', filePath }: TomlRendererProps) {
  const location = useLocation();
  const renderer = getRenderer(folderPath, 'toml');
  const mermaidFields = findMermaidFields(content);
  const [rawToml, setRawToml] = useState<string | null>(null);
  const [loadingRaw, setLoadingRaw] = useState(false);

  useEffect(() => {
    if (filePath && filePath.endsWith('.toml')) {
      setLoadingRaw(true);
      loadDocFile(filePath, true)
        .then((file: DocFile) => {
          if (typeof file.content === 'string') {
            setRawToml(file.content);
          }
        })
        .catch((err) => {
          console.error('Failed to load raw TOML:', err);
        })
        .finally(() => {
          setLoadingRaw(false);
        });
    }
  }, [filePath]);

  return (
    <Tabs defaultValue="rendered" className="w-full">
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="rendered">Rendered</TabsTrigger>
          <TabsTrigger value="source">Source Code</TabsTrigger>
        </TabsList>
        <div className="flex items-center gap-2">
          {content?.implementation?.preview && (
            <Button asChild variant="outline" size="sm">
              <Link to={content.implementation.preview}>
                Preview →
              </Link>
            </Button>
          )}
          <ShareButton url={location.pathname} />
        </div>
      </div>
      
      <TabsContent value="rendered" className="space-y-6 mt-6">
        {/* Render main content */}
        {renderer(content)}

        {/* Render any mermaid diagrams found */}
        {mermaidFields.length > 0 && (
          <div className="space-y-4 mt-8">
            {mermaidFields.map((field, index) => (
              <Suspense
                key={index}
                fallback={
                  <div className="h-[300px] flex items-center justify-center text-muted-foreground border rounded-lg">
                    Loading diagram...
                  </div>
                }
              >
                <MermaidDiagram
                  code={field.code}
                  title={field.title || (mermaidFields.length > 1 ? `Diagram ${index + 1}` : undefined)}
                />
              </Suspense>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="source" className="mt-6">
        {loadingRaw ? (
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            Loading source code...
          </div>
        ) : rawToml ? (
          <TomlCodeRenderer code={rawToml} fileName={filePath?.split('/').pop()} />
        ) : (
          <div className="text-sm text-muted-foreground p-4 border border-dashed rounded-lg">
            Source code unavailable
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}

