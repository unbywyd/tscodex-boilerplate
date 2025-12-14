// FilterChips - Horizontal scrollable filter chips
import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, ChevronDown, SlidersHorizontal } from 'lucide-react'

// ============================================
// Types
// ============================================

interface FilterOption {
  id: string
  label: string
  icon?: React.ReactNode
  count?: number
}

interface FilterChipsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  // Options
  options: FilterOption[]
  // Selected values
  selected: string[]
  // On selection change
  onChange: (selected: string[]) => void
  // Single or multi select
  multiple?: boolean
  // Show all option
  showAll?: boolean
  // All label
  allLabel?: string
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Variant
  variant?: 'default' | 'outline' | 'filled'
}

// ============================================
// Config
// ============================================

const sizeConfig = {
  sm: 'h-7 px-2.5 text-xs gap-1',
  md: 'h-8 px-3 text-sm gap-1.5',
  lg: 'h-10 px-4 text-sm gap-2',
}

// ============================================
// FilterChips Component
// ============================================

const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  (
    {
      options,
      selected,
      onChange,
      multiple = true,
      showAll = true,
      allLabel = 'All',
      size = 'md',
      variant = 'default',
      className,
      ...props
    },
    ref
  ) => {
    const isAllSelected = selected.length === 0

    const handleSelect = (id: string) => {
      if (multiple) {
        if (selected.includes(id)) {
          onChange(selected.filter((s) => s !== id))
        } else {
          onChange([...selected, id])
        }
      } else {
        onChange(selected.includes(id) ? [] : [id])
      }
    }

    const handleSelectAll = () => {
      onChange([])
    }

    const getChipClasses = (isSelected: boolean) => {
      const base = cn(
        'inline-flex items-center rounded-full font-medium transition-colors whitespace-nowrap flex-shrink-0',
        sizeConfig[size]
      )

      if (variant === 'outline') {
        return cn(
          base,
          'border',
          isSelected
            ? 'border-primary bg-primary/10 text-primary'
            : 'border-border bg-transparent text-muted-foreground hover:text-foreground'
        )
      }

      if (variant === 'filled') {
        return cn(
          base,
          isSelected
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground hover:text-foreground'
        )
      }

      // Default
      return cn(
        base,
        isSelected
          ? 'bg-primary text-primary-foreground'
          : 'bg-muted text-foreground hover:bg-muted/80'
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 -my-1',
          className
        )}
        {...props}
      >
        {/* All option */}
        {showAll && (
          <button
            onClick={handleSelectAll}
            className={getChipClasses(isAllSelected)}
          >
            {allLabel}
          </button>
        )}

        {/* Options */}
        {options.map((option) => {
          const isSelected = selected.includes(option.id)

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              className={getChipClasses(isSelected)}
            >
              {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
              {option.label}
              {option.count !== undefined && (
                <span className={cn(
                  'ml-1 text-xs',
                  isSelected ? 'opacity-80' : 'text-muted-foreground'
                )}>
                  ({option.count})
                </span>
              )}
            </button>
          )
        })}
      </div>
    )
  }
)
FilterChips.displayName = 'FilterChips'

// ============================================
// Removable Chips - Selected filters display
// ============================================

interface RemovableChipsProps extends React.HTMLAttributes<HTMLDivElement> {
  chips: { id: string; label: string }[]
  onRemove: (id: string) => void
  onClearAll?: () => void
  size?: 'sm' | 'md'
}

const RemovableChips = React.forwardRef<HTMLDivElement, RemovableChipsProps>(
  ({ chips, onRemove, onClearAll, size = 'sm', className, ...props }, ref) => {
    if (chips.length === 0) return null

    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2 flex-wrap', className)}
        {...props}
      >
        {chips.map((chip) => (
          <span
            key={chip.id}
            className={cn(
              'inline-flex items-center gap-1 bg-primary/10 text-primary rounded-full',
              size === 'sm' ? 'h-6 px-2 text-xs' : 'h-7 px-3 text-sm'
            )}
          >
            {chip.label}
            <button
              onClick={() => onRemove(chip.id)}
              className="hover:bg-primary/20 rounded-full p-0.5"
            >
              <X className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
            </button>
          </span>
        ))}

        {onClearAll && chips.length > 1 && (
          <button
            onClick={onClearAll}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear all
          </button>
        )}
      </div>
    )
  }
)
RemovableChips.displayName = 'RemovableChips'

// ============================================
// Filter Button - Single dropdown filter
// ============================================

interface FilterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  value?: string
  active?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const FilterButton = React.forwardRef<HTMLButtonElement, FilterButtonProps>(
  ({ label, value, active, size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full border transition-colors whitespace-nowrap',
        sizeConfig[size],
        active || value
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-foreground hover:border-primary/50'
      )}
      {...props}
    >
      {value || label}
      <ChevronDown className={cn(
        'ml-1',
        size === 'sm' ? 'h-3 w-3' : 'h-4 w-4'
      )} />
    </button>
  )
)
FilterButton.displayName = 'FilterButton'

// ============================================
// Filter Bar - Complete filter bar with chips and button
// ============================================

interface FilterBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  onFilterClick?: () => void
  filterCount?: number
}

const FilterBar = React.forwardRef<HTMLDivElement, FilterBarProps>(
  ({ children, onFilterClick, filterCount, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-center gap-2', className)}
      {...props}
    >
      {/* Filter button */}
      {onFilterClick && (
        <button
          onClick={onFilterClick}
          className={cn(
            'flex-shrink-0 h-8 px-3 flex items-center gap-1.5 rounded-full border transition-colors',
            filterCount && filterCount > 0
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-border text-foreground hover:border-primary/50'
          )}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span className="text-sm">Filters</span>
          {filterCount !== undefined && filterCount > 0 && (
            <span className="ml-0.5 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
              {filterCount}
            </span>
          )}
        </button>
      )}

      {/* Chips container */}
      <div className="flex-1 overflow-x-auto scrollbar-hide">
        {children}
      </div>
    </div>
  )
)
FilterBar.displayName = 'FilterBar'

export { FilterChips, RemovableChips, FilterButton, FilterBar }
