// TagInput - Input for entering multiple tags/chips (array of strings)
import * as React from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TagInputProps {
  value?: string[]
  onChange?: (value: string[]) => void
  placeholder?: string
  label?: string
  error?: string
  disabled?: boolean
  required?: boolean
  className?: string
  // Customization
  maxTags?: number
  allowDuplicates?: boolean
  delimiter?: string // Key to create tag (default: Enter, also supports comma)
  variant?: 'default' | 'outline' | 'soft'
}

const variantStyles = {
  default: 'bg-primary text-primary-foreground',
  outline: 'bg-transparent border border-input text-foreground',
  soft: 'bg-primary/10 text-primary border border-primary/20',
}

const TagInput = React.forwardRef<HTMLInputElement, TagInputProps>(
  (
    {
      value = [],
      onChange,
      placeholder = 'Type and press Enter...',
      label,
      error,
      disabled,
      required,
      className,
      maxTags,
      allowDuplicates = false,
      variant = 'default',
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState('')
    const inputRef = React.useRef<HTMLInputElement>(null)

    // Merge refs
    React.useImperativeHandle(ref, () => inputRef.current!)

    const addTag = (tag: string) => {
      const trimmed = tag.trim()
      if (!trimmed) return
      if (!allowDuplicates && value.includes(trimmed)) return
      if (maxTags && value.length >= maxTags) return

      onChange?.([...value, trimmed])
      setInputValue('')
    }

    const removeTag = (index: number) => {
      if (disabled) return
      const newTags = value.filter((_, i) => i !== index)
      onChange?.(newTags)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault()
        addTag(inputValue)
      } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
        // Remove last tag when backspace on empty input
        removeTag(value.length - 1)
      }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pastedText = e.clipboardData.getData('text')
      // Split by comma or newline
      const tags = pastedText.split(/[,\n]/).map((t) => t.trim()).filter(Boolean)

      let newTags = [...value]
      for (const tag of tags) {
        if (maxTags && newTags.length >= maxTags) break
        if (!allowDuplicates && newTags.includes(tag)) continue
        newTags.push(tag)
      }
      onChange?.(newTags)
    }

    const focusInput = () => {
      inputRef.current?.focus()
    }

    return (
      <div className={cn('space-y-1.5', className)}>
        {label && (
          <label className="text-sm font-medium">
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <div
          onClick={focusInput}
          className={cn(
            'flex flex-wrap gap-1.5 min-h-10 w-full rounded-md border border-input bg-background px-3 py-2',
            'ring-offset-background',
            'focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
            disabled && 'cursor-not-allowed opacity-50',
            error && 'border-destructive focus-within:ring-destructive'
          )}
        >
          {/* Tags */}
          {value.map((tag, index) => (
            <span
              key={`${tag}-${index}`}
              className={cn(
                'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium',
                variantStyles[variant],
                disabled && 'opacity-70'
              )}
            >
              {tag}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    removeTag(index)
                  }}
                  className={cn(
                    'rounded-full p-0.5 hover:bg-black/10 dark:hover:bg-white/10',
                    'focus:outline-none focus:ring-1 focus:ring-current'
                  )}
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </span>
          ))}

          {/* Input */}
          {(!maxTags || value.length < maxTags) && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onPaste={handlePaste}
              placeholder={value.length === 0 ? placeholder : ''}
              disabled={disabled}
              className={cn(
                'flex-1 min-w-[120px] bg-transparent text-sm outline-none',
                'placeholder:text-muted-foreground',
                'disabled:cursor-not-allowed'
              )}
            />
          )}
        </div>

        {/* Helper text */}
        {error ? (
          <p className="text-xs text-destructive">{error}</p>
        ) : maxTags ? (
          <p className="text-xs text-muted-foreground">
            {value.length}/{maxTags} tags
          </p>
        ) : null}
      </div>
    )
  }
)

TagInput.displayName = 'TagInput'

export { TagInput }
