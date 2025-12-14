// Signature - Digital signature capture component
// Built on signature_pad
import * as React from 'react'
import SignaturePad from 'signature_pad'
import { cn } from '@/lib/utils'
import { Button } from './Button'
import { Eraser, Undo2, Download, Check } from 'lucide-react'

interface SignatureProps extends React.HTMLAttributes<HTMLDivElement> {
  // On signature change (base64 data URL)
  onSignature?: (signature: string | null) => void
  // Initial signature (base64 data URL)
  value?: string | null
  // Pen color
  penColor?: string
  // Background color
  backgroundColor?: string
  // Line width
  minWidth?: number
  maxWidth?: number
  // Height
  height?: number
  // Disabled
  disabled?: boolean
  // Show controls
  showControls?: boolean
  // Placeholder text
  placeholder?: string
}

const Signature = React.forwardRef<HTMLDivElement, SignatureProps>(
  (
    {
      className,
      onSignature,
      value,
      penColor = '#000000',
      backgroundColor = '#ffffff',
      minWidth = 0.5,
      maxWidth = 2.5,
      height = 200,
      disabled = false,
      showControls = true,
      placeholder = 'Sign here',
      ...props
    },
    ref
  ) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const signaturePadRef = React.useRef<SignaturePad | null>(null)
    const [isEmpty, setIsEmpty] = React.useState(true)

    // Initialize signature pad
    React.useEffect(() => {
      if (!canvasRef.current) return

      const canvas = canvasRef.current
      const ratio = Math.max(window.devicePixelRatio || 1, 1)

      // Set canvas size
      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.getContext('2d')?.scale(ratio, ratio)

      // Initialize SignaturePad
      signaturePadRef.current = new SignaturePad(canvas, {
        penColor,
        backgroundColor,
        minWidth,
        maxWidth,
      })

      // Handle end stroke
      signaturePadRef.current.addEventListener('endStroke', () => {
        setIsEmpty(signaturePadRef.current?.isEmpty() ?? true)
        if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
          onSignature?.(signaturePadRef.current.toDataURL())
        }
      })

      // Load initial value
      if (value) {
        signaturePadRef.current.fromDataURL(value)
        setIsEmpty(false)
      }

      // Handle disabled state
      if (disabled) {
        signaturePadRef.current.off()
      }

      return () => {
        signaturePadRef.current?.off()
      }
    }, [])

    // Update when value changes externally
    React.useEffect(() => {
      if (!signaturePadRef.current) return

      if (value) {
        signaturePadRef.current.fromDataURL(value)
        setIsEmpty(false)
      } else if (!value && !signaturePadRef.current.isEmpty()) {
        signaturePadRef.current.clear()
        setIsEmpty(true)
      }
    }, [value])

    // Update disabled state
    React.useEffect(() => {
      if (!signaturePadRef.current) return

      if (disabled) {
        signaturePadRef.current.off()
      } else {
        signaturePadRef.current.on()
      }
    }, [disabled])

    // Handle window resize
    React.useEffect(() => {
      const handleResize = () => {
        if (!canvasRef.current || !signaturePadRef.current) return

        const canvas = canvasRef.current
        const data = signaturePadRef.current.toData()
        const ratio = Math.max(window.devicePixelRatio || 1, 1)

        canvas.width = canvas.offsetWidth * ratio
        canvas.height = canvas.offsetHeight * ratio
        canvas.getContext('2d')?.scale(ratio, ratio)

        signaturePadRef.current.clear()
        if (data.length > 0) {
          signaturePadRef.current.fromData(data)
        }
      }

      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleClear = () => {
      signaturePadRef.current?.clear()
      setIsEmpty(true)
      onSignature?.(null)
    }

    const handleUndo = () => {
      if (!signaturePadRef.current) return

      const data = signaturePadRef.current.toData()
      if (data.length > 0) {
        data.pop()
        signaturePadRef.current.fromData(data)
        setIsEmpty(data.length === 0)
        onSignature?.(data.length === 0 ? null : signaturePadRef.current.toDataURL())
      }
    }

    const handleDownload = () => {
      if (!signaturePadRef.current || signaturePadRef.current.isEmpty()) return

      const dataUrl = signaturePadRef.current.toDataURL('image/png')
      const link = document.createElement('a')
      link.download = 'signature.png'
      link.href = dataUrl
      link.click()
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)} {...props}>
        <div
          className={cn(
            'relative rounded-lg border-2 border-dashed overflow-hidden',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-crosshair',
            isEmpty ? 'border-muted-foreground/30' : 'border-primary/50'
          )}
          style={{ height }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full touch-none"
            style={{ backgroundColor }}
          />

          {/* Placeholder */}
          {isEmpty && !disabled && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-muted-foreground text-sm">{placeholder}</span>
            </div>
          )}

          {/* Signature line */}
          <div className="absolute bottom-8 left-8 right-8 border-b border-muted-foreground/30" />
          <span className="absolute bottom-2 left-8 text-xs text-muted-foreground">×</span>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleUndo}
                disabled={disabled || isEmpty}
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Undo
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={disabled || isEmpty}
              >
                <Eraser className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              disabled={disabled || isEmpty}
            >
              <Download className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        )}
      </div>
    )
  }
)
Signature.displayName = 'Signature'

// ============================================
// Compact Signature - Minimal inline version
// ============================================

interface CompactSignatureProps {
  value?: string | null
  onSignature?: (signature: string | null) => void
  height?: number
  className?: string
}

const CompactSignature = React.forwardRef<HTMLDivElement, CompactSignatureProps>(
  ({ value, onSignature, height = 100, className }, ref) => {
    const [isEditing, setIsEditing] = React.useState(false)
    const [tempSignature, setTempSignature] = React.useState<string | null>(value || null)

    const handleConfirm = () => {
      onSignature?.(tempSignature)
      setIsEditing(false)
    }

    const handleCancel = () => {
      setTempSignature(value || null)
      setIsEditing(false)
    }

    if (!isEditing && value) {
      return (
        <div
          ref={ref}
          className={cn('relative rounded-lg border bg-white cursor-pointer group', className)}
          style={{ height }}
          onClick={() => setIsEditing(true)}
        >
          <img src={value} alt="Signature" className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
            <span className="text-white text-sm font-medium">Click to edit</span>
          </div>
        </div>
      )
    }

    if (!isEditing) {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          className={cn(
            'w-full rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 transition-colors flex items-center justify-center',
            className
          )}
          style={{ height }}
          onClick={() => setIsEditing(true)}
        >
          <span className="text-muted-foreground text-sm">Click to sign</span>
        </button>
      )
    }

    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <Signature
          value={tempSignature}
          onSignature={setTempSignature}
          height={height}
          showControls={false}
          placeholder="Draw your signature"
        />
        <div className="flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleConfirm}>
            <Check className="h-4 w-4 mr-1" />
            Confirm
          </Button>
        </div>
      </div>
    )
  }
)
CompactSignature.displayName = 'CompactSignature'

export { Signature, CompactSignature }
