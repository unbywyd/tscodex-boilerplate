import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { loadDocFile, loadDocsTree, getRouteFromPath } from '../lib/docs-loader';
import DocFileRenderer from '../components/renderers/DocFileRenderer';
import DocSidebar from '../components/DocSidebar';
import type { DocFile, DocFolder } from '../lib/docs-loader';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Helper function to find folder by path in tree
function findFolderByPath(tree: DocFolder, targetPath: string): DocFolder | null {
  if (tree.path === targetPath) {
    return tree;
  }
  
  for (const folder of tree.folders) {
    const found = findFolderByPath(folder, targetPath);
    if (found) return found;
  }
  
  return null;
}

export default function DocViewer() {
  const { '*': docPath } = useParams<{ '*': string }>();
  const navigate = useNavigate();
  const [file, setFile] = useState<DocFile | null>(null);
  const [folderFiles, setFolderFiles] = useState<DocFile[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!docPath) {
      navigate('/docs');
      return;
    }

    const loadFileAndNavigation = async () => {
      try {
        setLoading(true);
        setError(null);

        // Convert route to file path (remove leading slash if present)
        let filePath = docPath.startsWith('/') ? docPath.slice(1) : docPath;

        // If path doesn't start with known folders, it's likely from /docs/ route
        // and refers to files in src/spec/docs/ folder
        if (!filePath.startsWith('layers/') && !filePath.startsWith('docs/') && !filePath.startsWith('status')) {
          filePath = `docs/${filePath}`;
        }

        // Load file and docs tree in parallel
        const [loadedFile, docsTree] = await Promise.all([
          loadDocFile(filePath),
          loadDocsTree()
        ]);
        
        setFile(loadedFile);

        // Extract folder path from file path
        const folderPath = loadedFile.path.split('/').slice(0, -1).join('/');
        
        // Find folder in tree
        const folder = findFolderByPath(docsTree, folderPath);
        
        if (folder) {
          // Sort files alphabetically
          const sortedFiles = [...folder.files].sort((a, b) => 
            a.name.localeCompare(b.name)
          );
          
          setFolderFiles(sortedFiles);
          
          // Find current file index
          const index = sortedFiles.findIndex(f => f.path === loadedFile.path);
          setCurrentIndex(index);
        } else {
          setFolderFiles([]);
          setCurrentIndex(-1);
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setError('File not found');
      } finally {
        setLoading(false);
      }
    };

    loadFileAndNavigation();
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

  // Navigation helpers
  const previousFile = currentIndex > 0 ? folderFiles[currentIndex - 1] : null;
  const nextFile = currentIndex >= 0 && currentIndex < folderFiles.length - 1 ? folderFiles[currentIndex + 1] : null;

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        {folderFiles.length > 0 && (
          <DocSidebar files={folderFiles} currentPath={file.path} />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/docs')}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight break-words">{file.name}</h1>
              {file.metadata && file.metadata.modified && (
                <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground flex-wrap">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
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
          <div className="prose prose-slate dark:prose-invert max-w-none prose-sm sm:prose-base">
            <Card>
              <CardContent className="p-4 sm:p-6 pt-4 sm:pt-6">
                <DocFileRenderer file={file} folderPath={folderPath} />
              </CardContent>
            </Card>
          </div>

          {/* Navigation buttons */}
          {(previousFile || nextFile) && (
            <div className="flex items-center justify-between gap-2 sm:gap-4 pt-4 border-t">
              {previousFile ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(getRouteFromPath(previousFile.path))}
                  className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none sm:w-[200px] h-auto py-2 px-2 sm:px-3"
                >
                  <ChevronLeft className="h-4 w-4 shrink-0" />
                  <div className="text-left leading-tight min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">Previous</div>
                    <div className="text-sm font-medium truncate">{previousFile.name.replace(/\.(md|toml)$/, '')}</div>
                  </div>
                </Button>
              ) : (
                <div className="hidden sm:block sm:w-[200px]" />
              )}
              
              {nextFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(getRouteFromPath(nextFile.path))}
                  className="flex items-center gap-1.5 sm:gap-2 flex-1 sm:flex-none sm:w-[200px] h-auto py-2 px-2 sm:px-3 sm:ml-auto"
                >
                  <div className="text-right leading-tight min-w-0 flex-1">
                    <div className="text-xs text-muted-foreground">Next</div>
                    <div className="text-sm font-medium truncate">{nextFile.name.replace(/\.(md|toml)$/, '')}</div>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
