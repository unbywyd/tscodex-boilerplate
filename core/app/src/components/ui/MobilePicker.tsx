// MobilePicker - Mobile-friendly select with BottomSheet
// Looks like Select, opens BottomSheet with filterable list
// Supports single and multi-select modes

import * as React from 'react'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SimpleBottomSheet } from './BottomSheet'
import { Input } from './Input'
import { Button } from './Button'

export interface PickerOption {
  value: string
  label: string
  description?: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface MobilePickerBaseProps {
  options: PickerOption[] | string[]
  placeholder?: string
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  className?: string
  /** Show search/filter input */
  searchable?: boolean
  /** Search placeholder */
  searchPlaceholder?: string
  /** Title in bottom sheet header */
  title?: string
  /** Max height of options list */
  maxHeight?: string
}

interface SinglePickerProps extends MobilePickerBaseProps {
  multiple?: false
  value?: string
  onChange?: (value: string) => void
}

interface MultiPickerProps extends MobilePickerBaseProps {
  multiple: true
  value?: string[]
  onChange?: (value: string[]) => void
}

type MobilePickerProps = SinglePickerProps | MultiPickerProps

export function MobilePicker({
  options,
  placeholder = 'Select...',
  label,
  error,
  required,
  disabled,
  className,
  searchable = true,
  searchPlaceholder = 'Search...',
  title,
  maxHeight = '60vh',
  multiple,
  value,
  onChange,
}: MobilePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const [tempSelection, setTempSelection] = React.useState<string[]>([])

  // Normalize options to PickerOption format
  const normalizedOptions: PickerOption[] = React.useMemo(() =>
    options.map((opt) =>
      typeof opt === 'string' ? { value: opt, label: opt } : opt
    ), [options])

  // Filter options by search
  const filteredOptions = React.useMemo(() => {
    if (!search.trim()) return normalizedOptions
    const query = search.toLowerCase()
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        opt.description?.toLowerCase().includes(query)
    )
  }, [normalizedOptions, search])

  // Get display text for trigger
  const displayText = React.useMemo(() => {
    if (multiple) {
      const selected = value as string[] | undefined
      if (!selected?.length) return null
      if (selected.length === 1) {
        return normalizedOptions.find((o) => o.value === selected[0])?.label
      }
      return `${selected.length} selected`
    } else {
      const selected = value as string | undefined
      return normalizedOptions.find((o) => o.value === selected)?.label
    }
  }, [multiple, value, normalizedOptions])

  // Handle open - initialize temp selection for multi mode
  const handleOpen = () => {
    if (disabled) return
    if (multiple) {
      setTempSelection((value as string[]) || [])
    }
    setSearch('')
    setOpen(true)
  }

  // Handle single select
  const handleSingleSelect = (optionValue: string) => {
    if (!multiple && onChange) {
      (onChange as (v: string) => void)(optionValue)
    }
    setOpen(false)
  }

  // Handle multi toggle
  const handleMultiToggle = (optionValue: string) => {
    setTempSelection((prev) =>
      prev.includes(optionValue)
        ? prev.filter((v) => v !== optionValue)
        : [...prev, optionValue]
    )
  }

  // Handle multi confirm
  const handleMultiConfirm = () => {
    if (multiple && onChange) {
      (onChange as (v: string[]) => void)(tempSelection)
    }
    setOpen(false)
  }

  // Check if option is selected
  const isSelected = (optionValue: string) => {
    if (multiple) {
      return tempSelection.includes(optionValue)
    }
    return value === optionValue
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      {/* Trigger - looks like Select */}
      <button
        type="button"
        onClick={handleOpen}
        disabled={disabled}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left',
          'ring-offset-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'active:bg-accent/50',
          error && 'border-destructive',
          className
        )}
      >
        <span className={cn('truncate flex-1', !displayText && 'text-muted-foreground')}>
          {displayText || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
      </button>

      {error && <p className="text-xs text-destructive">{error}</p>}

      {/* BottomSheet with options */}
      <SimpleBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title={title || label || placeholder}
        noPadding
      >
        <div className="flex flex-col" style={{ maxHeight }}>
          {/* Search input */}
          {searchable && (
            <div className="px-4 pt-1 pb-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="pl-9 pr-9"
                  autoFocus
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options list */}
          <div className="flex-1 overflow-auto py-2">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-8 text-center text-muted-foreground">
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() =>
                    multiple
                      ? handleMultiToggle(option.value)
                      : handleSingleSelect(option.value)
                  }
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    'hover:bg-accent active:bg-accent',
                    'disabled:opacity-50 disabled:pointer-events-none',
                    isSelected(option.value) && 'bg-accent/50'
                  )}
                >
                  {/* Checkbox/Radio indicator */}
                  <div
                    className={cn(
                      'shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                      multiple ? 'rounded' : 'rounded-full',
                      isSelected(option.value)
                        ? 'bg-primary border-primary text-primary-foreground'
                        : 'border-muted-foreground/30'
                    )}
                  >
                    {isSelected(option.value) && (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    )}
                  </div>

                  {/* Icon if provided */}
                  {option.icon && (
                    <div className="shrink-0 text-muted-foreground">
                      {option.icon}
                    </div>
                  )}

                  {/* Label and description */}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{option.label}</div>
                    {option.description && (
                      <div className="text-sm text-muted-foreground truncate">
                        {option.description}
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Confirm button for multi-select */}
          {multiple && (
            <div className="p-4 border-t bg-background">
              <Button onClick={handleMultiConfirm} className="w-full">
                OK{tempSelection.length > 0 && ` (${tempSelection.length})`}
              </Button>
            </div>
          )}
        </div>
      </SimpleBottomSheet>
    </div>
  )
}

// Compact version without label wrapper - for use in forms
export function MobilePickerTrigger({
  children,
  onClick,
  disabled,
  className,
  hasValue,
}: {
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
  className?: string
  hasValue?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm text-left',
        'ring-offset-background',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'active:bg-accent/50',
        !hasValue && 'text-muted-foreground',
        className
      )}
    >
      <span className="truncate flex-1">{children}</span>
      <ChevronDown className="h-4 w-4 opacity-50 shrink-0 ml-2" />
    </button>
  )
}
