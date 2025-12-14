// Banner - Inline notification banners
import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, Info, AlertTriangle, AlertCircle, CheckCircle, Megaphone, Sparkles } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

// ============================================
// Banner Variants
// ============================================

const bannerVariants = cva(
  'relative flex items-start gap-3 p-4 rounded-lg border',
  {
    variants: {
      variant: {
        default: 'bg-muted border-border text-foreground',
        info: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-100',
        success: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950 dark:border-green-800 dark:text-green-100',
        warning: 'bg-yellow-50 border-yellow-200 text-yellow-900 dark:bg-yellow-950 dark:border-yellow-800 dark:text-yellow-100',
        error: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-100',
        promo: 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-500 text-white',
        announcement: 'bg-primary border-primary text-primary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const iconMap = {
  default: Info,
  info: Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  promo: Sparkles,
  announcement: Megaphone,
}

// ============================================
// Banner Component
// ============================================

interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  // Title
  title?: string
  // Icon (auto based on variant if not provided)
  icon?: React.ReactNode
  // Show icon
  showIcon?: boolean
  // Dismissible
  dismissible?: boolean
  // On dismiss
  onDismiss?: () => void
  // Action
  action?: React.ReactNode
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = 'default',
      title,
      icon,
      showIcon = true,
      dismissible = false,
      onDismiss,
      action,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true)

    const handleDismiss = () => {
      setIsVisible(false)
      onDismiss?.()
    }

    if (!isVisible) return null

    const IconComponent = iconMap[variant || 'default']
    const displayIcon = icon ?? (showIcon ? <IconComponent className="h-5 w-5 flex-shrink-0" /> : null)

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(bannerVariants({ variant }), className)}
        {...props}
      >
        {displayIcon}

        <div className="flex-1 min-w-0">
          {title && <p className="font-medium mb-0.5">{title}</p>}
          <div className="text-sm opacity-90">{children}</div>
          {action && <div className="mt-3">{action}</div>}
        </div>

        {dismissible && (
          <button
            onClick={handleDismiss}
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors flex-shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
Banner.displayName = 'Banner'

// ============================================
// Top Banner - Full-width sticky banner
// ============================================

interface TopBannerProps extends BannerProps {
  // Sticky position
  sticky?: boolean
}

const TopBanner = React.forwardRef<HTMLDivElement, TopBannerProps>(
  ({ sticky = true, className, ...props }, ref) => (
    <Banner
      ref={ref}
      className={cn(
        'rounded-none border-x-0 border-t-0',
        sticky && 'sticky top-0 z-50',
        className
      )}
      {...props}
    />
  )
)
TopBanner.displayName = 'TopBanner'

// ============================================
// Inline Alert - Simple inline message
// ============================================

interface InlineAlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error'
}

const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(
  ({ variant = 'default', className, children, ...props }, ref) => {
    const IconComponent = iconMap[variant]

    const colorClasses = {
      default: 'text-muted-foreground',
      info: 'text-blue-600 dark:text-blue-400',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      error: 'text-red-600 dark:text-red-400',
    }

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 text-sm', colorClasses[variant], className)}
        {...props}
      >
        <IconComponent className="h-4 w-4 flex-shrink-0" />
        <span>{children}</span>
      </div>
    )
  }
)
InlineAlert.displayName = 'InlineAlert'

// ============================================
// Callout - Highlighted content block
// ============================================

interface CalloutProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'info' | 'warning' | 'tip'
  title?: string
  icon?: React.ReactNode
}

const calloutVariants = {
  default: 'border-l-muted-foreground bg-muted/50',
  info: 'border-l-blue-500 bg-blue-50 dark:bg-blue-950/50',
  warning: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-950/50',
  tip: 'border-l-green-500 bg-green-50 dark:bg-green-950/50',
}

const calloutIcons = {
  default: Info,
  info: Info,
  warning: AlertTriangle,
  tip: Sparkles,
}

const Callout = React.forwardRef<HTMLDivElement, CalloutProps>(
  ({ variant = 'default', title, icon, className, children, ...props }, ref) => {
    const IconComponent = calloutIcons[variant]

    return (
      <div
        ref={ref}
        className={cn(
          'border-l-4 p-4 rounded-r-lg',
          calloutVariants[variant],
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          {icon ?? <IconComponent className="h-5 w-5 flex-shrink-0 mt-0.5" />}
          <div>
            {title && <p className="font-medium mb-1">{title}</p>}
            <div className="text-sm text-muted-foreground">{children}</div>
          </div>
        </div>
      </div>
    )
  }
)
Callout.displayName = 'Callout'

// ============================================
// Cookie Banner - GDPR consent banner
// ============================================

interface CookieBannerProps {
  onAccept: () => void
  onDecline?: () => void
  onCustomize?: () => void
  className?: string
}

const CookieBanner = ({ onAccept, onDecline, onCustomize, className }: CookieBannerProps) => (
  <div
    className={cn(
      'fixed bottom-0 inset-x-0 z-50 bg-background border-t shadow-lg p-4',
      className
    )}
  >
    <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <div className="flex-1">
        <p className="font-medium mb-1">We use cookies</p>
        <p className="text-sm text-muted-foreground">
          We use cookies to enhance your browsing experience and analyze site traffic.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        {onCustomize && (
          <button
            onClick={onCustomize}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Customize
          </button>
        )}
        {onDecline && (
          <button
            onClick={onDecline}
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Decline
          </button>
        )}
        <button
          onClick={onAccept}
          className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          Accept All
        </button>
      </div>
    </div>
  </div>
)

export { Banner, TopBanner, InlineAlert, Callout, CookieBanner, bannerVariants }
