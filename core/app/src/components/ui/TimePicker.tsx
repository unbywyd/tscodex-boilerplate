// TimePicker - time selection with scroll wheels
import { useState, useRef, useEffect } from 'react'
import { Clock, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TimePickerProps {
  value?: string // HH:mm format
  onChange?: (time: string | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  minuteStep?: number // 1, 5, 10, 15, 30
  format24h?: boolean
}

export function TimePicker({
  value,
  onChange,
  label,
  placeholder = 'Select time',
  error,
  required,
  disabled,
  className,
  minuteStep = 5,
  format24h = true,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(value || '')
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse value
  const [selectedHour, selectedMinute] = (value || '').split(':').map(Number)

  useEffect(() => {
    setInputValue(value || '')
  }, [value])

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const hours = Array.from({ length: format24h ? 24 : 12 }, (_, i) => format24h ? i : i + 1)
  const minutes = Array.from({ length: 60 / minuteStep }, (_, i) => i * minuteStep)

  const handleTimeSelect = (hour: number, minute: number) => {
    const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    onChange?.(time)
    setInputValue(time)
    setIsOpen(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    // Validate HH:mm format
    if (/^\d{2}:\d{2}$/.test(val)) {
      const [h, m] = val.split(':').map(Number)
      if (h >= 0 && h < 24 && m >= 0 && m < 60) {
        onChange?.(val)
      }
    }
  }

  const handleClear = () => {
    onChange?.(undefined)
    setInputValue('')
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pr-20',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive focus-visible:ring-destructive',
            className
          )}
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            className="p-1 hover:bg-muted rounded"
            disabled={disabled}
          >
            <Clock className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-background border rounded-lg shadow-lg p-2">
            <div className="flex gap-2">
              {/* Hours */}
              <div className="h-48 w-16 overflow-y-auto scrollbar-thin">
                <div className="text-xs text-muted-foreground text-center mb-1">Hour</div>
                {hours.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleTimeSelect(hour, selectedMinute || 0)}
                    className={cn(
                      'w-full py-1.5 text-sm rounded hover:bg-muted',
                      selectedHour === hour && 'bg-primary text-primary-foreground hover:bg-primary'
                    )}
                  >
                    {hour.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>

              {/* Minutes */}
              <div className="h-48 w-16 overflow-y-auto scrollbar-thin">
                <div className="text-xs text-muted-foreground text-center mb-1">Min</div>
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => handleTimeSelect(selectedHour || 0, minute)}
                    className={cn(
                      'w-full py-1.5 text-sm rounded hover:bg-muted',
                      selectedMinute === minute && 'bg-primary text-primary-foreground hover:bg-primary'
                    )}
                  >
                    {minute.toString().padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick select */}
            <div className="flex gap-1 mt-2 pt-2 border-t">
              {['09:00', '12:00', '15:00', '18:00'].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => {
                    onChange?.(time)
                    setInputValue(time)
                    setIsOpen(false)
                  }}
                  className="flex-1 py-1 text-xs bg-muted rounded hover:bg-muted/80"
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
