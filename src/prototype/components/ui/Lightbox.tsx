// Lightbox - Fullscreen image viewer
import * as React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import * as VisuallyHidden from '@radix-ui/react-visually-hidden'
import { cn } from '@/lib/utils'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

interface LightboxProps {
  images: { src: string; alt?: string; caption?: string }[]
  initialIndex?: number
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode // trigger
}

const Lightbox = ({
  images,
  initialIndex = 0,
  open,
  onOpenChange,
  children,
}: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
  const [zoom, setZoom] = React.useState(1)

  // Reset on open
  React.useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
      setZoom(1)
    }
  }, [open, initialIndex])

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
    setZoom(1)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    setZoom(1)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') handlePrev()
    if (e.key === 'ArrowRight') handleNext()
    if (e.key === 'Escape') onOpenChange?.(false)
  }

  const toggleZoom = () => {
    setZoom((prev) => (prev === 1 ? 2 : 1))
  }

  const currentImage = images[currentIndex]

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children && (
        <DialogPrimitive.Trigger asChild>{children}</DialogPrimitive.Trigger>
      )}
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          className={cn(
            'fixed inset-0 z-50 bg-black/90',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0'
          )}
        />
        <DialogPrimitive.Content
          onKeyDown={handleKeyDown}
          className={cn(
            'fixed inset-0 z-50 flex flex-col items-center justify-center',
            'focus:outline-none'
          )}
        >
          {/* Hidden title for accessibility */}
          <VisuallyHidden.Root>
            <DialogPrimitive.Title>
              Image {currentIndex + 1} of {images.length}
            </DialogPrimitive.Title>
          </VisuallyHidden.Root>

          {/* Top bar */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 z-10">
            <span className="text-white/70 text-sm">
              {currentIndex + 1} / {images.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleZoom}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {zoom > 1 ? <ZoomOut className="h-5 w-5" /> : <ZoomIn className="h-5 w-5" />}
              </button>
              <DialogPrimitive.Close asChild>
                <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Main image area */}
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {/* Previous button */}
            {images.length > 1 && (
              <button
                onClick={handlePrev}
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image */}
            <div
              className={cn(
                'relative max-w-full max-h-full transition-transform duration-200',
                zoom > 1 && 'cursor-move'
              )}
              style={{ transform: `scale(${zoom})` }}
            >
              <img
                src={currentImage?.src}
                alt={currentImage?.alt || ''}
                className="max-w-full max-h-[80vh] object-contain"
                onClick={toggleZoom}
              />
            </div>

            {/* Next button */}
            {images.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Caption */}
          {currentImage?.caption && (
            <div className="absolute bottom-0 left-0 right-0 p-4 text-center">
              <p className="text-white/90 text-sm">{currentImage.caption}</p>
            </div>
          )}

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center gap-2 px-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index)
                    setZoom(1)
                  }}
                  className={cn(
                    'w-12 h-12 rounded overflow-hidden transition-all',
                    index === currentIndex
                      ? 'ring-2 ring-white opacity-100'
                      : 'opacity-50 hover:opacity-75'
                  )}
                >
                  <img
                    src={img.src}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

// Simple single image lightbox trigger
interface LightboxImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  caption?: string
}

const LightboxImage = ({ src, alt, caption, className, ...props }: LightboxImageProps) => {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={cn('cursor-pointer hover:opacity-90 transition-opacity', className)}
        onClick={() => setOpen(true)}
        {...props}
      />
      <Lightbox
        images={[{ src: src || '', alt, caption }]}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  )
}

export { Lightbox, LightboxImage }
