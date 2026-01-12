import { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { FileText, ChevronRight, Monitor, Smartphone, Server, MonitorSmartphone, ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container, Card, CardContent, CardHeader, CardTitle, Skeleton, Badge } from '@/components/ui'
import MarkdownRenderer from '@/components/renderers/MarkdownRenderer'

interface PlatformDoc {
  id: string
  title: string
  order: number
  path: string
}

interface Platform {
  id: string
  name: string
  description: string
  type: string
  docsCount: number
}

interface PlatformIndex {
  id: string
  name: string
  description: string
  type: string
  config: Record<string, any>
  relations: Record<string, string[]>
  docs: PlatformDoc[]
}

interface PlatformDocContent {
  id: string
  title: string
  content: string
}

const platformIcons: Record<string, typeof Monitor> = {
  web: Monitor,
  mobile: Smartphone,
  api: Server,
  desktop: MonitorSmartphone,
}

// Platform list component
function PlatformList({ platforms }: { platforms: Platform[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {platforms.map((platform) => {
        const Icon = platformIcons[platform.type] || Monitor
        return (
          <Link key={platform.id} to={`/platforms/${platform.id}`}>
            <Card className="h-full hover:border-primary transition-colors">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{platform.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">{platform.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">{platform.description}</p>
                <p className="text-xs text-muted-foreground">{platform.docsCount} documents</p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}

// Sidebar for platform docs
function DocsSidebar({
  platform,
  activeDocId,
  onDocSelect
}: {
  platform: PlatformIndex
  activeDocId?: string
  onDocSelect: (docId: string) => void
}) {
  const Icon = platformIcons[platform.type] || Monitor

  return (
    <div className="w-64 shrink-0 border-r bg-muted/30 overflow-y-auto flex flex-col min-h-[calc(100vh-8rem)]">
      <div className="p-4 border-b">
        <Link to="/platforms" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-3">
          <ArrowLeft className="h-4 w-4" />
          All Platforms
        </Link>
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary" />
          <span className="font-semibold">{platform.name}</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{platform.description}</p>
      </div>

      <nav className="p-2">
        <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
          Contents
        </div>
        {platform.docs.map((doc) => (
          <button
            key={doc.id}
            onClick={() => onDocSelect(doc.id)}
            className={cn(
              'flex items-center gap-2 w-full px-3 py-2 rounded-md text-sm text-left',
              'hover:bg-accent hover:text-accent-foreground transition-colors',
              activeDocId === doc.id
                ? 'bg-accent text-accent-foreground font-medium'
                : 'text-muted-foreground'
            )}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="truncate">{doc.title}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}

// Doc content viewer
function DocContent({
  platform,
  docId
}: {
  platform: PlatformIndex
  docId: string
}) {
  const [doc, setDoc] = useState<PlatformDocContent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/generated/platforms/${platform.id}/${docId}.json`)
      .then(res => res.json())
      .then(data => {
        setDoc(data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading doc:', err)
        setLoading(false)
      })
  }, [platform.id, docId])

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-32 w-full" />
      </div>
    )
  }

  if (!doc) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Document not found</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <article className="prose prose-sm dark:prose-invert max-w-none">
        <MarkdownRenderer content={doc.content} />
      </article>
    </div>
  )
}

// Platform viewer with sidebar
function PlatformViewer({ platformId }: { platformId: string }) {
  const [platform, setPlatform] = useState<PlatformIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeDocId, setActiveDocId] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    fetch(`/generated/platforms/${platformId}/index.json`)
      .then(res => res.json())
      .then(data => {
        setPlatform(data)
        // Set first doc as active by default
        if (data.docs?.length > 0 && !activeDocId) {
          setActiveDocId(data.docs[0].id)
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('Error loading platform:', err)
        setLoading(false)
      })
  }, [platformId])

  if (loading) {
    return (
      <div className="flex max-h-[calc(100vh-8rem)]">
        <div className="w-64 border-r p-4 space-y-4">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
        <div className="flex-1 p-6 space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!platform) {
    return (
      <Container size="lg" className="py-8">
        <Card className="border-destructive">
          <CardContent className="p-6">
            <p className="text-destructive">Platform not found</p>
            <Link to="/platforms" className="text-sm text-primary hover:underline mt-2 block">
              Back to platforms
            </Link>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <div className="flex max-h-[calc(100vh-8rem)]">
      <DocsSidebar
        platform={platform}
        activeDocId={activeDocId || undefined}
        onDocSelect={setActiveDocId}
      />
      <div className="flex-1 overflow-y-auto">
        {activeDocId ? (
          <DocContent platform={platform} docId={activeDocId} />
        ) : (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{platform.name}</h1>
            <p className="text-muted-foreground mb-6">{platform.description}</p>
            {platform.docs.length > 0 && (
              <p className="text-sm">
                Select a document from the sidebar to get started.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Main platforms page
export default function PlatformsPage() {
  const { platformId } = useParams()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!platformId) {
      fetch('/generated/platforms/index.json')
        .then(res => res.json())
        .then(data => {
          setPlatforms(data.platforms || [])
          setLoading(false)
        })
        .catch(err => {
          console.error('Error loading platforms:', err)
          setLoading(false)
        })
    }
  }, [platformId])

  // If viewing a specific platform
  if (platformId) {
    return <PlatformViewer platformId={platformId} />
  }

  // Platforms index
  if (loading) {
    return (
      <Container size="lg" className="py-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </Container>
    )
  }

  return (
    <Container size="lg" className="py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Platforms</h1>
        <p className="text-lg text-muted-foreground">
          Documentation organized by target platform
        </p>
      </div>

      {platforms.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No platforms defined yet.</p>
            <p className="text-sm text-muted-foreground mt-2">
              Create platform folders in <code className="bg-muted px-1 rounded">src/spec/platforms/</code>
            </p>
          </CardContent>
        </Card>
      ) : (
        <PlatformList platforms={platforms} />
      )}
    </Container>
  )
}
