// Pagination - Page navigation component
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, MoreHorizontal } from 'lucide-react'
import { Button } from './Button'

// ============================================
// Types
// ============================================

interface PaginationProps extends React.HTMLAttributes<HTMLElement> {
  // Current page (1-indexed)
  page: number
  // Total pages
  totalPages: number
  // On page change
  onPageChange: (page: number) => void
  // Siblings on each side
  siblingCount?: number
  // Show boundaries
  boundaryCount?: number
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Show first/last buttons
  showFirstLast?: boolean
  // Disabled
  disabled?: boolean
}

// ============================================
// Pagination Components (Primitives)
// ============================================

const PaginationRoot = React.forwardRef<HTMLElement, React.HTMLAttributes<HTMLElement>>(
  ({ className, ...props }, ref) => (
    <nav
      ref={ref}
      role="navigation"
      aria-label="Pagination"
      className={cn('flex justify-center', className)}
      {...props}
    />
  )
)
PaginationRoot.displayName = 'PaginationRoot'

const PaginationContent = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement>>(
  ({ className, ...props }, ref) => (
    <ul ref={ref} className={cn('flex items-center gap-1', className)} {...props} />
  )
)
PaginationContent.displayName = 'PaginationContent'

const PaginationItem = React.forwardRef<HTMLLIElement, React.LiHTMLAttributes<HTMLLIElement>>(
  ({ className, ...props }, ref) => <li ref={ref} className={cn('', className)} {...props} />
)
PaginationItem.displayName = 'PaginationItem'

interface PaginationButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeConfig = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-8 w-8 text-sm',
  lg: 'h-10 w-10 text-base',
}

const PaginationButton = React.forwardRef<HTMLButtonElement, PaginationButtonProps>(
  ({ className, isActive, size = 'md', ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-muted text-foreground',
        sizeConfig[size],
        className
      )}
      {...props}
    />
  )
)
PaginationButton.displayName = 'PaginationButton'

const PaginationEllipsis = ({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) => (
  <span
    aria-hidden
    className={cn('flex h-8 w-8 items-center justify-center text-muted-foreground', className)}
    {...props}
  >
    <MoreHorizontal className="h-4 w-4" />
    <span className="sr-only">More pages</span>
  </span>
)
PaginationEllipsis.displayName = 'PaginationEllipsis'

// ============================================
// Main Pagination Component
// ============================================

const Pagination = React.forwardRef<HTMLElement, PaginationProps>(
  (
    {
      page,
      totalPages,
      onPageChange,
      siblingCount = 1,
      boundaryCount = 1,
      size = 'md',
      showFirstLast = true,
      disabled = false,
      className,
      ...props
    },
    ref
  ) => {
    // Generate page numbers to display
    const pages = React.useMemo(() => {
      const range = (start: number, end: number) =>
        Array.from({ length: end - start + 1 }, (_, i) => start + i)

      const totalNumbers = siblingCount * 2 + boundaryCount * 2 + 3 // siblings + boundaries + current + 2 ellipses

      if (totalPages <= totalNumbers) {
        return range(1, totalPages)
      }

      const leftSiblingIndex = Math.max(page - siblingCount, boundaryCount + 1)
      const rightSiblingIndex = Math.min(page + siblingCount, totalPages - boundaryCount)

      const shouldShowLeftEllipsis = leftSiblingIndex > boundaryCount + 2
      const shouldShowRightEllipsis = rightSiblingIndex < totalPages - boundaryCount - 1

      if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
        const leftItemCount = siblingCount * 2 + boundaryCount + 2
        return [...range(1, leftItemCount), 'ellipsis', ...range(totalPages - boundaryCount + 1, totalPages)]
      }

      if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
        const rightItemCount = siblingCount * 2 + boundaryCount + 2
        return [...range(1, boundaryCount), 'ellipsis', ...range(totalPages - rightItemCount + 1, totalPages)]
      }

      return [
        ...range(1, boundaryCount),
        'ellipsis',
        ...range(leftSiblingIndex, rightSiblingIndex),
        'ellipsis',
        ...range(totalPages - boundaryCount + 1, totalPages),
      ]
    }, [page, totalPages, siblingCount, boundaryCount])

    const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'

    return (
      <PaginationRoot ref={ref} className={className} {...props}>
        <PaginationContent>
          {/* First page */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationButton
                onClick={() => onPageChange(1)}
                disabled={disabled || page === 1}
                size={size}
                aria-label="Go to first page"
              >
                <ChevronsLeft className={iconSize} />
              </PaginationButton>
            </PaginationItem>
          )}

          {/* Previous */}
          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(page - 1)}
              disabled={disabled || page === 1}
              size={size}
              aria-label="Go to previous page"
            >
              <ChevronLeft className={iconSize} />
            </PaginationButton>
          </PaginationItem>

          {/* Page numbers */}
          {pages.map((p, index) =>
            p === 'ellipsis' ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationButton
                  onClick={() => onPageChange(p as number)}
                  isActive={page === p}
                  disabled={disabled}
                  size={size}
                  aria-label={`Go to page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </PaginationButton>
              </PaginationItem>
            )
          )}

          {/* Next */}
          <PaginationItem>
            <PaginationButton
              onClick={() => onPageChange(page + 1)}
              disabled={disabled || page === totalPages}
              size={size}
              aria-label="Go to next page"
            >
              <ChevronRight className={iconSize} />
            </PaginationButton>
          </PaginationItem>

          {/* Last page */}
          {showFirstLast && (
            <PaginationItem>
              <PaginationButton
                onClick={() => onPageChange(totalPages)}
                disabled={disabled || page === totalPages}
                size={size}
                aria-label="Go to last page"
              >
                <ChevronsRight className={iconSize} />
              </PaginationButton>
            </PaginationItem>
          )}
        </PaginationContent>
      </PaginationRoot>
    )
  }
)
Pagination.displayName = 'Pagination'

// ============================================
// Simple Pagination - Compact version
// ============================================

interface SimplePaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

const SimplePagination = React.forwardRef<HTMLDivElement, SimplePaginationProps>(
  ({ page, totalPages, onPageChange, className }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-muted-foreground px-2">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
)
SimplePagination.displayName = 'SimplePagination'

// ============================================
// Pagination Info - "Showing X-Y of Z"
// ============================================

interface PaginationInfoProps {
  page: number
  pageSize: number
  totalItems: number
  className?: string
}

const PaginationInfo = ({ page, pageSize, totalItems, className }: PaginationInfoProps) => {
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <p className={cn('text-sm text-muted-foreground', className)}>
      Showing <span className="font-medium">{start}</span> to{' '}
      <span className="font-medium">{end}</span> of{' '}
      <span className="font-medium">{totalItems}</span> results
    </p>
  )
}

export {
  Pagination,
  SimplePagination,
  PaginationInfo,
  PaginationRoot,
  PaginationContent,
  PaginationItem,
  PaginationButton,
  PaginationEllipsis,
}
