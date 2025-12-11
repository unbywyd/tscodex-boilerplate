import { 
  ChevronDown, 
  ChevronRight, 
  Sparkles, 
  Layers, 
  Code2, 
  Package,
  Globe,
  Server,
  Smartphone,
  BookOpen,
  FileCode,
  Database
} from 'lucide-react'

export default function ArchitectureDiagram() {
  return (
    <div className="architecture-diagram max-w-4xl mx-auto space-y-2">
      {/* LLM CONTEXT */}
      <Section 
        label="LLM Context" 
        color="amber" 
        icon={Sparkles}
        description="AI assistant context and workflow rules"
      >
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="flex items-center gap-2 group">
            <Tag color="amber" icon={FileCode}>rules/*.md</Tag>
            <span className="text-muted-foreground text-sm">prompts & patterns</span>
          </div>
          <span className="text-muted-foreground text-lg font-bold">+</span>
          <div className="flex items-center gap-2 group">
            <Tag color="amber" icon={FileCode}>status.toml</Tag>
            <span className="text-muted-foreground text-sm">current phase</span>
          </div>
        </div>
      </Section>

      <Arrow />

      {/* SPECIFICATION */}
      <Section 
        label="Specification Layers" 
        color="blue" 
        icon={Layers}
        description="TOML specifications organized by layers"
      >
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <Tag color="blue" icon={BookOpen}>Markdown</Tag>
            <span className="text-muted-foreground text-sm">docs/</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 justify-center">
            <Tag color="blue" icon={Layers}>TOML Layers</Tag>
            <div className="flex flex-wrap gap-1.5 justify-center mt-1">
              <Tag color="blue" small>entities</Tag>
              <Tag color="blue" small>components</Tag>
              <Tag color="blue" small>routes</Tag>
              <Tag color="blue" small>use-cases</Tag>
              <Tag color="blue" small>roles</Tag>
              <Tag color="blue" small>guards</Tag>
              <Tag color="blue" small>events</Tag>
              <Tag color="blue" small>platforms</Tag>
              <Tag color="blue" small>knowledge</Tag>
            </div>
          </div>
        </div>
      </Section>

      <Arrow />

      {/* PROTOTYPE */}
      <Section 
        label="React Prototype" 
        color="purple" 
        icon={Code2}
        description="Working UI with mock data and localStorage"
      >
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <Tag color="purple" icon={Code2}>React App</Tag>
          <ChevronRight className="w-4 h-4 text-purple-400 animate-pulse" />
          <div className="flex gap-2">
            <Tag color="purple" small icon={Globe}>Web</Tag>
            <Tag color="purple" small icon={Server}>Admin</Tag>
            <Tag color="purple" small icon={Smartphone}>Mobile</Tag>
          </div>
        </div>
      </Section>

      <Arrow />

      {/* OUTPUT */}
      <Section 
        label="Generated Output" 
        color="green" 
        icon={Package}
        description="Three outputs from single source of truth"
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <OutputCard 
            icon={Package}
            title="Manifest.json"
            tagColor="amber"
            description="LLM/RAG API"
            endpoint="/generated/manifest.json"
          />
          <OutputCard 
            icon={BookOpen}
            title="Docs UI"
            tagColor="green"
            description="Browsable docs"
            endpoint="/docs/*"
          />
          <OutputCard 
            icon={Database}
            title="Prisma Schema"
            tagColor="blue"
            description="Database schema"
            endpoint="/schema"
          />
        </div>
      </Section>
    </div>
  )
}

function Section({ 
  label, 
  color, 
  children, 
  icon: Icon,
  description 
}: {
  label: string
  color: 'blue' | 'purple' | 'green' | 'amber'
  children: React.ReactNode
  icon?: React.ComponentType<{ className?: string }>
  description?: string
}) {
  const styles = {
    blue: { 
      border: 'border-blue-300 dark:border-blue-700', 
      bg: 'bg-blue-50/50 dark:bg-blue-950/20',
      label: 'text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50',
      icon: 'text-blue-600 dark:text-blue-400'
    },
    purple: { 
      border: 'border-purple-300 dark:border-purple-700', 
      bg: 'bg-purple-50/50 dark:bg-purple-950/20',
      label: 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/50',
      icon: 'text-purple-600 dark:text-purple-400'
    },
    green: { 
      border: 'border-green-300 dark:border-green-700', 
      bg: 'bg-green-50/50 dark:bg-green-950/20',
      label: 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/50',
      icon: 'text-green-600 dark:text-green-400'
    },
    amber: { 
      border: 'border-amber-300 dark:border-amber-700', 
      bg: 'bg-amber-50/50 dark:bg-amber-950/20',
      label: 'text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50',
      icon: 'text-amber-600 dark:text-amber-400'
    },
  }
  const style = styles[color]
  
  return (
    <div className={`
      relative border-2 border-dashed ${style.border} ${style.bg}
      rounded-xl p-4 pt-6 shadow-sm
      transition-all duration-300 hover:shadow-md hover:scale-[1.01]
    `}>
      <div className={`absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1 rounded-lg ${style.label} shadow-sm`}>
        {Icon && <Icon className={`w-3.5 h-3.5 ${style.icon}`} />}
        <span className="text-xs font-semibold">{label}</span>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground mb-3 text-center font-medium">{description}</p>
      )}
      {children}
    </div>
  )
}

function Tag({ 
  color, 
  children, 
  small,
  icon: Icon 
}: {
  color: 'blue' | 'purple' | 'green' | 'amber'
  children: React.ReactNode
  small?: boolean
  icon?: React.ComponentType<{ className?: string }>
}) {
  const colors = {
    blue: 'border-blue-400/60 dark:border-blue-600 text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50',
    purple: 'border-purple-400/60 dark:border-purple-600 text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50',
    green: 'border-green-400/60 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/50',
    amber: 'border-amber-400/60 dark:border-amber-600 text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50',
  }
  return (
    <span className={`
      inline-flex items-center gap-1.5 border rounded-md font-medium
      transition-all duration-200 hover:scale-105 hover:shadow-sm
      ${colors[color]}
      ${small ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs'}
    `}>
      {Icon && <Icon className={`${small ? 'w-2.5 h-2.5' : 'w-3 h-3'}`} />}
      {children}
    </span>
  )
}

function Arrow() {
  return (
    <div className="flex justify-center py-0.5">
      <div className="flex flex-col items-center gap-0.5">
        <div className="w-0.5 h-2 bg-gradient-to-b from-muted-foreground/40 to-transparent" />
        <ChevronDown className="w-4 h-4 text-muted-foreground animate-pulse" />
        <div className="w-0.5 h-2 bg-gradient-to-t from-muted-foreground/40 to-transparent" />
      </div>
    </div>
  )
}

function OutputCard({
  icon: Icon,
  title,
  tagColor,
  description,
  endpoint
}: {
  icon: React.ComponentType<{ className?: string }>
  title: string
  tagColor: 'blue' | 'purple' | 'green' | 'amber'
  description: string
  endpoint: string
}) {
  return (
    <div className="group relative p-3 rounded-lg border border-border/50 bg-background/50 hover:bg-background transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
          <Icon className="w-5 h-5 text-muted-foreground" />
        </div>
        <Tag color={tagColor} small>{title}</Tag>
        <p className="text-xs text-muted-foreground">{description}</p>
        <code className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-mono text-muted-foreground break-all">
          {endpoint}
        </code>
      </div>
    </div>
  )
}
