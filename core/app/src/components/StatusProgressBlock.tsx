import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Clock, ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui'
import { workflowPhases } from '@/components/WorkflowDiagram'

// Status data types
export interface StatusProgressData {
  status: {
    id?: string
    name?: string
    profile: string
    currentPhase: string
    lastUpdated?: string
  }
  phases: Record<string, {
    status: string
    description?: string
    skip?: boolean
    checklist?: Record<string, boolean>
  }>
}

interface StatusProgressBlockProps {
  statusData: StatusProgressData
  title?: string
  onPhaseClick?: (phaseId: string) => void
}

export function StatusProgressBlock({ statusData, title, onPhaseClick }: StatusProgressBlockProps) {
  const navigate = useNavigate()

  const handlePhaseClick = (phaseId: string) => {
    if (onPhaseClick) {
      onPhaseClick(phaseId)
    }
  }

  // Calculate completion percentage
  const allPhases = ['assessment', 'discovery', 'design', 'access', 'data', 'schema', 'modules', 'features', 'documentation']
  const activePhases = allPhases.filter(p => !statusData.phases[p]?.skip)
  const completed = activePhases.filter(p => statusData.phases[p]?.status === 'completed').length
  const percentage = Math.round((completed / activePhases.length) * 100)

  return (
    <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
      <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-visible">
        {/* Header with title and percentage */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1 flex-1 min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight flex flex-wrap items-center gap-2">
              <span className="break-words">{title || statusData.status.name || 'Project Status'}</span>
              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full text-xs font-semibold whitespace-nowrap shrink-0 ${statusData.status.profile === 'simple' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
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
              {percentage}%
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

            if (isSkipped) return (
              <div
                key={phase.id}
                className="flex items-center gap-4 p-3 rounded-lg opacity-60"
              >
                <div className="relative shrink-0">
                  <div className="relative w-12 h-12 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                    <span className="text-sm font-medium text-muted-foreground">—</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-muted-foreground/70 line-through">
                    {phase.label}
                  </div>
                  <div className="text-sm text-muted-foreground/50 mt-0.5">
                    {phase.description}
                  </div>
                </div>
              </div>
            )

            return (
              <div
                key={phase.id}
                className="flex items-center gap-4 cursor-pointer p-3 rounded-lg hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
                onClick={() => handlePhaseClick(phase.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handlePhaseClick(phase.id)}
              >
                <div className="relative shrink-0">
                  {(isCurrent || isInProgress) && (
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                  )}
                  <div
                    className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCompleted
                      ? 'bg-gradient-to-br from-green-400 to-green-500 text-white'
                      : isCurrent || isInProgress
                        ? 'bg-gradient-to-br from-primary/90 to-primary text-white ring ring-primary/20'
                        : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-muted-foreground'
                      }`}
                    style={{ backdropFilter: 'blur(8px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : isCurrent || isInProgress ? (
                      <Clock className="h-6 w-6" />
                    ) : (
                      <span className="text-base font-bold">{idx + 1}</span>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-base font-medium ${isCompleted ? 'text-green-600 dark:text-green-400' :
                    isCurrent || isInProgress ? 'text-primary font-semibold' :
                      'text-foreground'
                    }`}>
                    {phase.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    {phase.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Desktop: Horizontal layout */}
        <div className="hidden sm:block relative py-6 overflow-visible">
          {/* Background track */}
          <div className="absolute top-[51px] left-0 right-0 h-1 bg-gray-200/50 dark:bg-gray-700/30 rounded-full" />

          {/* Progress fill */}
          <div
            className="absolute top-[51px] left-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-full transition-all duration-700 ease-out"
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
          <div className="relative flex justify-between overflow-visible">
            {workflowPhases.map((phase, idx) => {
              const phaseData = statusData.phases[phase.id]
              const isSkipped = phaseData?.skip
              const isCurrent = statusData.status.currentPhase === phase.id
              const isCompleted = phaseData?.status === 'completed'
              const isInProgress = phaseData?.status === 'in_progress'

              if (isSkipped) return (
                <div key={phase.id} className="flex flex-col items-center w-24 opacity-60">
                  <div className="w-14 h-14 rounded-full border border-dashed border-muted-foreground/30 flex items-center justify-center bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm" style={{ boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
                    <span className="text-sm font-medium text-muted-foreground">—</span>
                  </div>
                  <span className="mt-3 text-sm text-muted-foreground/70 line-through font-medium">{phase.label}</span>
                </div>
              )

              return (
                <div
                  key={phase.id}
                  className="flex flex-col items-center w-24 group cursor-pointer relative"
                  onClick={() => handlePhaseClick(phase.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handlePhaseClick(phase.id)}
                >
                  {/* Step circle */}
                  <div className="relative">
                    {/* Outer glow for active */}
                    {(isCurrent || isInProgress) && (
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
                    )}

                    <div
                      className={`relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                        ? 'bg-gradient-to-br from-green-400 to-green-500 text-white hover:scale-110'
                        : isCurrent || isInProgress
                          ? 'bg-gradient-to-br from-primary/90 to-primary text-white ring ring-primary/20 hover:ring-primary/30 hover:scale-110'
                          : 'bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm text-muted-foreground hover:text-primary hover:scale-105'
                        }`}
                      style={{ backdropFilter: 'blur(8px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-6 w-6" />
                      ) : isCurrent || isInProgress ? (
                        <Clock className="h-6 w-6" />
                      ) : (
                        <span className="text-base font-bold">{idx + 1}</span>
                      )}
                    </div>
                  </div>

                  {/* Label */}
                  <span className={`mt-3 text-sm font-medium text-center transition-all duration-200 ${isCompleted ? 'text-green-600 dark:text-green-400 group-hover:text-green-500' :
                    isCurrent || isInProgress ? 'text-primary font-semibold' :
                      'text-muted-foreground group-hover:text-foreground'
                    }`}>
                    {phase.label}
                  </span>

                  {/* Tooltip on hover */}
                  <div className="hidden group-hover:block absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-foreground text-xs px-3 py-1.5 rounded-lg whitespace-nowrap z-50 border border-white/20 pointer-events-none shadow-sm">
                    <span className="flex items-center gap-1.5">
                      {phase.description}
                      <ExternalLink className="h-3 w-3 opacity-60" />
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
  )
}
