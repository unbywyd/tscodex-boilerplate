// LoadingOverlay - Loading states and overlays
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

// ============================================
// Loading Spinner
// ============================================

interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  color?: 'default' | 'primary' | 'white'
}

const spinnerSizes = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

const spinnerColors = {
  default: 'text-muted-foreground',
  primary: 'text-primary',
  white: 'text-white',
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = 'md', color = 'default', className, ...props }, ref) => (
    <div ref={ref} className={cn('animate-spin', className)} {...props}>
      <Loader2 className={cn(spinnerSizes[size], spinnerColors[color])} />
    </div>
  )
)
Spinner.displayName = 'Spinner'

// ============================================
// Loading Dots
// ============================================

interface LoadingDotsProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg'
  color?: 'default' | 'primary' | 'white'
}

const dotSizes = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
  lg: 'h-3 w-3',
}

const LoadingDots = React.forwardRef<HTMLDivElement, LoadingDotsProps>(
  ({ size = 'md', color = 'default', className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-1', className)} {...props}>
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'rounded-full animate-bounce',
            dotSizes[size],
            spinnerColors[color],
            'bg-current'
          )}
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  )
)
LoadingDots.displayName = 'LoadingDots'

// ============================================
// Loading Bar (Indeterminate)
// ============================================

interface LoadingBarProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'default' | 'primary'
}

const LoadingBar = React.forwardRef<HTMLDivElement, LoadingBarProps>(
  ({ color = 'primary', className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('h-1 w-full bg-muted overflow-hidden rounded-full', className)}
      {...props}
    >
      <div
        className={cn(
          'h-full w-1/3 rounded-full animate-indeterminate',
          color === 'primary' ? 'bg-primary' : 'bg-muted-foreground'
        )}
      />
    </div>
  )
)
LoadingBar.displayName = 'LoadingBar'

// ============================================
// Loading Overlay
// ============================================

interface LoadingOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  // Show overlay
  visible?: boolean
  // Loading text
  text?: string
  // Blur background
  blur?: boolean
  // Dark background
  dark?: boolean
  // Spinner size
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl'
  // Full screen
  fullScreen?: boolean
}

const LoadingOverlay = React.forwardRef<HTMLDivElement, LoadingOverlayProps>(
  (
    {
      visible = true,
      text,
      blur = true,
      dark = false,
      spinnerSize = 'lg',
      fullScreen = false,
      className,
      ...props
    },
    ref
  ) => {
    if (!visible) return null

    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 flex flex-col items-center justify-center z-50',
          blur && 'backdrop-blur-sm',
          dark ? 'bg-black/50' : 'bg-white/80 dark:bg-black/50',
          fullScreen && 'fixed',
          className
        )}
        {...props}
      >
        <Spinner size={spinnerSize} color={dark ? 'white' : 'primary'} />
        {text && (
          <p className={cn(
            'mt-3 text-sm font-medium',
            dark ? 'text-white' : 'text-foreground'
          )}>
            {text}
          </p>
        )}
      </div>
    )
  }
)
LoadingOverlay.displayName = 'LoadingOverlay'

// ============================================
// Page Loading - Full page loading state
// ============================================

interface PageLoadingProps {
  text?: string
  showLogo?: boolean
  logo?: React.ReactNode
}

const PageLoading = ({ text = 'Loading...', showLogo = false, logo }: PageLoadingProps) => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">
    {showLogo && (
      <div className="mb-8">
        {logo ?? (
          <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center">
            <span className="text-2xl font-bold text-primary-foreground">A</span>
          </div>
        )}
      </div>
    )}
    <Spinner size="xl" color="primary" />
    <p className="mt-4 text-muted-foreground">{text}</p>
  </div>
)

// ============================================
// Button Loading State
// ============================================

interface ButtonLoadingProps {
  loading?: boolean
  children: React.ReactNode
  loadingText?: string
}

const ButtonLoading = ({ loading, children, loadingText }: ButtonLoadingProps) => {
  if (!loading) return <>{children}</>

  return (
    <span className="flex items-center gap-2">
      <Spinner size="sm" color="white" />
      {loadingText ?? 'Loading...'}
    </span>
  )
}

// ============================================
// Skeleton Pulse
// ============================================

interface SkeletonPulseProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: string | number
  height?: string | number
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full'
}

const roundedClasses = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
}

const SkeletonPulse = React.forwardRef<HTMLDivElement, SkeletonPulseProps>(
  ({ width, height, rounded = 'md', className, style, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'animate-pulse bg-muted',
        roundedClasses[rounded],
        className
      )}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        ...style,
      }}
      {...props}
    />
  )
)
SkeletonPulse.displayName = 'SkeletonPulse'

// ============================================
// Loading Container - Wrapper with loading state
// ============================================

interface LoadingContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  loading?: boolean
  error?: Error | null
  errorComponent?: React.ReactNode
  loadingComponent?: React.ReactNode
}

const LoadingContainer = React.forwardRef<HTMLDivElement, LoadingContainerProps>(
  (
    {
      loading = false,
      error = null,
      errorComponent,
      loadingComponent,
      children,
      className,
      ...props
    },
    ref
  ) => {
    if (error) {
      return (
        <div ref={ref} className={cn('p-8 text-center', className)} {...props}>
          {errorComponent ?? (
            <>
              <p className="text-destructive font-medium">Something went wrong</p>
              <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
            </>
          )}
        </div>
      )
    }

    if (loading) {
      return (
        <div ref={ref} className={cn('p-8 flex justify-center', className)} {...props}>
          {loadingComponent ?? <Spinner size="lg" color="primary" />}
        </div>
      )
    }

    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    )
  }
)
LoadingContainer.displayName = 'LoadingContainer'

export {
  Spinner,
  LoadingDots,
  LoadingBar,
  LoadingOverlay,
  PageLoading,
  ButtonLoading,
  SkeletonPulse,
  LoadingContainer,
}
