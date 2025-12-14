import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, FileText, Settings } from 'lucide-react';
import { loadDocFile, loadDocsTree, getRouteFromPath } from '../lib/docs-loader';
import DocFileRenderer from '../components/renderers/DocFileRenderer';
import DocSidebar from '../components/DocSidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import type { DocFile, DocFolder } from '../lib/docs-loader';
import { Container, Button, Card, CardContent, CardHeader, Skeleton } from '@/components/ui';

// Helper function to find folder by path in tree
function findFolderByPath(tree: DocFolder, targetPath: string): DocFolder | null {
  // Normalize paths for comparison
  const normalizePath = (path: string) => path.replace(/^\/+|\/+$/g, '');
  const normalizedTarget = normalizePath(targetPath);
  const normalizedTreePath = normalizePath(tree.path);
  
  if (normalizedTreePath === normalizedTarget) {
    return tree;
  }
  
  // Also check if target path matches the folder name when tree path is 'docs'
  if (normalizedTreePath === 'docs' && tree.name === normalizedTarget) {
    return tree;
  }
  
  // Check if target path starts with tree path
  if (normalizedTarget.startsWith(normalizedTreePath + '/')) {
    const remainingPath = normalizedTarget.slice(normalizedTreePath.length + 1);
    for (const folder of tree.folders) {
      const found = findFolderByPath(folder, remainingPath);
      if (found) return found;
    }
  }
  
  // Recursive search in subfolders
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

  const [currentFolder, setCurrentFolder] = useState<DocFolder | null>(null);

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
        // But don't add prefix if it already starts with docs/ or layers/
        if (!filePath.startsWith('layers/') && !filePath.startsWith('docs/') && filePath !== 'status' && !filePath.startsWith('status/')) {
          filePath = `docs/${filePath}`;
        }

        // Load docs tree first
        const docsTree = await loadDocsTree();
        
        // Helper function to find file in tree
        function findFileInTree(tree: DocFolder, targetPath: string): DocFile | null {
          // Check if targetPath matches a file path exactly
          function searchFolder(folder: DocFolder): DocFile | null {
            for (const file of folder.files) {
              // Check exact match or match without extension
              const filePathWithoutExt = file.path.replace(/\.(md|toml)$/, '');
              if (file.path === targetPath || filePathWithoutExt === targetPath) {
                return file;
              }
            }
            for (const subFolder of folder.folders) {
              const found = searchFolder(subFolder);
              if (found) return found;
            }
            return null;
          }
          return searchFolder(tree);
        }
        
        // Check if it's a directory first (if path doesn't have extension and is not 'status')
        const pathParts = filePath.split('/');
        const lastPart = pathParts[pathParts.length - 1];
        const hasExtension = lastPart.includes('.') && (lastPart.endsWith('.toml') || lastPart.endsWith('.md'));
        
        // If no extension, check if it's a directory first
        if (!hasExtension && lastPart !== 'status') {
          let folder = findFolderByPath(docsTree, filePath);
          
          // If not found, try to find by traversing the path
          if (!folder) {
            let currentFolder: DocFolder | null = docsTree;
            for (const part of pathParts) {
              if (!currentFolder) break;
              const found: DocFolder | undefined = currentFolder.folders.find(f => f.name === part || f.path === part || f.path.endsWith(`/${part}`));
              if (found) {
                currentFolder = found;
              } else {
                currentFolder = null;
                break;
              }
            }
            folder = currentFolder;
          }
          
          if (folder) {
            setCurrentFolder(folder);
            setFile(null);
            // Sort files alphabetically
            const sortedFiles = [...folder.files].sort((a, b) => 
              a.name.localeCompare(b.name)
            );
            setFolderFiles(sortedFiles);
            setCurrentIndex(-1);
            setLoading(false);
            return;
          }
        }
        
        // If it has extension or directory not found, try to find as file
        let foundFile = findFileInTree(docsTree, filePath);
        
        // If not found, try with .toml extension
        if (!foundFile && !filePath.endsWith('.toml') && !filePath.endsWith('.md')) {
          foundFile = findFileInTree(docsTree, `${filePath}.toml`);
          if (foundFile) {
            filePath = foundFile.path;
          }
        }
        
        // If not found, try with .md extension
        if (!foundFile && !filePath.endsWith('.toml') && !filePath.endsWith('.md')) {
          foundFile = findFileInTree(docsTree, `${filePath}.md`);
          if (foundFile) {
            filePath = foundFile.path;
          }
        }
        
        if (foundFile) {
          // It's a file
          const loadedFile = await loadDocFile(filePath);
          setFile(loadedFile);
          setCurrentFolder(null);

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
        } else {
          // Last resort: try to find as directory
          const folder = findFolderByPath(docsTree, filePath);
          if (folder) {
            setCurrentFolder(folder);
            setFile(null);
            // Sort files alphabetically
            const sortedFiles = [...folder.files].sort((a, b) => 
              a.name.localeCompare(b.name)
            );
            setFolderFiles(sortedFiles);
            setCurrentIndex(-1);
          } else {
            setError('File or directory not found');
          }
        }
      } catch (err) {
        console.error('Error loading file:', err);
        setError('File or directory not found');
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

  // If viewing a directory, show directory view
  if (currentFolder && !file) {
    const folderPath = currentFolder.path;
    const pathParts = folderPath.split('/').filter(Boolean);
    
    // Build breadcrumbs
    const breadcrumbItems = [];
    let currentPath = '';
    for (let i = 0; i < pathParts.length; i++) {
      currentPath += '/' + pathParts[i];
      breadcrumbItems.push({
        label: pathParts[i],
        path: `/docs${currentPath}`,
      });
    }

    return (
      <Container size="lg" className="py-4 sm:py-6 md:py-8">
        <div className="space-y-4 sm:space-y-6">
          {/* Breadcrumbs */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs items={breadcrumbItems} />
          )}

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight capitalize">
              {currentFolder.name}
            </h1>
          </div>

          {/* Directory content - folders and files */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Subfolders as cards */}
            {currentFolder.folders.map((subFolder) => {
              const folderRoute = `/docs/${subFolder.path}`;
              return (
                <Card key={subFolder.path} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <Link to={folderRoute} className="block">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                          <ChevronRight className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base capitalize mb-1 truncate">
                            {subFolder.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {subFolder.files.length} {subFolder.files.length === 1 ? 'file' : 'files'}
                            {subFolder.folders.length > 0 && ` • ${subFolder.folders.length} ${subFolder.folders.length === 1 ? 'folder' : 'folders'}`}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}

            {/* Files as cards */}
            {currentFolder.files.map((file) => {
              const fileRoute = getRouteFromPath(file.path);
              return (
                <Card key={file.path} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4 sm:p-6">
                    <Link to={fileRoute} className="block">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          {file.type === 'markdown' ? (
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Settings className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base mb-1 truncate">
                            {file.name.replace(/\.(md|toml)$/, '')}
                          </h3>
                          <p className="text-xs text-muted-foreground uppercase">
                            {file.type}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {currentFolder.folders.length === 0 && currentFolder.files.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">This directory is empty</p>
              </CardContent>
            </Card>
          )}
        </div>
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

  // Build breadcrumbs from file path
  const breadcrumbItems = [];
  const pathParts = file.path.split('/').filter(Boolean);
  
  // Build breadcrumb path progressively
  let currentPath = '';
  for (let i = 0; i < pathParts.length - 1; i++) {
    currentPath += '/' + pathParts[i];
    breadcrumbItems.push({
      label: pathParts[i],
      path: `/docs${currentPath}`,
    });
  }

  // Navigation helpers
  const previousFile = currentIndex > 0 ? folderFiles[currentIndex - 1] : null;
  const nextFile = currentIndex >= 0 && currentIndex < folderFiles.length - 1 ? folderFiles[currentIndex + 1] : null;

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        {folderFiles.length > 0 && (
          <DocSidebar files={folderFiles} currentPath={file.path} folderPath={folderPath} />
        )}

        {/* Main content */}
        <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
          {/* Breadcrumbs */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs items={breadcrumbItems} />
          )}

          {/* Header */}
          <div className="space-y-3 sm:space-y-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight break-words">{file.name.replace(/\.(md|toml)$/, '')}</h1>
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
