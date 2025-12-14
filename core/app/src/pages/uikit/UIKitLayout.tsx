import { ReactNode, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { Palette, ChevronRight } from 'lucide-react'
import { sections } from './config/sections'

interface UIKitLayoutProps {
  children: ReactNode
}

export function UIKitLayout({ children }: UIKitLayoutProps) {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active section and subsection from path
  const currentPath = location.pathname
  let activeSection = 'forms'
  let activeSubsection = 'quickform'

  for (const section of sections) {
    for (const sub of section.subsections) {
      // Exact match or path starts with subsection path (for wildcard routes)
      if (currentPath === sub.path || currentPath.startsWith(sub.path + '/') || currentPath === sub.path.replace(/\/[^/]+$/, '/' + currentPath.split('/').pop())) {
        activeSection = section.id
        activeSubsection = sub.id
        break
      }
    }
    // Also check if we're in a section with wildcard routing
    const sectionBasePath = `/ui-kit/${section.id}`
    if (currentPath.startsWith(sectionBasePath + '/')) {
      activeSection = section.id
      // Find matching subsection by the last path segment
      const lastSegment = currentPath.split('/').pop()
      const matchingSub = section.subsections.find(s => s.id === lastSegment || s.path.endsWith('/' + lastSegment))
      if (matchingSub) {
        activeSubsection = matchingSub.id
      } else if (section.subsections.length > 0) {
        // Default to first subsection if no match
        activeSubsection = section.subsections[0].id
      }
    }
  }

  // Auto-expand active section
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([activeSection]))

  // Update expanded sections when active section changes
  useEffect(() => {
    setExpandedSections((prev) => {
      if (!prev.has(activeSection)) {
        return new Set([...prev, activeSection])
      }
      return prev
    })
  }, [activeSection])

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev)
      if (next.has(sectionId)) {
        next.delete(sectionId)
      } else {
        next.add(sectionId)
      }
      return next
    })
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 overflow-y-auto hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-semibold">UI Kit</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Component Reference</p>
        </div>
        <nav className="p-2">
          {sections.map((section) => {
            const isExpanded = expandedSections.has(section.id)
            const isActive = activeSection === section.id

            return (
              <div key={section.id} className="mb-1">
                <button
                  onClick={() => toggleSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                  )}
                >
                  <section.icon className="h-4 w-4" />
                  {section.title}
                </button>
                {isExpanded && (
                  <div className="ml-6 mt-1 space-y-0.5">
                    {section.subsections.map((sub) => {
                      const isSubActive = activeSubsection === sub.id && isActive
                      return (
                        <Link
                          key={sub.id}
                          to={sub.path}
                          className={cn(
                            'w-full flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                            isSubActive
                              ? 'bg-muted text-foreground font-medium'
                              : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                          )}
                        >
                          <ChevronRight
                            className={cn('h-3 w-3 transition-transform', isSubActive && 'rotate-90')}
                          />
                          {sub.title}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Mobile section selector */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-50">
        <select
          value={`${activeSection}:${activeSubsection}`}
          onChange={(e) => {
            const [sectionId, subId] = e.target.value.split(':')
            const section = sections.find((s) => s.id === sectionId)
            const sub = section?.subsections.find((s) => s.id === subId)
            if (sub) {
              navigate(sub.path)
            }
          }}
          className="w-full p-2 border rounded-md text-sm"
        >
          {sections.map((section) =>
            section.subsections.map((sub) => (
              <option key={`${section.id}:${sub.id}`} value={`${section.id}:${sub.id}`}>
                {section.title} / {sub.title}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Container size="md" className="py-6">
          {children}
        </Container>
      </main>
    </div>
  )
}

