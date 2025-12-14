// MobileLayout - Container with safe areas for mobile prototypes
import * as React from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  // Whether to add padding for bottom nav
  hasBottomNav?: boolean
  // Background color
  bg?: 'default' | 'muted' | 'card'
}

const MobileLayout = React.forwardRef<HTMLDivElement, MobileLayoutProps>(
  ({ className, hasBottomNav = false, bg = 'muted', children, ...props }, ref) => {
    const bgClass = {
      default: 'bg-background',
      muted: 'bg-muted/30',
      card: 'bg-card',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'min-h-screen',
          bgClass[bg],
          hasBottomNav && 'pb-16', // space for bottom nav
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MobileLayout.displayName = 'MobileLayout'

// Scrollable content area
interface MobileContentProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md'
}

const MobileContent = React.forwardRef<HTMLDivElement, MobileContentProps>(
  ({ className, padding = 'md', children, ...props }, ref) => {
    const paddingClass = {
      none: '',
      sm: 'px-2 py-2',
      md: 'px-4 py-4',
    }

    return (
      <div
        ref={ref}
        className={cn('flex-1', paddingClass[padding], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MobileContent.displayName = 'MobileContent'

// ============================================
// Screen - Full screen layout with header/body/footer
// ============================================

interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  // Background color
  bg?: 'default' | 'muted' | 'card'
}

/**
 * Screen - Full mobile screen container (absolute positioned, flex column)
 * Use inside MobileFrame for proper mobile layout
 *
 * Structure:
 * - ScreenHeader (fixed top)
 * - ScreenBody (scrollable middle)
 * - ScreenFooter (fixed bottom)
 */
const Screen = React.forwardRef<HTMLDivElement, ScreenProps>(
  ({ className, bg = 'default', children, ...props }, ref) => {
    const bgClass = {
      default: 'bg-background',
      muted: 'bg-muted/30',
      card: 'bg-card',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'absolute inset-0 flex flex-col overflow-hidden',
          bgClass[bg],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Screen.displayName = 'Screen'

// Screen Header - Fixed at top
interface ScreenHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  // Border at bottom
  border?: boolean
  // Transparent background (for scroll behind)
  transparent?: boolean
}

const ScreenHeader = React.forwardRef<HTMLDivElement, ScreenHeaderProps>(
  ({ className, border = true, transparent = false, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-shrink-0 z-30', // z-30 to be above MobileFrame StatusBar (z-20)
        !transparent && 'bg-background',
        border && 'border-b',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ScreenHeader.displayName = 'ScreenHeader'

// Screen Body - Scrollable content area
interface ScreenBodyProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'none' | 'sm' | 'md' | 'lg'
  // Scroll behavior
  scroll?: boolean
}

const ScreenBody = React.forwardRef<HTMLDivElement, ScreenBodyProps>(
  ({ className, padding = 'md', scroll = true, children, ...props }, ref) => {
    const paddingClass = {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex-1 min-h-0', // min-h-0 is critical for flex child scrolling
          scroll && 'overflow-y-auto',
          paddingClass[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
ScreenBody.displayName = 'ScreenBody'

// Screen Footer - Fixed at bottom
interface ScreenFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  // Border at top
  border?: boolean
  // Safe area padding for home indicator
  safeArea?: boolean
}

const ScreenFooter = React.forwardRef<HTMLDivElement, ScreenFooterProps>(
  ({ className, border = true, safeArea = true, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex-shrink-0 bg-background z-10',
        border && 'border-t',
        safeArea && 'pb-safe', // if using safe area CSS
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
)
ScreenFooter.displayName = 'ScreenFooter'

export { MobileLayout, MobileContent, Screen, ScreenHeader, ScreenBody, ScreenFooter }
