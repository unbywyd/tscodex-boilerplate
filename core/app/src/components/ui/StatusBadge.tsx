// StatusBadge - Status indicator with icon and color coding
import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Loader2,
  Pause,
  Ban,
  CircleDot,
  Circle,
  Zap,
  Send,
  Archive,
  Eye,
  EyeOff,
} from 'lucide-react'

type StatusVariant =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'pending'
  | 'loading'
  | 'paused'
  | 'cancelled'
  | 'draft'
  | 'active'
  | 'inactive'
  | 'published'
  | 'archived'
  | 'visible'
  | 'hidden'

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  // Status variant
  status: StatusVariant
  // Custom label (overrides default)
  label?: string
  // Show icon
  showIcon?: boolean
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Dot only (no text)
  dotOnly?: boolean
  // Pulse animation for active states
  pulse?: boolean
}

const statusConfig: Record<
  StatusVariant,
  { icon: React.ElementType; label: string; className: string; dotClass: string }
> = {
  success: {
    icon: CheckCircle,
    label: 'Success',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  error: {
    icon: XCircle,
    label: 'Error',
    className: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
  warning: {
    icon: AlertCircle,
    label: 'Warning',
    className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    dotClass: 'bg-yellow-500',
  },
  info: {
    icon: CircleDot,
    label: 'Info',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  pending: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
    dotClass: 'bg-orange-500',
  },
  loading: {
    icon: Loader2,
    label: 'Loading',
    className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  paused: {
    icon: Pause,
    label: 'Paused',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-500',
  },
  cancelled: {
    icon: Ban,
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-500',
  },
  draft: {
    icon: Circle,
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
  active: {
    icon: Zap,
    label: 'Active',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  inactive: {
    icon: Circle,
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-400',
  },
  published: {
    icon: Send,
    label: 'Published',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  archived: {
    icon: Archive,
    label: 'Archived',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-500',
  },
  visible: {
    icon: Eye,
    label: 'Visible',
    className: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  hidden: {
    icon: EyeOff,
    label: 'Hidden',
    className: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400',
    dotClass: 'bg-gray-500',
  },
}

const StatusBadge = React.forwardRef<HTMLDivElement, StatusBadgeProps>(
  (
    {
      className,
      status,
      label,
      showIcon = true,
      size = 'md',
      dotOnly = false,
      pulse = false,
      ...props
    },
    ref
  ) => {
    const config = statusConfig[status]
    const IconComponent = config.icon
    const isLoading = status === 'loading'

    const sizeClasses = {
      sm: {
        badge: 'text-xs px-1.5 py-0.5 gap-1',
        icon: 'h-3 w-3',
        dot: 'h-1.5 w-1.5',
      },
      md: {
        badge: 'text-xs px-2 py-1 gap-1.5',
        icon: 'h-3.5 w-3.5',
        dot: 'h-2 w-2',
      },
      lg: {
        badge: 'text-sm px-2.5 py-1.5 gap-2',
        icon: 'h-4 w-4',
        dot: 'h-2.5 w-2.5',
      },
    }

    const sizes = sizeClasses[size]

    // Dot only variant
    if (dotOnly) {
      return (
        <div
          ref={ref}
          className={cn('inline-flex items-center', className)}
          title={label || config.label}
          {...props}
        >
          <span
            className={cn(
              'rounded-full',
              sizes.dot,
              config.dotClass,
              pulse && 'animate-pulse'
            )}
          />
        </div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium',
          sizes.badge,
          config.className,
          className
        )}
        {...props}
      >
        {showIcon && (
          <IconComponent
            className={cn(
              sizes.icon,
              isLoading && 'animate-spin'
            )}
          />
        )}
        <span>{label || config.label}</span>
      </div>
    )
  }
)
StatusBadge.displayName = 'StatusBadge'

// ============================================
// StatusDot - Simple dot indicator
// ============================================

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: StatusVariant
  size?: 'sm' | 'md' | 'lg'
  pulse?: boolean
}

const StatusDot = React.forwardRef<HTMLSpanElement, StatusDotProps>(
  ({ className, status, size = 'md', pulse = false, ...props }, ref) => {
    const config = statusConfig[status]
    const sizeClasses = {
      sm: 'h-1.5 w-1.5',
      md: 'h-2 w-2',
      lg: 'h-3 w-3',
    }

    return (
      <span
        ref={ref}
        className={cn(
          'inline-block rounded-full',
          sizeClasses[size],
          config.dotClass,
          pulse && 'animate-pulse',
          className
        )}
        {...props}
      />
    )
  }
)
StatusDot.displayName = 'StatusDot'

export { StatusBadge, StatusDot, type StatusVariant }
