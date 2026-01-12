import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FileText, Sparkles, Database, Menu, X, Info, GitBranch, Rocket, ClipboardList, Monitor, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from './ui'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  // Project links (PRIMARY - left side, prominent)
  const mainNavLinks = [
    { path: '/interview', label: 'Interview', icon: ClipboardList },
    { path: '/platforms', label: 'Platforms', icon: Monitor },
    { path: '/prototype', label: 'Prototype', icon: Smartphone },
    { path: '/docs', label: 'Docs', icon: FileText },
    { path: '/schema', label: 'Schema', icon: Database },
  ]

  // Engine/docs links (SECONDARY - right side, muted background)
  // Note: Home is accessed via logo click, no need for separate Home link
  const projectNavLinks = [
    { path: '/about', label: 'About', icon: Info },
    { path: '/challenge', label: 'Challenge', icon: GitBranch },
    { path: '/get-started', label: 'Get Started', icon: Rocket },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Container>
          <div className="flex min-h-16 items-center py-2">
            <div className="flex items-center gap-4 flex-1">
              <Link to="/" className="flex items-center space-x-2 group py-2">
                <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
                <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  tscodex-boilerplate
                </span>
              </Link>

              {/* Desktop Navigation - Main Links */}
              <nav className="hidden lg:flex items-center space-x-1 text-sm font-medium">
                {mainNavLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-2 transition-colors relative px-3 xl:px-4 py-3 rounded-md',
                      isActive(path)
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:text-foreground/80 hover:bg-accent'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{label}</span>
                    {isActive(path) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Desktop Navigation - Project Links */}
            <nav className="hidden lg:flex items-center text-sm font-medium">
              <div className="flex items-center space-x-1 px-2 py-1 rounded-lg bg-muted/50 border border-border/50">
                {projectNavLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-2 transition-colors relative px-3 xl:px-4 py-2 rounded-md',
                      isActive(path)
                        ? 'text-foreground bg-background'
                        : 'text-foreground/60 hover:text-foreground/80 hover:bg-background/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden xl:inline">{label}</span>
                    {isActive(path) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Tablet Navigation - compact version */}
            <div className="hidden md:flex lg:hidden items-center flex-1 gap-4">
              <nav className="flex items-center space-x-1 text-sm font-medium">
                {mainNavLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-1.5 transition-colors relative px-2 py-3 rounded-md',
                      isActive(path)
                        ? 'text-foreground'
                        : 'text-foreground/60 hover:text-foreground/80 hover:bg-accent'
                    )}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                    {isActive(path) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Tablet Navigation - Project Links */}
            <nav className="hidden md:flex lg:hidden items-center text-sm font-medium">
              <div className="flex items-center space-x-1 px-1.5 py-1 rounded-lg bg-muted/50 border border-border/50">
                {projectNavLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    className={cn(
                      'flex items-center gap-1.5 transition-colors relative px-2 py-2 rounded-md',
                      isActive(path)
                        ? 'text-foreground bg-background'
                        : 'text-foreground/60 hover:text-foreground/80 hover:bg-background/50'
                    )}
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                    {isActive(path) && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </Link>
                ))}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-accent transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden border-t py-4 space-y-2">
              {/* Main Navigation */}
              {mainNavLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-md transition-colors',
                    isActive(path)
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-foreground/60 hover:bg-accent hover:text-foreground'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* Divider */}
              <div className="px-4 py-2">
                <div className="h-px bg-border" />
              </div>
              
              {/* Project Navigation - grouped with background */}
              <div className="mx-4 mb-2 p-2 rounded-lg bg-muted/50 border border-border/50 space-y-1">
                {projectNavLinks.map(({ path, label, icon: Icon }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
                      isActive(path)
                        ? 'bg-background text-foreground font-medium'
                        : 'text-foreground/60 hover:bg-background/50 hover:text-foreground'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </nav>
          )}
        </Container>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t">
        <Container>
          <div className="flex flex-col items-center justify-between gap-4 py-6 md:h-16 md:flex-row">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              tscodex-boilerplate - File-driven specification for LLM-assisted development
            </p>
            <div className="flex flex-col items-center gap-2 md:flex-row md:items-center md:gap-4">
              <p className="text-center text-xs text-muted-foreground md:text-right">
                From idea to working prototype through structured dialogue
              </p>
              <p className="text-center text-xs text-muted-foreground">
                Author:{' '}
                <a 
                  href="https://unbywyd.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  unbywyd.com
                </a>
              </p>
            </div>
          </div>
        </Container>
      </footer>

    </div>
  )
}
