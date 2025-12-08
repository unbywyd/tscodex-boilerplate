// Floating button that links to documentation for current route
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText } from 'lucide-react'

const isDev = import.meta.env.DEV

type RouteDocsMap = Record<string, string>

// Load route-docs mapping
async function loadRouteDocsMap(): Promise<RouteDocsMap> {
  if (isDev) {
    const response = await fetch('/api/docs/route-map')
    if (!response.ok) return {}
    return response.json()
  } else {
    const response = await fetch('/generated/route-docs-map.json')
    if (!response.ok) return {}
    return response.json()
  }
}

export function DocsLink() {
  const location = useLocation()
  const [routeMap, setRouteMap] = useState<RouteDocsMap>({})
  const [docsPath, setDocsPath] = useState<string | null>(null)

  // Load route map once
  useEffect(() => {
    loadRouteDocsMap().then(setRouteMap).catch(console.error)
  }, [])

  // Check if current route has documentation
  useEffect(() => {
    const path = location.pathname
    const docFile = routeMap[path]
    setDocsPath(docFile || null)
  }, [location.pathname, routeMap])

  // Don't render if no docs for this route
  if (!docsPath) return null

  // Convert file path to docs route (remove extension)
  const docsRoute = `/docs/${docsPath.replace(/\.(md|toml)$/, '')}`

  return (
    <Link
      to={docsRoute}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-all hover:scale-105"
      title="View documentation for this page"
    >
      <FileText className="h-4 w-4" />
      <span className="text-sm font-medium">Docs</span>
    </Link>
  )
}
