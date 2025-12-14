import type { LucideIcon } from 'lucide-react'
import {
  FormInput,
  Type,
  ListChecks,
  Calendar,
  MousePointerClick,
  Layers,
  ImageIcon,
  Table,
  Navigation,
  Upload,
  ShoppingCart,
  Smartphone,
  Loader2,
  PanelTop,
  BarChart3,
} from 'lucide-react'

export interface Subsection {
  id: string
  title: string
  path: string
}

export interface Section {
  id: string
  title: string
  icon: LucideIcon
  subsections: Subsection[]
}

export const sections: Section[] = [
  {
    id: 'forms',
    title: 'Forms',
    icon: FormInput,
    subsections: [
      { id: 'quickform', title: 'QuickForm', path: '/ui-kit/forms/quickform' },
      { id: 'smartfield', title: 'SmartField', path: '/ui-kit/forms/smartfield' },
      { id: 'validators', title: 'Validators', path: '/ui-kit/forms/validators' },
    ],
  },
  {
    id: 'inputs',
    title: 'Input Fields',
    icon: Type,
    subsections: [
      { id: 'input', title: 'Input', path: '/ui-kit/inputs/input' },
      { id: 'search', title: 'SearchInput', path: '/ui-kit/inputs/search' },
      { id: 'phone', title: 'PhoneInput', path: '/ui-kit/inputs/phone' },
      { id: 'currency', title: 'CurrencyInput', path: '/ui-kit/inputs/currency' },
      { id: 'otp', title: 'OTPInput', path: '/ui-kit/inputs/otp' },
      { id: 'tags', title: 'TagInput', path: '/ui-kit/inputs/tags' },
    ],
  },
  {
    id: 'selection',
    title: 'Selection',
    icon: ListChecks,
    subsections: [
      { id: 'select', title: 'Select / Dropdown', path: '/ui-kit/selection/select' },
      { id: 'autocomplete', title: 'Autocomplete', path: '/ui-kit/selection/autocomplete' },
      { id: 'checkbox', title: 'Checkbox', path: '/ui-kit/selection/checkbox' },
      { id: 'radio', title: 'Radio Group', path: '/ui-kit/selection/radio' },
      { id: 'switch', title: 'Switch', path: '/ui-kit/selection/switch' },
      { id: 'toggle', title: 'Toggle', path: '/ui-kit/selection/toggle' },
      { id: 'chips', title: 'Chip Select', path: '/ui-kit/selection/chips' },
    ],
  },
  {
    id: 'datetime',
    title: 'Date & Time',
    icon: Calendar,
    subsections: [
      { id: 'datepicker', title: 'Date Picker', path: '/ui-kit/datetime/datepicker' },
      { id: 'timepicker', title: 'Time Picker', path: '/ui-kit/datetime/timepicker' },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    icon: MousePointerClick,
    subsections: [
      { id: 'button', title: 'Button', path: '/ui-kit/actions/button' },
      { id: 'icon-button', title: 'IconButton', path: '/ui-kit/actions/icon-button' },
      { id: 'dropdown', title: 'Dropdown Menu', path: '/ui-kit/actions/dropdown' },
    ],
  },
  {
    id: 'layout',
    title: 'Layout',
    icon: Layers,
    subsections: [
      { id: 'card', title: 'Card', path: '/ui-kit/layout/card' },
      { id: 'container', title: 'Container', path: '/ui-kit/layout/container' },
      { id: 'tabs', title: 'Tabs', path: '/ui-kit/layout/tabs' },
      { id: 'accordion', title: 'Accordion', path: '/ui-kit/layout/accordion' },
    ],
  },
  {
    id: 'overlays',
    title: 'Overlays',
    icon: PanelTop,
    subsections: [
      { id: 'dialog', title: 'Dialog / Modal', path: '/ui-kit/overlays/dialog' },
      { id: 'drawer', title: 'Drawer', path: '/ui-kit/overlays/drawer' },
      { id: 'sheet', title: 'Sheet (Side Panel)', path: '/ui-kit/overlays/sheet' },
      { id: 'popover', title: 'Popover', path: '/ui-kit/overlays/popover' },
      { id: 'alert-dialog', title: 'Alert Dialog', path: '/ui-kit/overlays/alert-dialog' },
      { id: 'tooltip', title: 'Tooltip', path: '/ui-kit/overlays/tooltip' },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback & Loading',
    icon: Loader2,
    subsections: [
      { id: 'progress', title: 'Progress Bar', path: '/ui-kit/feedback/progress' },
      { id: 'circular-progress', title: 'Circular Progress', path: '/ui-kit/feedback/circular-progress' },
      { id: 'skeleton', title: 'Skeleton', path: '/ui-kit/feedback/skeleton' },
      { id: 'spinner', title: 'Spinner & Loading', path: '/ui-kit/feedback/spinner' },
      { id: 'loading-overlay', title: 'Loading Overlay', path: '/ui-kit/feedback/loading-overlay' },
      { id: 'toast', title: 'Toast', path: '/ui-kit/feedback/toast' },
    ],
  },
  {
    id: 'media',
    title: 'Media',
    icon: ImageIcon,
    subsections: [
      { id: 'avatar', title: 'Avatar', path: '/ui-kit/media/avatar' },
      { id: 'carousel', title: 'Carousel', path: '/ui-kit/media/carousel' },
      { id: 'lightbox', title: 'Lightbox', path: '/ui-kit/media/lightbox' },
      { id: 'file-upload', title: 'File Upload', path: '/ui-kit/media/file-upload' },
      { id: 'image-upload', title: 'Image Upload', path: '/ui-kit/media/image-upload' },
    ],
  },
  {
    id: 'data',
    title: 'Data Tables',
    icon: Table,
    subsections: [
      { id: 'datatable', title: 'DataTable', path: '/ui-kit/data/datatable' },
      { id: 'empty-state', title: 'Empty State', path: '/ui-kit/data/empty-state' },
    ],
  },
  {
    id: 'display',
    title: 'Data Display',
    icon: BarChart3,
    subsections: [
      { id: 'badge', title: 'Badge', path: '/ui-kit/display/badge' },
      { id: 'status-badge', title: 'Status Badge', path: '/ui-kit/display/status-badge' },
      { id: 'stat-card', title: 'Stat Card', path: '/ui-kit/display/stat-card' },
      { id: 'timeline', title: 'Timeline', path: '/ui-kit/display/timeline' },
      { id: 'banner', title: 'Banner', path: '/ui-kit/display/banner' },
    ],
  },
  {
    id: 'navigation',
    title: 'Navigation',
    icon: Navigation,
    subsections: [
      { id: 'breadcrumb', title: 'Breadcrumb', path: '/ui-kit/navigation/breadcrumb' },
      { id: 'pagination', title: 'Pagination', path: '/ui-kit/navigation/pagination' },
    ],
  },
  {
    id: 'special',
    title: 'Special Inputs',
    icon: Upload,
    subsections: [
      { id: 'slider', title: 'Slider / Range', path: '/ui-kit/special/slider' },
      { id: 'counter', title: 'Counter', path: '/ui-kit/special/counter' },
      { id: 'signature', title: 'Signature', path: '/ui-kit/special/signature' },
      { id: 'color-picker', title: 'Color Picker', path: '/ui-kit/special/color-picker' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce',
    icon: ShoppingCart,
    subsections: [
      { id: 'price-tag', title: 'Price Tag', path: '/ui-kit/ecommerce/price-tag' },
      { id: 'quantity-selector', title: 'Quantity Selector', path: '/ui-kit/ecommerce/quantity-selector' },
      { id: 'size-selector', title: 'Size Selector', path: '/ui-kit/ecommerce/size-selector' },
      { id: 'color-selector', title: 'Color Selector', path: '/ui-kit/ecommerce/color-selector' },
      { id: 'star-rating', title: 'Star Rating', path: '/ui-kit/ecommerce/star-rating' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    icon: Smartphone,
    subsections: [
      // Layout
      { id: 'mobile-frame', title: 'MobileFrame', path: '/ui-kit/mobile/mobile-frame' },
      { id: 'screen-layout', title: 'Screen Layout', path: '/ui-kit/mobile/screen-layout' },
      { id: 'mobile-list', title: 'MobileList', path: '/ui-kit/mobile/mobile-list' },
      { id: 'topbar', title: 'TopBar', path: '/ui-kit/mobile/topbar' },
      { id: 'bottomnav', title: 'BottomNav', path: '/ui-kit/mobile/bottomnav' },
      { id: 'actionsheet', title: 'ActionSheet', path: '/ui-kit/mobile/actionsheet' },
      { id: 'scroll-tabs', title: 'ScrollTabs', path: '/ui-kit/mobile/scroll-tabs' },
      // Cards
      { id: 'mobile-cards', title: 'Cards', path: '/ui-kit/mobile/mobile-cards' },
      { id: 'card-slider', title: 'CardSlider', path: '/ui-kit/mobile/card-slider' },
      // Actions
      { id: 'swipe-actions', title: 'Swipe Actions', path: '/ui-kit/mobile/swipe-actions' },
      { id: 'segmented-control', title: 'Segmented Control', path: '/ui-kit/mobile/segmented-control' },
      { id: 'page-indicator', title: 'Page Indicator', path: '/ui-kit/mobile/page-indicator' },
      { id: 'floating-button', title: 'Floating Button (FAB)', path: '/ui-kit/mobile/floating-button' },
      // Filters
      { id: 'search-bar', title: 'Search Bar', path: '/ui-kit/mobile/search-bar' },
      { id: 'filter-chips', title: 'Filter Chips', path: '/ui-kit/mobile/filter-chips' },
      { id: 'bottom-sheet', title: 'Bottom Sheet', path: '/ui-kit/mobile/bottom-sheet' },
      // Feedback
      { id: 'success-animation', title: 'Success Animation', path: '/ui-kit/mobile/success-animation' },
      { id: 'product-gallery', title: 'Product Gallery', path: '/ui-kit/mobile/product-gallery' },
      { id: 'cart-badge', title: 'Cart Badge', path: '/ui-kit/mobile/cart-badge' },
      { id: 'mobile-toast', title: 'Mobile Toast', path: '/ui-kit/mobile/mobile-toast' },
    ],
  },
]
