// StatCard / MetricCard - Dashboard KPI display
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Minus, ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps extends React.HTMLAttributes<HTMLDivElement> {
  // Main value
  value: string | number
  // Label/title
  label: string
  // Optional description
  description?: string
  // Icon
  icon?: React.ReactNode
  // Trend (percentage change)
  trend?: {
    value: number
    label?: string
  }
  // Color variant
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary'
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Show border
  bordered?: boolean
}

const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  (
    {
      className,
      value,
      label,
      description,
      icon,
      trend,
      variant = 'default',
      size = 'md',
      bordered = true,
      ...props
    },
    ref
  ) => {
    const sizeClasses = {
      sm: {
        container: 'p-3',
        value: 'text-xl',
        label: 'text-xs',
        icon: 'h-8 w-8',
        iconInner: 'h-4 w-4',
        trend: 'text-xs',
      },
      md: {
        container: 'p-4',
        value: 'text-2xl',
        label: 'text-sm',
        icon: 'h-10 w-10',
        iconInner: 'h-5 w-5',
        trend: 'text-sm',
      },
      lg: {
        container: 'p-6',
        value: 'text-4xl',
        label: 'text-base',
        icon: 'h-12 w-12',
        iconInner: 'h-6 w-6',
        trend: 'text-sm',
      },
    }

    const variantClasses = {
      default: 'bg-muted',
      success: 'bg-green-100 dark:bg-green-900/30',
      warning: 'bg-yellow-100 dark:bg-yellow-900/30',
      danger: 'bg-red-100 dark:bg-red-900/30',
      primary: 'bg-primary/10',
    }

    const iconVariantClasses = {
      default: 'text-muted-foreground',
      success: 'text-green-600 dark:text-green-400',
      warning: 'text-yellow-600 dark:text-yellow-400',
      danger: 'text-red-600 dark:text-red-400',
      primary: 'text-primary',
    }

    const sizes = sizeClasses[size]

    const trendIsPositive = trend && trend.value > 0
    const trendIsNegative = trend && trend.value < 0

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-lg bg-card',
          bordered && 'border',
          sizes.container,
          className
        )}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className={cn('text-muted-foreground font-medium mb-1', sizes.label)}>
              {label}
            </p>
            <p className={cn('font-bold tracking-tight', sizes.value)}>{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && (
              <div className={cn('flex items-center gap-1 mt-2', sizes.trend)}>
                {trendIsPositive ? (
                  <ArrowUp className="h-3 w-3 text-green-600" />
                ) : trendIsNegative ? (
                  <ArrowDown className="h-3 w-3 text-red-600" />
                ) : (
                  <Minus className="h-3 w-3 text-muted-foreground" />
                )}
                <span
                  className={cn(
                    'font-medium',
                    trendIsPositive && 'text-green-600',
                    trendIsNegative && 'text-red-600',
                    !trendIsPositive && !trendIsNegative && 'text-muted-foreground'
                  )}
                >
                  {trendIsPositive && '+'}
                  {trend.value}%
                </span>
                {trend.label && (
                  <span className="text-muted-foreground">{trend.label}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'rounded-lg flex items-center justify-center',
                sizes.icon,
                variantClasses[variant]
              )}
            >
              <span className={cn(iconVariantClasses[variant], '[&>svg]:h-full [&>svg]:w-full', sizes.iconInner)}>
                {icon}
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
)
StatCard.displayName = 'StatCard'

// ============================================
// StatGrid - Grid layout for stats
// ============================================

interface StatGridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 2 | 3 | 4
}

const StatGrid = React.forwardRef<HTMLDivElement, StatGridProps>(
  ({ className, columns = 4, children, ...props }, ref) => {
    const colClasses = {
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    }

    return (
      <div
        ref={ref}
        className={cn('grid gap-4', colClasses[columns], className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
StatGrid.displayName = 'StatGrid'

// ============================================
// MiniStat - Compact inline stat
// ============================================

interface MiniStatProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string | number
  label: string
  trend?: number
}

const MiniStat = React.forwardRef<HTMLDivElement, MiniStatProps>(
  ({ className, value, label, trend, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center gap-2', className)} {...props}>
      <span className="text-lg font-bold">{value}</span>
      <span className="text-sm text-muted-foreground">{label}</span>
      {trend !== undefined && (
        <span
          className={cn(
            'text-xs font-medium',
            trend > 0 && 'text-green-600',
            trend < 0 && 'text-red-600',
            trend === 0 && 'text-muted-foreground'
          )}
        >
          {trend > 0 && '+'}
          {trend}%
        </span>
      )}
    </div>
  )
)
MiniStat.displayName = 'MiniStat'

export { StatCard, StatGrid, MiniStat }
