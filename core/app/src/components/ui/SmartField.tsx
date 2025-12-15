// SmartField - Universal form field that renders appropriate input based on type
import { cn } from '@/lib/utils'
import { DatePicker } from './DatePicker'
import { TimePicker } from './TimePicker'
import { PhoneInput } from './PhoneInput'
import { CurrencyInput } from './CurrencyInput'
import { OTPInput } from './OTPInput'
import { Checkbox } from './Checkbox'
import { Switch } from './Switch'
import { RadioGroup } from './RadioGroup'
import { Select, SimpleSelect } from './Select'
import { ChipSelect } from './ChipSelect'
import { Combobox } from './Combobox'
import { TagInput } from './TagInput'
import { MobilePicker } from './MobilePicker'

export type FieldType =
  | 'string'
  | 'email'
  | 'password'
  | 'number'
  | 'text'
  | 'boolean'
  | 'switch'
  | 'checkbox'
  | 'enum'
  | 'radio'
  | 'date'
  | 'time'
  | 'datetime'
  | 'phone'
  | 'currency'
  | 'otp'
  | 'url'
  | 'search'
  | 'chip'   // Single select chips (radio-like)
  | 'chips'  // Multi select chips (checkbox-like)
  | 'autocomplete' // Searchable dropdown
  | 'tags'  // Free-form tag input (array of strings)
  | 'picker' // Mobile picker - single select with BottomSheet
  | 'multi-picker' // Mobile picker - multi select with BottomSheet
  | 'simple-select' // Simple dropdown without portal (for inline dialogs)

export interface FieldConfig {
  name: string
  type: FieldType
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  options?: string[] // For enum type
  defaultValue?: any
  // Type-specific options
  min?: number
  max?: number
  step?: number
  rows?: number // For text type
  otpLength?: number // For otp type
  currency?: string // For currency type
  dateFormat?: string // For date type
  locale?: 'en' | 'ru'
  // Chip options
  chipVariant?: 'outline' | 'solid' | 'soft'
  showChipIndicator?: boolean
  chipWrap?: boolean
  // Tag input options
  maxTags?: number
  allowDuplicates?: boolean
  tagVariant?: 'default' | 'outline' | 'soft'
  // Mobile picker options
  searchable?: boolean
  pickerTitle?: string
}

interface SmartFieldProps extends FieldConfig {
  value?: any
  onChange?: (value: any) => void
  error?: string
  className?: string
}

// Base input styles
const baseInputClass = cn(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
  'placeholder:text-muted-foreground',
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
  'disabled:cursor-not-allowed disabled:opacity-50'
)

export function SmartField({
  name,
  type,
  label,
  placeholder,
  required,
  disabled,
  options,
  value,
  onChange,
  error,
  className,
  min,
  max,
  step,
  rows = 3,
  otpLength = 6,
  currency = 'RUB',
  dateFormat,
  locale,
  chipVariant = 'outline',
  showChipIndicator = true,
  chipWrap = true,
  maxTags,
  allowDuplicates = false,
  tagVariant = 'default',
  searchable = true,
  pickerTitle,
}: SmartFieldProps) {
  const errorClass = error ? 'border-destructive focus-visible:ring-destructive' : ''

  const renderLabel = () =>
    label && (
      <label htmlFor={name} className="text-sm font-medium">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    )

  const renderError = () =>
    error && <p className="text-xs text-destructive">{error}</p>

  // Wrapper for standard inputs
  const renderWrapper = (children: React.ReactNode) => (
    <div className="space-y-1.5">
      {renderLabel()}
      {children}
      {renderError()}
    </div>
  )

  switch (type) {
    // Text inputs
    case 'string':
    case 'search':
      return renderWrapper(
        <input
          type={type === 'search' ? 'search' : 'text'}
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(baseInputClass, errorClass, className)}
        />
      )

    case 'email':
      return renderWrapper(
        <input
          type="email"
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || 'email@example.com'}
          disabled={disabled}
          required={required}
          autoComplete="email"
          className={cn(baseInputClass, errorClass, className)}
        />
      )

    case 'password':
      return renderWrapper(
        <input
          type="password"
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || '••••••••'}
          disabled={disabled}
          required={required}
          autoComplete="current-password"
          className={cn(baseInputClass, errorClass, className)}
        />
      )

    case 'url':
      return renderWrapper(
        <input
          type="url"
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder || 'https://'}
          disabled={disabled}
          required={required}
          className={cn(baseInputClass, errorClass, className)}
        />
      )

    case 'number':
      return renderWrapper(
        <input
          type="number"
          id={name}
          name={name}
          value={value ?? ''}
          onChange={(e) => onChange?.(e.target.value ? Number(e.target.value) : undefined)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          min={min}
          max={max}
          step={step}
          className={cn(baseInputClass, errorClass, 'text-right', className)}
        />
      )

    case 'text':
      return renderWrapper(
        <textarea
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={cn(
            baseInputClass,
            'h-auto min-h-[80px] resize-y',
            errorClass,
            className
          )}
        />
      )

    case 'boolean':
    case 'checkbox':
      return (
        <Checkbox
          id={name}
          name={name}
          checked={!!value}
          onCheckedChange={(checked) => onChange?.(checked)}
          disabled={disabled}
          required={required}
          label={label}
          error={error}
          className={className}
        />
      )

    case 'switch':
      return (
        <Switch
          id={name}
          name={name}
          checked={!!value}
          onCheckedChange={(checked) => onChange?.(checked)}
          disabled={disabled}
          required={required}
          label={label}
          error={error}
          className={className}
        />
      )

    case 'enum':
      return (
        <Select
          value={value || ''}
          onValueChange={(val) => onChange?.(val || undefined)}
          disabled={disabled}
          required={required}
          label={label}
          placeholder={placeholder}
          error={error}
          options={options}
          className={className}
        />
      )

    case 'radio':
      return (
        <RadioGroup
          name={name}
          value={value || ''}
          onValueChange={(val) => onChange?.(val)}
          disabled={disabled}
          required={required}
          label={label}
          error={error}
          options={options?.map((opt) => ({ value: opt, label: opt }))}
          className={className}
        />
      )

    // Complex inputs (use dedicated components)
    case 'date':
      return (
        <DatePicker
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
          dateFormat={dateFormat}
          locale={locale}
        />
      )

    case 'time':
      return (
        <TimePicker
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
        />
      )

    case 'datetime':
      return (
        <div className="space-y-1.5">
          {renderLabel()}
          <div className="flex gap-2">
            <div className="flex-1">
              <DatePicker
                value={value?.date}
                onChange={(date) => onChange?.({ ...value, date })}
                placeholder="Date"
                error={error}
                disabled={disabled}
                dateFormat={dateFormat}
                locale={locale}
              />
            </div>
            <div className="w-32">
              <TimePicker
                value={value?.time}
                onChange={(time) => onChange?.({ ...value, time })}
                placeholder="Time"
                disabled={disabled}
              />
            </div>
          </div>
          {renderError()}
        </div>
      )

    case 'phone':
      return (
        <PhoneInput
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
        />
      )

    case 'currency':
      return (
        <CurrencyInput
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
          defaultCurrency={currency}
          min={min}
          max={max}
        />
      )

    case 'otp':
      return (
        <OTPInput
          value={value}
          onChange={onChange}
          label={label}
          error={error}
          required={required}
          disabled={disabled}
          length={otpLength}
          className={className}
        />
      )

    case 'chip':
      return (
        <ChipSelect
          options={options || []}
          value={value}
          onChange={onChange}
          multiple={false}
          label={label}
          error={error}
          required={required}
          disabled={disabled}
          variant={chipVariant}
          showIndicator={showChipIndicator}
          wrap={chipWrap}
          className={className}
        />
      )

    case 'chips':
      return (
        <ChipSelect
          options={options || []}
          value={value}
          onChange={onChange}
          multiple={true}
          label={label}
          error={error}
          required={required}
          disabled={disabled}
          variant={chipVariant}
          showIndicator={showChipIndicator}
          wrap={chipWrap}
          className={className}
        />
      )

    case 'autocomplete':
      return (
        <Combobox
          options={options || []}
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
        />
      )

    case 'tags':
      return (
        <TagInput
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          maxTags={maxTags}
          allowDuplicates={allowDuplicates}
          variant={tagVariant}
          className={className}
        />
      )

    case 'picker':
      return (
        <MobilePicker
          options={options || []}
          value={value}
          onChange={onChange}
          multiple={false}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          searchable={searchable}
          title={pickerTitle}
          className={className}
        />
      )

    case 'multi-picker':
      return (
        <MobilePicker
          options={options || []}
          value={value}
          onChange={onChange}
          multiple={true}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          searchable={searchable}
          title={pickerTitle}
          className={className}
        />
      )

    case 'simple-select':
      return (
        <SimpleSelect
          options={options || []}
          value={value}
          onChange={onChange}
          label={label}
          placeholder={placeholder}
          error={error}
          required={required}
          disabled={disabled}
          className={className}
        />
      )

    default:
      return renderWrapper(
        <input
          type="text"
          id={name}
          name={name}
          value={value || ''}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(baseInputClass, errorClass, className)}
        />
      )
  }
}
