// PullToRefresh - Pull down to refresh content
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ArrowDown, Loader2 } from 'lucide-react'

// ============================================
// Types
// ============================================

interface PullToRefreshProps extends React.HTMLAttributes<HTMLDivElement> {
  // On refresh callback
  onRefresh: () => Promise<void>
  // Disabled
  disabled?: boolean
  // Pull threshold to trigger refresh
  threshold?: number
  // Max pull distance
  maxPull?: number
  // Custom loading indicator
  loadingIndicator?: React.ReactNode
  // Custom pull indicator
  pullIndicator?: React.ReactNode
  // Text customization
  pullText?: string
  releaseText?: string
  refreshingText?: string
}

// ============================================
// PullToRefresh Component
// ============================================

const PullToRefresh = React.forwardRef<HTMLDivElement, PullToRefreshProps>(
  (
    {
      onRefresh,
      disabled = false,
      threshold = 80,
      maxPull = 120,
      loadingIndicator,
      pullIndicator,
      pullText = 'Pull to refresh',
      releaseText = 'Release to refresh',
      refreshingText = 'Refreshing...',
      children,
      className,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [pullDistance, setPullDistance] = React.useState(0)
    const [isRefreshing, setIsRefreshing] = React.useState(false)
    const [isPulling, setIsPulling] = React.useState(false)
    const startY = React.useRef(0)
    const currentY = React.useRef(0)

    const canRefresh = pullDistance >= threshold

    const handleTouchStart = (e: React.TouchEvent) => {
      if (disabled || isRefreshing) return

      // Only activate if scrolled to top
      const scrollTop = containerRef.current?.scrollTop ?? 0
      if (scrollTop > 0) return

      startY.current = e.touches[0].clientY
      setIsPulling(true)
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isPulling || disabled || isRefreshing) return

      currentY.current = e.touches[0].clientY
      const diff = currentY.current - startY.current

      // Only pull down
      if (diff < 0) {
        setPullDistance(0)
        return
      }

      // Apply resistance
      const resistance = diff > threshold ? 0.4 : 0.6
      const pull = Math.min(diff * resistance, maxPull)
      setPullDistance(pull)
    }

    const handleTouchEnd = async () => {
      if (!isPulling) return
      setIsPulling(false)

      if (canRefresh && !isRefreshing) {
        setIsRefreshing(true)
        setPullDistance(threshold * 0.6) // Keep some visible during refresh

        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
        }
      } else {
        setPullDistance(0)
      }
    }

    // Calculate rotation for arrow
    const rotation = Math.min((pullDistance / threshold) * 180, 180)
    const progress = Math.min(pullDistance / threshold, 1)

    return (
      <div ref={ref} className={cn('relative overflow-hidden', className)} {...props}>
        {/* Pull indicator */}
        <div
          className={cn(
            'absolute left-0 right-0 flex flex-col items-center justify-end pb-2 transition-opacity',
            'pointer-events-none z-10'
          )}
          style={{
            height: pullDistance,
            opacity: progress,
          }}
        >
          {isRefreshing ? (
            loadingIndicator ?? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="text-sm">{refreshingText}</span>
              </div>
            )
          ) : (
            pullIndicator ?? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <ArrowDown
                  className="h-5 w-5 transition-transform duration-200"
                  style={{ transform: `rotate(${rotation}deg)` }}
                />
                <span className="text-sm">
                  {canRefresh ? releaseText : pullText}
                </span>
              </div>
            )
          )}
        </div>

        {/* Content */}
        <div
          ref={containerRef}
          className={cn(
            'h-full overflow-auto',
            !isPulling && !isRefreshing && 'transition-transform duration-200'
          )}
          style={{
            transform: `translateY(${pullDistance}px)`,
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children}
        </div>
      </div>
    )
  }
)
PullToRefresh.displayName = 'PullToRefresh'

// ============================================
// Refreshing Indicator - Standalone
// ============================================

interface RefreshingIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  visible: boolean
  text?: string
}

const RefreshingIndicator = React.forwardRef<HTMLDivElement, RefreshingIndicatorProps>(
  ({ visible, text = 'Refreshing...', className, ...props }, ref) => {
    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 py-3 text-muted-foreground',
          className
        )}
        {...props}
      >
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">{text}</span>
      </div>
    )
  }
)
RefreshingIndicator.displayName = 'RefreshingIndicator'

export { PullToRefresh, RefreshingIndicator }
