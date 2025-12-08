import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import { loadDocFile } from '../lib/docs-loader';
import DocFileRenderer from '../components/renderers/DocFileRenderer';
import type { DocFile } from '../lib/docs-loader';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocViewer() {
  const { '*': docPath } = useParams<{ '*': string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<DocFile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docPath) {
      navigate('/docs');
      return;
    }

    const loadFile = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert route to file path (remove leading slash if present)
        const filePath = docPath.startsWith('/') ? docPath.slice(1) : docPath;

        // API auto-detects extension (.toml or .md)
        const loadedFile = await loadDocFile(filePath);
        setFile(loadedFile);
      } catch (err) {
        console.error('Error loading file:', err);
        setError('File not found');
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [docPath, navigate]);

  if (loading) {
    return (
      <Container size="lg" className="py-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-48" />
        </div>
        <Skeleton className="h-96 w-full" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg" className="py-8">
        <Card className="border-destructive">
          <CardHeader>
            <h2 className="text-2xl font-bold text-destructive">Error</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={() => navigate('/docs')} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  if (!file) {
    return (
      <Container size="lg" className="py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">File not found</p>
            <Button onClick={() => navigate('/docs')} variant="outline" className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Documentation
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  // Extract folder path from file path
  const folderPath = file.path.split('/').slice(0, -1).join('/') || '*';

  return (
    <Container size="lg" className="py-8 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/docs')}
            className="shrink-0"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">{file.name}</h1>
          {file.metadata && file.metadata.modified && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                Last modified: {new Date(file.metadata.modified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <Card>
          <CardContent className="pt-6">
            <DocFileRenderer file={file} folderPath={folderPath} />
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
