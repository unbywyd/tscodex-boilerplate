import { Link, useLocation } from 'react-router-dom'
import { FileText, Box, Home, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DocsLink } from './DocsLink'
import { Container } from './ui/container'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/docs', label: 'Docs', icon: FileText },
    { path: '/prototype', label: 'Prototype', icon: Box },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex h-16 items-center justify-between">
            <Link to="/" className="flex items-center space-x-2 group">
              <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                TSCodex BluePrint
              </span>
            </Link>

            <nav className="flex items-center space-x-8 text-sm font-medium">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className={cn(
                    'flex items-center gap-2 transition-colors relative',
                    isActive(path)
                      ? 'text-foreground'
                      : 'text-foreground/60 hover:text-foreground/80'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                  {isActive(path) && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </Container>
      </header>

      {/* Main content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              TSCodex BluePrint - LLM-driven project specification generator
            </p>
            <p className="text-center text-xs text-muted-foreground md:text-right">
              From idea to working prototype through structured dialogue
            </p>
          </div>
        </Container>
      </footer>

      {/* Floating docs link */}
      <DocsLink />
    </div>
  )
}
