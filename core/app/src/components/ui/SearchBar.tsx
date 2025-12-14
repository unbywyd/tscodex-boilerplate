// SearchBar - Mobile search bar with iOS-style cancel button
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Search, X, Mic, SlidersHorizontal } from 'lucide-react'

// ============================================
// Types
// ============================================

interface SearchBarProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'onSubmit'> {
  // Value
  value: string
  // On change
  onChange: (value: string) => void
  // On submit
  onSubmit?: (value: string) => void
  // On cancel
  onCancel?: () => void
  // Show cancel button when focused
  showCancel?: boolean
  // Cancel text
  cancelText?: string
  // Show voice search button
  showVoice?: boolean
  // On voice click
  onVoice?: () => void
  // Show filter button
  showFilter?: boolean
  // On filter click
  onFilter?: () => void
  // Filter active
  filterActive?: boolean
  // Auto focus
  autoFocus?: boolean
}

// ============================================
// SearchBar Component
// ============================================

const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onCancel,
      showCancel = true,
      cancelText = 'Cancel',
      showVoice = false,
      onVoice,
      showFilter = false,
      onFilter,
      filterActive = false,
      autoFocus = false,
      placeholder = 'Search',
      className,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(autoFocus)
    const inputRef = React.useRef<HTMLInputElement>(null)
    const combinedRef = (node: HTMLInputElement) => {
      inputRef.current = node
      if (typeof ref === 'function') ref(node)
      else if (ref) ref.current = node
    }

    const handleFocus = () => setIsFocused(true)

    const handleBlur = () => {
      // Delay to allow cancel button click
      setTimeout(() => {
        if (!value) setIsFocused(false)
      }, 100)
    }

    const handleCancel = () => {
      onChange('')
      setIsFocused(false)
      inputRef.current?.blur()
      onCancel?.()
    }

    const handleClear = () => {
      onChange('')
      inputRef.current?.focus()
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit?.(value)
      inputRef.current?.blur()
    }

    const showCancelButton = showCancel && isFocused

    return (
      <form
        onSubmit={handleSubmit}
        className={cn('flex items-center gap-2', className)}
      >
        {/* Search input container */}
        <div
          className={cn(
            'flex-1 flex items-center gap-2 h-10 px-3 bg-muted rounded-lg transition-all',
            isFocused && 'bg-muted/80'
          )}
        >
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />

          <input
            ref={combinedRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            autoFocus={autoFocus}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            {...props}
          />

          {/* Clear button */}
          {value && (
            <button
              type="button"
              onClick={handleClear}
              className="p-1 rounded-full bg-muted-foreground/20 hover:bg-muted-foreground/30"
            >
              <X className="h-3 w-3 text-muted-foreground" />
            </button>
          )}

          {/* Voice button */}
          {showVoice && !value && (
            <button
              type="button"
              onClick={onVoice}
              className="text-muted-foreground hover:text-foreground"
            >
              <Mic className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter button */}
        {showFilter && !showCancelButton && (
          <button
            type="button"
            onClick={onFilter}
            className={cn(
              'h-10 w-10 flex items-center justify-center rounded-lg transition-colors',
              filterActive
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </button>
        )}

        {/* Cancel button */}
        {showCancelButton && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-primary text-sm font-medium animate-in slide-in-from-right-2"
          >
            {cancelText}
          </button>
        )}
      </form>
    )
  }
)
SearchBar.displayName = 'SearchBar'

// ============================================
// Search Header - Full-width header with search
// ============================================

interface SearchHeaderProps extends SearchBarProps {
  title?: string
  onBack?: () => void
}

const SearchHeader = React.forwardRef<HTMLInputElement, SearchHeaderProps>(
  ({ title, onBack, className, ...props }, ref) => {
    const [isSearching, setIsSearching] = React.useState(false)

    if (isSearching) {
      return (
        <div className={cn('px-4 py-2 bg-background border-b', className)}>
          <SearchBar
            ref={ref}
            autoFocus
            onCancel={() => setIsSearching(false)}
            {...props}
          />
        </div>
      )
    }

    return (
      <div className={cn('flex items-center justify-between px-4 py-2 bg-background border-b', className)}>
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2">
            <X className="h-5 w-5" />
          </button>
        )}
        <h1 className="font-semibold">{title}</h1>
        <button
          onClick={() => setIsSearching(true)}
          className="p-2 -mr-2"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>
    )
  }
)
SearchHeader.displayName = 'SearchHeader'

// ============================================
// Search Suggestions
// ============================================

interface SearchSuggestionsProps {
  suggestions: string[]
  onSelect: (value: string) => void
  recentSearches?: string[]
  onClearRecent?: () => void
  className?: string
}

const SearchSuggestions = ({
  suggestions,
  onSelect,
  recentSearches,
  onClearRecent,
  className,
}: SearchSuggestionsProps) => (
  <div className={cn('py-2', className)}>
    {/* Recent searches */}
    {recentSearches && recentSearches.length > 0 && (
      <div className="mb-4">
        <div className="flex items-center justify-between px-4 mb-2">
          <span className="text-xs font-medium text-muted-foreground uppercase">Recent</span>
          {onClearRecent && (
            <button
              onClick={onClearRecent}
              className="text-xs text-primary"
            >
              Clear
            </button>
          )}
        </div>
        {recentSearches.map((search, i) => (
          <button
            key={i}
            onClick={() => onSelect(search)}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{search}</span>
          </button>
        ))}
      </div>
    )}

    {/* Suggestions */}
    {suggestions.length > 0 && (
      <div>
        <span className="text-xs font-medium text-muted-foreground uppercase px-4 mb-2 block">
          Suggestions
        </span>
        {suggestions.map((suggestion, i) => (
          <button
            key={i}
            onClick={() => onSelect(suggestion)}
            className="w-full flex items-center gap-3 px-4 py-2 hover:bg-muted text-left"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{suggestion}</span>
          </button>
        ))}
      </div>
    )}
  </div>
)

export { SearchBar, SearchHeader, SearchSuggestions }
