// Breadcrumb - Navigation breadcrumbs
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronRight, Home, MoreHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'

// ============================================
// Types
// ============================================

interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[]
  // Separator
  separator?: React.ReactNode
  // Max items before collapse
  maxItems?: number
  // Show home icon
  showHome?: boolean
  // Home href
  homeHref?: string
}

// ============================================
// Breadcrumb Components
// ============================================

const BreadcrumbRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn('flex items-center', className)}
      {...props}
    />
  )
)
BreadcrumbRoot.displayName = 'BreadcrumbRoot'

const BreadcrumbList = React.forwardRef<HTMLOListElement, React.OlHTMLAttributes<HTMLOListElement>>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      className={cn('flex items-center flex-wrap gap-1.5', className)}
      {...props}
    />
  )
)
BreadcrumbList.displayName = 'BreadcrumbList'

const BreadcrumbItemEl = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => (
    <li ref={ref} className={cn('inline-flex items-center gap-1.5', className)} {...props} />
  )
)
BreadcrumbItemEl.displayName = 'BreadcrumbItem'

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.AnchorHTMLAttributes<HTMLAnchorElement> & { asChild?: boolean }
>(({ className, ...props }, ref) => (
  <a
    ref={ref}
    className={cn(
      'text-sm font-medium text-muted-foreground hover:text-foreground transition-colors',
      className
    )}
    {...props}
  />
))
BreadcrumbLink.displayName = 'BreadcrumbLink'

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn('text-sm font-medium text-foreground', className)}
      {...props}
    />
  )
)
BreadcrumbPage.displayName = 'BreadcrumbPage'

const BreadcrumbSeparator = ({ children, className, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
  <li
    role="presentation"
    aria-hidden="true"
    className={cn('text-muted-foreground/50', className)}
    {...props}
  >
    {children ?? <ChevronRight className="h-4 w-4" />}
  </li>
)
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const BreadcrumbEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    role="presentation"
    aria-hidden="true"
    className={cn('flex h-9 w-9 items-center justify-center', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More</span>
  </span>
)
BreadcrumbEllipsis.displayName = 'BreadcrumbEllipsis'

// ============================================
// Main Breadcrumb Component
// ============================================

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  (
    {
      items,
      separator,
      maxItems = 4,
      showHome = true,
      homeHref = '/',
      className,
      ...props
    },
    ref
  ) => {
    // Process items for collapse
    const processedItems = React.useMemo(() => {
      if (items.length <= maxItems) return { items, collapsed: false }

      const first = items[0]
      const last = items.slice(-2)
      return {
        items: [first, ...last],
        collapsed: true,
        hiddenCount: items.length - 3,
      }
    }, [items, maxItems])

    return (
      <BreadcrumbRoot ref={ref} className={className} {...props}>
        <BreadcrumbList>
          {/* Home */}
          {showHome && (
            <>
              <BreadcrumbItemEl>
                <Link
                  to={homeHref}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Home className="h-4 w-4" />
                </Link>
              </BreadcrumbItemEl>
              <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
            </>
          )}

          {/* Items */}
          {processedItems.items.map((item, index) => {
            const isLast = index === processedItems.items.length - 1
            const showEllipsis = processedItems.collapsed && index === 0

            return (
              <React.Fragment key={index}>
                {/* Ellipsis after first item when collapsed */}
                {showEllipsis && (
                  <>
                    <BreadcrumbItemEl>
                      <BreadcrumbEllipsis />
                    </BreadcrumbItemEl>
                    <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>
                  </>
                )}

                <BreadcrumbItemEl>
                  {item.icon && (
                    <span className="mr-1.5">{item.icon}</span>
                  )}
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <Link
                      to={item.href}
                      className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                  )}
                </BreadcrumbItemEl>

                {!isLast && <BreadcrumbSeparator>{separator}</BreadcrumbSeparator>}
              </React.Fragment>
            )
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
    )
  }
)
Breadcrumb.displayName = 'Breadcrumb'

// ============================================
// Simple Breadcrumb - String array version
// ============================================

interface SimpleBreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  // Path segments (e.g., ['Products', 'Electronics', 'Phones'])
  path: string[]
  // Base href to build links
  baseHref?: string
}

const SimpleBreadcrumb = React.forwardRef<HTMLElement, SimpleBreadcrumbProps>(
  ({ path, baseHref = '/', className, ...props }, ref) => {
    const items: BreadcrumbItem[] = path.map((segment, index) => ({
      label: segment,
      href: index < path.length - 1 ? `${baseHref}/${path.slice(0, index + 1).join('/')}` : undefined,
    }))

    return <Breadcrumb ref={ref} items={items} className={className} {...props} />
  }
)
SimpleBreadcrumb.displayName = 'SimpleBreadcrumb'

export {
  Breadcrumb,
  SimpleBreadcrumb,
  BreadcrumbRoot,
  BreadcrumbList,
  BreadcrumbItemEl as BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
}
