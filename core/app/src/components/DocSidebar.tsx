import { Link, useLocation } from 'react-router-dom'
import { FileText, Settings, ArrowUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getRouteFromPath } from '@/lib/docs-loader'
import type { DocFile } from '@/lib/docs-loader'

interface DocSidebarProps {
  files: DocFile[]
  currentPath: string
  folderPath?: string
}

export default function DocSidebar({ files, folderPath }: DocSidebarProps) {
  const location = useLocation()

  // Build parent folder route
  const parentRoute = folderPath && folderPath !== '*' 
    ? `/docs/${folderPath.split('/').slice(0, -1).join('/')}`
    : '/docs'

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-20 space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">
          Navigation
        </h3>
        <nav className="space-y-1">
          {/* Parent folder link */}
          {folderPath && folderPath !== '*' && (
            <Link
              to={parentRoute}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors mb-2',
                'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <ArrowUp className="h-4 w-4 shrink-0" />
              <span className="truncate">Up one level</span>
            </Link>
          )}
          
          {files.map((file) => {
            const route = getRouteFromPath(file.path)
            const isActive = location.pathname === route

            return (
              <Link
                key={file.path}
                to={route}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                )}
              >
                {file.type === 'markdown' ? (
                  <FileText className="h-4 w-4 shrink-0" />
                ) : (
                  <Settings className="h-4 w-4 shrink-0" />
                )}
                <span className="truncate">{file.name.replace(/\.(md|toml)$/, '')}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
