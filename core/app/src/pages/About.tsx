import { Container, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge, Button } from '@/components/ui'
import { Link } from 'react-router-dom'
import {
  FileText,
  Layers,
  Zap,
  Database,
  GitBranch,
  Code2,
  Sparkles,
  Target,
  Users,
  CheckCircle2,
  Box,
  Github,
  Bot
} from 'lucide-react'
import ArchitectureDiagram from '@/components/ArchitectureDiagram'

const features = [
  {
    icon: FileText,
    title: 'File-Driven Architecture',
    description: 'All project knowledge lives in TOML and Markdown files. No database required for documentation.',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/50',
  },
  {
    icon: Layers,
    title: 'Layered Specifications',
    description: 'Organize specs by layers: project, entities, roles, guards, routes, use-cases, and more.',
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/50',
  },
  {
    icon: Zap,
    title: 'Instant Prototype',
    description: 'Generate working React components and pages directly from your specifications.',
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/50',
  },
  {
    icon: Database,
    title: 'Prisma Schema',
    description: 'Automatically generate database schema from your entity definitions.',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/50',
  },
  {
    icon: GitBranch,
    title: 'Relations Graph',
    description: 'Visualize connections between entities, roles, guards, and use-cases.',
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-950/50',
  },
  {
    icon: Code2,
    title: 'LLM-Friendly',
    description: 'Structured dialogue workflow designed for AI-assisted development.',
    color: 'text-indigo-600 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-950/50',
  },
]

const roadmap = [
  { name: 'LLM Challenge', description: 'LLM performs challenge according to project rules' },
  { name: 'Project Structure', description: 'Project has clear structure and allows creating files and folders' },
  { name: 'Auto Generation', description: 'Documentation and prototype in UI are automatically generated' },
  { name: 'Production SPA', description: 'On production we get SPA with all files - static, no server' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-b from-primary/5 via-background to-background">
        <Container size="lg" className="py-8 sm:py-12 md:py-16 lg:py-24">
          <div className="flex flex-col items-center text-center space-y-4 sm:space-y-6 md:space-y-8">
            <Badge variant="secondary" className="px-3 py-1 sm:px-4 sm:py-1.5 text-xs sm:text-sm">
              <Sparkles className="w-3 h-3 mr-1.5 sm:mr-2" />
              LLM-Driven Development
            </Badge>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight max-w-4xl px-4">
              From{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Documentation
              </span>{' '}
              to Working{' '}
              <span className="bg-gradient-to-r from-primary/60 to-primary bg-clip-text text-transparent">
                Prototype
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl px-4">
              A file-driven system that transforms your MVP specifications into browsable documentation
              and working React prototypes. Single source of truth for your project.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4">
              <Button size="lg" asChild className="w-full sm:w-auto">
                <Link to="/docs">
                  <FileText className="w-4 h-4 mr-2" />
                  Browse Docs
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
                <Link to="/prototype">
                  <Box className="w-4 h-4 mr-2" />
                  View Prototype
                </Link>
              </Button>
            </div>
          </div>
        </Container>

        {/* Decorative elements */}
        <div className="hidden md:block absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="hidden md:block absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-10" />
      </section>

      {/* Problem & Solution */}
      <section className="border-b">
        <Container size="lg" className="py-8 sm:py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            <Card className="!backdrop-blur-xl !border-white/40 bg-gradient-to-br from-red-100/70 via-red-50/50 to-white/50 dark:from-red-950/30 dark:via-red-900/20 dark:to-slate-900/50" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-red-400 to-red-600 p-2.5">
                    <Target className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>The Problem</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>Documentation and prototypes live in separate worlds.</p>
                <p>Specs get outdated as code evolves.</p>
                <p>Teams waste time keeping them in sync.</p>
              </CardContent>
            </Card>

            <Card className="!backdrop-blur-xl !border-white/40 bg-gradient-to-br from-green-100/70 via-green-50/50 to-white/50 dark:from-green-950/30 dark:via-green-900/20 dark:to-slate-900/50" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-green-400 to-green-600 p-2.5">
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle>The Solution</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 text-muted-foreground">
                <p>Single source of truth in simple files.</p>
                <p>Docs and prototype generated from same specs.</p>
                <p>Change once, update everywhere.</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* Features Grid */}
      <section className="border-b">
        <Container size="lg" className="py-8 sm:py-12 md:py-16">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Core Features</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Everything you need to go from idea to working prototype
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} className="group hover:shadow-lg transition-all hover:border-primary/50">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg ${feature.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Workflow Phases */}
      <section className="border-b relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          {/* Animated gradient blobs - local to section, muted */}
          <div className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-purple-300/15 dark:bg-purple-400/8 rounded-full blur-3xl animate-blob-1" />
          <div className="absolute top-1/4 right-[15%] w-[500px] h-[500px] bg-blue-300/15 dark:bg-blue-400/8 rounded-full blur-3xl animate-blob-2" />
          <div className="absolute bottom-1/4 left-[20%] w-[500px] h-[500px] bg-pink-300/15 dark:bg-pink-400/8 rounded-full blur-3xl animate-blob-3" />
          <div className="absolute bottom-0 right-[10%] w-[500px] h-[500px] bg-green-300/15 dark:bg-green-400/8 rounded-full blur-3xl animate-blob-4" />
        </div>
        <Container size="lg" className="py-8 sm:py-12 md:py-16 relative">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Development Workflow</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Structured dialogue guides you through each phase
            </p>
          </div>

          {/* Roadmap */}
          <div className="mb-12 px-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-center">System Architecture</h3>
            </div>
            <div className="relative px-4 overflow-visible">
              {/* Timeline line - gradient */}
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-primary/30 to-transparent md:-translate-x-1/2" />

              <div className="space-y-6 sm:space-y-8">
                {roadmap.map((step, index) => {
                  // Gradient colors for dots
                  const gradientColors = [
                    'from-purple-400 to-purple-600',
                    'from-blue-400 to-blue-600',
                    'from-pink-400 to-pink-600',
                    'from-green-400 to-green-600',
                  ]
                  const gradient = gradientColors[index % gradientColors.length]

                  return (
                    <div
                      key={step.name}
                      className={`relative flex items-start md:items-center gap-3 sm:gap-4 md:gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                        }`}
                    >
                      {/* Timeline dot - gradient */}
                      <div className={`absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-br ${gradient} border-2 border-white dark:border-slate-900 md:-translate-x-1/2 z-10 shrink-0 mt-1 md:mt-0`} style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }} />

                      {/* Content */}
                      <div className={`flex-1 ml-10 sm:ml-12 md:ml-0 w-full ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                        <Card className="w-full md:inline-block !backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all duration-300" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                          <CardHeader className="pb-2">
                            <div className={`flex items-center gap-2 flex-wrap ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                              <Badge variant="outline" className="text-xs border-white/30">
                                Step {index + 1}
                              </Badge>
                            </div>
                            <CardTitle className="text-base sm:text-lg">{step.name}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-xs sm:text-sm text-muted-foreground mb-2">{step.description}</p>
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
          </div>

          {/* Architecture Diagram */}
          <div className="mt-16 mb-12 px-4">
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2 text-center">System Structure</h3>
              <p className="text-sm text-muted-foreground text-center max-w-2xl mx-auto">
                Visual overview: core engine, spec layers, prototype, documentation, manifest, and multi-platform support
              </p>
            </div>
            <ArchitectureDiagram />
          </div>
        </Container>
      </section>

      {/* Target Audience */}
      <section className="border-b">
        <Container size="lg" className="py-8 sm:py-12 md:py-16">
          <div className="text-center mb-6 sm:mb-8 md:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Who Is This For?</h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Designed for teams and individuals who value clarity, speed, and automation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="group hover:shadow-lg transition-all hover:border-blue-500/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-base sm:text-lg">Product Teams</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                Document requirements in structured files that translate directly to working code.
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:border-purple-500/30">
              <CardHeader className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-purple-50 dark:bg-purple-950/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Code2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-base sm:text-lg">Developers</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                Skip boilerplate. Focus on business logic while specs generate the scaffolding.
              </CardContent>
            </Card>

            <Card className="group hover:shadow-lg transition-all hover:border-orange-500/30 sm:col-span-2 lg:col-span-1">
              <CardHeader className="text-center">
                <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-orange-50 dark:bg-orange-950/50 flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-base sm:text-lg">AI Enthusiasts</CardTitle>
              </CardHeader>
              <CardContent className="text-center text-muted-foreground text-sm">
                Leverage LLMs to accelerate specification writing and prototype generation.
              </CardContent>
            </Card>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section>
        <Container size="lg" className="py-8 sm:py-12 md:py-16 px-4">
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="py-8 sm:py-10 md:py-12 text-center space-y-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Ready to Explore?</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Clone the repository, invite your LLM, and start building your project today
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild size="lg">
                  <a href="https://github.com/unbywyd/tscodex-boilerplate" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Clone Repository
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/challenge">
                    <Bot className="h-4 w-4 mr-2" />
                    Learn How It Works
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </Container>
      </section>
    </div>
  )
}
