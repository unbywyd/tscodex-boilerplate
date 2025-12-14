import { Link } from 'react-router-dom'
import { 
  FileText, 
  Layers, 
  Code2, 
  Database,
  Sparkles,
  Target,
  Palette,
  Shield,
  Box,
  Zap,
  GitBranch,
  Bot,
  BookOpen,
  MessageSquare,
  Settings,
  PlayCircle
} from 'lucide-react'
import { Container, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const profiles = {
  simple: {
    name: 'Simple',
    description: 'Landing pages, portfolios, simple CRUD apps',
    phases: ['Assessment', 'Discovery', 'Data', 'Features', 'Prototype'],
    color: 'green',
    icon: Zap
  },
  medium: {
    name: 'Medium',
    description: 'SaaS, e-commerce, multi-role apps, dashboards',
    phases: ['Assessment', 'Discovery', 'Design', 'Access', 'Data', 'Features', 'Prototype', 'Schema'],
    color: 'blue',
    icon: Layers
  },
  complex: {
    name: 'Complex',
    description: 'ERP, marketplaces, multi-tenant, enterprise',
    phases: ['Assessment', 'Discovery', 'Design', 'Access', 'Data', 'Modules', 'Features', 'Prototype', 'Schema'],
    color: 'purple',
    icon: GitBranch
  }
}

const phaseDetails: Record<string, {
  icon: typeof FileText
  description: string
  questions: string[]
  output: string[]
}> = {
  assessment: {
    icon: Target,
    description: 'Determine project scope and select workflow profile',
    questions: [
      'What type of project? (web-app | mobile | api | landing)',
      'How many user roles? (single | 2-3 | many)',
      'Data complexity? (simple-crud | relational | complex)',
      'External integrations? (none | few | many)',
      'Multiple platforms? (single | 2-3 apps)'
    ],
    output: ['Profile selected', 'status.toml updated']
  },
  discovery: {
    icon: Sparkles,
    description: 'Understand the project fundamentals',
    questions: [
      'What problem does it solve?',
      'Who is the target audience?',
      'What\'s the core value proposition?',
      'What are the key features?'
    ],
    output: ['layers/project/about.toml', 'layers/knowledge/*.toml']
  },
  design: {
    icon: Palette,
    description: 'Visual and UX requirements',
    questions: [
      'Custom design or standard UI kit?',
      'Color scheme preferences?',
      'Mobile-first or desktop-first?',
      'Any brand guidelines?'
    ],
    output: ['layers/project/design.toml']
  },
  access: {
    icon: Shield,
    description: 'User roles and permissions',
    questions: [
      'List all user types',
      'What can each role do?',
      'What pages are protected?'
    ],
    output: ['layers/roles/*.toml', 'layers/guards/*.toml']
  },
  data: {
    icon: Database,
    description: 'Entities and relationships',
    questions: [
      'What are the main objects?',
      'What fields does each have?',
      'How are they related?'
    ],
    output: ['layers/entities/*.toml']
  },
  modules: {
    icon: GitBranch,
    description: 'Decompose into manageable domains',
    questions: [
      'What are the main domains?',
      'How do modules communicate?',
      'What are module interfaces?'
    ],
    output: ['layers/modules/*.toml']
  },
  features: {
    icon: Code2,
    description: 'Use cases, routes, components',
    questions: [
      'What are the main user flows?',
      'What screens are needed?',
      'What components compose each page?'
    ],
    output: ['layers/use-cases/*.toml', 'layers/routes/*.toml', 'layers/components/*.toml']
  },
  prototype: {
    icon: Box,
    description: 'Working React screens with mock data',
    questions: [],
    output: ['src/prototype/pages/*.tsx', 'src/prototype/mocks/*.json', 'src/prototype/components/**/*.tsx']
  },
  schema: {
    icon: Database,
    description: 'Database schema generation',
    questions: [],
    output: ['prisma/schema.prisma']
  }
}

export default function ChallengePage() {
  return (
    <>
      <AnimatedBackground />
      <Container size="lg" className="py-12 space-y-12 relative">
        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              How It Works with LLM
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Demonstration of how the tool works and interacts with LLM through the file system
          </p>
        </section>

        {/* LLM Interaction Flow */}
        <section className="border-b relative">
          <Container size="lg" className="py-8 sm:py-12 md:py-16 relative">
            <div className="text-center mb-6 sm:mb-8 md:mb-12 px-4">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">LLM Workflow Process</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                How LLM reads files and follows the workflow
              </p>
            </div>

            <div className="relative px-4 overflow-visible">
              {/* Timeline line - градиентная */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent md:-translate-x-1/2" />

              <div className="space-y-6 sm:space-y-8">
                {[
                  {
                    name: 'LLM reads rules/challenge.md',
                    description: 'At project start, LLM receives instructions from rules/challenge.md. This file contains a complete workflow description, all phases, questions for each phase, and rules.',
                    icon: FileText,
                    gradient: 'from-purple-400 to-purple-600'
                  },
                  {
                    name: 'LLM reads src/spec/status.toml',
                    description: 'LLM checks the current project state. If currentPhase = "assessment" and all phases are pending — this is a new project.',
                    icon: Settings,
                    gradient: 'from-blue-400 to-blue-600'
                  },
                  {
                    name: 'LLM asks questions to the user',
                    description: 'Following instructions from challenge.md, LLM asks questions to determine the project profile (Simple/Medium/Complex).',
                    icon: MessageSquare,
                    gradient: 'from-pink-400 to-pink-600'
                  },
                  {
                    name: 'LLM selects profile and updates status.toml',
                    description: 'Based on answers, LLM selects profile and updates status.toml, setting currentPhase = "discovery".',
                    icon: PlayCircle,
                    gradient: 'from-green-400 to-green-600'
                  },
                  {
                    name: 'LLM goes through phases',
                    description: 'For each phase, LLM reads phase description, asks questions at appropriate depth, creates TOML files in src/spec/layers/, and updates status.toml after completion.',
                    icon: Layers,
                    gradient: 'from-orange-400 to-orange-600'
                  },
                  {
                    name: 'Prototype generation',
                    description: 'Based on TOML files, generates React app, documentation, and Prisma schema.',
                    icon: Box,
                    gradient: 'from-emerald-400 to-emerald-600'
                  }
                ].map((step, index) => {
                  const Icon = step.icon
                  
                  return (
                    <div
                      key={step.name}
                      className={`relative flex items-start md:items-center gap-3 sm:gap-4 md:gap-8 ${
                        index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                      }`}
                    >
                      {/* Timeline dot - градиентный */}
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${step.gradient} border-2 border-white dark:border-slate-900 md:-translate-x-1/2 z-10 shrink-0 mt-1 md:mt-0`} style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }} />

                      {/* Content */}
                      <div className={`flex-1 ml-10 sm:ml-12 md:ml-0 w-full ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <Card className="w-full md:inline-block !backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all duration-300" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                          <CardHeader className="pb-2">
                            <div className={`flex items-center gap-2 flex-wrap ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                              <Badge variant="outline" className="text-xs border-white/30">
                                Step {index + 1}
                              </Badge>
                            </div>
                            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {step.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs sm:text-sm text-muted-foreground">{step.description}</p>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Spacer for alternating layout */}
                      <div className="hidden md:block flex-1" />
                    </div>
                  )
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* Key Files Explanation */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Key Files for LLM</h2>
            <p className="text-muted-foreground">How LLM uses the file system</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 p-2.5">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>rules/challenge.md</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Purpose:</strong> Complete workflow description for LLM
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Contains:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                    <li>• Description of all phases</li>
                    <li>• Questions for each phase</li>
                    <li>• Profile selection rules</li>
                    <li>• Instructions for updating status.toml</li>
                    <li>• Examples of output files</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>When read:</strong> At every session start, LLM uses it as instructions
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-green-400 to-green-600 p-2.5">
                    <Settings className="h-5 w-5 text-white" />
                  </div>
                  <CardTitle>src/spec/status.toml</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Purpose:</strong> Current project state
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Contains:</p>
                  <ul className="space-y-1 text-xs text-muted-foreground ml-4">
                    <li>• Selected profile (simple/medium/complex)</li>
                    <li>• Current phase (currentPhase)</li>
                    <li>• Status of each phase (pending/completed)</li>
                    <li>• Checklists for each phase</li>
                  </ul>
                </div>
                <div className="pt-2 border-t border-white/20">
                  <p className="text-xs text-muted-foreground">
                    <strong>When read:</strong> LLM reads it first to understand where the project is
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Profiles */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Workflow Profiles</h2>
            <p className="text-muted-foreground">LLM adapts question depth based on profile</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {Object.entries(profiles).map(([key, prof]) => {
              const Icon = prof.icon
              
              return (
                <Card 
                  key={key}
                  className="!backdrop-blur-xl !border-white/40 !bg-white/50 dark:!bg-slate-900/50"
                  style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`rounded-lg bg-gradient-to-br ${
                        prof.color === 'green' ? 'from-green-400 to-green-600' :
                        prof.color === 'blue' ? 'from-blue-400 to-blue-600' :
                        'from-purple-400 to-purple-600'
                      } p-2.5`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{prof.name}</CardTitle>
                    </div>
                    <CardDescription>{prof.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-2">Phases ({prof.phases.length}):</p>
                      <div className="flex flex-wrap gap-1.5">
                        {prof.phases.map((phase, idx) => (
                          <span 
                            key={idx}
                            className="text-xs px-2 py-1 rounded bg-muted/50 text-muted-foreground"
                          >
                            {phase}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-2 border-t border-white/20">
                      <p className="text-xs text-muted-foreground">
                        <strong>Question depth:</strong> {
                          key === 'simple' ? 'Shallow - key questions only' :
                          key === 'medium' ? 'Medium - detailed specifications' :
                          'Deep - thorough questions with edge cases'
                        }
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Workflow Phases */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Phase Details</h2>
            <p className="text-muted-foreground">What LLM does at each phase</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(phaseDetails).map(([key, phase]) => {
              const Icon = phase.icon

              return (
                <Card 
                  key={key}
                  className="!backdrop-blur-xl !border-white/40 !bg-white/50 dark:!bg-slate-900/50"
                  style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="rounded-lg bg-gradient-to-br from-primary/90 to-primary p-2.5">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</CardTitle>
                        <CardDescription className="mt-1">{phase.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {phase.questions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Questions LLM asks:</p>
                        <ul className="space-y-1.5">
                          {phase.questions.map((q, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="text-primary mt-1">•</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium mb-2">Files LLM creates:</p>
                      <div className="flex flex-wrap gap-2">
                        {phase.output.map((file, idx) => (
                          <code key={idx} className="text-xs bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm px-2 py-1 rounded border border-white/20">
                            {file}
                          </code>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Manifest for LLM/RAG */}
        <section>
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Manifest for LLM/RAG Integration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                All project specifications are available as a unified manifest for integration with LLM and RAG systems:
              </p>
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <Code2 className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-medium text-sm mb-1">Manifest URL:</p>
                    <code className="text-xs bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm px-2 py-1 rounded border border-white/20 block w-fit">
                      /generated/manifest.json
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Contains all layers (entities, components, routes, etc.) with <code className="text-xs bg-muted px-1 py-0.5 rounded">_meta.path</code> metadata for source tracking.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* CTA */}
        <section>
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="py-8 text-center space-y-4">
              <h2 className="text-2xl font-bold">Ready to Start?</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse the documentation to see how specifications are structured, or check out TOML file examples
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <Link to="/docs">
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Documentation
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Go to Home
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </Container>
    </>
  )
}

