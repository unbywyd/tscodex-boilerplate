import { Link, useLocation } from 'react-router-dom'
import { Users, Package, ArrowRight, Code, Zap, Database, FileCode, Layers, Sparkles, BookOpen, Palette } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import UsersPage from './prototype/UsersPage'
import ProductsPage from './prototype/ProductsPage'

function PrototypeHome() {
  const pages = [
    {
      path: '/prototype/users',
      icon: Users,
      title: 'Users',
      description: 'User management with mock data',
      badge: 'CRUD',
    },
    {
      path: '/prototype/products',
      icon: Package,
      title: 'Products',
      description: 'Product catalog with pricing',
      badge: 'Catalog',
    },
    {
      path: '/ui-kit',
      icon: Palette,
      title: 'UI Kit',
      description: 'Component reference & documentation',
      badge: 'Docs',
    },
    {
      path: '/docs',
      icon: BookOpen,
      title: 'Documentation',
      description: 'Project specs and layer definitions',
      badge: 'Specs',
    },
  ]

  const features = [
    {
      icon: Database,
      title: 'Mock Data',
      description: 'All data comes from JSON files, easy to modify and extend',
    },
    {
      icon: Code,
      title: 'React Components',
      description: 'Built with reusable components and modern patterns',
    },
    {
      icon: Zap,
      title: 'Fast Development',
      description: 'Quick iteration and testing without backend setup',
    },
    {
      icon: Layers,
      title: 'Modular Structure',
      description: 'Organized by pages, components, and services',
    },
  ]

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Prototype</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">
              Interactive MVP prototype powered by mock data
            </p>
          </div>
        </div>
      </div>

      {/* Pages grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Available Pages</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pages.map(({ path, icon: Icon, title, description, badge }) => (
            <Link
              key={path}
              to={path}
              className="group"
            >
              <Card className="h-full hover:shadow-lg hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="rounded-md bg-primary/10 p-2.5">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-muted text-muted-foreground">
                      {badge}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 text-sm text-primary group-hover:gap-3 transition-all">
                    <span>Explore</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Key Features</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Info box */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Getting Started</CardTitle>
          <CardDescription>
            This prototype demonstrates LLM Boilerplate capabilities. All data comes from JSON files.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileCode className="h-4 w-4 text-muted-foreground" />
                Add pages
              </div>
              <code className="block text-xs bg-background px-2 py-1.5 rounded border">
                src/prototype/pages/
              </code>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Layers className="h-4 w-4 text-muted-foreground" />
                Add components
              </div>
              <code className="block text-xs bg-background px-2 py-1.5 rounded border">
                src/prototype/components/
              </code>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Database className="h-4 w-4 text-muted-foreground" />
                Add mock data
              </div>
              <code className="block text-xs bg-background px-2 py-1.5 rounded border">
                src/prototype/mocks/*.json
              </code>
            </div>
          </div>
          <div className="pt-2">
            <Button asChild variant="outline" size="sm">
              <Link to="/docs">
                View Documentation
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}

export default function PrototypePage() {
  const location = useLocation()
  
  // If we're on a sub-route, render the appropriate component
  if (location.pathname === '/prototype/users') {
    return <UsersPage />
  }
  
  if (location.pathname === '/prototype/products') {
    return <ProductsPage />
  }

  // Otherwise render the home page
  return <PrototypeHome />
}
