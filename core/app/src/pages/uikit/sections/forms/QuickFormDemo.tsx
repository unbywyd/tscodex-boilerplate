import { useState } from 'react'
import { QuickForm, validators, type QuickFieldConfig } from '@/components/ui/QuickForm'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'

const codeExample = `<QuickForm
  fields={[
    { name: 'name', type: 'string', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'role', type: 'enum', options: ['User', 'Admin'] },
  ]}
  onSubmit={(data) => console.log(data)}
  columns={2}
/>`

const registrationFields: QuickFieldConfig[] = [
  { name: 'name', type: 'string', label: 'Full Name', placeholder: 'John Doe', required: true, validation: [validators.minLength(2)] },
  { name: 'email', type: 'email', label: 'Email', required: true, validation: [validators.email()] },
  { name: 'password', type: 'password', label: 'Password', required: true, validation: [validators.minLength(6, 'Min 6 characters')] },
  { name: 'phone', type: 'phone', label: 'Phone Number', required: true },
  { name: 'birthDate', type: 'date', label: 'Birth Date', locale: 'ru' },
  { name: 'role', type: 'enum', label: 'Role', options: ['User', 'Admin', 'Moderator'], required: true },
  { name: 'salary', type: 'currency', label: 'Expected Salary', currency: 'USD' },
  { name: 'bio', type: 'text', label: 'About You', placeholder: 'Tell us about yourself...', rows: 3, colSpan: 2 },
  { name: 'acceptTerms', type: 'checkbox', label: 'I accept the terms and conditions', required: true },
]

export function QuickFormDemo() {
  const [formResult, setFormResult] = useState<Record<string, unknown> | null>(null)

  const handleRegistration = (data: Record<string, unknown>) => {
    setFormResult(data)
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="QuickForm"
        description="Declarative form builder with built-in validation. Define fields as config and get a fully functional form."
      />

      <CodeBlock code={codeExample} id="quickform" />

      <DemoCard title="Live Example: Registration Form">
        <QuickForm
          fields={registrationFields}
          onSubmit={handleRegistration}
          submitLabel="Register"
          showReset
          columns={2}
          gap="md"
        />
        {formResult && (
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Form Result:</h4>
            <pre className="text-sm overflow-auto">{JSON.stringify(formResult, null, 2)}</pre>
          </div>
        )}
      </DemoCard>

      <div className="space-y-3">
        <h3 className="font-semibold">Props</h3>
        <div className="text-sm space-y-2">
          <div className="flex gap-2">
            <code className="bg-muted px-2 py-0.5 rounded">fields</code>
            <span className="text-muted-foreground">QuickFieldConfig[] - Field definitions</span>
          </div>
          <div className="flex gap-2">
            <code className="bg-muted px-2 py-0.5 rounded">onSubmit</code>
            <span className="text-muted-foreground">(data) =&gt; void - Submit handler</span>
          </div>
          <div className="flex gap-2">
            <code className="bg-muted px-2 py-0.5 rounded">columns</code>
            <span className="text-muted-foreground">1 | 2 | 3 - Grid columns (default: 1)</span>
          </div>
          <div className="flex gap-2">
            <code className="bg-muted px-2 py-0.5 rounded">gap</code>
            <span className="text-muted-foreground">'sm' | 'md' | 'lg' - Grid gap</span>
          </div>
          <div className="flex gap-2">
            <code className="bg-muted px-2 py-0.5 rounded">showReset</code>
            <span className="text-muted-foreground">boolean - Show reset button</span>
          </div>
        </div>
      </div>
    </div>
  )
}

