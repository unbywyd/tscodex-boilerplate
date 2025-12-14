// DatePicker - calendar popup for date selection
import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Calendar, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import 'react-day-picker/style.css'

interface DatePickerProps {
  value?: Date | string
  onChange?: (date: Date | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  locale?: 'en' | 'ru'
  dateFormat?: string
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder = 'Select date',
  error,
  required,
  disabled,
  className,
  locale = 'en',
  dateFormat = 'dd.MM.yyyy',
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Convert value to Date
  const dateValue = value instanceof Date ? value : value ? new Date(value) : undefined

  // Sync input with value
  useEffect(() => {
    if (dateValue && isValid(dateValue)) {
      setInputValue(format(dateValue, dateFormat))
    } else {
      setInputValue('')
    }
  }, [dateValue, dateFormat])

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    // Try to parse date
    const parsed = parse(val, dateFormat, new Date())
    if (isValid(parsed) && val.length === dateFormat.length) {
      onChange?.(parsed)
    }
  }

  const handleDaySelect = (date: Date | undefined) => {
    onChange?.(date)
    if (date) {
      setInputValue(format(date, dateFormat))
    }
    setIsOpen(false)
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
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 bg-background border rounded-lg shadow-lg p-3">
            <DayPicker
              mode="single"
              selected={dateValue}
              onSelect={handleDaySelect}
              locale={locale === 'ru' ? ru : undefined}
              showOutsideDays
              className="rdp-custom"
            />
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <style>{`
        .rdp-custom {
          --rdp-cell-size: 36px;
          --rdp-accent-color: hsl(var(--primary));
          --rdp-background-color: hsl(var(--primary) / 0.1);
        }
        .rdp-custom .rdp-day_selected {
          background-color: var(--rdp-accent-color);
          color: white;
        }
        .rdp-custom .rdp-day:hover:not(.rdp-day_selected) {
          background-color: hsl(var(--muted));
        }
      `}</style>
    </div>
  )
}
