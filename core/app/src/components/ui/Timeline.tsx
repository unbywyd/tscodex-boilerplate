// Timeline / Vertical Stepper - Status tracking component
// Perfect for delivery tracking, order status, onboarding progress
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, Circle, Loader2 } from 'lucide-react'

type StepStatus = 'completed' | 'current' | 'pending'

interface TimelineStep {
  id: string | number
  title: string
  description?: string
  // Optional timestamp or meta info
  time?: string
  // Optional icon (defaults based on status)
  icon?: React.ReactNode
  // Optional image (small product image, avatar, etc)
  image?: string
  // Status (auto-calculated if not provided)
  status?: StepStatus
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: TimelineStep[]
  // Current active step index (0-based) - steps before are completed, after are pending
  currentStep?: number
  // Visual variant
  variant?: 'default' | 'compact' | 'detailed'
  // Color scheme
  color?: 'primary' | 'success' | 'blue'
  // Show connector line animation
  animated?: boolean
  // Orientation (vertical is default for mobile)
  orientation?: 'vertical' | 'horizontal'
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      steps,
      currentStep = 0,
      variant = 'default',
      color = 'primary',
      animated = true,
      orientation = 'vertical',
      ...props
    },
    ref
  ) => {
    // Determine step status based on currentStep
    const getStepStatus = (index: number, step: TimelineStep): StepStatus => {
      if (step.status) return step.status
      if (index < currentStep) return 'completed'
      if (index === currentStep) return 'current'
      return 'pending'
    }

    // Color classes
    const colorClasses = {
      primary: {
        completed: 'bg-primary text-primary-foreground',
        current: 'bg-primary text-primary-foreground ring-4 ring-primary/20',
        pending: 'bg-muted text-muted-foreground',
        line: 'bg-primary',
        linePending: 'bg-muted',
      },
      success: {
        completed: 'bg-green-600 text-white',
        current: 'bg-green-600 text-white ring-4 ring-green-600/20',
        pending: 'bg-muted text-muted-foreground',
        line: 'bg-green-600',
        linePending: 'bg-muted',
      },
      blue: {
        completed: 'bg-blue-600 text-white',
        current: 'bg-blue-600 text-white ring-4 ring-blue-600/20',
        pending: 'bg-muted text-muted-foreground',
        line: 'bg-blue-600',
        linePending: 'bg-muted',
      },
    }

    const colors = colorClasses[color]

    // Size classes based on variant
    const sizeClasses = {
      default: {
        circle: 'w-10 h-10',
        icon: 'h-5 w-5',
        image: 'w-8 h-8',
        gap: 'gap-4',
        line: 'w-0.5',
      },
      compact: {
        circle: 'w-8 h-8',
        icon: 'h-4 w-4',
        image: 'w-6 h-6',
        gap: 'gap-3',
        line: 'w-0.5',
      },
      detailed: {
        circle: 'w-12 h-12',
        icon: 'h-6 w-6',
        image: 'w-10 h-10',
        gap: 'gap-5',
        line: 'w-1',
      },
    }

    const sizes = sizeClasses[variant]

    // Render step icon/indicator
    const renderIndicator = (step: TimelineStep, status: StepStatus) => {
      // Custom icon
      if (step.icon) {
        return <span className={sizes.icon}>{step.icon}</span>
      }

      // Image
      if (step.image) {
        return (
          <img
            src={step.image}
            alt=""
            className={cn(sizes.image, 'rounded-full object-cover')}
          />
        )
      }

      // Default icons based on status
      switch (status) {
        case 'completed':
          return <Check className={sizes.icon} />
        case 'current':
          return animated ? (
            <Loader2 className={cn(sizes.icon, 'animate-spin')} />
          ) : (
            <Circle className={cn(sizes.icon, 'fill-current')} />
          )
        default:
          return <Circle className={sizes.icon} />
      }
    }

    if (orientation === 'horizontal') {
      return (
        <div ref={ref} className={cn('w-full', className)} {...props}>
          <div className="flex items-start justify-between">
            {steps.map((step, index) => {
              const status = getStepStatus(index, step)

              return (
                <div key={step.id} className="flex-1 flex flex-col items-center relative">
                  {/* Connector line (before circle) */}
                  {index > 0 && (
                    <div
                      className={cn(
                        'absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2',
                        status === 'pending' ? colors.linePending : colors.line,
                        animated && status === 'current' && 'animate-pulse'
                      )}
                      style={{ width: 'calc(100% - 2.5rem)', right: 'calc(50% + 1.25rem)' }}
                    />
                  )}

                  {/* Circle */}
                  <div
                    className={cn(
                      sizes.circle,
                      'rounded-full flex items-center justify-center z-10 transition-all',
                      colors[status]
                    )}
                  >
                    {renderIndicator(step, status)}
                  </div>

                  {/* Content */}
                  <div className="mt-2 text-center">
                    <p className={cn(
                      'text-sm font-medium',
                      status === 'pending' && 'text-muted-foreground'
                    )}>
                      {step.title}
                    </p>
                    {step.time && (
                      <p className="text-xs text-muted-foreground">{step.time}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    // Vertical orientation (default)
    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        {steps.map((step, index) => {
          const status = getStepStatus(index, step)
          const isLast = index === steps.length - 1

          return (
            <div key={step.id} className={cn('flex', sizes.gap)}>
              {/* Left side: indicator + line */}
              <div className="flex flex-col items-center">
                {/* Circle indicator */}
                <div
                  className={cn(
                    sizes.circle,
                    'rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                    colors[status]
                  )}
                >
                  {renderIndicator(step, status)}
                </div>

                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      'flex-1 my-2',
                      sizes.line,
                      index < currentStep ? colors.line : colors.linePending,
                      animated && index === currentStep && 'animate-pulse'
                    )}
                    style={{ minHeight: variant === 'compact' ? '24px' : '32px' }}
                  />
                )}
              </div>

              {/* Right side: content */}
              <div className={cn('flex-1 pb-6', isLast && 'pb-0')}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4
                      className={cn(
                        'font-medium leading-tight',
                        status === 'pending' && 'text-muted-foreground'
                      )}
                    >
                      {step.title}
                    </h4>
                    {step.description && (
                      <p
                        className={cn(
                          'text-sm mt-0.5',
                          status === 'pending'
                            ? 'text-muted-foreground/60'
                            : 'text-muted-foreground'
                        )}
                      >
                        {step.description}
                      </p>
                    )}
                  </div>
                  {step.time && (
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {step.time}
                    </span>
                  )}
                </div>

                {/* Optional image below description */}
                {step.image && variant === 'detailed' && (
                  <div className="mt-2">
                    <img
                      src={step.image}
                      alt=""
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }
)
Timeline.displayName = 'Timeline'

// ============================================
// Preset: Delivery Tracker
// ============================================

interface DeliveryTrackerProps {
  // Current status: 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'
  status: 'ordered' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered'
  // Optional timestamps for each step
  timestamps?: {
    ordered?: string
    packed?: string
    shipped?: string
    out_for_delivery?: string
    delivered?: string
  }
  className?: string
}

const deliverySteps = [
  { id: 'ordered', title: 'Order Placed', description: 'Your order has been confirmed' },
  { id: 'packed', title: 'Packed', description: 'Your items are being prepared' },
  { id: 'shipped', title: 'Shipped', description: 'Package handed to courier' },
  { id: 'out_for_delivery', title: 'Out for Delivery', description: 'Courier is on the way' },
  { id: 'delivered', title: 'Delivered', description: 'Package delivered successfully' },
]

const DeliveryTracker = ({ status, timestamps = {}, className }: DeliveryTrackerProps) => {
  const statusIndex = deliverySteps.findIndex((s) => s.id === status)

  const steps = deliverySteps.map((step) => ({
    ...step,
    time: timestamps[step.id as keyof typeof timestamps],
  }))

  return (
    <Timeline
      steps={steps}
      currentStep={statusIndex}
      color="success"
      className={className}
    />
  )
}

// ============================================
// Preset: Order Status
// ============================================

interface OrderStatusProps {
  steps: Array<{
    title: string
    description?: string
    time?: string
    completed?: boolean
  }>
  className?: string
}

const OrderStatus = ({ steps, className }: OrderStatusProps) => {
  // Find first non-completed step
  const currentStep = steps.findIndex((s) => !s.completed)
  const normalizedSteps = steps.map((s, i) => ({
    id: i,
    ...s,
  }))

  return (
    <Timeline
      steps={normalizedSteps}
      currentStep={currentStep === -1 ? steps.length : currentStep}
      variant="compact"
      className={className}
    />
  )
}

export { Timeline, DeliveryTracker, OrderStatus, type TimelineStep }
