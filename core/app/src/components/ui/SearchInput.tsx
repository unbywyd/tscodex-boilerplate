// SearchInput - Input with search icon and clear button
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Search, X, Loader2 } from 'lucide-react'

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  // Value (controlled)
  value?: string
  // Change handler
  onChange?: (value: string) => void
  // Loading state
  loading?: boolean
  // Show clear button
  clearable?: boolean
  // Debounce delay in ms
  debounce?: number
  // Size variant
  inputSize?: 'sm' | 'md' | 'lg'
  // Full width
  fullWidth?: boolean
  // On submit (Enter key)
  onSubmit?: (value: string) => void
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  (
    {
      className,
      value: controlledValue,
      onChange,
      loading = false,
      clearable = true,
      debounce = 0,
      inputSize = 'md',
      fullWidth = false,
      onSubmit,
      placeholder = 'Search...',
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(controlledValue || '')
    const value = controlledValue !== undefined ? controlledValue : internalValue
    const debounceTimeout = React.useRef<NodeJS.Timeout>(null)

    const sizeClasses = {
      sm: {
        input: 'h-8 text-sm pl-8 pr-8',
        icon: 'h-3.5 w-3.5 left-2.5',
        clear: 'h-3.5 w-3.5 right-2.5',
      },
      md: {
        input: 'h-10 pl-10 pr-10',
        icon: 'h-4 w-4 left-3',
        clear: 'h-4 w-4 right-3',
      },
      lg: {
        input: 'h-12 text-lg pl-12 pr-12',
        icon: 'h-5 w-5 left-4',
        clear: 'h-5 w-5 right-4',
      },
    }

    const sizes = sizeClasses[inputSize]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInternalValue(newValue)

      if (debounce > 0) {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
        debounceTimeout.current = setTimeout(() => {
          onChange?.(newValue)
        }, debounce)
      } else {
        onChange?.(newValue)
      }
    }

    const handleClear = () => {
      setInternalValue('')
      onChange?.('')
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSubmit) {
        e.preventDefault()
        onSubmit(value)
      }
      if (e.key === 'Escape') {
        handleClear()
      }
    }

    React.useEffect(() => {
      return () => {
        if (debounceTimeout.current) {
          clearTimeout(debounceTimeout.current)
        }
      }
    }, [])

    return (
      <div className={cn('relative', fullWidth && 'w-full', className)}>
        {/* Search icon */}
        <Search
          className={cn(
            'absolute top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none',
            sizes.icon
          )}
        />

        {/* Input */}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'w-full rounded-md border border-input bg-background ring-offset-background',
            'placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            sizes.input
          )}
          {...props}
        />

        {/* Loading or Clear button */}
        <div className={cn('absolute top-1/2 -translate-y-1/2', sizes.clear.split(' ').slice(2).join(' '))}>
          {loading ? (
            <Loader2 className={cn('animate-spin text-muted-foreground', sizes.clear.split(' ').slice(0, 2).join(' '))} />
          ) : clearable && value ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className={sizes.clear.split(' ').slice(0, 2).join(' ')} />
            </button>
          ) : null}
        </div>
      </div>
    )
  }
)
SearchInput.displayName = 'SearchInput'

export { SearchInput }
