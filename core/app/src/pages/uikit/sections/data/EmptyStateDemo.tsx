import { EmptyState } from '@/components/ui/EmptyState'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { FileWarning, Search } from 'lucide-react'

const codeExample = `import { EmptyState } from '@/components/ui/EmptyState'
import { FileWarning } from 'lucide-react'

<EmptyState
  icon={<FileWarning className="h-10 w-10 text-muted-foreground" />}
  title="No items found"
  description="Try adjusting your search or filters"
  action={<Button>Create Item</Button>}
/>`

export function EmptyStateDemo() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="Empty State"
        description="Display when there's no data to show. Helps guide users on what to do next."
      />

      <CodeBlock code={codeExample} id="empty-state" />

      <div className="grid md:grid-cols-2 gap-6">
        <DemoCard>
          <EmptyState
            icon={<FileWarning className="h-10 w-10 text-muted-foreground" />}
            title="No items found"
            description="Try adjusting your search or filters"
          />
        </DemoCard>

        <DemoCard>
          <EmptyState
            icon={<Search className="h-10 w-10 text-muted-foreground" />}
            title="No results"
            description="We couldn't find anything matching your search"
          />
        </DemoCard>
      </div>
    </div>
  )
}

