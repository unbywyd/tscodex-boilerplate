// PhoneInput - phone number with country code selector
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// Popular countries with codes
const countries = [
  { code: 'RU', dial: '+7', name: 'Russia', flag: '🇷🇺' },
  { code: 'US', dial: '+1', name: 'USA', flag: '🇺🇸' },
  { code: 'UA', dial: '+380', name: 'Ukraine', flag: '🇺🇦' },
  { code: 'BY', dial: '+375', name: 'Belarus', flag: '🇧🇾' },
  { code: 'KZ', dial: '+7', name: 'Kazakhstan', flag: '🇰🇿' },
  { code: 'GB', dial: '+44', name: 'UK', flag: '🇬🇧' },
  { code: 'DE', dial: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: 'FR', dial: '+33', name: 'France', flag: '🇫🇷' },
  { code: 'IT', dial: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', dial: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: 'PL', dial: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: 'TR', dial: '+90', name: 'Turkey', flag: '🇹🇷' },
  { code: 'CN', dial: '+86', name: 'China', flag: '🇨🇳' },
  { code: 'JP', dial: '+81', name: 'Japan', flag: '🇯🇵' },
  { code: 'KR', dial: '+82', name: 'South Korea', flag: '🇰🇷' },
  { code: 'IN', dial: '+91', name: 'India', flag: '🇮🇳' },
  { code: 'BR', dial: '+55', name: 'Brazil', flag: '🇧🇷' },
  { code: 'AE', dial: '+971', name: 'UAE', flag: '🇦🇪' },
  { code: 'IL', dial: '+972', name: 'Israel', flag: '🇮🇱' },
  { code: 'AU', dial: '+61', name: 'Australia', flag: '🇦🇺' },
]

interface PhoneInputProps {
  value?: string // Full number with dial code
  onChange?: (value: string | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  defaultCountry?: string // Country code like 'RU'
}

export function PhoneInput({
  value,
  onChange,
  label,
  placeholder = 'Phone number',
  error,
  required,
  disabled,
  className,
  defaultCountry = 'RU',
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState(
    countries.find((c) => c.code === defaultCountry) || countries[0]
  )
  const [phoneNumber, setPhoneNumber] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse value to country and number
  useEffect(() => {
    if (value) {
      const country = countries.find((c) => value.startsWith(c.dial))
      if (country) {
        setSelectedCountry(country)
        setPhoneNumber(value.slice(country.dial.length).replace(/\D/g, ''))
      }
    }
  }, [])

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

  const formatPhone = (num: string): string => {
    const digits = num.replace(/\D/g, '')
    // Format: XXX XXX XX XX
    if (digits.length <= 3) return digits
    if (digits.length <= 6) return `${digits.slice(0, 3)} ${digits.slice(3)}`
    if (digits.length <= 8) return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
    return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 8)} ${digits.slice(8, 10)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 10)
    setPhoneNumber(raw)

    if (raw) {
      onChange?.(`${selectedCountry.dial}${raw}`)
    } else {
      onChange?.(undefined)
    }
  }

  const handleCountrySelect = (country: typeof countries[0]) => {
    setSelectedCountry(country)
    setIsOpen(false)
    if (phoneNumber) {
      onChange?.(`${country.dial}${phoneNumber}`)
    }
  }

  const handleClear = () => {
    setPhoneNumber('')
    onChange?.(undefined)
  }

  return (
    <div className="space-y-1.5" ref={containerRef}>
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className="relative flex">
        {/* Country selector */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={cn(
            'flex items-center gap-1 h-10 px-2 border border-r-0 rounded-l-md bg-muted/50',
            'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
            'disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-destructive'
          )}
        >
          <span className="text-lg">{selectedCountry.flag}</span>
          <span className="text-sm text-muted-foreground">{selectedCountry.dial}</span>
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </button>

        {/* Phone input */}
        <div className="relative flex-1">
          <input
            type="tel"
            value={formatPhone(phoneNumber)}
            onChange={handlePhoneChange}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm pr-8',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          />
          {phoneNumber && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Country dropdown */}
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-background border rounded-lg shadow-lg">
            {countries.map((country) => (
              <button
                key={country.code}
                type="button"
                onClick={() => handleCountrySelect(country)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left',
                  selectedCountry.code === country.code && 'bg-muted'
                )}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="flex-1">{country.name}</span>
                <span className="text-muted-foreground">{country.dial}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
