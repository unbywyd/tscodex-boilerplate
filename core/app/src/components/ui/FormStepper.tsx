// FormStepper / Wizard - Multi-step form component
import * as React from 'react'
import { cn } from '@/lib/utils'
import { Check, ChevronRight, Circle } from 'lucide-react'
import { Button } from './Button'

// ============================================
// Types
// ============================================

interface Step {
  id: string
  title: string
  description?: string
  icon?: React.ReactNode
  optional?: boolean
}

interface FormStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number
  onStepChange?: (step: number) => void
  // Allow clicking on completed steps
  clickable?: boolean
  // Orientation
  orientation?: 'horizontal' | 'vertical'
  // Size
  size?: 'sm' | 'md' | 'lg'
  // Show step numbers
  showNumbers?: boolean
}

// ============================================
// Step Indicator Components
// ============================================

const sizeConfig = {
  sm: { circle: 'w-6 h-6', icon: 'h-3 w-3', text: 'text-xs', title: 'text-sm' },
  md: { circle: 'w-8 h-8', icon: 'h-4 w-4', text: 'text-sm', title: 'text-sm' },
  lg: { circle: 'w-10 h-10', icon: 'h-5 w-5', text: 'text-base', title: 'text-base' },
}

const FormStepper = React.forwardRef<HTMLDivElement, FormStepperProps>(
  (
    {
      steps,
      currentStep,
      onStepChange,
      clickable = true,
      orientation = 'horizontal',
      size = 'md',
      showNumbers = true,
      className,
      ...props
    },
    ref
  ) => {
    const config = sizeConfig[size]
    const isVertical = orientation === 'vertical'

    const handleStepClick = (index: number) => {
      if (clickable && index < currentStep) {
        onStepChange?.(index)
      }
    }

    return (
      <div
        ref={ref}
        className={cn(
          'flex',
          isVertical ? 'flex-col gap-0' : 'items-start gap-2',
          className
        )}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isClickable = clickable && isCompleted

          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  'flex',
                  isVertical ? 'items-start gap-3' : 'flex-col items-center gap-2',
                  isClickable && 'cursor-pointer'
                )}
                onClick={() => handleStepClick(index)}
              >
                {/* Step indicator */}
                <div className={cn(isVertical && 'flex flex-col items-center')}>
                  <div
                    className={cn(
                      'rounded-full flex items-center justify-center font-medium transition-colors',
                      config.circle,
                      isCompleted && 'bg-primary text-primary-foreground',
                      isCurrent && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
                      !isCompleted && !isCurrent && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {isCompleted ? (
                      <Check className={config.icon} />
                    ) : step.icon ? (
                      step.icon
                    ) : showNumbers ? (
                      <span className={config.text}>{index + 1}</span>
                    ) : (
                      <Circle className={config.icon} />
                    )}
                  </div>

                  {/* Vertical connector */}
                  {isVertical && index < steps.length - 1 && (
                    <div
                      className={cn(
                        'w-0.5 flex-1 min-h-[2rem] my-2',
                        isCompleted ? 'bg-primary' : 'bg-muted'
                      )}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className={cn(
                  isVertical ? 'flex-1 pb-8' : 'text-center',
                  index === steps.length - 1 && isVertical && 'pb-0'
                )}>
                  <p
                    className={cn(
                      config.title,
                      'font-medium',
                      isCurrent && 'text-primary',
                      !isCompleted && !isCurrent && 'text-muted-foreground'
                    )}
                  >
                    {step.title}
                    {step.optional && (
                      <span className="ml-1 text-muted-foreground font-normal">(optional)</span>
                    )}
                  </p>
                  {step.description && (
                    <p className={cn(config.text, 'text-muted-foreground mt-0.5')}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Horizontal connector */}
              {!isVertical && index < steps.length - 1 && (
                <div className={cn(
                  'flex-1 h-0.5 mt-4 min-w-[2rem]',
                  index < currentStep ? 'bg-primary' : 'bg-muted'
                )} />
              )}
            </React.Fragment>
          )
        })}
      </div>
    )
  }
)
FormStepper.displayName = 'FormStepper'

// ============================================
// Wizard - Complete multi-step form container
// ============================================

interface WizardProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  // Show navigation buttons
  showNavigation?: boolean
  // Custom labels
  prevLabel?: string
  nextLabel?: string
  finishLabel?: string
  // On finish
  onFinish?: () => void
  // Disable next when invalid
  canProceed?: boolean
  // Loading state
  loading?: boolean
}

const Wizard = React.forwardRef<HTMLDivElement, WizardProps>(
  (
    {
      steps,
      currentStep,
      onStepChange,
      children,
      showNavigation = true,
      prevLabel = 'Previous',
      nextLabel = 'Next',
      finishLabel = 'Finish',
      onFinish,
      canProceed = true,
      loading = false,
      className,
      ...props
    },
    ref
  ) => {
    const isFirstStep = currentStep === 0
    const isLastStep = currentStep === steps.length - 1

    const handlePrev = () => {
      if (!isFirstStep) {
        onStepChange(currentStep - 1)
      }
    }

    const handleNext = () => {
      if (isLastStep) {
        onFinish?.()
      } else {
        onStepChange(currentStep + 1)
      }
    }

    return (
      <div ref={ref} className={cn('space-y-6', className)} {...props}>
        {/* Stepper */}
        <FormStepper
          steps={steps}
          currentStep={currentStep}
          onStepChange={onStepChange}
        />

        {/* Content */}
        <div className="min-h-[200px]">
          {children}
        </div>

        {/* Navigation */}
        {showNavigation && (
          <div className="flex items-center justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={isFirstStep || loading}
            >
              {prevLabel}
            </Button>

            <div className="text-sm text-muted-foreground">
              Step {currentStep + 1} of {steps.length}
            </div>

            <Button
              onClick={handleNext}
              disabled={!canProceed || loading}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : isLastStep ? (
                finishLabel
              ) : (
                <>
                  {nextLabel}
                  <ChevronRight className="ml-1 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    )
  }
)
Wizard.displayName = 'Wizard'

// ============================================
// Simple Steps - Minimal numbered steps
// ============================================

interface SimpleStepsProps {
  total: number
  current: number
  className?: string
}

const SimpleSteps = ({ total, current, className }: SimpleStepsProps) => (
  <div className={cn('flex items-center gap-2', className)}>
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
            i < current && 'bg-primary text-primary-foreground',
            i === current && 'bg-primary text-primary-foreground ring-4 ring-primary/20',
            i > current && 'bg-muted text-muted-foreground'
          )}
        >
          {i < current ? <Check className="h-4 w-4" /> : i + 1}
        </div>
        {i < total - 1 && (
          <div
            className={cn(
              'flex-1 h-0.5',
              i < current ? 'bg-primary' : 'bg-muted'
            )}
          />
        )}
      </React.Fragment>
    ))}
  </div>
)

// ============================================
// Progress Steps - With progress bar
// ============================================

interface ProgressStepsProps {
  steps: string[]
  current: number
  className?: string
}

const ProgressSteps = ({ steps, current, className }: ProgressStepsProps) => {
  const progress = (current / (steps.length - 1)) * 100

  return (
    <div className={cn('space-y-3', className)}>
      {/* Progress bar */}
      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Labels */}
      <div className="flex justify-between">
        {steps.map((step, i) => (
          <span
            key={i}
            className={cn(
              'text-xs transition-colors',
              i <= current ? 'text-primary font-medium' : 'text-muted-foreground'
            )}
          >
            {step}
          </span>
        ))}
      </div>
    </div>
  )
}

export { FormStepper, Wizard, SimpleSteps, ProgressSteps }
