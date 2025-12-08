import { lazy, Suspense } from 'react';
import { getRenderer } from '../../lib/render-config';

// Lazy load MermaidDiagram to avoid loading ReactFlow for non-mermaid pages
const MermaidDiagram = lazy(() => import('./MermaidDiagram'));

interface TomlRendererProps {
  content: any;
  folderPath?: string;
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

export default function TomlRenderer({ content, folderPath = '*' }: TomlRendererProps) {
  const renderer = getRenderer(folderPath, 'toml');
  const mermaidFields = findMermaidFields(content);

  return (
    <div className="space-y-6">
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
    </div>
  );
}

