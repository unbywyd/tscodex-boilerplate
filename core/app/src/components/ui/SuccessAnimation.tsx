// SuccessAnimation - Animated success/error/loading states
import * as React from 'react'
import { cn } from '@/lib/utils'

// ============================================
// Types
// ============================================

interface SuccessAnimationProps extends React.HTMLAttributes<HTMLDivElement> {
  // Animation type
  type?: 'success' | 'error' | 'loading' | 'warning'
  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // Title
  title?: string
  // Description
  description?: string
  // Show animation
  show?: boolean
  // On animation complete
  onComplete?: () => void
}

// ============================================
// Size Config
// ============================================

const sizeConfig = {
  sm: { container: 'w-12 h-12', icon: 24, stroke: 2 },
  md: { container: 'w-16 h-16', icon: 32, stroke: 2.5 },
  lg: { container: 'w-20 h-20', icon: 40, stroke: 3 },
  xl: { container: 'w-24 h-24', icon: 48, stroke: 3.5 },
}

// ============================================
// SuccessAnimation Component
// ============================================

const SuccessAnimation = React.forwardRef<HTMLDivElement, SuccessAnimationProps>(
  (
    {
      type = 'success',
      size = 'lg',
      title,
      description,
      show = true,
      onComplete,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]

    React.useEffect(() => {
      if (show && onComplete && type !== 'loading') {
        const timer = setTimeout(onComplete, 2000)
        return () => clearTimeout(timer)
      }
    }, [show, onComplete, type])

    if (!show) return null

    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center text-center', className)}
        {...props}
      >
        {/* Animation */}
        <div className={cn(config.container, 'relative')}>
          {type === 'success' && <SuccessIcon size={config.icon} stroke={config.stroke} />}
          {type === 'error' && <ErrorIcon size={config.icon} stroke={config.stroke} />}
          {type === 'warning' && <WarningIcon size={config.icon} stroke={config.stroke} />}
          {type === 'loading' && <LoadingIcon size={config.icon} stroke={config.stroke} />}
        </div>

        {/* Text */}
        {(title || description) && (
          <div className="mt-4 space-y-1">
            {title && <p className="font-semibold text-lg">{title}</p>}
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </div>
        )}
      </div>
    )
  }
)
SuccessAnimation.displayName = 'SuccessAnimation'

// ============================================
// Success Icon (Animated Checkmark)
// ============================================

const SuccessIcon = ({ size, stroke }: { size: number; stroke: number }) => (
  <svg
    viewBox="0 0 52 52"
    width={size}
    height={size}
    className="success-animation"
  >
    {/* Circle */}
    <circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      className="text-green-500 animate-circle"
      style={{
        strokeDasharray: '166',
        strokeDashoffset: '166',
        animation: 'circle 0.6s ease-in-out forwards',
      }}
    />
    {/* Checkmark */}
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M14 27l7 7 16-16"
      className="text-green-500"
      style={{
        strokeDasharray: '48',
        strokeDashoffset: '48',
        animation: 'check 0.3s ease-in-out 0.4s forwards',
      }}
    />
    <style>{`
      @keyframes circle {
        to { stroke-dashoffset: 0; }
      }
      @keyframes check {
        to { stroke-dashoffset: 0; }
      }
    `}</style>
  </svg>
)

// ============================================
// Error Icon (Animated X)
// ============================================

const ErrorIcon = ({ size, stroke }: { size: number; stroke: number }) => (
  <svg
    viewBox="0 0 52 52"
    width={size}
    height={size}
    className="error-animation"
  >
    {/* Circle */}
    <circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      className="text-red-500"
      style={{
        strokeDasharray: '166',
        strokeDashoffset: '166',
        animation: 'circle 0.6s ease-in-out forwards',
      }}
    />
    {/* X */}
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      d="M18 18l16 16M34 18l-16 16"
      className="text-red-500"
      style={{
        strokeDasharray: '48',
        strokeDashoffset: '48',
        animation: 'check 0.3s ease-in-out 0.4s forwards',
      }}
    />
  </svg>
)

// ============================================
// Warning Icon (Animated !)
// ============================================

const WarningIcon = ({ size, stroke }: { size: number; stroke: number }) => (
  <svg
    viewBox="0 0 52 52"
    width={size}
    height={size}
    className="warning-animation"
  >
    {/* Triangle */}
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M26 6L4 46h44L26 6z"
      className="text-yellow-500"
      style={{
        strokeDasharray: '120',
        strokeDashoffset: '120',
        animation: 'circle 0.6s ease-in-out forwards',
      }}
    />
    {/* Exclamation */}
    <path
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      d="M26 20v12M26 38v2"
      className="text-yellow-500"
      style={{
        strokeDasharray: '20',
        strokeDashoffset: '20',
        animation: 'check 0.3s ease-in-out 0.4s forwards',
      }}
    />
  </svg>
)

// ============================================
// Loading Icon (Spinning)
// ============================================

const LoadingIcon = ({ size, stroke }: { size: number; stroke: number }) => (
  <svg
    viewBox="0 0 52 52"
    width={size}
    height={size}
    className="animate-spin"
  >
    <circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      className="text-muted-foreground/30"
    />
    <circle
      cx="26"
      cy="26"
      r="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeDasharray="60 100"
      className="text-primary"
    />
  </svg>
)

// ============================================
// Full Screen Result - Success/Error page
// ============================================

interface FullScreenResultProps {
  type: 'success' | 'error'
  title: string
  description?: string
  primaryAction?: {
    label: string
    onClick: () => void
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

const FullScreenResult = ({
  type,
  title,
  description,
  primaryAction,
  secondaryAction,
}: FullScreenResultProps) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
    <SuccessAnimation type={type} size="xl" />

    <h1 className="mt-6 text-2xl font-bold">{title}</h1>

    {description && (
      <p className="mt-2 text-muted-foreground max-w-sm">{description}</p>
    )}

    {(primaryAction || secondaryAction) && (
      <div className="mt-8 flex flex-col gap-3 w-full max-w-xs">
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            className="w-full py-3 px-6 bg-primary text-primary-foreground rounded-lg font-medium"
          >
            {primaryAction.label}
          </button>
        )}
        {secondaryAction && (
          <button
            onClick={secondaryAction.onClick}
            className="w-full py-3 px-6 text-primary font-medium"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    )}
  </div>
)

// ============================================
// Confetti Animation (Simple CSS)
// ============================================

interface ConfettiProps {
  show?: boolean
  duration?: number
}

const Confetti = ({ show = true, duration = 3000 }: ConfettiProps) => {
  const [visible, setVisible] = React.useState(show)

  React.useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), duration)
      return () => clearTimeout(timer)
    }
  }, [show, duration])

  if (!visible) return null

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 rounded-full animate-confetti"
          style={{
            left: `${Math.random() * 100}%`,
            backgroundColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'][
              Math.floor(Math.random() * 6)
            ],
            animationDelay: `${Math.random() * 0.5}s`,
            animationDuration: `${2 + Math.random() * 2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export { SuccessAnimation, FullScreenResult, Confetti }
