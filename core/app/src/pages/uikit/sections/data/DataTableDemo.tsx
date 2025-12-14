import { DataTable, createColumn } from '@/components/ui/DataTable'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
  { id: '3', name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
]

const columns = [
  createColumn<typeof users[0]>('name', 'Name'),
  createColumn<typeof users[0]>('email', 'Email'),
  createColumn<typeof users[0]>('role', 'Role'),
]

const codeExample = `import { DataTable, createColumn } from '@/components/ui/DataTable'

const columns = [
  createColumn('name', 'Name'),
  createColumn('email', 'Email'),
]

<DataTable columns={columns} data={users} />`

export function DataTableDemo() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="DataTable"
        description="Sortable, filterable data tables with pagination."
      />

      <CodeBlock code={codeExample} id="datatable" />

      <DemoCard>
        <DataTable columns={columns} data={users} />
      </DemoCard>
    </div>
  )
}

