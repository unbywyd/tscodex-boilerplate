// BottomSheet - Draggable bottom sheet / modal
import * as React from 'react'
import { cn } from '@/lib/utils'
import { X } from 'lucide-react'

// ============================================
// Types
// ============================================

interface BottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  // Open state
  open: boolean
  // On close
  onClose: () => void
  // Snap points (percentages of viewport height)
  snapPoints?: number[]
  // Default snap point index
  defaultSnap?: number
  // Show handle
  showHandle?: boolean
  // Show close button
  showClose?: boolean
  // Title
  title?: string
  // Disable drag
  disableDrag?: boolean
  // Close on backdrop click
  closeOnBackdrop?: boolean
  // Max height (vh)
  maxHeight?: number
}

// ============================================
// BottomSheet Component
// ============================================

const BottomSheet = React.forwardRef<HTMLDivElement, BottomSheetProps>(
  (
    {
      open,
      onClose,
      snapPoints = [50, 90],
      defaultSnap = 0,
      showHandle = true,
      showClose = false,
      title,
      disableDrag = false,
      closeOnBackdrop = true,
      maxHeight = 95,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const sheetRef = React.useRef<HTMLDivElement>(null)
    const [currentSnap, setCurrentSnap] = React.useState(defaultSnap)
    const [isDragging, setIsDragging] = React.useState(false)
    const [dragOffset, setDragOffset] = React.useState(0)
    const startY = React.useRef(0)
    const startHeight = React.useRef(0)

    const currentHeight = snapPoints[currentSnap]

    // Handle touch start
    const handleTouchStart = (e: React.TouchEvent) => {
      if (disableDrag) return
      startY.current = e.touches[0].clientY
      startHeight.current = currentHeight + dragOffset
      setIsDragging(true)
    }

    // Handle touch move
    const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging || disableDrag) return

      const currentY = e.touches[0].clientY
      const diff = startY.current - currentY
      const newOffset = (diff / window.innerHeight) * 100

      // Calculate new height
      const newHeight = startHeight.current + newOffset

      // Clamp to valid range
      if (newHeight < 10) {
        setDragOffset(10 - currentHeight)
      } else if (newHeight > maxHeight) {
        setDragOffset(maxHeight - currentHeight)
      } else {
        setDragOffset(newHeight - currentHeight)
      }
    }

    // Handle touch end
    const handleTouchEnd = () => {
      if (!isDragging) return
      setIsDragging(false)

      const finalHeight = currentHeight + dragOffset

      // Close if dragged below threshold
      if (finalHeight < 20) {
        onClose()
        setDragOffset(0)
        return
      }

      // Find closest snap point
      let closestSnap = 0
      let minDiff = Math.abs(snapPoints[0] - finalHeight)

      snapPoints.forEach((point, index) => {
        const diff = Math.abs(point - finalHeight)
        if (diff < minDiff) {
          minDiff = diff
          closestSnap = index
        }
      })

      setCurrentSnap(closestSnap)
      setDragOffset(0)
    }

    // Reset on close
    React.useEffect(() => {
      if (!open) {
        setCurrentSnap(defaultSnap)
        setDragOffset(0)
      }
    }, [open, defaultSnap])

    const displayHeight = currentHeight + dragOffset

    if (!open) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 z-50 bg-black/50 transition-opacity',
            open ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeOnBackdrop ? onClose : undefined}
        />

        {/* Sheet */}
        <div
          ref={ref}
          className={cn(
            'absolute inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-xl',
            !isDragging && 'transition-all duration-300 ease-out',
            className
          )}
          style={{ height: `${displayHeight}vh` }}
          {...props}
        >
          {/* Handle area */}
          <div
            ref={sheetRef}
            className="flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {showHandle && (
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            )}
          </div>

          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-4 pb-3">
              {title && <h2 className="font-semibold text-lg">{title}</h2>}
              {!title && <div />}
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto px-4 pb-safe">
            {children}
          </div>
        </div>
      </>
    )
  }
)
BottomSheet.displayName = 'BottomSheet'

// ============================================
// Simple Bottom Sheet - No drag, just modal
// ============================================

interface SimpleBottomSheetProps extends React.HTMLAttributes<HTMLDivElement> {
  open: boolean
  onClose: () => void
  title?: string
  showClose?: boolean
  /** Disable default padding on content wrapper */
  noPadding?: boolean
}

const SimpleBottomSheet = React.forwardRef<HTMLDivElement, SimpleBottomSheetProps>(
  ({ open, onClose, title, showClose = true, noPadding = false, children, className, ...props }, ref) => {
    if (!open) return null

    return (
      <>
        {/* Backdrop */}
        <div
          className="absolute inset-0 z-50 bg-black/50 animate-in fade-in"
          onClick={onClose}
        />

        {/* Sheet */}
        <div
          ref={ref}
          className={cn(
            'absolute inset-x-0 bottom-0 z-50 bg-background rounded-t-2xl shadow-xl',
            'animate-in slide-in-from-bottom duration-300',
            'max-h-[90vh] flex flex-col',
            className
          )}
          {...props}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
          </div>

          {/* Header */}
          {(title || showClose) && (
            <div className="flex items-center justify-between px-4 pb-3 border-b">
              {title && <h2 className="font-semibold text-lg">{title}</h2>}
              {!title && <div />}
              {showClose && (
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          )}

          {/* Content */}
          <div className={cn('flex-1 overflow-auto', !noPadding && 'p-4')}>
            {children}
          </div>
        </div>
      </>
    )
  }
)
SimpleBottomSheet.displayName = 'SimpleBottomSheet'

// ============================================
// Option Sheet - For selection lists
// ============================================

interface OptionSheetOption {
  id: string
  label: string
  icon?: React.ReactNode
  description?: string
  destructive?: boolean
}

interface OptionSheetProps {
  open: boolean
  onClose: () => void
  options: OptionSheetOption[]
  onSelect: (id: string) => void
  title?: string
  selected?: string
}

const OptionSheet = ({
  open,
  onClose,
  options,
  onSelect,
  title,
  selected,
}: OptionSheetProps) => {
  const handleSelect = (id: string) => {
    onSelect(id)
    onClose()
  }

  return (
    <SimpleBottomSheet open={open} onClose={onClose} title={title}>
      <div className="space-y-1 -mx-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={cn(
              'w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left',
              option.destructive && 'text-destructive',
              selected === option.id && 'bg-muted'
            )}
          >
            {option.icon && (
              <span className="flex-shrink-0">{option.icon}</span>
            )}
            <div className="flex-1">
              <p className="font-medium">{option.label}</p>
              {option.description && (
                <p className="text-sm text-muted-foreground">{option.description}</p>
              )}
            </div>
            {selected === option.id && (
              <div className="w-2 h-2 rounded-full bg-primary" />
            )}
          </button>
        ))}
      </div>
    </SimpleBottomSheet>
  )
}

export { BottomSheet, SimpleBottomSheet, OptionSheet }
