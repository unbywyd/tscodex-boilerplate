// ColorPicker - Color selection component
// Built on react-colorful
import * as React from 'react'
import { HexColorPicker, HexColorInput } from 'react-colorful'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from './Popover'
import { Check, Copy } from 'lucide-react'
import { Button } from './Button'

// ============================================
// Color Picker (Popover)
// ============================================

interface ColorPickerProps {
  // Value (hex color)
  value?: string
  // On change
  onChange?: (color: string) => void
  // Preset colors
  presets?: string[]
  // Show input
  showInput?: boolean
  // Disabled
  disabled?: boolean
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Class name
  className?: string
}

const defaultPresets = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9',
  '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef',
  '#ec4899', '#f43f5e', '#000000', '#6b7280', '#ffffff',
]

const sizeConfig = {
  sm: { swatch: 'w-6 h-6', picker: 'w-48' },
  md: { swatch: 'w-8 h-8', picker: 'w-56' },
  lg: { swatch: 'w-10 h-10', picker: 'w-64' },
}

const ColorPicker = React.forwardRef<HTMLDivElement, ColorPickerProps>(
  (
    {
      value = '#3b82f6',
      onChange,
      presets = defaultPresets,
      showInput = true,
      disabled = false,
      size = 'md',
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const config = sizeConfig[size]

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            disabled={disabled}
            className={cn(
              'rounded-md border-2 border-input ring-offset-background transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-50',
              config.swatch,
              className
            )}
            style={{ backgroundColor: value }}
          />
        </PopoverTrigger>
        <PopoverContent className={cn('p-3', config.picker)}>
          <div className="space-y-3">
            {/* Color picker */}
            <HexColorPicker
              color={value}
              onChange={onChange}
              className="!w-full"
            />

            {/* Hex input */}
            {showInput && (
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                    #
                  </span>
                  <HexColorInput
                    color={value}
                    onChange={onChange}
                    className="w-full h-8 pl-6 pr-2 rounded-md border border-input bg-background text-sm uppercase"
                    prefixed={false}
                  />
                </div>
                <CopyButton value={value} />
              </div>
            )}

            {/* Presets */}
            {presets.length > 0 && (
              <div className="space-y-1.5">
                <p className="text-xs text-muted-foreground">Presets</p>
                <div className="grid grid-cols-10 gap-1">
                  {presets.map((color) => (
                    <button
                      key={color}
                      onClick={() => onChange?.(color)}
                      className={cn(
                        'w-5 h-5 rounded-sm border transition-transform hover:scale-110',
                        value.toLowerCase() === color.toLowerCase() && 'ring-2 ring-primary ring-offset-1'
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    )
  }
)
ColorPicker.displayName = 'ColorPicker'

// ============================================
// Color Input - Inline picker with text input
// ============================================

interface ColorInputProps {
  value?: string
  onChange?: (color: string) => void
  presets?: string[]
  disabled?: boolean
  className?: string
  placeholder?: string
}

const ColorInput = React.forwardRef<HTMLDivElement, ColorInputProps>(
  (
    {
      value = '#3b82f6',
      onChange,
      presets = defaultPresets.slice(0, 10),
      disabled = false,
      className,
      placeholder = 'Select color',
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('space-y-2', className)}>
        <div className="flex items-center gap-2">
          <ColorPicker
            value={value}
            onChange={onChange}
            presets={presets}
            disabled={disabled}
            size="md"
          />
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              #
            </span>
            <input
              type="text"
              value={value.replace('#', '')}
              onChange={(e) => onChange?.(`#${e.target.value}`)}
              disabled={disabled}
              placeholder={placeholder}
              className={cn(
                'w-full h-9 pl-7 pr-3 rounded-md border border-input bg-background text-sm uppercase',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                'disabled:cursor-not-allowed disabled:opacity-50'
              )}
              maxLength={6}
            />
          </div>
        </div>
      </div>
    )
  }
)
ColorInput.displayName = 'ColorInput'

// ============================================
// Color Swatch List - Simple preset selector
// ============================================

interface ColorSwatchProps {
  value?: string
  onChange?: (color: string) => void
  colors?: string[]
  columns?: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const swatchSizeConfig = {
  sm: 'w-6 h-6',
  md: 'w-8 h-8',
  lg: 'w-10 h-10',
}

const ColorSwatch = React.forwardRef<HTMLDivElement, ColorSwatchProps>(
  (
    {
      value,
      onChange,
      colors = defaultPresets,
      columns = 5,
      size = 'md',
      className,
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('grid gap-2', className)}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {colors.map((color) => (
          <button
            key={color}
            onClick={() => onChange?.(color)}
            className={cn(
              'rounded-md border-2 transition-all hover:scale-105',
              swatchSizeConfig[size],
              value?.toLowerCase() === color.toLowerCase()
                ? 'border-primary ring-2 ring-primary/30'
                : 'border-transparent hover:border-muted-foreground/30'
            )}
            style={{ backgroundColor: color }}
          >
            {value?.toLowerCase() === color.toLowerCase() && (
              <Check className={cn(
                'w-full h-full p-1',
                isLightColor(color) ? 'text-black' : 'text-white'
              )} />
            )}
          </button>
        ))}
      </div>
    )
  }
)
ColorSwatch.displayName = 'ColorSwatch'

// ============================================
// Gradient Picker
// ============================================

interface GradientPickerProps {
  value?: { from: string; to: string; direction?: string }
  onChange?: (gradient: { from: string; to: string; direction: string }) => void
  className?: string
}

const directions = [
  { value: 'to right', label: '→' },
  { value: 'to bottom', label: '↓' },
  { value: 'to bottom right', label: '↘' },
  { value: 'to bottom left', label: '↙' },
]

const GradientPicker = React.forwardRef<HTMLDivElement, GradientPickerProps>(
  (
    {
      value = { from: '#3b82f6', to: '#8b5cf6', direction: 'to right' },
      onChange,
      className,
    },
    ref
  ) => {
    const handleChange = (key: 'from' | 'to' | 'direction', val: string) => {
      onChange?.({ from: value.from, to: value.to, direction: value.direction || 'to right', [key]: val })
    }

    const gradientStyle = {
      background: `linear-gradient(${value.direction || 'to right'}, ${value.from}, ${value.to})`,
    }

    return (
      <div ref={ref} className={cn('space-y-3', className)}>
        {/* Preview */}
        <div
          className="h-16 rounded-lg border"
          style={gradientStyle}
        />

        {/* Controls */}
        <div className="flex items-center gap-3">
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">From</p>
            <ColorPicker
              value={value.from}
              onChange={(c) => handleChange('from', c)}
              size="sm"
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">To</p>
            <ColorPicker
              value={value.to}
              onChange={(c) => handleChange('to', c)}
              size="sm"
            />
          </div>
          <div className="flex-1 space-y-1">
            <p className="text-xs text-muted-foreground">Direction</p>
            <div className="flex gap-1">
              {directions.map((dir) => (
                <button
                  key={dir.value}
                  onClick={() => handleChange('direction', dir.value)}
                  className={cn(
                    'w-7 h-7 rounded border text-sm font-medium transition-colors',
                    value.direction === dir.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted border-input'
                  )}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }
)
GradientPicker.displayName = 'GradientPicker'

// ============================================
// Helpers
// ============================================

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = React.useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8 shrink-0"
      onClick={handleCopy}
    >
      {copied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </Button>
  )
}

function isLightColor(hex: string): boolean {
  const color = hex.replace('#', '')
  const r = parseInt(color.substr(0, 2), 16)
  const g = parseInt(color.substr(2, 2), 16)
  const b = parseInt(color.substr(4, 2), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5
}

export { ColorPicker, ColorInput, ColorSwatch, GradientPicker, defaultPresets }
