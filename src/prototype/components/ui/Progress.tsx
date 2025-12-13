// Progress components - Linear and Circular progress indicators
import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// Linear Progress Bar
// ============================================

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  // Progress value (0-100)
  value: number
  // Max value (default 100)
  max?: number
  // Show percentage text
  showValue?: boolean
  // Value position
  valuePosition?: 'inside' | 'right' | 'top'
  // Size variant
  size?: 'sm' | 'md' | 'lg'
  // Color variant
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'blue'
  // Animated stripe effect
  striped?: boolean
  // Animation for striped
  animated?: boolean
  // Custom label instead of percentage
  label?: string
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showValue = false,
      valuePosition = 'right',
      size = 'md',
      color = 'primary',
      striped = false,
      animated = false,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))
    const displayValue = label ?? `${Math.round(percentage)}%`

    const sizeClasses = {
      sm: 'h-1.5',
      md: 'h-2.5',
      lg: 'h-4',
    }

    const colorClasses = {
      primary: 'bg-primary',
      success: 'bg-green-500',
      warning: 'bg-yellow-500',
      danger: 'bg-red-500',
      blue: 'bg-blue-500',
    }

    const textSizeClasses = {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    }

    const renderBar = () => (
      <div
        className={cn(
          'w-full bg-muted rounded-full overflow-hidden',
          sizeClasses[size]
        )}
      >
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            colorClasses[color],
            striped && 'bg-stripes',
            animated && striped && 'animate-stripes'
          )}
          style={{ width: `${percentage}%` }}
        >
          {showValue && valuePosition === 'inside' && size === 'lg' && (
            <span className="flex items-center justify-center h-full text-xs font-medium text-white">
              {displayValue}
            </span>
          )}
        </div>
      </div>
    )

    if (showValue && valuePosition === 'top') {
      return (
        <div ref={ref} className={cn('space-y-1', className)} {...props}>
          <div className="flex justify-between items-center">
            <span className={cn('text-muted-foreground', textSizeClasses[size])}>
              Progress
            </span>
            <span className={cn('font-medium', textSizeClasses[size])}>
              {displayValue}
            </span>
          </div>
          {renderBar()}
        </div>
      )
    }

    if (showValue && valuePosition === 'right') {
      return (
        <div ref={ref} className={cn('flex items-center gap-3', className)} {...props}>
          <div className="flex-1">{renderBar()}</div>
          <span className={cn('font-medium tabular-nums min-w-[3ch]', textSizeClasses[size])}>
            {displayValue}
          </span>
        </div>
      )
    }

    return (
      <div ref={ref} className={className} {...props}>
        {renderBar()}
      </div>
    )
  }
)
Progress.displayName = 'Progress'

// ============================================
// Circular Progress (SVG-based)
// ============================================

interface CircularProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  // Progress value (0-100)
  value: number
  // Max value (default 100)
  max?: number
  // Size in pixels
  size?: number
  // Stroke width
  strokeWidth?: number
  // Show percentage in center
  showValue?: boolean
  // Color variant
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'blue'
  // Track color (background circle)
  trackColor?: string
  // Custom content in center (overrides showValue)
  children?: React.ReactNode
  // Clockwise or counter-clockwise
  clockwise?: boolean
  // Start angle (default: top = -90)
  startAngle?: number
}

const CircularProgress = React.forwardRef<HTMLDivElement, CircularProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 120,
      strokeWidth = 8,
      showValue = true,
      color = 'primary',
      trackColor,
      children,
      clockwise = true,
      startAngle = -90,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    // SVG calculations
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    const center = size / 2

    const colorClasses: Record<string, string> = {
      primary: 'stroke-primary',
      success: 'stroke-green-500',
      warning: 'stroke-yellow-500',
      danger: 'stroke-red-500',
      blue: 'stroke-blue-500',
    }

    // Font size based on circle size
    const fontSize = size < 60 ? 'text-xs' : size < 100 ? 'text-lg' : 'text-2xl'

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex items-center justify-center', className)}
        style={{ width: size, height: size }}
        {...props}
      >
        <svg
          width={size}
          height={size}
          className="transform"
          style={{ transform: `rotate(${startAngle}deg)` }}
        >
          {/* Background track */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className={trackColor ? '' : 'stroke-muted'}
            style={trackColor ? { stroke: trackColor } : undefined}
          />

          {/* Progress arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn(colorClasses[color], 'transition-all duration-500 ease-out')}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: clockwise ? strokeDashoffset : -strokeDashoffset,
            }}
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          {children ?? (
            showValue && (
              <span className={cn('font-semibold tabular-nums', fontSize)}>
                {Math.round(percentage)}%
              </span>
            )
          )}
        </div>
      </div>
    )
  }
)
CircularProgress.displayName = 'CircularProgress'

// ============================================
// Semi-circular Progress (Gauge style)
// ============================================

interface GaugeProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number
  max?: number
  size?: number
  strokeWidth?: number
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'blue'
  showValue?: boolean
  label?: string
}

const GaugeProgress = React.forwardRef<HTMLDivElement, GaugeProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 160,
      strokeWidth = 12,
      color = 'primary',
      showValue = true,
      label,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100))

    const radius = (size - strokeWidth) / 2
    // Semi-circle: 180 degrees = PI radians
    const circumference = Math.PI * radius
    const strokeDashoffset = circumference - (percentage / 100) * circumference
    const center = size / 2

    const colorClasses: Record<string, string> = {
      primary: 'stroke-primary',
      success: 'stroke-green-500',
      warning: 'stroke-yellow-500',
      danger: 'stroke-red-500',
      blue: 'stroke-blue-500',
    }

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex flex-col items-center', className)}
        style={{ width: size, height: size / 2 + 20 }}
        {...props}
      >
        <svg
          width={size}
          height={size / 2 + strokeWidth}
          className="overflow-visible"
        >
          {/* Background track (semi-circle) */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
            strokeLinecap="round"
          />

          {/* Progress arc */}
          <path
            d={`M ${strokeWidth / 2} ${center} A ${radius} ${radius} 0 0 1 ${size - strokeWidth / 2} ${center}`}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn(colorClasses[color], 'transition-all duration-500 ease-out')}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: strokeDashoffset,
            }}
          />
        </svg>

        {/* Center content */}
        {showValue && (
          <div className="absolute bottom-0 flex flex-col items-center">
            <span className="text-2xl font-bold tabular-nums">
              {Math.round(percentage)}%
            </span>
            {label && (
              <span className="text-xs text-muted-foreground">{label}</span>
            )}
          </div>
        )}
      </div>
    )
  }
)
GaugeProgress.displayName = 'GaugeProgress'

// ============================================
// Progress with Steps (like upload progress)
// ============================================

interface StepProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  // Current step (1-based)
  currentStep: number
  // Total steps
  totalSteps: number
  // Show step count
  showSteps?: boolean
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Color
  color?: 'primary' | 'success' | 'blue'
}

const StepProgress = React.forwardRef<HTMLDivElement, StepProgressProps>(
  (
    {
      className,
      currentStep,
      totalSteps,
      showSteps = true,
      size = 'md',
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const percentage = (currentStep / totalSteps) * 100

    return (
      <Progress
        ref={ref}
        value={percentage}
        showValue={showSteps}
        valuePosition="right"
        size={size}
        color={color}
        label={`${currentStep}/${totalSteps}`}
        className={className}
        {...props}
      />
    )
  }
)
StepProgress.displayName = 'StepProgress'

export { Progress, CircularProgress, GaugeProgress, StepProgress }
