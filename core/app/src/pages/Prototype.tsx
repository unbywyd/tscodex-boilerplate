import { Link } from 'react-router-dom'
import { Users, Package, LayoutDashboard, ArrowRight } from 'lucide-react'

export default function PrototypePage() {
  const pages = [
    {
      path: '/prototype/dashboard',
      icon: LayoutDashboard,
      title: 'Dashboard',
      description: 'Overview with key metrics and stats',
    },
    {
      path: '/prototype/users',
      icon: Users,
      title: 'Users',
      description: 'User management with mock data',
    },
    {
      path: '/prototype/products',
      icon: Package,
      title: 'Products',
      description: 'Product catalog with pricing',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Prototype</h1>
        <p className="text-muted-foreground mt-2">
          Interactive MVP prototype powered by mock data. Click any page to explore.
        </p>
      </div>

      {/* Pages grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pages.map(({ path, icon: Icon, title, description }) => (
          <Link
            key={path}
            to={path}
            className="group rounded-lg border bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/50 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="rounded-md bg-primary/10 p-2">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <h3 className="font-semibold mt-4">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </Link>
        ))}
      </div>

      {/* Info box */}
      <div className="rounded-lg border bg-muted/50 p-6">
        <h2 className="font-semibold mb-2">About the Prototype</h2>
        <p className="text-sm text-muted-foreground mb-4">
          This prototype demonstrates the MVP Generator's capabilities. All data comes from JSON files in{' '}
          <code className="text-xs bg-muted px-1 py-0.5 rounded">src/prototype/mocks/</code>.
        </p>
        <div className="text-sm space-y-2">
          <p className="flex items-center gap-2">
            <span className="font-medium">Add pages:</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">src/prototype/pages/</code>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Add components:</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">src/prototype/components/</code>
          </p>
          <p className="flex items-center gap-2">
            <span className="font-medium">Add mock data:</span>
            <code className="text-xs bg-muted px-1 py-0.5 rounded">src/prototype/mocks/*.json</code>
          </p>
        </div>
      </div>
    </div>
  )
}
