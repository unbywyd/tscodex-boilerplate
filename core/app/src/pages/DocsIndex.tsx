import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadDocsStructure, getRouteFromPath, loadInterviewsIndex } from '@/lib/docs-loader'
import type { DocFolder, InterviewIndex } from '@/lib/docs-loader'
import { ChevronRight, ChevronDown, FileText, Settings, Folder, FolderOpen, Monitor, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container, Card, CardContent, CardHeader, CardTitle, CardDescription, Skeleton, Badge } from '@/components/ui'

interface FolderTreeProps {
  folder: DocFolder
  level?: number
}

function FolderTree({ folder, level = 0 }: FolderTreeProps) {
  const [expanded, setExpanded] = useState(level < 2)

  const hasContent = folder.files.length > 0 || folder.folders.length > 0

  return (
    <div className={cn('space-y-1', level > 0 && 'ml-2 sm:ml-4')}>
      {/* Folder header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex items-center gap-2 w-full px-2 sm:px-3 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'text-left'
        )}
      >
        {hasContent ? (
          expanded ? (
            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          ) : (
            <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
          )
        ) : (
          <span className="w-3 sm:w-4" />
        )}
        {expanded ? (
          <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
        ) : (
          <Folder className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
        )}
        <span className="capitalize truncate flex-1 min-w-0">{folder.name}</span>
        {folder.files.length > 0 && (
          <span className="text-xs text-muted-foreground ml-auto shrink-0">
            {folder.files.length}
          </span>
        )}
      </button>

      {/* Folder content */}
      {expanded && hasContent && (
        <div className="space-y-0.5">
          {/* Files */}
          {folder.files.map((file) => (
            <Link
              key={file.path}
              to={getRouteFromPath(file.path)}
              className={cn(
                'flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 ml-4 sm:ml-6 rounded-md text-xs sm:text-sm',
                'hover:bg-accent hover:text-accent-foreground transition-colors',
                'text-muted-foreground hover:text-foreground'
              )}
            >
              {file.type === 'markdown' ? (
                <FileText className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              ) : (
                <Settings className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
              )}
              <span className="truncate flex-1 min-w-0">{file.name.replace(/\.(md|toml)$/, '')}</span>
            </Link>
          ))}

          {/* Subfolders */}
          {folder.folders.map((subFolder) => (
            <FolderTree key={subFolder.path} folder={subFolder} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function DocsIndex() {
  const [structure, setStructure] = useState<DocFolder | null>(null)
  const [platforms, setPlatforms] = useState<InterviewIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      loadDocsStructure(),
      loadInterviewsIndex().catch(() => null) // Don't fail if no platforms
    ])
      .then(([docsData, platformsData]) => {
        setStructure(docsData)
        setPlatforms(platformsData)
        setLoading(false)
      })
      .catch((err) => {
        console.error('Error loading docs structure:', err)
        setError('Failed to load documentation')
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <Container size="lg" className="py-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="lg" className="py-8">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <div className="text-destructive">{error}</div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!structure) {
    return (
      <Container size="lg" className="py-8">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-muted-foreground">No documentation found</div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8 space-y-4 sm:space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-base sm:text-lg text-muted-foreground">
          Browse project documentation organized by folder structure
        </p>
      </div>

      <Card>
        <CardContent className="p-4 sm:p-6">
          <FolderTree folder={structure} />
        </CardContent>
      </Card>

      {/* Platforms Section */}
      {platforms && platforms.platforms.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Platforms</h2>
              <p className="text-sm text-muted-foreground">
                Platform-specific documentation and interview progress
              </p>
            </div>
            <Link
              to="/platforms"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {platforms.platforms.map((platform) => (
              <Link key={platform.platformId} to={`/platforms/${platform.platformId}`}>
                <Card className="h-full hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-primary/10 p-2">
                        <Monitor className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base capitalize truncate">
                          {platform.platformId.replace(/-/g, ' ')}
                        </CardTitle>
                        <CardDescription className="text-xs capitalize">
                          Phase: {platform.currentPhase}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center gap-2">
                      <Badge variant={
                        platform.profile === 'simple' ? 'secondary' :
                        platform.profile === 'complex' ? 'outline' : 'default'
                      }>
                        {platform.profile}
                      </Badge>
                      {platform.lastUpdated && (
                        <span className="text-xs text-muted-foreground">
                          {platform.lastUpdated}
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </Container>
  )
}
