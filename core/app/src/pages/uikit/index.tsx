import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { UIKitLayout } from './UIKitLayout'
import { Spinner } from '@/components/ui/LoadingOverlay'
import { Toaster } from '@/components/ui/Toaster'

// Lazy load all sections
// Forms
const QuickFormDemo = lazy(() => import('./sections/forms/QuickFormDemo').then(m => ({ default: m.QuickFormDemo })))
const SmartFieldDemo = lazy(() => import('./sections/forms/SmartFieldDemo').then(m => ({ default: m.SmartFieldDemo })))
const ValidatorsDemo = lazy(() => import('./sections/forms/ValidatorsDemo').then(m => ({ default: m.ValidatorsDemo })))

// Data
const DataTableDemo = lazy(() => import('./sections/data/DataTableDemo').then(m => ({ default: m.DataTableDemo })))
const EmptyStateDemo = lazy(() => import('./sections/data/EmptyStateDemo').then(m => ({ default: m.EmptyStateDemo })))

// Inputs
const InputDemo = lazy(() => import('./sections/inputs/InputDemo').then(m => ({ default: m.InputDemo })))

// Selection
const SelectionDemo = lazy(() => import('./sections/selection/SelectionDemo').then(m => ({ default: m.SelectionDemo })))

// DateTime
const DateTimeDemo = lazy(() => import('./sections/datetime/DateTimeDemo').then(m => ({ default: m.DateTimeDemo })))

// Actions
const ActionsDemo = lazy(() => import('./sections/actions/ActionsDemo').then(m => ({ default: m.ActionsDemo })))

// Feedback
const FeedbackDemo = lazy(() => import('./sections/feedback/FeedbackDemo').then(m => ({ default: m.FeedbackDemo })))

// Overlays
const OverlaysDemo = lazy(() => import('./sections/overlays/OverlaysDemo').then(m => ({ default: m.OverlaysDemo })))

// Navigation
const NavigationDemo = lazy(() => import('./sections/navigation/NavigationDemo').then(m => ({ default: m.NavigationDemo })))

// Layout
const LayoutDemo = lazy(() => import('./sections/layout/LayoutDemo').then(m => ({ default: m.LayoutDemo })))

// Media
const MediaDemo = lazy(() => import('./sections/media/MediaDemo').then(m => ({ default: m.MediaDemo })))

// E-commerce
const EcommerceDemo = lazy(() => import('./sections/ecommerce/EcommerceDemo').then(m => ({ default: m.EcommerceDemo })))

// Data Display
const DataDisplayDemo = lazy(() => import('./sections/display/DataDisplayDemo').then(m => ({ default: m.DataDisplayDemo })))

// Special Inputs
const SpecialInputsDemo = lazy(() => import('./sections/special/SpecialInputsDemo').then(m => ({ default: m.SpecialInputsDemo })))

// Mobile
const MobileDemo = lazy(() => import('./sections/mobile/MobileDemo').then(m => ({ default: m.MobileDemo })))

export default function UIKit() {
  return (
    <UIKitLayout>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route index element={<Navigate to="/ui-kit/forms/quickform" replace />} />

          {/* Forms */}
          <Route path="forms/quickform" element={<QuickFormDemo />} />
          <Route path="forms/smartfield" element={<SmartFieldDemo />} />
          <Route path="forms/validators" element={<ValidatorsDemo />} />

          {/* Data */}
          <Route path="data/datatable" element={<DataTableDemo />} />
          <Route path="data/empty-state" element={<EmptyStateDemo />} />

          {/* Inputs */}
          <Route path="inputs/*" element={<InputDemo />} />

          {/* Selection */}
          <Route path="selection/*" element={<SelectionDemo />} />

          {/* Date & Time */}
          <Route path="datetime/*" element={<DateTimeDemo />} />

          {/* Actions */}
          <Route path="actions/*" element={<ActionsDemo />} />

          {/* Feedback */}
          <Route path="feedback/*" element={<FeedbackDemo />} />

          {/* Overlays */}
          <Route path="overlays/*" element={<OverlaysDemo />} />

          {/* Navigation */}
          <Route path="navigation/*" element={<NavigationDemo />} />

          {/* Layout */}
          <Route path="layout/*" element={<LayoutDemo />} />

          {/* Media */}
          <Route path="media/*" element={<MediaDemo />} />

          {/* E-commerce */}
          <Route path="ecommerce/*" element={<EcommerceDemo />} />

          {/* Data Display */}
          <Route path="display/*" element={<DataDisplayDemo />} />

          {/* Special Inputs */}
          <Route path="special/*" element={<SpecialInputsDemo />} />

          {/* Mobile */}
          <Route path="mobile/*" element={<MobileDemo />} />
        </Routes>
      </Suspense>
      <Toaster />
    </UIKitLayout>
  )
}
