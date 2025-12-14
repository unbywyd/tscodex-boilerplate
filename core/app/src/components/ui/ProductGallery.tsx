// ProductGallery - Product image gallery with thumbnails and zoom
import * as React from 'react'
import { cn } from '@/lib/utils'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'
import { PageIndicator } from './PageIndicator'

// ============================================
// Types
// ============================================

interface ProductGalleryProps extends React.HTMLAttributes<HTMLDivElement> {
  // Images
  images: string[]
  // Alt texts
  alts?: string[]
  // Show thumbnails
  showThumbnails?: boolean
  // Show indicators
  showIndicators?: boolean
  // Enable zoom
  enableZoom?: boolean
  // Aspect ratio
  aspectRatio?: 'square' | '4:3' | '3:4' | '16:9'
  // Initial index
  initialIndex?: number
  // On image change
  onImageChange?: (index: number) => void
}

// ============================================
// Aspect Ratio Config
// ============================================

const aspectConfig = {
  square: 'aspect-square',
  '4:3': 'aspect-[4/3]',
  '3:4': 'aspect-[3/4]',
  '16:9': 'aspect-video',
}

// ============================================
// ProductGallery Component
// ============================================

const ProductGallery = React.forwardRef<HTMLDivElement, ProductGalleryProps>(
  (
    {
      images,
      alts = [],
      showThumbnails = true,
      showIndicators = true,
      enableZoom = true,
      aspectRatio = 'square',
      initialIndex = 0,
      onImageChange,
      className,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex)
    const [isZoomed, setIsZoomed] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Touch handling for swipe
    const touchStart = React.useRef(0)
    const touchEnd = React.useRef(0)

    const handleTouchStart = (e: React.TouchEvent) => {
      touchStart.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: React.TouchEvent) => {
      touchEnd.current = e.touches[0].clientX
    }

    const handleTouchEnd = () => {
      const diff = touchStart.current - touchEnd.current
      const threshold = 50

      if (Math.abs(diff) > threshold) {
        if (diff > 0 && currentIndex < images.length - 1) {
          // Swipe left - next
          goTo(currentIndex + 1)
        } else if (diff < 0 && currentIndex > 0) {
          // Swipe right - prev
          goTo(currentIndex - 1)
        }
      }
    }

    const goTo = (index: number) => {
      setCurrentIndex(index)
      onImageChange?.(index)
    }

    const prev = () => {
      if (currentIndex > 0) goTo(currentIndex - 1)
    }

    const next = () => {
      if (currentIndex < images.length - 1) goTo(currentIndex + 1)
    }

    if (images.length === 0) {
      return (
        <div
          ref={ref}
          className={cn(
            'bg-muted flex items-center justify-center',
            aspectConfig[aspectRatio],
            className
          )}
        >
          <span className="text-muted-foreground">No images</span>
        </div>
      )
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {/* Main image */}
        <div
          ref={containerRef}
          className={cn(
            'relative overflow-hidden bg-muted rounded-lg',
            aspectConfig[aspectRatio]
          )}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Image slider */}
          <div
            className="absolute inset-0 flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((src, i) => (
              <div key={i} className="w-full h-full flex-shrink-0">
                <img
                  src={src}
                  alt={alts[i] || `Image ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Navigation arrows (desktop) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                disabled={currentIndex === 0}
                className={cn(
                  'absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-sm',
                  'hover:bg-white transition-colors hidden sm:flex',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={next}
                disabled={currentIndex === images.length - 1}
                className={cn(
                  'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 shadow-sm',
                  'hover:bg-white transition-colors hidden sm:flex',
                  'disabled:opacity-50 disabled:cursor-not-allowed'
                )}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Zoom button */}
          {enableZoom && (
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute top-2 right-2 p-2 rounded-full bg-white/80 shadow-sm hover:bg-white transition-colors"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          )}

          {/* Page indicators */}
          {showIndicators && images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <PageIndicator
                total={images.length}
                current={currentIndex}
                size="sm"
                color="white"
              />
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={cn(
                  'flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all',
                  currentIndex === i
                    ? 'border-primary'
                    : 'border-transparent hover:border-muted-foreground/50'
                )}
              >
                <img
                  src={src}
                  alt={alts[i] || `Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Zoom modal */}
        {isZoomed && (
          <ZoomModal
            images={images}
            alts={alts}
            currentIndex={currentIndex}
            onClose={() => setIsZoomed(false)}
            onIndexChange={goTo}
          />
        )}
      </div>
    )
  }
)
ProductGallery.displayName = 'ProductGallery'

// ============================================
// Zoom Modal
// ============================================

interface ZoomModalProps {
  images: string[]
  alts: string[]
  currentIndex: number
  onClose: () => void
  onIndexChange: (index: number) => void
}

const ZoomModal = ({ images, alts, currentIndex, onClose, onIndexChange }: ZoomModalProps) => {
  const [scale, setScale] = React.useState(1)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })

  const handleDoubleTap = () => {
    if (scale === 1) {
      setScale(2)
    } else {
      setScale(1)
      setPosition({ x: 0, y: 0 })
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <span className="text-sm">
          {currentIndex + 1} / {images.length}
        </span>
        <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10">
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Image */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden"
        onDoubleClick={handleDoubleTap}
      >
        <img
          src={images[currentIndex]}
          alt={alts[currentIndex] || `Image ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain transition-transform duration-200"
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          }}
        />
      </div>

      {/* Thumbnails */}
      <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide justify-center">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => {
              onIndexChange(i)
              setScale(1)
              setPosition({ x: 0, y: 0 })
            }}
            className={cn(
              'flex-shrink-0 w-12 h-12 rounded overflow-hidden border-2 transition-all',
              currentIndex === i ? 'border-white' : 'border-transparent opacity-60'
            )}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

// ============================================
// Simple Gallery - No thumbnails, just swipe
// ============================================

interface SimpleGalleryProps {
  images: string[]
  aspectRatio?: 'square' | '4:3' | '3:4' | '16:9'
  className?: string
}

const SimpleGallery = ({ images, aspectRatio = 'square', className }: SimpleGalleryProps) => (
  <ProductGallery
    images={images}
    showThumbnails={false}
    showIndicators={true}
    enableZoom={false}
    aspectRatio={aspectRatio}
    className={className}
  />
)

export { ProductGallery, SimpleGallery }
