// OTPInput - verification code input with separate boxes
import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  length?: number
  label?: string
  error?: string
  required?: boolean
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  masked?: boolean // Show dots instead of numbers
}

export function OTPInput({
  value = '',
  onChange,
  onComplete,
  length = 6,
  label,
  error,
  required,
  disabled,
  autoFocus = false,
  className,
  masked = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Sync with external value
  useEffect(() => {
    if (value) {
      const digits = value.slice(0, length).split('')
      setOtp([...digits, ...Array(length - digits.length).fill('')])
    }
  }, [value, length])

  // Auto focus first input
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const focusInput = (index: number) => {
    if (index >= 0 && index < length && inputRefs.current[index]) {
      inputRefs.current[index]?.focus()
      inputRefs.current[index]?.select()
    }
  }

  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return // Only digits

    const newOtp = [...otp]
    newOtp[index] = digit.slice(-1) // Take last digit only
    setOtp(newOtp)

    const newValue = newOtp.join('')
    onChange?.(newValue)

    // Move to next input
    if (digit && index < length - 1) {
      focusInput(index + 1)
    }

    // Check completion
    if (newOtp.every((d) => d !== '') && newOtp.length === length) {
      onComplete?.(newValue)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    switch (e.key) {
      case 'Backspace':
        e.preventDefault()
        if (otp[index]) {
          // Clear current
          handleChange(index, '')
        } else if (index > 0) {
          // Move to previous and clear
          focusInput(index - 1)
          handleChange(index - 1, '')
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        focusInput(index - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        focusInput(index + 1)
        break
      case 'Delete':
        e.preventDefault()
        handleChange(index, '')
        break
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)

    if (pastedData) {
      const digits = pastedData.split('')
      const newOtp = [...digits, ...Array(length - digits.length).fill('')]
      setOtp(newOtp)
      onChange?.(pastedData)

      // Focus last filled or next empty
      const nextIndex = Math.min(digits.length, length - 1)
      focusInput(nextIndex)

      if (digits.length === length) {
        onComplete?.(pastedData)
      }
    }
  }

  const handleFocus = (index: number) => {
    inputRefs.current[index]?.select()
  }

  return (
    <div className="space-y-1.5">
      {label && (
        <label className="text-sm font-medium">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}

      <div className={cn('flex gap-1.5 sm:gap-2 justify-center', className)}>
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type={masked ? 'password' : 'text'}
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              'w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-semibold rounded-lg border border-input bg-background',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-primary',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'transition-all',
              error && 'border-destructive focus-visible:ring-destructive',
              digit && 'border-primary bg-primary/5'
            )}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && <p className="text-xs text-destructive text-center">{error}</p>}

      {/* Hidden input for form submission */}
      <input type="hidden" name="otp" value={otp.join('')} />
    </div>
  )
}
