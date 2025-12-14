// CardSlider - Swipeable card carousel for mobile
import * as React from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { cn } from '@/lib/utils'

interface CardSliderProps extends React.HTMLAttributes<HTMLDivElement> {
  // How many cards to show at once (can be fractional like 1.2 for peek effect)
  slidesToShow?: number | { mobile: number; tablet?: number; desktop?: number }
  // Gap between cards
  gap?: 'sm' | 'md' | 'lg'
  // Padding on sides (for peek effect)
  padding?: 'none' | 'sm' | 'md'
  // Show dots indicator
  showDots?: boolean
  // Enable loop
  loop?: boolean
  // Snap to card
  snap?: boolean
  // Free scroll (no snap)
  freeScroll?: boolean
}

const CardSlider = React.forwardRef<HTMLDivElement, CardSliderProps>(
  (
    {
      className,
      slidesToShow = 1.15,
      gap = 'md',
      padding = 'md',
      showDots = false,
      loop = false,
      snap = true,
      freeScroll = false,
      children,
      ...props
    },
    ref
  ) => {
    // Calculate slides to show based on prop
    const getSlidesToShow = () => {
      if (typeof slidesToShow === 'number') return slidesToShow
      // Could add responsive logic here with window.innerWidth
      return slidesToShow.mobile
    }

    const slideSize = 100 / getSlidesToShow()

    const [emblaRef, emblaApi] = useEmblaCarousel({
      loop,
      align: 'start',
      containScroll: freeScroll ? false : 'trimSnaps',
      dragFree: freeScroll,
      skipSnaps: !snap,
    })

    const [selectedIndex, setSelectedIndex] = React.useState(0)
    const [scrollSnaps, setScrollSnaps] = React.useState<number[]>([])

    React.useEffect(() => {
      if (!emblaApi) return

      const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
      setScrollSnaps(emblaApi.scrollSnapList())
      emblaApi.on('select', onSelect)
      onSelect()

      return () => {
        emblaApi.off('select', onSelect)
      }
    }, [emblaApi])

    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-3',
      lg: 'gap-4',
    }

    const paddingClasses = {
      none: '',
      sm: 'px-2',
      md: 'px-4',
    }

    // Calculate negative margin to offset padding for edge-to-edge scroll feel
    const marginClasses = {
      none: '',
      sm: '-mx-2',
      md: '-mx-4',
    }

    return (
      <div ref={ref} className={cn('relative', className)} {...props}>
        <div className={cn(marginClasses[padding])}>
          {/* overflow-visible on outer, clip on x-axis only to preserve shadows */}
          <div ref={emblaRef} className="overflow-x-clip overflow-y-visible">
            <div className={cn('flex py-2', gapClasses[gap], paddingClasses[padding])}>
              {React.Children.map(children, (child, index) => (
                <div
                  key={index}
                  className="flex-shrink-0"
                  style={{ width: `${slideSize}%` }}
                >
                  {child}
                </div>
              ))}
            </div>
          </div>
        </div>

        {showDots && scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-4">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                className={cn(
                  'w-2 h-2 rounded-full transition-all',
                  index === selectedIndex
                    ? 'bg-primary w-6'
                    : 'bg-muted-foreground/30'
                )}
              />
            ))}
          </div>
        )}
      </div>
    )
  }
)
CardSlider.displayName = 'CardSlider'

// Preset: Product slider (1.2 cards visible with peek)
interface ProductSliderProps extends Omit<CardSliderProps, 'slidesToShow'> {
  children: React.ReactNode
}

const ProductSlider = ({ children, ...props }: ProductSliderProps) => (
  <CardSlider slidesToShow={2.2} gap="md" padding="md" {...props}>
    {children}
  </CardSlider>
)

// Preset: Story slider (many small items)
const StorySlider = ({ children, ...props }: ProductSliderProps) => (
  <CardSlider slidesToShow={4.5} gap="sm" padding="md" freeScroll {...props}>
    {children}
  </CardSlider>
)

// Preset: Feature/Banner slider (full width with peek)
const BannerSlider = ({ children, showDots = true, ...props }: ProductSliderProps) => (
  <CardSlider slidesToShow={1.1} gap="md" padding="md" showDots={showDots} {...props}>
    {children}
  </CardSlider>
)

export { CardSlider, ProductSlider, StorySlider, BannerSlider }
