// UI Components Registry
export { Button } from './Button'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './Card'
export { Input } from './Input'
export { Badge } from './Badge'
export { FormField } from './FormField'
export { Container } from './container'
export type { ContainerProps } from './container'

// Doc component for documentation links
export { Doc } from '../documented'

// Form Components
export { DatePicker } from './DatePicker'
export { TimePicker } from './TimePicker'
export { PhoneInput } from './PhoneInput'
export { CurrencyInput } from './CurrencyInput'
export { OTPInput } from './OTPInput'
export { Checkbox } from './Checkbox'
export { Switch } from './Switch'
export { RadioGroup, RadioGroupItem } from './RadioGroup'
export { Select, SelectItem, SelectContent, SelectTrigger } from './Select'
export { SmartField, type FieldConfig, type FieldType } from './SmartField'
export { QuickForm, validators, type QuickFieldConfig } from './QuickForm'
export { ChipSelect, type ChipOption } from './ChipSelect'
export { Toggle, toggleVariants } from './Toggle'
export { ToggleGroup, ToggleGroupItem } from './ToggleGroup'
export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from './Popover'
export { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandShortcut, CommandSeparator } from './Command'
export { Combobox, type ComboboxOption } from './Combobox'
export { TagInput } from './TagInput'
export { StarRating } from './StarRating'
export { Slider, RangeSlider } from './Slider'

// Layout Components
export { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs'
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion'

// Status Components
export { Timeline, DeliveryTracker, OrderStatus, type TimelineStep } from './Timeline'
export { Progress, CircularProgress, GaugeProgress, StepProgress } from './Progress'
export { StatusBadge } from './StatusBadge'
export { EmptyState, type EmptyStatePreset } from './EmptyState'

// Data Display Components
export { DataTable, createColumn, Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption } from './DataTable'
export { StatCard, StatGrid, MiniStat } from './StatCard'
export { PriceTag, PriceRangeDisplay } from './PriceTag'

// Navigation Components
export { Breadcrumb, SimpleBreadcrumb, BreadcrumbRoot, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator, BreadcrumbEllipsis } from './Breadcrumb'
export { Pagination, SimplePagination, PaginationInfo, PaginationRoot, PaginationContent, PaginationItem as PaginationItemEl, PaginationButton, PaginationEllipsis } from './Pagination'
export { FormStepper, Wizard, SimpleSteps, ProgressSteps } from './FormStepper'

// Input Components (Extended)
export { SearchInput } from './SearchInput'
export { FileUpload, formatFileSize } from './FileUpload'
export { ImageUpload, AvatarUpload, CoverUpload, MultiImageUpload } from './ImageUpload'
export { ColorPicker, ColorInput, ColorSwatch, GradientPicker, defaultPresets } from './ColorPicker'
export { Signature, CompactSignature } from './Signature'
export { QuantitySelector, CompactQuantity, Stepper } from './QuantitySelector'
export { SizeSelector, SizeGuide, SizePills, SizeGrid, VariantSelector } from './SizeSelector'
export { ColorSelector, ColorDot, ColorStack, commonColors } from './ColorSelector'

// Feedback Components (Extended)
export { Banner, TopBanner, InlineAlert, Callout, CookieBanner, bannerVariants } from './Banner'
export { Spinner, LoadingDots, LoadingBar, LoadingOverlay, PageLoading, ButtonLoading, SkeletonPulse, LoadingContainer } from './LoadingOverlay'

// Feedback Components
export { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogClose } from './Dialog'
export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup,
  DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuRadioGroup,
} from './DropdownMenu'
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, SimpleTooltip } from './Tooltip'
export { Avatar, AvatarRoot, AvatarImage, AvatarFallback } from './Avatar'
export { Skeleton, SkeletonCard, SkeletonAvatar, SkeletonText, SkeletonList } from './Skeleton'
export { Toaster, toast } from './Toaster'
export { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription, DrawerClose } from './Drawer'
export { Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription } from './Sheet'
export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from './Carousel'
export { Lightbox, LightboxImage } from './Lightbox'
export { IconButton, FAB } from './IconButton'
export { Counter, CompactCounter } from './Counter'
export {
  AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger, AlertDialogContent,
  AlertDialogHeader, AlertDialogFooter, AlertDialogTitle, AlertDialogDescription,
  AlertDialogAction, AlertDialogCancel, ConfirmDialog, Alert
} from './AlertDialog'

// Mobile Components
export { MobileList, MobileListItem, MobileListSeparator } from './MobileList'
export { MobileLayout, MobileContent, Screen, ScreenHeader, ScreenBody, ScreenFooter } from './MobileLayout'
export { TopBar, TopBarAction } from './TopBar'
export { BottomNav, type BottomNavItem } from './BottomNav'
export { ActionSheet, type ActionSheetAction } from './ActionSheet'
export { HorizontalScroll, HorizontalScrollItem, ScrollTabs } from './HorizontalScroll'
export { MobileCard, ProductCard, HorizontalCard, StoryCard } from './MobileCard'
export { CardSlider, ProductSlider, StorySlider, BannerSlider } from './CardSlider'
export { MobileFrame, SimpleFrame, BrowserFrame } from './MobileFrame'
export { SwipeActions, SwipeableListItem, createDeleteAction, createArchiveAction, createStarAction, createPinAction, createMuteAction, createMoreAction } from './SwipeActions'
export { SegmentedControl, SimpleSegment, IconSegment } from './SegmentedControl'
export { PageIndicator, ProgressDots, NumberedIndicator } from './PageIndicator'
export { FloatingButton, SimpleFAB, ExtendedFAB } from './FloatingButton'
export { PullToRefresh, RefreshingIndicator } from './PullToRefresh'
export { SearchBar, SearchHeader, SearchSuggestions } from './SearchBar'
export { FilterChips, RemovableChips, FilterButton, FilterBar } from './FilterChips'
export { BottomSheet, SimpleBottomSheet, OptionSheet } from './BottomSheet'
export { MobileToastProvider, useToast, Snackbar, InlineToast } from './MobileToast'
export { SuccessAnimation, FullScreenResult, Confetti } from './SuccessAnimation'
export { ProductGallery, SimpleGallery } from './ProductGallery'
export { CartBadge, NotificationBadge, WishlistBadge, MiniCart } from './CartBadge'

// Component registry for dynamic rendering in previews
import { Button } from './Button'
import { Card } from './Card'
import { Input } from './Input'
import { Badge } from './Badge'
import { ComponentType } from 'react'

export const componentRegistry: Record<string, ComponentType<any>> = {
  button: Button,
  card: Card,
  input: Input,
  badge: Badge,
}
