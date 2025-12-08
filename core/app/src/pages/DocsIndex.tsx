import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadDocsStructure, getRouteFromPath } from '@/lib/docs-loader'
import type { DocFolder } from '@/lib/docs-loader'
import { ChevronRight, ChevronDown, FileText, Settings, Folder, FolderOpen } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface FolderTreeProps {
  folder: DocFolder
  level?: number
}

function FolderTree({ folder, level = 0 }: FolderTreeProps) {
  const [expanded, setExpanded] = useState(level < 2)

  const hasContent = folder.files.length > 0 || folder.folders.length > 0

  return (
    <div className={cn('space-y-1', level > 0 && 'ml-4')}>
      {/* Folder header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={cn(
          'flex items-center gap-2 w-full px-2 py-1.5 rounded-md text-sm font-medium',
          'hover:bg-accent hover:text-accent-foreground transition-colors',
          'text-left'
        )}
      >
        {hasContent ? (
          expanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <span className="w-4" />
        )}
        {expanded ? (
          <FolderOpen className="h-4 w-4 text-primary" />
        ) : (
          <Folder className="h-4 w-4 text-muted-foreground" />
        )}
        <span className="capitalize">{folder.name}</span>
        {folder.files.length > 0 && (
          <span className="text-xs text-muted-foreground ml-auto">
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
                'flex items-center gap-2 px-2 py-1.5 ml-6 rounded-md text-sm',
                'hover:bg-accent hover:text-accent-foreground transition-colors',
                'text-muted-foreground hover:text-foreground'
              )}
            >
              {file.type === 'markdown' ? (
                <FileText className="h-4 w-4" />
              ) : (
                <Settings className="h-4 w-4" />
              )}
              <span>{file.name.replace(/\.(md|toml)$/, '')}</span>
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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadDocsStructure()
      .then((data) => {
        setStructure(data)
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
    <Container size="lg" className="py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Browse project documentation organized by folder structure
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <FolderTree folder={structure} />
        </CardContent>
      </Card>
    </Container>
  )
}
