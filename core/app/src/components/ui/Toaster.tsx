// Toaster - Toast notifications using Sonner
import { Toaster as SonnerToaster } from 'sonner'

interface ToasterProps {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center'
  richColors?: boolean
  expand?: boolean
  duration?: number
  closeButton?: boolean
}

function Toaster({
  position = 'bottom-right',
  richColors = true,
  expand = false,
  duration = 4000,
  closeButton = true,
}: ToasterProps) {
  return (
    <SonnerToaster
      position={position}
      richColors={richColors}
      expand={expand}
      duration={duration}
      closeButton={closeButton}
      toastOptions={{
        classNames: {
          toast: 'group border-border bg-background text-foreground shadow-lg',
          description: 'text-muted-foreground',
          actionButton: 'bg-primary text-primary-foreground',
          cancelButton: 'bg-muted text-muted-foreground',
        },
      }}
    />
  )
}

// Re-export toast function for convenience
export { toast } from 'sonner'
export { Toaster }
