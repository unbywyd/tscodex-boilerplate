import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Circle,
  Clock,
  Target,
  Sparkles,
  Palette,
  Shield,
  Database,
  Code2,
  GitBranch,
  Box,
  AlertCircle,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui'
import { Skeleton } from '@/components/ui/skeleton'
import { loadInterview, type InterviewData } from '@/lib/docs-loader'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { cn } from '@/lib/utils'
import interviewLabels from '@/lib/interview-labels.json'

// Phase icons mapping
const phaseIcons: Record<string, typeof Target> = {
  assessment: Target,
  discovery: Sparkles,
  design: Palette,
  access: Shield,
  data: Database,
  features: Code2,
  modules: GitBranch,
  prototype: Box,
  schema: Database,
}

// Phase colors
const phaseColors: Record<string, string> = {
  assessment: 'from-blue-400 to-blue-600',
  discovery: 'from-purple-400 to-purple-600',
  design: 'from-pink-400 to-pink-600',
  access: 'from-orange-400 to-orange-600',
  data: 'from-green-400 to-green-600',
  features: 'from-cyan-400 to-cyan-600',
  modules: 'from-indigo-400 to-indigo-600',
  prototype: 'from-emerald-400 to-emerald-600',
  schema: 'from-teal-400 to-teal-600',
}

// Profile badges
const profileBadges: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
  simple: { label: 'Simple', variant: 'secondary' },
  medium: { label: 'Medium', variant: 'default' },
  complex: { label: 'Complex', variant: 'outline' },
}

// Status badges
function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'completed':
      return (
        <Badge variant="default" className="bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>
      )
    case 'in_progress':
      return (
        <Badge variant="default" className="bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-500/30">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      )
    default:
      return (
        <Badge variant="secondary" className="bg-muted/50">
          <Circle className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      )
  }
}

// Check if value is empty (string, array, or boolean false)
function isEmpty(value: any): boolean {
  if (value === null || value === undefined) return true
  if (typeof value === 'string') return value === ''
  if (typeof value === 'boolean') return false // boolean is never "empty"
  if (Array.isArray(value)) return value.length === 0
  return false
}

// Format value for display
function formatValue(value: any): string {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (Array.isArray(value)) {
    if (value.length === 0) return '—'
    return value.join(', ')
  }
  return String(value)
}

// Get human-readable label for interview question key
function getQuestionLabel(phaseName: string, key: string): string {
  // First check checklist labels
  const checklistLabels = (interviewLabels as any).checklist?.[phaseName]
  if (checklistLabels && checklistLabels[key]) {
    return checklistLabels[key]
  }
  
  // Then check phase labels
  const phaseLabels = (interviewLabels as any)[phaseName]
  if (phaseLabels && phaseLabels[key]) {
    return phaseLabels[key]
  }
  
  // Fallback: format key as title case
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()).trim()
}

// Collapsible phase section
function PhaseSection({
  phaseName,
  phaseData,
  interviewData,
  isCurrentPhase
}: {
  phaseName: string
  phaseData: any
  interviewData: Record<string, any> | undefined
  isCurrentPhase: boolean
}) {
  const [isOpen, setIsOpen] = useState(isCurrentPhase || phaseData?.status === 'in_progress')
  const Icon = phaseIcons[phaseName] || Circle
  const gradient = phaseColors[phaseName] || 'from-gray-400 to-gray-600'

  // Count answered questions
  const questions = interviewData ? Object.entries(interviewData).filter(([key]) => !key.startsWith('_')) : []
  const answered = questions.filter(([, value]) => !isEmpty(value)).length
  const total = questions.length
  const progress = total > 0 ? Math.round((answered / total) * 100) : 0

  // Checklist progress
  const checklist = phaseData?.checklist ? Object.entries(phaseData.checklist) : []
  const checklistDone = checklist.filter(([, done]) => done).length

  return (
    <Card
      className={cn(
        "!backdrop-blur-xl transition-all duration-300",
        isCurrentPhase
          ? "!bg-gradient-to-br from-blue-500/20 via-blue-400/15 to-blue-500/10 !border-blue-500/50 ring-2 ring-blue-500/30 shadow-lg shadow-blue-500/10 hover:!bg-gradient-to-br hover:from-blue-500/25 hover:via-blue-400/20 hover:to-blue-500/15"
          : "!bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60"
      )}
      style={{ 
        backdropFilter: 'blur(24px)', 
        WebkitBackdropFilter: 'blur(24px)', 
        boxShadow: isCurrentPhase ? '0 8px 24px 0 rgba(59, 130, 246, 0.15)' : '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
      }}
    >
      <CardHeader
        className={cn(
          "cursor-pointer select-none",
          isCurrentPhase && "!bg-transparent"
        )}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`rounded-lg bg-gradient-to-br ${gradient} p-2.5`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="capitalize flex items-center gap-2">
                {phaseName.replace(/([A-Z])/g, ' $1').trim()}
                {isCurrentPhase && (
                  <Badge variant="default" className="bg-blue-600 text-white border-blue-500/50 text-xs font-semibold shadow-sm">
                    Current
                  </Badge>
                )}
              </CardTitle>
              {phaseData?.description && (
                <CardDescription className="mt-1">{phaseData.description}</CardDescription>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={phaseData?.status || 'pending'} />
            {phaseData?.skip && (
              <Badge variant="outline" className="text-xs">Skipped</Badge>
            )}
            {isOpen ? (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        {total > 0 && (
          <div className="mt-3">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Questions answered</span>
              <span>{answered} / {total} ({progress}%)</span>
            </div>
            <div className="h-1.5 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </CardHeader>

      {isOpen && (
        <CardContent className={cn(
          "pt-0 space-y-4",
          isCurrentPhase && "!bg-transparent"
        )}>
          {/* Checklist */}
          {checklist.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Checklist ({checklistDone}/{checklist.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {checklist.map(([key, done]) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center gap-2 text-xs px-2 py-1.5 rounded-md",
                      done
                        ? "bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/30"
                        : "bg-white/40 dark:bg-slate-800/40 text-muted-foreground border border-white/20 dark:border-slate-700/50"
                    )}
                  >
                    {done ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Circle className="h-3.5 w-3.5" />
                    )}
                    <span className="truncate">{getQuestionLabel(phaseName, key)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Interview answers */}
          {questions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Interview Answers</p>
              <div className="space-y-1">
                {questions.map(([key, value]) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-start gap-3 text-sm px-3 py-2.5 rounded-md border transition-colors",
                      isEmpty(value)
                        ? "bg-white/30 dark:bg-slate-800/30 border-white/20 dark:border-slate-700/50"
                        : "bg-white/50 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/50 hover:bg-white/60 dark:hover:bg-slate-800/60"
                    )}
                  >
                    <span className="text-foreground/70 min-w-[140px] font-medium">
                      {getQuestionLabel(phaseName, key)}
                    </span>
                    <span className={cn(
                      "flex-1",
                      isEmpty(value) ? "text-muted-foreground/60 italic" : "text-foreground"
                    )}>
                      {formatValue(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {questions.length === 0 && checklist.length === 0 && (
            <p className="text-sm text-muted-foreground/70 italic text-center py-4">
              No data for this phase yet
            </p>
          )}
        </CardContent>
      )}
    </Card>
  )
}

export default function InterviewPage() {
  const [data, setData] = useState<InterviewData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadInterview()
      .then(setData)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Container size="lg" className="py-8 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-96" />
        <div className="grid gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="lg" className="py-8">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Error Loading Interview Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      </Container>
    )
  }

  const status = data?.status
  const interview = data?.interview
  const currentPhase = status?.status?.currentPhase || 'assessment'
  const profile = status?.status?.profile || 'medium'
  const projectName = interview?.meta?.projectName || 'Untitled Project'

  // Calculate overall progress
  const phases = status?.phases || {}
  const totalPhases = Object.keys(phases).filter(k => !phases[k]?.skip).length
  const completedPhases = Object.values(phases).filter(p => p?.status === 'completed').length
  const overallProgress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0

  // Phase order
  const phaseOrder = ['assessment', 'discovery', 'design', 'access', 'data', 'modules', 'features', 'prototype', 'schema']

  return (
    <>
      <AnimatedBackground />
      <Container size="lg" className="py-8 sm:py-12 md:py-16 space-y-8 relative">
        {/* Header */}
        <section className="text-center space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            {projectName || 'Interview Progress'}
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Track your project specification progress and interview answers
          </p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{overallProgress}%</div>
              <p className="text-xs text-muted-foreground mt-1">Overall Progress</p>
              <div className="mt-2 h-1.5 bg-white/30 dark:bg-slate-800/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold capitalize">{currentPhase}</div>
              <p className="text-xs text-muted-foreground mt-1">Current Phase</p>
            </CardContent>
          </Card>

          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="pt-6">
              <Badge {...profileBadges[profile]} className="text-sm">
                {profileBadges[profile]?.label || profile}
              </Badge>
              <p className="text-xs text-muted-foreground mt-2">Profile</p>
            </CardContent>
          </Card>

          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{completedPhases}/{totalPhases}</div>
              <p className="text-xs text-muted-foreground mt-1">Phases Completed</p>
            </CardContent>
          </Card>
        </section>

        {/* Phases */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Phases</h2>
          <div className="space-y-4">
            {phaseOrder.map(phaseName => {
              const phaseData = phases[phaseName]
              if (!phaseData) return null

              // Get interview data for this phase
              const interviewSection = interview?.[phaseName as keyof typeof interview]
              const interviewData = typeof interviewSection === 'object' && interviewSection !== null
                ? interviewSection as Record<string, any>
                : undefined

              return (
                <PhaseSection
                  key={phaseName}
                  phaseName={phaseName}
                  phaseData={phaseData}
                  interviewData={interviewData}
                  isCurrentPhase={currentPhase === phaseName}
                />
              )
            })}
          </div>
        </section>

        {/* Metadata */}
        <section>
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle className="text-sm">Source Files</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-foreground/70 space-y-2">
              <p>Status: <code className="bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 px-2 py-1 rounded text-foreground">{data?.metadata?.statusPath}</code></p>
              <p>Interview: <code className="bg-white/50 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/50 px-2 py-1 rounded text-foreground">{data?.metadata?.interviewPath}</code></p>
              <p className="text-muted-foreground">Last updated: {status?.status?.lastUpdated || 'N/A'}</p>
            </CardContent>
          </Card>
        </section>
      </Container>
    </>
  )
}
