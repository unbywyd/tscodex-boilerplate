import { useState } from 'react'
import { Progress, CircularProgress, GaugeProgress, StepProgress } from '@/components/ui/Progress'
import { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, SkeletonList } from '@/components/ui/Skeleton'
import { Spinner, LoadingDots, LoadingBar, LoadingOverlay } from '@/components/ui/LoadingOverlay'
import { Snackbar, InlineToast } from '@/components/ui/MobileToast'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function FeedbackDemo() {
  useScrollToSection()
  const [progress, setProgress] = useState(65)
  const [showOverlay, setShowOverlay] = useState(false)
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; type?: 'success' | 'error' | 'warning' | 'info' }>({ open: false, message: '' })

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Feedback & Loading"
        description="Progress indicators, skeleton loaders, spinners, and toast notifications."
      />

      {/* Progress */}
      <DemoCard id="progress" title="Progress - Linear Progress Bar">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Linear progress bar with colors, sizes, and value display options.
          </p>
          <CodeBlock
            code={`<Progress value={65} showValue size="md" color="primary" />
<Progress value={80} striped animated color="success" />`}
            id="progress"
          />
          <div className="space-y-6 pt-2">
            <div className="space-y-2">
              <Progress value={progress} showValue />
              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="space-y-3">
              <Progress value={30} size="sm" />
              <Progress value={50} size="md" />
              <Progress value={70} size="lg" showValue valuePosition="inside" />
            </div>
            <div className="space-y-3">
              <Progress value={90} color="success" showValue />
              <Progress value={60} color="warning" showValue />
              <Progress value={40} color="danger" showValue />
            </div>
            <Progress value={75} striped animated color="blue" size="lg" />
          </div>
        </div>
      </DemoCard>

      {/* Circular Progress */}
      <DemoCard id="circular-progress" title="CircularProgress & GaugeProgress">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Circular and gauge-style progress indicators with customizable size and stroke.
          </p>
          <CodeBlock
            code={`<CircularProgress value={75} size={100} strokeWidth={8} />
<GaugeProgress value={80} label="Performance" />`}
            id="circular-progress"
          />
          <div className="flex flex-wrap gap-8 items-end pt-2">
            <CircularProgress value={progress} size={80} />
            <CircularProgress value={progress} size={100} color="success" />
            <CircularProgress value={progress} size={60} strokeWidth={4} showValue={false}>
              <span className="text-xs font-medium">{progress}%</span>
            </CircularProgress>
            <GaugeProgress value={progress} label="Score" />
          </div>
        </div>
      </DemoCard>

      {/* Step Progress */}
      <DemoCard title="StepProgress - Multi-step Progress">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Progress bar showing steps completion (e.g., wizard forms).
          </p>
          <CodeBlock
            code={`<StepProgress currentStep={2} totalSteps={5} />`}
            id="step-progress"
          />
          <div className="space-y-4 pt-2">
            <StepProgress currentStep={1} totalSteps={4} />
            <StepProgress currentStep={2} totalSteps={4} color="blue" />
            <StepProgress currentStep={3} totalSteps={4} color="success" />
            <StepProgress currentStep={4} totalSteps={4} color="success" />
          </div>
        </div>
      </DemoCard>

      {/* Skeleton */}
      <DemoCard id="skeleton" title="Skeleton - Loading Placeholders">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Animated placeholder components for loading states.
          </p>
          <CodeBlock
            code={`<Skeleton className="h-4 w-full" />
<SkeletonAvatar size="lg" />
<SkeletonText lines={3} />
<SkeletonCard />
<SkeletonList items={3} />`}
            id="skeleton"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-2">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Basic Skeletons</h4>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="flex gap-2">
                <SkeletonAvatar size="sm" />
                <SkeletonAvatar size="md" />
                <SkeletonAvatar size="lg" />
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Text Skeleton</h4>
              <SkeletonText lines={4} />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Card Skeleton</h4>
              <SkeletonCard />
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-medium">List Skeleton</h4>
              <SkeletonList items={3} />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Spinners & Loading */}
      <DemoCard id="spinner" title="Spinners & Loading States">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Various loading indicators: spinners, dots, bars.
          </p>
          <CodeBlock
            code={`<Spinner size="lg" color="primary" />
<LoadingDots size="md" />
<LoadingBar />
<LoadingOverlay visible text="Loading..." />`}
            id="spinner"
          />
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <Spinner size="sm" />
                <p className="text-xs mt-2">sm</p>
              </div>
              <div className="text-center">
                <Spinner size="md" color="primary" />
                <p className="text-xs mt-2">md</p>
              </div>
              <div className="text-center">
                <Spinner size="lg" color="primary" />
                <p className="text-xs mt-2">lg</p>
              </div>
              <div className="text-center">
                <Spinner size="xl" color="primary" />
                <p className="text-xs mt-2">xl</p>
              </div>
            </div>
            <div className="flex items-center gap-8">
              <div className="text-center">
                <LoadingDots size="sm" />
                <p className="text-xs mt-2">Dots sm</p>
              </div>
              <div className="text-center">
                <LoadingDots size="md" color="primary" />
                <p className="text-xs mt-2">Dots md</p>
              </div>
              <div className="text-center">
                <LoadingDots size="lg" color="primary" />
                <p className="text-xs mt-2">Dots lg</p>
              </div>
            </div>
            <div className="max-w-md">
              <LoadingBar />
              <p className="text-xs mt-2">Indeterminate Loading Bar</p>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Loading Overlay */}
      <DemoCard id="loading-overlay" title="LoadingOverlay">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Full container overlay for blocking interactions during loading.
          </p>
          <Button onClick={() => setShowOverlay(true)}>Show Overlay (2s)</Button>
          <div className="relative h-48 bg-muted/30 rounded-lg">
            <div className="p-4">
              <p className="text-sm">Content behind overlay</p>
              <p className="text-xs text-muted-foreground">This area will be covered by the overlay</p>
            </div>
            <LoadingOverlay
              visible={showOverlay}
              text="Processing..."
              blur
            />
          </div>
          {showOverlay && setTimeout(() => setShowOverlay(false), 2000) && null}
        </div>
      </DemoCard>

      {/* Toast / Snackbar */}
      <DemoCard id="toast" title="Toast / Snackbar Notifications">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Toast notifications for user feedback. Snackbar for simple controlled notifications,
            or useToast hook with MobileToastProvider for global toast management.
          </p>
          <CodeBlock
            code={`// Snackbar - controlled component (no provider needed)
<Snackbar
  open={open}
  message="Item deleted"
  onClose={() => setOpen(false)}
  action={{ label: "Undo", onClick: handleUndo }}
/>

// InlineToast - static inline notifications
<InlineToast type="success" message="Changes saved!" />

// useToast hook (requires MobileToastProvider)
const { show } = useToast()
show({ message: "Success!", type: "success" })`}
            id="toast-code"
          />
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => setSnackbar({ open: true, message: 'Action completed!', type: 'success' })}>
                Success Toast
              </Button>
              <Button variant="destructive" onClick={() => setSnackbar({ open: true, message: 'Something went wrong', type: 'error' })}>
                Error Toast
              </Button>
              <Button variant="outline" onClick={() => setSnackbar({ open: true, message: 'Please check your input', type: 'warning' })}>
                Warning Toast
              </Button>
              <Button variant="secondary" onClick={() => setSnackbar({ open: true, message: 'New updates available', type: 'info' })}>
                Info Toast
              </Button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">InlineToast (static):</p>
              <div className="space-y-2">
                <InlineToast type="success" message="Your changes have been saved successfully." />
                <InlineToast type="error" message="Failed to connect to the server." />
                <InlineToast type="warning" message="Your session will expire in 5 minutes." />
                <InlineToast type="info" message="New features are available. Check the changelog." />
              </div>
            </div>
          </div>

          <Snackbar
            open={snackbar.open}
            message={snackbar.message}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            position="bottom"
          />
        </div>
      </DemoCard>

      {/* Props Reference */}
      <DemoCard title="Props Reference">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 pr-4">Component</th>
                <th className="text-left py-2 pr-4">Key Props</th>
                <th className="text-left py-2">Notes</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">Progress</td>
                <td className="py-2 pr-4">value, size, color, striped, animated, showValue</td>
                <td className="py-2">valuePosition: inside/right/top</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">CircularProgress</td>
                <td className="py-2 pr-4">value, size (px), strokeWidth, color</td>
                <td className="py-2">SVG-based</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">GaugeProgress</td>
                <td className="py-2 pr-4">value, size, label</td>
                <td className="py-2">Semi-circle gauge</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">StepProgress</td>
                <td className="py-2 pr-4">currentStep, totalSteps</td>
                <td className="py-2">Shows "2/5" format</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Skeleton</td>
                <td className="py-2 pr-4">variant (default/circular/text), width, height</td>
                <td className="py-2">Base skeleton</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Spinner</td>
                <td className="py-2 pr-4">size (sm/md/lg/xl), color</td>
                <td className="py-2">Rotating icon</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">LoadingOverlay</td>
                <td className="py-2 pr-4">visible, text, blur, dark, fullScreen</td>
                <td className="py-2">Blocks container</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Snackbar</td>
                <td className="py-2 pr-4">open, message, onClose, action, duration</td>
                <td className="py-2">Controlled component</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">InlineToast</td>
                <td className="py-2 pr-4">type, message, onDismiss</td>
                <td className="py-2">Static inline notification</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">useToast</td>
                <td className="py-2 pr-4">show(), dismiss(), dismissAll()</td>
                <td className="py-2">Requires MobileToastProvider</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
