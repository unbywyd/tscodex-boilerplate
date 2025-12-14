import { useState } from 'react'
import { Input } from '@/components/ui/Input'
import { SearchInput } from '@/components/ui/SearchInput'
import { PhoneInput } from '@/components/ui/PhoneInput'
import { CurrencyInput } from '@/components/ui/CurrencyInput'
import { OTPInput } from '@/components/ui/OTPInput'
import { TagInput } from '@/components/ui/TagInput'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function InputDemo() {
  useScrollToSection()
  const [text, setText] = useState('')
  const [search, setSearch] = useState('')
  const [phone, setPhone] = useState<string | undefined>()
  const [currency, setCurrency] = useState<{ amount: number; currency: string } | undefined>()
  const [otp, setOtp] = useState('')
  const [tags, setTags] = useState<string[]>(['React', 'TypeScript'])

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Input Fields"
        description="Various input components for different data types: text, search, phone, currency, OTP codes, and tags."
      />

      {/* Basic Input */}
      <DemoCard id="input" title="Input - Basic Text Input">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Standard text input with label, error state, and required indicator.
          </p>
          <CodeBlock
            code={`<Input
  label="Username"
  placeholder="Enter username"
  value={text}
  onChange={(e) => setText(e.target.value)}
  required
/>

<Input
  label="With Error"
  value=""
  error="This field is required"
/>`}
            id="input-basic"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Input
              label="Username"
              placeholder="Enter username"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
            <Input
              label="With Error"
              value=""
              error="This field is required"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{text || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Search Input */}
      <DemoCard id="search" title="SearchInput - Search with Icon & Clear">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Search input with icon, clear button, debounce support, and keyboard shortcuts (Escape to clear).
          </p>
          <CodeBlock
            code={`<SearchInput
  value={search}
  onChange={setSearch}
  placeholder="Search products..."
  inputSize="md"
  debounce={300}
  clearable
/>`}
            id="search-input"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search..."
              inputSize="sm"
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search..."
              inputSize="md"
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search..."
              inputSize="lg"
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Sizes: <code className="bg-muted px-1 rounded">sm</code>, <code className="bg-muted px-1 rounded">md</code>, <code className="bg-muted px-1 rounded">lg</code>
          </div>
        </div>
      </DemoCard>

      {/* Phone Input */}
      <DemoCard id="phone" title="PhoneInput - Phone with Country Code">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Phone number input with country selector, auto-formatting, and clear button.
          </p>
          <CodeBlock
            code={`<PhoneInput
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  defaultCountry="RU"
  required
/>`}
            id="phone-input"
          />
          <div className="max-w-sm pt-2">
            <PhoneInput
              label="Phone Number"
              value={phone}
              onChange={setPhone}
              defaultCountry="RU"
              required
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{phone || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Currency Input */}
      <DemoCard id="currency" title="CurrencyInput - Money with Currency Selector">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Currency input with symbol, locale-aware formatting, and optional currency selector.
          </p>
          <CodeBlock
            code={`<CurrencyInput
  label="Price"
  value={currency}
  onChange={setCurrency}
  defaultCurrency="USD"
  showCurrencySelector
/>`}
            id="currency-input"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <CurrencyInput
              label="With Selector"
              value={currency}
              onChange={setCurrency}
              defaultCurrency="USD"
              showCurrencySelector
            />
            <CurrencyInput
              label="Fixed Currency"
              defaultCurrency="EUR"
              showCurrencySelector={false}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{currency ? `${currency.amount} ${currency.currency}` : '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* OTP Input */}
      <DemoCard id="otp" title="OTPInput - Verification Code">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            One-time password input with auto-focus, paste support, and completion callback.
          </p>
          <CodeBlock
            code={`<OTPInput
  label="Enter Code"
  value={otp}
  onChange={setOtp}
  onComplete={(code) => console.log('Complete:', code)}
  length={6}
/>`}
            id="otp-input"
          />
          <div className="pt-2">
            <OTPInput
              label="Enter Code"
              value={otp}
              onChange={setOtp}
              onComplete={(code) => console.log('OTP Complete:', code)}
              length={6}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div>
              <p className="text-xs font-medium mb-2">4-digit code:</p>
              <OTPInput length={4} />
            </div>
            <div>
              <p className="text-xs font-medium mb-2">Masked:</p>
              <OTPInput length={4} masked />
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{otp || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Tag Input */}
      <DemoCard id="tags" title="TagInput - Multiple Tags/Chips">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Input for multiple values as tags. Press Enter or comma to add. Supports paste with comma/newline separation.
          </p>
          <CodeBlock
            code={`<TagInput
  label="Skills"
  value={tags}
  onChange={setTags}
  maxTags={5}
  variant="soft"
/>`}
            id="tag-input"
          />
          <div className="space-y-4 pt-2">
            <TagInput
              label="Skills (max 5)"
              value={tags}
              onChange={setTags}
              maxTags={5}
              variant="soft"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium mb-2">Default variant:</p>
                <TagInput value={['Tag 1', 'Tag 2']} variant="default" />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Outline variant:</p>
                <TagInput value={['Tag 1', 'Tag 2']} variant="outline" />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Soft variant:</p>
                <TagInput value={['Tag 1', 'Tag 2']} variant="soft" />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">[{tags.map(t => `"${t}"`).join(', ')}]</code>
          </div>
        </div>
      </DemoCard>

      {/* Props Reference */}
      <DemoCard title="Props Reference">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Component</th>
                <th className="text-left py-2 pr-4">Key Props</th>
                <th className="text-left py-2">Value Type</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">Input</td>
                <td className="py-2 pr-4">label, error, required</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SearchInput</td>
                <td className="py-2 pr-4">inputSize, debounce, clearable, onSubmit</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">PhoneInput</td>
                <td className="py-2 pr-4">defaultCountry, label, error</td>
                <td className="py-2">string (+7XXXXXXXXXX)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">CurrencyInput</td>
                <td className="py-2 pr-4">defaultCurrency, showCurrencySelector, min, max</td>
                <td className="py-2">{`{ amount, currency }`}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">OTPInput</td>
                <td className="py-2 pr-4">length, masked, onComplete, autoFocus</td>
                <td className="py-2">string</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">TagInput</td>
                <td className="py-2 pr-4">maxTags, variant, allowDuplicates</td>
                <td className="py-2">string[]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
