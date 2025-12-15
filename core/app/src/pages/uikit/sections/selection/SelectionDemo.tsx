import { useState } from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react'
import { Select, SimpleSelect } from '@/components/ui/Select'
import { Checkbox } from '@/components/ui/Checkbox'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Switch } from '@/components/ui/Switch'
import { Toggle } from '@/components/ui/Toggle'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/ToggleGroup'
import { ChipSelect } from '@/components/ui/ChipSelect'
import { Combobox } from '@/components/ui/Combobox'
import { MobilePicker } from '@/components/ui/MobilePicker'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'de', label: 'Germany' },
  { value: 'fr', label: 'France' },
  { value: 'jp', label: 'Japan' },
  { value: 'ru', label: 'Russia' },
]

const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Solid']

const pickerOptions = [
  { value: 'apple', label: 'Apple', description: 'Fresh red apples' },
  { value: 'banana', label: 'Banana', description: 'Yellow bananas' },
  { value: 'orange', label: 'Orange', description: 'Juicy oranges' },
  { value: 'grape', label: 'Grape', description: 'Sweet grapes' },
  { value: 'mango', label: 'Mango', description: 'Tropical mangoes' },
]

export function SelectionDemo() {
  useScrollToSection()

  const [selectValue, setSelectValue] = useState('')
  const [simpleSelectValue, setSimpleSelectValue] = useState('')
  const [checkboxValue, setCheckboxValue] = useState(false)
  const [radioValue, setRadioValue] = useState('')
  const [switchValue, setSwitchValue] = useState(false)
  const [toggleValue, setToggleValue] = useState(false)
  const [toggleGroupValue, setToggleGroupValue] = useState('left')
  const [chipSingle, setChipSingle] = useState('')
  const [chipMultiple, setChipMultiple] = useState<string[]>([])
  const [comboValue, setComboValue] = useState('')
  const [pickerValue, setPickerValue] = useState('')
  const [multiPickerValue, setMultiPickerValue] = useState<string[]>([])

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Selection Components"
        description="Components for selecting values: dropdowns, checkboxes, radio buttons, switches, toggles, and chip selectors."
      />

      {/* Select */}
      <DemoCard id="select" title="Select - Dropdown Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Dropdown select built on Radix UI. Supports simple string arrays or value/label objects.
          </p>
          <CodeBlock
            code={`<Select
  label="Country"
  value={value}
  onValueChange={setValue}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  placeholder="Select country..."
/>`}
            id="select"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Select
              label="With Objects"
              value={selectValue}
              onValueChange={setSelectValue}
              options={countries}
              placeholder="Select country..."
            />
            <Select
              label="With Strings"
              options={frameworks}
              placeholder="Select framework..."
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{selectValue || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Combobox / Autocomplete */}
      <DemoCard id="autocomplete" title="Combobox - Searchable Dropdown">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Searchable dropdown with filtering. Uses cmdk under the hood.
          </p>
          <CodeBlock
            code={`<Combobox
  label="Framework"
  value={value}
  onChange={setValue}
  options={['React', 'Vue', 'Angular']}
  searchPlaceholder="Search frameworks..."
/>`}
            id="combobox"
          />
          <div className="max-w-sm pt-2">
            <Combobox
              label="Framework"
              value={comboValue}
              onChange={setComboValue}
              options={frameworks}
              searchPlaceholder="Search frameworks..."
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{comboValue || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* SimpleSelect */}
      <DemoCard id="simple-select" title="SimpleSelect - No Portal Dropdown">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Simple dropdown without Portal. Use in inline dialogs, MobileFrame, or modals where Portal positioning breaks.
          </p>
          <CodeBlock
            code={`<SimpleSelect
  label="Country"
  value={value}
  onChange={setValue}
  options={[
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
  ]}
  placeholder="Select country..."
/>`}
            id="simpleselect"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <SimpleSelect
              label="With Objects"
              value={simpleSelectValue}
              onChange={setSimpleSelectValue}
              options={countries}
              placeholder="Select country..."
            />
            <SimpleSelect
              label="With Strings"
              options={frameworks}
              placeholder="Select framework..."
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{simpleSelectValue || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* MobilePicker */}
      <DemoCard id="mobile-picker" title="MobilePicker - BottomSheet Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mobile-friendly picker that opens a BottomSheet. Supports search, single/multi-select modes.
          </p>
          <CodeBlock
            code={`// Single selection
<MobilePicker
  label="Fruit"
  value={value}
  onChange={setValue}
  options={[
    { value: 'apple', label: 'Apple', description: 'Fresh apples' },
    { value: 'banana', label: 'Banana' },
  ]}
  searchable
  title="Select Fruit"
/>

// Multi-selection
<MobilePicker
  label="Fruits"
  multiple
  value={values}
  onChange={setValues}
  options={['Apple', 'Banana', 'Orange']}
/>`}
            id="mobilepicker"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <MobilePicker
              label="Single Selection"
              value={pickerValue}
              onChange={setPickerValue}
              options={pickerOptions}
              placeholder="Select fruit..."
              title="Choose a Fruit"
              searchable
            />
            <MobilePicker
              label="Multi Selection"
              multiple
              value={multiPickerValue}
              onChange={setMultiPickerValue}
              options={frameworks}
              placeholder="Select frameworks..."
              title="Choose Frameworks"
              searchable
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Single: <code className="bg-muted px-1 rounded">{pickerValue || '(empty)'}</code> |
            Multi: <code className="bg-muted px-1 rounded">[{multiPickerValue.join(', ')}]</code>
          </div>
        </div>
      </DemoCard>

      {/* Checkbox */}
      <DemoCard id="checkbox" title="Checkbox - Boolean Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Checkbox for boolean values. Supports label and description.
          </p>
          <CodeBlock
            code={`<Checkbox
  label="Accept terms"
  description="I agree to the terms and conditions"
  checked={checked}
  onCheckedChange={setChecked}
/>`}
            id="checkbox"
          />
          <div className="space-y-4 pt-2">
            <Checkbox
              label="Accept terms"
              description="I agree to the terms and conditions"
              checked={checkboxValue}
              onCheckedChange={(v) => setCheckboxValue(v === true)}
            />
            <Checkbox label="Simple checkbox" />
            <Checkbox label="With error" error="This field is required" />
            <Checkbox disabled label="Disabled" />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{checkboxValue.toString()}</code>
          </div>
        </div>
      </DemoCard>

      {/* RadioGroup */}
      <DemoCard id="radio" title="RadioGroup - Single Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Radio button group for selecting one option. Supports vertical and horizontal layouts.
          </p>
          <CodeBlock
            code={`<RadioGroup
  label="Plan"
  value={value}
  onValueChange={setValue}
  options={[
    { value: 'free', label: 'Free', description: 'Basic features' },
    { value: 'pro', label: 'Pro', description: 'Advanced features' },
  ]}
/>`}
            id="radiogroup"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <RadioGroup
              label="Vertical (default)"
              value={radioValue}
              onValueChange={setRadioValue}
              options={[
                { value: 'free', label: 'Free', description: 'Basic features' },
                { value: 'pro', label: 'Pro', description: 'Advanced features' },
                { value: 'enterprise', label: 'Enterprise', description: 'Custom solutions' },
              ]}
            />
            <RadioGroup
              label="Horizontal"
              value={radioValue}
              onValueChange={setRadioValue}
              orientation="horizontal"
              options={[
                { value: 'free', label: 'Free' },
                { value: 'pro', label: 'Pro' },
                { value: 'enterprise', label: 'Enterprise' },
              ]}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{radioValue || '(empty)'}</code>
          </div>
        </div>
      </DemoCard>

      {/* Switch */}
      <DemoCard id="switch" title="Switch - Toggle On/Off">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Toggle switch for boolean settings. Three sizes available.
          </p>
          <CodeBlock
            code={`<Switch
  label="Dark Mode"
  description="Enable dark theme"
  checked={enabled}
  onCheckedChange={setEnabled}
  size="md"
/>`}
            id="switch"
          />
          <div className="space-y-4 pt-2">
            <Switch
              label="Dark Mode"
              description="Enable dark theme across the application"
              checked={switchValue}
              onCheckedChange={setSwitchValue}
            />
            <div className="flex items-center gap-6">
              <Switch size="sm" />
              <Switch size="md" />
              <Switch size="lg" />
            </div>
            <p className="text-xs text-muted-foreground">
              Sizes: <code className="bg-muted px-1 rounded">sm</code>, <code className="bg-muted px-1 rounded">md</code>, <code className="bg-muted px-1 rounded">lg</code>
            </p>
          </div>
          <div className="text-xs text-muted-foreground">
            Value: <code className="bg-muted px-1 rounded">{switchValue.toString()}</code>
          </div>
        </div>
      </DemoCard>

      {/* Toggle & ToggleGroup */}
      <DemoCard id="toggle" title="Toggle & ToggleGroup - Button Toggles">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Toggle buttons for toolbar-like interfaces. Can be single or grouped.
          </p>
          <CodeBlock
            code={`// Single Toggle
<Toggle pressed={pressed} onPressedChange={setPressed}>
  <Bold className="h-4 w-4" />
</Toggle>

// Toggle Group (single selection)
<ToggleGroup type="single" value={value} onValueChange={setValue}>
  <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
</ToggleGroup>`}
            id="toggle"
          />
          <div className="space-y-4 pt-2">
            <div className="flex gap-2">
              <Toggle pressed={toggleValue} onPressedChange={setToggleValue} aria-label="Bold">
                <Bold className="h-4 w-4" />
              </Toggle>
              <Toggle variant="outline" aria-label="Italic">
                <Italic className="h-4 w-4" />
              </Toggle>
              <Toggle aria-label="Underline">
                <Underline className="h-4 w-4" />
              </Toggle>
            </div>

            <ToggleGroup
              type="single"
              value={toggleGroupValue}
              onValueChange={(v) => v && setToggleGroupValue(v)}
              label="Alignment"
            >
              <ToggleGroupItem value="left" aria-label="Align left">
                <AlignLeft className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="center" aria-label="Align center">
                <AlignCenter className="h-4 w-4" />
              </ToggleGroupItem>
              <ToggleGroupItem value="right" aria-label="Align right">
                <AlignRight className="h-4 w-4" />
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </DemoCard>

      {/* ChipSelect */}
      <DemoCard id="chips" title="ChipSelect - Chip-based Selection">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Visual chip/tag selection. Works as radio (single) or checkbox (multiple) group.
          </p>
          <CodeBlock
            code={`// Single selection (radio mode)
<ChipSelect
  label="Category"
  value={value}
  onChange={setValue}
  options={['Technology', 'Design', 'Marketing']}
  variant="soft"
/>

// Multiple selection (checkbox mode)
<ChipSelect
  label="Tags"
  multiple
  value={values}
  onChange={setValues}
  options={['React', 'Vue', 'Angular']}
/>`}
            id="chipselect"
          />
          <div className="space-y-6 pt-2">
            <ChipSelect
              label="Single Selection (radio)"
              value={chipSingle}
              onChange={(v) => setChipSingle(v as string)}
              options={['Technology', 'Design', 'Marketing', 'Sales']}
              variant="soft"
            />
            <ChipSelect
              label="Multiple Selection (checkbox)"
              multiple
              value={chipMultiple}
              onChange={(v) => setChipMultiple(v as string[])}
              options={frameworks}
              variant="outline"
            />
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-medium mb-2">Outline:</p>
                <ChipSelect options={['A', 'B', 'C']} variant="outline" showIndicator={false} />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Solid:</p>
                <ChipSelect options={['A', 'B', 'C']} variant="solid" showIndicator={false} />
              </div>
              <div>
                <p className="text-xs font-medium mb-2">Soft:</p>
                <ChipSelect options={['A', 'B', 'C']} variant="soft" showIndicator={false} />
              </div>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Single: <code className="bg-muted px-1 rounded">{chipSingle || '(empty)'}</code> |
            Multiple: <code className="bg-muted px-1 rounded">[{chipMultiple.join(', ')}]</code>
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
                <td className="py-2 pr-4">Select</td>
                <td className="py-2 pr-4">options, placeholder, label, error</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SimpleSelect</td>
                <td className="py-2 pr-4">options, placeholder, label, error (no Portal)</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Combobox</td>
                <td className="py-2 pr-4">options, searchPlaceholder, emptyText</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">MobilePicker</td>
                <td className="py-2 pr-4">options, multiple, searchable, title</td>
                <td className="py-2">string | string[]</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Checkbox</td>
                <td className="py-2 pr-4">label, description, checked, onCheckedChange</td>
                <td className="py-2">boolean</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">RadioGroup</td>
                <td className="py-2 pr-4">options, orientation, value, onValueChange</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Switch</td>
                <td className="py-2 pr-4">size (sm/md/lg), label, description</td>
                <td className="py-2">boolean</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Toggle</td>
                <td className="py-2 pr-4">variant, size, pressed, onPressedChange</td>
                <td className="py-2">boolean</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ToggleGroup</td>
                <td className="py-2 pr-4">type (single/multiple), value, onValueChange</td>
                <td className="py-2">string | string[]</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">ChipSelect</td>
                <td className="py-2 pr-4">multiple, variant, size, showIndicator</td>
                <td className="py-2">string | string[]</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
