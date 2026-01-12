import { lazy, Suspense } from 'react'
import { Loader2, Smartphone } from 'lucide-react'

// Dynamic import of user's prototype
const UserPrototype = lazy(() =>
  import('@prototype/index').catch(() => ({
    default: () => <NoPrototype />,
  }))
)

function NoPrototype() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center p-8 max-w-md">
        <Smartphone className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">No Prototype Yet</h1>
        <p className="text-muted-foreground mb-4">
          Create your prototype by adding files to <code className="bg-muted px-1 rounded">src/prototype/</code>
        </p>
        <p className="text-sm text-muted-foreground">
          See <code className="bg-muted px-1 rounded">rules/prototype.md</code> for instructions.
        </p>
      </div>
    </div>
  )
}

function LoadingPrototype() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
        <p className="text-muted-foreground">Loading prototype...</p>
      </div>
    </div>
  )
}

export default function PrototypePage() {
  return (
    <Suspense fallback={<LoadingPrototype />}>
      <UserPrototype />
    </Suspense>
  )
}
