import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'

const codeExample = `import { validators } from '@/components/ui/QuickForm'

// Available validators:
validators.required('Custom message')
validators.email()
validators.minLength(3)
validators.maxLength(100)
validators.min(0)
validators.max(999)
validators.pattern(/^[A-Z]/, 'Must start with capital')
validators.match('password', 'Passwords must match')`

export function ValidatorsDemo() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Validators"
        description="Built-in validation functions for QuickForm fields."
      />

      <CodeBlock code={codeExample} id="validators" />

      <div className="space-y-4">
        <h3 className="font-semibold">Available Validators</h3>
        <div className="space-y-3 text-sm">
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.required(message?)</code>
            <p className="text-muted-foreground mt-1">Field must have a value</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.email(message?)</code>
            <p className="text-muted-foreground mt-1">Must be valid email format</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.minLength(min, message?)</code>
            <p className="text-muted-foreground mt-1">Minimum string length</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.maxLength(max, message?)</code>
            <p className="text-muted-foreground mt-1">Maximum string length</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.min(value, message?)</code>
            <p className="text-muted-foreground mt-1">Minimum numeric value</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.max(value, message?)</code>
            <p className="text-muted-foreground mt-1">Maximum numeric value</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.pattern(regex, message?)</code>
            <p className="text-muted-foreground mt-1">Must match regex pattern</p>
          </div>
          <div className="p-3 bg-muted rounded-lg">
            <code className="font-medium">validators.match(fieldName, message?)</code>
            <p className="text-muted-foreground mt-1">Must match another field (e.g., confirm password)</p>
          </div>
        </div>
      </div>
    </div>
  )
}

