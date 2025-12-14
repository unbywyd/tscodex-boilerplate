import { useState } from 'react'
import { SmartField } from '@/components/ui/SmartField'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'

const codeExample = `<SmartField
  name="email"
  type="email"
  label="Email"
  value={value}
  onChange={setValue}
  required
/>`

export function SmartFieldDemo() {
  const [values, setValues] = useState<Record<string, unknown>>({})

  const updateValue = (key: string) => (value: unknown) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="SmartField"
        description="Universal form field component. Automatically renders the right input based on type."
      />

      <CodeBlock code={codeExample} id="smartfield" />

      <div className="space-y-3">
        <h3 className="font-semibold">Supported Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
          {['string', 'email', 'password', 'number', 'text', 'checkbox', 'switch', 'enum', 'radio', 'autocomplete', 'chip', 'chips', 'tags', 'date', 'time', 'phone', 'currency', 'otp', 'url', 'search'].map((type) => (
            <code key={type} className="bg-muted px-2 py-1 rounded text-center">
              {type}
            </code>
          ))}
        </div>
      </div>

      <DemoCard title="Interactive Examples">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SmartField name="demo-string" type="string" label="String" placeholder="Enter text..." value={values.string} onChange={updateValue('string')} />
          <SmartField name="demo-email" type="email" label="Email" value={values.email} onChange={updateValue('email')} />
          <SmartField name="demo-number" type="number" label="Number" min={0} max={100} value={values.number} onChange={updateValue('number')} />
          <SmartField name="demo-enum" type="enum" label="Select" options={['Option A', 'Option B', 'Option C']} value={values.enum} onChange={updateValue('enum')} />
        </div>
      </DemoCard>
    </div>
  )
}

