// MobileToast / Snackbar - Mobile notifications
// Renders toasts inside the nearest positioned ancestor (not in body like Sonner)
// Perfect for multi-app layouts where each MobileFrame needs its own toasts
import * as React from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

// ============================================
// Types
// ============================================

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  type?: ToastType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
  dismissible?: boolean
}

interface ToastContextType {
  toasts: Toast[]
  show: (toast: Omit<Toast, 'id'>) => string
  dismiss: (id: string) => void
  dismissAll: () => void
}

// ============================================
// Context
// ============================================

const ToastContext = React.createContext<ToastContextType | null>(null)

const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a MobileToastProvider')
  }
  return context
}

// ============================================
// Provider
// ============================================

interface MobileToastProviderProps {
  children: React.ReactNode
  position?: 'top' | 'bottom'
  offset?: number
  /** Container element or ref to render toasts into (via portal). If not provided, renders inline. */
  container?: HTMLElement | React.RefObject<HTMLElement> | null
}

const MobileToastProvider = ({
  children,
  position = 'bottom',
  offset = 16,
  container,
}: MobileToastProviderProps) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const containerRef = React.useRef<HTMLDivElement>(null)

  const show = React.useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration ?? 3000,
      dismissible: toast.dismissible ?? true,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, newToast.duration)
    }

    return id
  }, [])

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const dismissAll = React.useCallback(() => {
    setToasts([])
  }, [])

  // Resolve container element
  const portalTarget = container
    ? ('current' in container ? container.current : container)
    : null

  const toastContainer = (
    <ToastContainer toasts={toasts} position={position} offset={offset} onDismiss={dismiss} />
  )

  return (
    <ToastContext.Provider value={{ toasts, show, dismiss, dismissAll }}>
      <div ref={containerRef} className="relative w-full h-full">
        {children}
        {portalTarget
          ? createPortal(toastContainer, portalTarget)
          : toastContainer
        }
      </div>
    </ToastContext.Provider>
  )
}

// ============================================
// Toast Container
// ============================================

interface ToastContainerProps {
  toasts: Toast[]
  position: 'top' | 'bottom'
  offset: number
  onDismiss: (id: string) => void
}

const ToastContainer = ({ toasts, position, offset, onDismiss }: ToastContainerProps) => {
  if (toasts.length === 0) return null

  return (
    <div
      className={cn(
        'absolute left-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none',
        position === 'top' ? 'top-0' : 'bottom-0'
      )}
      style={{ [position === 'top' ? 'paddingTop' : 'paddingBottom']: offset }}
    >
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onDismiss={() => onDismiss(toast.id)}
          position={position}
        />
      ))}
    </div>
  )
}

// ============================================
// Toast Item
// ============================================

const iconMap = {
  default: null,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colorMap = {
  default: 'bg-foreground text-background',
  success: 'bg-green-600 text-white',
  error: 'bg-red-600 text-white',
  warning: 'bg-yellow-500 text-black',
  info: 'bg-blue-600 text-white',
}

interface ToastItemProps {
  toast: Toast
  onDismiss: () => void
  position: 'top' | 'bottom'
}

const ToastItem = ({ toast, onDismiss, position }: ToastItemProps) => {
  const Icon = iconMap[toast.type || 'default']

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg',
        'animate-in fade-in slide-in-from-bottom-2 duration-200',
        position === 'top' && 'slide-in-from-top-2',
        colorMap[toast.type || 'default']
      )}
    >
      {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}

      <p className="flex-1 text-sm font-medium">{toast.message}</p>

      {toast.action && (
        <button
          onClick={toast.action.onClick}
          className="text-sm font-semibold underline underline-offset-2 flex-shrink-0"
        >
          {toast.action.label}
        </button>
      )}

      {toast.dismissible && (
        <button onClick={onDismiss} className="p-1 -mr-1 rounded hover:bg-white/20 flex-shrink-0">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

// ============================================
// Snackbar - Simpler single-line notification
// ============================================

interface SnackbarProps {
  open: boolean
  message: string
  onClose: () => void
  action?: {
    label: string
    onClick: () => void
  }
  duration?: number
  position?: 'top' | 'bottom'
}

const Snackbar = ({
  open,
  message,
  onClose,
  action,
  duration = 4000,
  position = 'bottom',
}: SnackbarProps) => {
  React.useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [open, duration, onClose])

  if (!open) return null

  return (
    <div
      className={cn(
        'absolute left-4 right-4 z-[100]',
        'animate-in fade-in duration-200',
        position === 'top' ? 'top-4 slide-in-from-top-2' : 'bottom-4 slide-in-from-bottom-2'
      )}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3 bg-foreground text-background rounded-lg shadow-lg">
        <p className="text-sm">{message}</p>
        {action && (
          <button
            onClick={() => {
              action.onClick()
              onClose()
            }}
            className="text-sm font-semibold text-primary-foreground underline underline-offset-2 flex-shrink-0"
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  )
}

// ============================================
// Inline Toast - For embedding in UI
// ============================================

interface InlineToastProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: ToastType
  message: string
  onDismiss?: () => void
}

const InlineToast = React.forwardRef<HTMLDivElement, InlineToastProps>(
  ({ type = 'default', message, onDismiss, className, ...props }, ref) => {
    const Icon = iconMap[type]

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-lg',
          colorMap[type],
          className
        )}
        {...props}
      >
        {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
        <p className="flex-1 text-sm font-medium">{message}</p>
        {onDismiss && (
          <button onClick={onDismiss} className="p-1 -mr-1 rounded hover:bg-white/20">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
InlineToast.displayName = 'InlineToast'

export { MobileToastProvider, useToast, Snackbar, InlineToast }
