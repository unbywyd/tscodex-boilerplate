// CurrencyInput - money input with currency selector and formatting
import { useState, useRef, useEffect } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const currencies = [
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'UAH', symbol: '₴', name: 'Ukrainian Hryvnia', locale: 'uk-UA' },
  { code: 'KZT', symbol: '₸', name: 'Kazakhstani Tenge', locale: 'kk-KZ' },
  { code: 'BYN', symbol: 'Br', name: 'Belarusian Ruble', locale: 'be-BY' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'hi-IN' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
]

interface CurrencyValue {
  amount: number
  currency: string
}

interface CurrencyInputProps {
  value?: CurrencyValue | number
  onChange?: (value: CurrencyValue | undefined) => void
  label?: string
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  defaultCurrency?: string
  showCurrencySelector?: boolean
  min?: number
  max?: number
}

export function CurrencyInput({
  value,
  onChange,
  label,
  placeholder = '0.00',
  error,
  required,
  disabled,
  className,
  defaultCurrency = 'RUB',
  showCurrencySelector = true,
  min,
  max,
}: CurrencyInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState(
    currencies.find((c) => c.code === defaultCurrency) || currencies[0]
  )
  const [inputValue, setInputValue] = useState('')
  const containerRef = useRef<HTMLDivElement>(null)

  // Parse initial value
  useEffect(() => {
    if (value) {
      const amount = typeof value === 'number' ? value : value.amount
      const currency = typeof value === 'object' ? value.currency : defaultCurrency
      setInputValue(formatNumber(amount))
      const curr = currencies.find((c) => c.code === currency)
      if (curr) setSelectedCurrency(curr)
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

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(selectedCurrency.locale, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num)
  }

  const parseNumber = (str: string): number => {
    // Remove all non-numeric chars except decimal separators
    const cleaned = str.replace(/[^\d.,]/g, '').replace(',', '.')
    return parseFloat(cleaned) || 0
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputValue(raw)

    const amount = parseNumber(raw)

    if (amount > 0) {
      // Check bounds
      let finalAmount = amount
      if (min !== undefined && amount < min) finalAmount = min
      if (max !== undefined && amount > max) finalAmount = max

      onChange?.({
        amount: finalAmount,
        currency: selectedCurrency.code,
      })
    } else {
      onChange?.(undefined)
    }
  }

  const handleBlur = () => {
    const amount = parseNumber(inputValue)
    if (amount > 0) {
      setInputValue(formatNumber(amount))
    }
  }

  const handleFocus = () => {
    const amount = parseNumber(inputValue)
    if (amount > 0) {
      setInputValue(amount.toString())
    }
  }

  const handleCurrencySelect = (currency: typeof currencies[0]) => {
    setSelectedCurrency(currency)
    setIsOpen(false)
    const amount = parseNumber(inputValue)
    if (amount > 0) {
      onChange?.({
        amount,
        currency: currency.code,
      })
    }
  }

  const handleClear = () => {
    setInputValue('')
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
        {/* Currency selector */}
        {showCurrencySelector ? (
          <button
            type="button"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            className={cn(
              'flex items-center gap-1 h-10 px-2 border border-r-0 rounded-l-md bg-muted/50 min-w-[70px]',
              'hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive'
            )}
          >
            <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </button>
        ) : (
          <div
            className={cn(
              'flex items-center justify-center h-10 px-3 border border-r-0 rounded-l-md bg-muted/50',
              error && 'border-destructive'
            )}
          >
            <span className="text-sm font-medium">{selectedCurrency.symbol}</span>
          </div>
        )}

        {/* Amount input */}
        <div className="relative flex-1">
          <input
            type="text"
            inputMode="decimal"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-r-md border border-input bg-background px-3 py-2 text-sm pr-8 text-right',
              'placeholder:text-muted-foreground',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              'disabled:cursor-not-allowed disabled:opacity-50',
              error && 'border-destructive focus-visible:ring-destructive',
              className
            )}
          />
          {inputValue && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Currency dropdown */}
        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-1 w-56 max-h-60 overflow-y-auto bg-background border rounded-lg shadow-lg">
            {currencies.map((currency) => (
              <button
                key={currency.code}
                type="button"
                onClick={() => handleCurrencySelect(currency)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted text-left',
                  selectedCurrency.code === currency.code && 'bg-muted'
                )}
              >
                <span className="w-6 text-center font-medium">{currency.symbol}</span>
                <span className="flex-1">{currency.name}</span>
                <span className="text-muted-foreground text-xs">{currency.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
