// MobileFrame - Phone mockup container for mobile UI previews
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Wifi, Battery, Signal } from 'lucide-react'

interface MobileFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  // Device type
  device?: 'iphone' | 'android' | 'minimal'
  // Screen size preset
  size?: 'sm' | 'md' | 'lg'
  // Show status bar
  showStatusBar?: boolean
  // Show home indicator (iPhone style)
  showHomeIndicator?: boolean
  // Show notch (iPhone style)
  showNotch?: boolean
  // Custom time for status bar
  time?: string
  // Scale factor for responsive embedding
  scale?: number
  // Dark mode frame
  dark?: boolean
}

const MobileFrame = React.forwardRef<HTMLDivElement, MobileFrameProps>(
  (
    {
      className,
      device = 'iphone',
      size = 'md',
      showStatusBar = true,
      showHomeIndicator = true,
      showNotch = true,
      time,
      scale = 1,
      dark = false,
      children,
      ...props
    },
    ref
  ) => {
    // Size presets (width x height in pixels)
    const sizePresets = {
      sm: { width: 320, height: 568 },   // iPhone SE
      md: { width: 375, height: 812 },   // iPhone X/11/12
      lg: { width: 428, height: 926 },   // iPhone 12 Pro Max
    }

    const { width, height } = sizePresets[size]
    const currentTime = time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

    // Status bar component
    const StatusBar = () => (
      <div className={cn(
        'flex items-center justify-between px-6 py-1 text-xs font-medium',
        dark ? 'text-white' : 'text-black'
      )}>
        <span>{currentTime}</span>
        <div className="flex items-center gap-1">
          <Signal className="h-3 w-3" />
          <Wifi className="h-3 w-3" />
          <Battery className="h-4 w-4" />
        </div>
      </div>
    )

    // Notch component (iPhone style)
    const Notch = () => (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40%] h-7 bg-black rounded-b-2xl z-10" />
    )

    // Home indicator (iPhone style)
    const HomeIndicator = () => (
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-black/20 dark:bg-white/20 rounded-full" />
    )

    // Dynamic Island (newer iPhones)
    const DynamicIsland = () => (
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[30%] h-8 bg-black rounded-full z-10" />
    )

    return (
      <div
        ref={ref}
        className={cn('inline-block', className)}
        style={{ transform: scale !== 1 ? `scale(${scale})` : undefined, transformOrigin: 'top left' }}
        {...props}
      >
        {/* Phone frame */}
        <div
          className={cn(
            'relative rounded-[3rem] p-3 shadow-xl',
            dark ? 'bg-gray-900' : 'bg-gray-800',
            device === 'minimal' && 'rounded-[2rem] p-2'
          )}
          style={{ width: width + 24, height: height + 24 }}
        >
          {/* Side buttons (iPhone) */}
          {device === 'iphone' && (
            <>
              {/* Volume buttons */}
              <div className={cn(
                'absolute -left-1 top-28 w-1 h-8 rounded-l',
                dark ? 'bg-gray-700' : 'bg-gray-600'
              )} />
              <div className={cn(
                'absolute -left-1 top-40 w-1 h-12 rounded-l',
                dark ? 'bg-gray-700' : 'bg-gray-600'
              )} />
              <div className={cn(
                'absolute -left-1 top-56 w-1 h-12 rounded-l',
                dark ? 'bg-gray-700' : 'bg-gray-600'
              )} />
              {/* Power button */}
              <div className={cn(
                'absolute -right-1 top-36 w-1 h-16 rounded-r',
                dark ? 'bg-gray-700' : 'bg-gray-600'
              )} />
            </>
          )}

          {/* Screen */}
          <div
            className={cn(
              'relative overflow-hidden bg-white dark:bg-gray-950',
              device === 'iphone' && 'rounded-[2.5rem]',
              device === 'android' && 'rounded-[1.5rem]',
              device === 'minimal' && 'rounded-[1.5rem]'
            )}
            style={{ width, height }}
          >
            {/* Notch/Dynamic Island */}
            {device === 'iphone' && showNotch && (
              size === 'lg' ? <DynamicIsland /> : <Notch />
            )}

            {/* Status bar */}
            {showStatusBar && (
              <div className={cn(
                'relative z-20',
                device === 'iphone' && showNotch && 'pt-8'
              )}>
                <StatusBar />
              </div>
            )}

            {/* Content area */}
            <div className={cn(
              'h-full overflow-auto',
              showStatusBar && 'pt-0',
              showHomeIndicator && 'pb-6'
            )}>
              {children}
            </div>

            {/* Home indicator */}
            {device === 'iphone' && showHomeIndicator && <HomeIndicator />}
          </div>
        </div>
      </div>
    )
  }
)
MobileFrame.displayName = 'MobileFrame'

// Simplified version for quick previews
interface SimpleFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  width?: number
  height?: number
}

const SimpleFrame = ({ width = 375, height = 667, className, children, ...props }: SimpleFrameProps) => (
  <div
    className={cn(
      'relative overflow-hidden rounded-3xl border-8 border-gray-800 bg-white shadow-xl',
      className
    )}
    style={{ width, height }}
    {...props}
  >
    {children}
  </div>
)

// Browser frame for desktop previews
interface BrowserFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  url?: string
  title?: string
}

const BrowserFrame = ({ url = 'localhost:5173', title, className, children, ...props }: BrowserFrameProps) => (
  <div className={cn('rounded-lg border shadow-lg overflow-hidden bg-white', className)} {...props}>
    {/* Browser chrome */}
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border-b">
      {/* Traffic lights */}
      <div className="flex items-center gap-1.5">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
      </div>
      {/* URL bar */}
      <div className="flex-1 mx-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-white rounded-md border text-sm text-gray-500">
          <span className="text-gray-400">🔒</span>
          <span className="truncate">{url}</span>
        </div>
      </div>
    </div>
    {/* Content */}
    <div className="overflow-auto">
      {children}
    </div>
  </div>
)

export { MobileFrame, SimpleFrame, BrowserFrame }
