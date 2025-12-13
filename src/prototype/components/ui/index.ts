// UI Components Registry
export { Button } from './Button'
export { Card } from './Card'
export { Input } from './Input'
export { Badge } from './Badge'
export { FormField } from './FormField'

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
export { MobileList, MobileListItem, MobileListSeparator } from '../mobile/MobileList'
export { MobileLayout, MobileContent, Screen, ScreenHeader, ScreenBody, ScreenFooter } from '../mobile/MobileLayout'
export { TopBar, TopBarAction } from '../mobile/TopBar'
export { BottomNav, type BottomNavItem } from '../mobile/BottomNav'
export { ActionSheet, type ActionSheetAction } from '../mobile/ActionSheet'
export { HorizontalScroll, HorizontalScrollItem, ScrollTabs } from '../mobile/HorizontalScroll'
export { MobileCard, ProductCard, HorizontalCard, StoryCard } from '../mobile/MobileCard'
export { CardSlider, ProductSlider, StorySlider, BannerSlider } from '../mobile/CardSlider'
export { MobileFrame, SimpleFrame, BrowserFrame } from '../mobile/MobileFrame'

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
