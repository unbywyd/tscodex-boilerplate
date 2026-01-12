import { useMemo } from 'react'
import {
  ReactFlow,
  Background,
  type Node,
  type Edge,
  MarkerType,
  Position,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

// Workflow phases in correct order
export const workflowPhases = [
  { id: 'assessment', label: 'Assessment', type: 'start' as const, description: 'Determine project complexity' },
  { id: 'discovery', label: 'Discovery', type: 'action' as const, description: 'Define problem & audience' },
  { id: 'design', label: 'Design', type: 'action' as const, description: 'Visual requirements' },
  { id: 'access', label: 'Access', type: 'action' as const, description: 'Roles & permissions' },
  { id: 'data', label: 'Data Model', type: 'action' as const, description: 'Entities & fields' },
  { id: 'schema', label: 'Schema', type: 'subprocess' as const, description: 'Prisma generation' },
  { id: 'modules', label: 'Modules', type: 'action' as const, description: 'Domain decomposition' },
  { id: 'features', label: 'Features', type: 'action' as const, description: 'Use cases & routes' },
  { id: 'documentation', label: 'Docs', type: 'end' as const, description: 'Platform documentation' },
] as const

const phaseColors: Record<string, { bg: string; border: string }> = {
  start: { bg: '#22c55e', border: '#16a34a' },
  end: { bg: '#8b5cf6', border: '#7c3aed' },
  action: { bg: '#3b82f6', border: '#2563eb' },
  subprocess: { bg: '#f59e0b', border: '#d97706' },
}

interface WorkflowDiagramProps {
  height?: number
  showLegend?: boolean
  interactive?: boolean
}

export default function WorkflowDiagram({
  height = 200,
  showLegend = true,
  interactive = false
}: WorkflowDiagramProps) {
  const nodes: Node[] = useMemo(() => {
    const nodeWidth = 120
    const nodeSpacing = 40
    const startX = 50

    return workflowPhases.map((phase, index) => {
      const colors = phaseColors[phase.type]
      const isTerminal = phase.type === 'start' || phase.type === 'end'

      return {
        id: phase.id,
        type: 'default',
        position: {
          x: startX + index * (nodeWidth + nodeSpacing),
          y: 60,
        },
        data: {
          label: (
            <div className="text-center">
              <div className="font-semibold text-xs">{phase.label}</div>
            </div>
          )
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
        style: {
          background: colors.bg,
          color: 'white',
          border: `2px solid ${colors.border}`,
          borderRadius: isTerminal ? '24px' : '8px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 500,
          width: nodeWidth,
          textAlign: 'center' as const,
        },
      }
    })
  }, [])

  const edges: Edge[] = useMemo(() => {
    return workflowPhases.slice(0, -1).map((phase, index) => ({
      id: `e-${phase.id}-${workflowPhases[index + 1].id}`,
      source: phase.id,
      target: workflowPhases[index + 1].id,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: '#94a3b8',
      },
    }))
  }, [])

  return (
    <div className="workflow-diagram">
      {showLegend && (
        <div className="flex gap-6 mb-4 justify-center flex-wrap text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ background: phaseColors.start.bg }} />
            <span className="text-muted-foreground">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: phaseColors.action.bg }} />
            <span className="text-muted-foreground">Phase</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ background: phaseColors.subprocess.bg }} />
            <span className="text-muted-foreground">Generation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ background: phaseColors.end.bg }} />
            <span className="text-muted-foreground">Output</span>
          </div>
        </div>
      )}

      <div
        className="border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/50"
        style={{ height }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          nodesDraggable={interactive}
          nodesConnectable={false}
          elementsSelectable={interactive}
          panOnDrag={interactive}
          zoomOnScroll={interactive}
          zoomOnPinch={interactive}
          zoomOnDoubleClick={false}
          preventScrolling={!interactive}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2e8f0" gap={20} />
        </ReactFlow>
      </div>
    </div>
  )
}
