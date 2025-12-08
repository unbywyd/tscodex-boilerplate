import { lazy, Suspense, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FileText, Box, FolderOpen, GitBranch, Bot, Zap, Sparkles, CheckCircle2, Clock, ExternalLink } from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { workflowPhases } from '@/components/WorkflowDiagram'
import { loadDocFile } from '@/lib/docs-loader'

const WorkflowDiagram = lazy(() => import('@/components/WorkflowDiagram'))

// Status data types
interface StatusData {
  status: {
    id: string
    name: string
    profile: string
    currentPhase: string
    lastUpdated: string
  }
  phases: Record<string, {
    status: string
    description: string
    skip?: boolean
    checklist?: Record<string, boolean>
  }>
}

// Phase to docs file mapping
const phaseDocsMap: Record<string, string> = {
  assessment: '/docs/status', // status.toml at root
  discovery: '/docs/layers/project/about', // project about.toml
  design: '/docs/layers/project/design', // design.toml
  access: '/docs/layers/roles/admin', // roles - first file
  data: '/docs/layers/entities/user', // entities - user.toml
  schema: '/docs/layers/entities/user', // schema from entities
  modules: '/docs', // modules folder (may be empty, go to docs index)
  features: '/docs/layers/use-cases/view-documentation', // first use case
  prototype: '/prototype', // final prototype
}

export default function HomePage() {
  const navigate = useNavigate()
  const [statusData, setStatusData] = useState<StatusData | null>(null)
  const [statusLoading, setStatusLoading] = useState(true)

  const handlePhaseClick = (phaseId: string) => {
    const path = phaseDocsMap[phaseId]
    if (path) {
      navigate(path)
    }
  }

  useEffect(() => {
    loadDocFile('status.toml')
      .then((file) => {
        if (file.content) {
          setStatusData(file.content as StatusData)
        }
      })
      .catch((err) => {
        console.error('Failed to load status:', err)
      })
      .finally(() => {
        setStatusLoading(false)
      })
  }, [])

  const features = [
    {
      icon: FolderOpen,
      title: 'File-Driven',
      description: 'No database required. All content in markdown and TOML files.',
    },
    {
      icon: Bot,
      title: 'LLM-Friendly',
      description: 'Structure optimized for AI-assisted development.',
    },
    {
      icon: FileText,
      title: 'Documentation Portal',
      description: 'Beautiful docs from your markdown and TOML files.',
    },
    {
      icon: Box,
      title: 'MVP Prototype',
      description: 'Working React prototype with mock data.',
    },
    {
      icon: GitBranch,
      title: 'Version Controlled',
      description: 'All project knowledge versioned in Git.',
    },
    {
      icon: Zap,
      title: 'Static Build',
      description: 'Pre-built SPA. Deploy anywhere.',
    },
  ]

  return (
    <Container size="lg" className="space-y-16 py-12">
      {/* Hero */}
      <section className="text-center space-y-6 py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TSCodex BluePrint
          </h1>
        </div>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          LLM-driven project specification generator. Transform your ideas into working prototypes through structured dialogue and intelligent documentation.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button asChild size="lg" className="text-base">
            <Link to="/docs">
              <FileText className="h-5 w-5" />
              View Documentation
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="text-base">
            <Link to="/prototype">
              <Box className="h-5 w-5" />
              Explore Prototype
            </Link>
          </Button>
        </div>
      </section>

      {/* Project Status - Visual Progress Bar */}
      {statusLoading ? (
        <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="py-8">
            <div className="flex items-center justify-center gap-3 text-muted-foreground">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Loading project status...</span>
            </div>
          </CardContent>
        </Card>
      ) : statusData ? (
        <section className="space-y-4">
          <Card className="overflow-hidden border-primary/20 bg-gradient-to-br from-background to-primary/5">
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Header with title and percentage */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1 flex-1 min-w-0">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex flex-wrap items-center gap-2">
                    <span className="break-words">{statusData.status.name || 'Project Status'}</span>
                    <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${
                      statusData.status.profile === 'simple' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
                      statusData.status.profile === 'medium' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
                      'bg-purple-500/20 text-purple-600 dark:text-purple-400'
                    }`}>
                      {statusData.status.profile}
                    </span>
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground">Specification workflow progress</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {(() => {
                      const allPhases = ['assessment', 'discovery', 'design', 'access', 'data', 'schema', 'modules', 'features', 'prototype']
                      const activePhases = allPhases.filter(p => !statusData.phases[p]?.skip)
                      const completed = activePhases.filter(p => statusData.phases[p]?.status === 'completed').length
                      return Math.round((completed / activePhases.length) * 100)
                    })()}%
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Complete</div>
                </div>
              </div>

              {/* Visual Progress Steps */}
              {/* Mobile: Vertical layout */}
              <div className="block sm:hidden space-y-4">
                {workflowPhases.map((phase, idx) => {
                  const phaseData = statusData.phases[phase.id]
                  const isSkipped = phaseData?.skip
                  const isCurrent = statusData.status.currentPhase === phase.id
                  const isCompleted = phaseData?.status === 'completed'
                  const isInProgress = phaseData?.status === 'in_progress'

                  if (isSkipped) return null

                  return (
                    <div
                      key={phase.id}
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={() => handlePhaseClick(phase.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === 'Enter' && handlePhaseClick(phase.id)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-all ${
                          isCompleted
                            ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                            : isCurrent || isInProgress
                              ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20 animate-pulse'
                              : 'bg-muted text-muted-foreground border-2 border-muted-foreground/20'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : isCurrent || isInProgress ? (
                          <Clock className="h-5 w-5" />
                        ) : (
                          <span className="text-sm font-medium">{idx + 1}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${
                          isCompleted ? 'text-green-600 dark:text-green-400' :
                          isCurrent || isInProgress ? 'text-primary' :
                          'text-foreground'
                        }`}>
                          {phase.label}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {phase.description}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Desktop: Horizontal layout */}
              <div className="hidden sm:block relative">
                {/* Background track */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-muted rounded-full" />

                {/* Progress fill */}
                <div
                  className="absolute top-5 left-0 h-1 bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-500"
                  style={{
                    width: (() => {
                      const activePhases = workflowPhases.filter(p => !statusData.phases[p.id]?.skip)
                      const currentIdx = activePhases.findIndex(p => p.id === statusData.status.currentPhase)
                      const completedCount = activePhases.filter(p => statusData.phases[p.id]?.status === 'completed').length
                      const progress = completedCount > 0 ? (completedCount / activePhases.length) * 100 :
                                       currentIdx >= 0 ? (currentIdx / activePhases.length) * 100 : 0
                      return `${progress}%`
                    })()
                  }}
                />

                {/* Phase nodes */}
                <div className="relative flex justify-between">
                  {workflowPhases.map((phase, idx) => {
                    const phaseData = statusData.phases[phase.id]
                    const isSkipped = phaseData?.skip
                    const isCurrent = statusData.status.currentPhase === phase.id
                    const isCompleted = phaseData?.status === 'completed'
                    const isInProgress = phaseData?.status === 'in_progress'

                    if (isSkipped) return (
                      <div key={phase.id} className="flex flex-col items-center w-20 opacity-30">
                        <div className="w-10 h-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center bg-background">
                          <span className="text-xs text-muted-foreground">skip</span>
                        </div>
                        <span className="mt-2 text-xs text-muted-foreground line-through">{phase.label}</span>
                      </div>
                    )

                    return (
                      <div
                        key={phase.id}
                        className="flex flex-col items-center w-20 group cursor-pointer"
                        onClick={() => handlePhaseClick(phase.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handlePhaseClick(phase.id)}
                      >
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                            isCompleted
                              ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600'
                              : isCurrent || isInProgress
                                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-primary/20 animate-pulse hover:ring-primary/40'
                                : 'bg-muted text-muted-foreground border-2 border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/80'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : isCurrent || isInProgress ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <span className="text-sm font-medium">{idx + 1}</span>
                          )}
                        </div>
                        <span className={`mt-2 text-xs font-medium text-center transition-colors ${
                          isCompleted ? 'text-green-600 dark:text-green-400 group-hover:text-green-500' :
                          isCurrent || isInProgress ? 'text-primary' :
                          'text-muted-foreground group-hover:text-foreground'
                        }`}>
                          {phase.label}
                        </span>
                        {/* Tooltip on hover */}
                        <div className="hidden group-hover:block absolute -bottom-8 bg-popover text-popover-foreground text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10 border pointer-events-none">
                          <span className="flex items-center gap-1">
                            {phase.description}
                            <ExternalLink className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Current phase indicator */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-center gap-1 sm:gap-2 pt-2">
                <span className="text-xs sm:text-sm text-muted-foreground">Current:</span>
                <span className="text-xs sm:text-sm font-semibold text-primary">
                  {workflowPhases.find(p => p.id === statusData.status.currentPhase)?.label || statusData.status.currentPhase}
                </span>
                <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">
                  — {workflowPhases.find(p => p.id === statusData.status.currentPhase)?.description}
                </span>
                <span className="text-xs text-muted-foreground sm:hidden block mt-1">
                  {workflowPhases.find(p => p.id === statusData.status.currentPhase)?.description}
                </span>
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {/* Features */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
          <p className="text-muted-foreground">Everything you need to build better projects</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:shadow-lg transition-all duration-300 hover:border-primary/50">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="rounded-lg bg-primary/10 p-2.5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="text-muted-foreground">Structured dialogue from idea to working prototype</p>
        </div>

        {/* Workflow Flow Diagram */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Development Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div className="h-[200px] flex items-center justify-center text-muted-foreground">Loading diagram...</div>}>
              <WorkflowDiagram height={200} showLegend={true} interactive={false} />
            </Suspense>
          </CardContent>
        </Card>

        {/* Phase descriptions */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflowPhases.map((phase, index) => (
            <Card key={phase.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold shrink-0">
                    {index + 1}
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold">{phase.label}</h3>
                    <p className="text-sm text-muted-foreground">{phase.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Profiles */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-center text-lg">Adaptive Workflow Profiles</h3>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="space-y-2 text-center p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="font-semibold text-green-700 dark:text-green-400">Simple</div>
                  <p className="text-sm text-muted-foreground">
                    Assessment → Discovery → Data → Features → Prototype
                  </p>
                  <p className="text-xs text-muted-foreground">Landing pages, simple CRUD apps</p>
                </div>
                <div className="space-y-2 text-center p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="font-semibold text-blue-700 dark:text-blue-400">Medium</div>
                  <p className="text-sm text-muted-foreground">
                    + Design, Access, Schema phases
                  </p>
                  <p className="text-xs text-muted-foreground">SaaS, e-commerce, dashboards</p>
                </div>
                <div className="space-y-2 text-center p-4 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <div className="font-semibold text-purple-700 dark:text-purple-400">Complex</div>
                  <p className="text-sm text-muted-foreground">
                    + Modules decomposition phase
                  </p>
                  <p className="text-xs text-muted-foreground">ERP, marketplaces, enterprise apps</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </Container>
  )
}
