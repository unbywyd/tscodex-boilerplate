// ImageUpload - Image upload with preview and cropping support
// Built on react-dropzone
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'
import { Upload, X, Image as ImageIcon, ZoomIn, Loader2 } from 'lucide-react'

interface ImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Value (URL or File)
  value?: string | File | null
  // On change
  onChange?: (file: File | null) => void
  // Max file size in bytes
  maxSize?: number
  // Aspect ratio (e.g., 1, 16/9, 4/3)
  aspectRatio?: number
  // Shape
  shape?: 'square' | 'circle' | 'rectangle'
  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl'
  // Disabled
  disabled?: boolean
  // Loading state
  loading?: boolean
  // Placeholder text
  placeholder?: string
  // Show zoom button
  showZoom?: boolean
}

const sizeConfig = {
  sm: { container: 'w-24 h-24', icon: 'h-6 w-6', text: 'text-xs' },
  md: { container: 'w-32 h-32', icon: 'h-8 w-8', text: 'text-sm' },
  lg: { container: 'w-40 h-40', icon: 'h-10 w-10', text: 'text-sm' },
  xl: { container: 'w-48 h-48', icon: 'h-12 w-12', text: 'text-base' },
}

const ImageUpload = React.forwardRef<HTMLDivElement, ImageUploadProps>(
  (
    {
      className,
      value,
      onChange,
      maxSize = 5 * 1024 * 1024, // 5MB
      aspectRatio,
      shape = 'square',
      size = 'md',
      disabled = false,
      loading = false,
      placeholder = 'Upload image',
      showZoom = true,
      ...props
    },
    ref
  ) => {
    const [preview, setPreview] = React.useState<string | null>(null)
    const [showLightbox, setShowLightbox] = React.useState(false)

    // Generate preview URL
    React.useEffect(() => {
      if (!value) {
        setPreview(null)
        return
      }

      if (typeof value === 'string') {
        setPreview(value)
        return
      }

      // File object
      const url = URL.createObjectURL(value)
      setPreview(url)

      return () => URL.revokeObjectURL(url)
    }, [value])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
          onChange?.(acceptedFiles[0])
        }
      },
      [onChange]
    )

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      },
      maxFiles: 1,
      maxSize,
      multiple: false,
      disabled: disabled || loading,
    })

    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation()
      onChange?.(null)
    }

    const handleZoom = (e: React.MouseEvent) => {
      e.stopPropagation()
      setShowLightbox(true)
    }

    const config = sizeConfig[size]
    const isCircle = shape === 'circle'

    // Determine container style
    const containerStyle: React.CSSProperties = {}
    if (aspectRatio && shape === 'rectangle') {
      containerStyle.aspectRatio = aspectRatio.toString()
    }

    return (
      <>
        <div
          ref={ref}
          {...getRootProps()}
          className={cn(
            'relative cursor-pointer transition-all',
            !aspectRatio && config.container,
            aspectRatio && shape === 'rectangle' && 'w-full max-w-xs',
            isCircle && 'rounded-full',
            !isCircle && 'rounded-lg',
            'border-2 border-dashed',
            isDragActive && 'border-primary bg-primary/5',
            isDragReject && 'border-red-500 bg-red-50',
            !isDragActive && !isDragReject && 'border-muted-foreground/25 hover:border-primary/50',
            (disabled || loading) && 'opacity-50 cursor-not-allowed',
            className
          )}
          style={containerStyle}
          {...props}
        >
          <input {...getInputProps()} />

          {preview ? (
            // Image preview
            <div className="relative w-full h-full group">
              <img
                src={preview}
                alt="Preview"
                className={cn(
                  'w-full h-full object-cover',
                  isCircle && 'rounded-full',
                  !isCircle && 'rounded-lg'
                )}
              />
              {/* Overlay on hover */}
              <div
                className={cn(
                  'absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2',
                  isCircle && 'rounded-full',
                  !isCircle && 'rounded-lg'
                )}
              >
                {showZoom && (
                  <button
                    onClick={handleZoom}
                    className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                  >
                    <ZoomIn className="h-5 w-5 text-white" />
                  </button>
                )}
                <button
                  onClick={handleRemove}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                >
                  <X className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          ) : (
            // Empty state
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
              {loading ? (
                <Loader2 className={cn(config.icon, 'animate-spin text-muted-foreground')} />
              ) : (
                <ImageIcon className={cn(config.icon, 'text-muted-foreground mb-1')} />
              )}
              <span className={cn(config.text, 'text-muted-foreground text-center')}>
                {loading ? 'Uploading...' : placeholder}
              </span>
            </div>
          )}
        </div>

        {/* Lightbox */}
        {showLightbox && preview && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowLightbox(false)}
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="h-6 w-6 text-white" />
            </button>
            <img
              src={preview}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}
      </>
    )
  }
)
ImageUpload.displayName = 'ImageUpload'

// ============================================
// Avatar Upload - Specialized for profile pics
// ============================================

interface AvatarUploadProps extends Omit<ImageUploadProps, 'shape' | 'aspectRatio'> {
  // Fallback initials
  fallback?: string
}

const AvatarUpload = React.forwardRef<HTMLDivElement, AvatarUploadProps>(
  ({ fallback, size = 'lg', ...props }, ref) => {
    return (
      <div ref={ref} className="relative">
        <ImageUpload shape="circle" size={size} showZoom={false} {...props} />
        {!props.value && fallback && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-lg font-medium text-muted-foreground">{fallback}</span>
          </div>
        )}
      </div>
    )
  }
)
AvatarUpload.displayName = 'AvatarUpload'

// ============================================
// Cover Upload - For banners/headers
// ============================================

interface CoverUploadProps extends Omit<ImageUploadProps, 'shape' | 'size'> {
  // Height
  height?: 'sm' | 'md' | 'lg'
}

const heightConfig = {
  sm: 'h-32',
  md: 'h-48',
  lg: 'h-64',
}

const CoverUpload = React.forwardRef<HTMLDivElement, CoverUploadProps>(
  ({ height = 'md', className, ...props }, ref) => {
    return (
      <ImageUpload
        ref={ref}
        shape="rectangle"
        className={cn('w-full', heightConfig[height], className)}
        placeholder="Upload cover image"
        {...props}
      />
    )
  }
)
CoverUpload.displayName = 'CoverUpload'

// ============================================
// Multi Image Upload - Gallery style
// ============================================

interface MultiImageUploadProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Values
  value?: (string | File)[]
  // On change
  onChange?: (files: (string | File)[]) => void
  // Max images
  maxImages?: number
  // Max file size
  maxSize?: number
  // Disabled
  disabled?: boolean
}

const MultiImageUpload = React.forwardRef<HTMLDivElement, MultiImageUploadProps>(
  (
    {
      className,
      value = [],
      onChange,
      maxImages = 6,
      maxSize = 5 * 1024 * 1024,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [previews, setPreviews] = React.useState<string[]>([])

    // Generate previews
    React.useEffect(() => {
      const urls: string[] = []
      const objectUrls: string[] = []

      value.forEach((item) => {
        if (typeof item === 'string') {
          urls.push(item)
        } else {
          const url = URL.createObjectURL(item)
          urls.push(url)
          objectUrls.push(url)
        }
      })

      setPreviews(urls)

      return () => {
        objectUrls.forEach((url) => URL.revokeObjectURL(url))
      }
    }, [value])

    const onDrop = React.useCallback(
      (acceptedFiles: File[]) => {
        const remaining = maxImages - value.length
        const newFiles = acceptedFiles.slice(0, remaining)
        onChange?.([...value, ...newFiles])
      },
      [value, maxImages, onChange]
    )

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
      onDrop,
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      },
      maxSize,
      multiple: true,
      disabled: disabled || value.length >= maxImages,
    })

    const handleRemove = (index: number) => {
      const newValue = value.filter((_, i) => i !== index)
      onChange?.(newValue)
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        <div className="grid grid-cols-3 gap-2">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square group">
              <img
                src={preview}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>
            </div>
          ))}

          {value.length < maxImages && (
            <div
              {...getRootProps()}
              className={cn(
                'aspect-square rounded-lg border-2 border-dashed cursor-pointer transition-colors flex flex-col items-center justify-center',
                isDragActive && 'border-primary bg-primary/5',
                !isDragActive && 'border-muted-foreground/25 hover:border-primary/50',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <input {...getInputProps()} />
              <Upload className="h-6 w-6 text-muted-foreground mb-1" />
              <span className="text-xs text-muted-foreground">Add</span>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground">
          {value.length} / {maxImages} images
        </p>
      </div>
    )
  }
)
MultiImageUpload.displayName = 'MultiImageUpload'

export { ImageUpload, AvatarUpload, CoverUpload, MultiImageUpload }
