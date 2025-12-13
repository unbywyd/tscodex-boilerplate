// UIKit - Documentation and reference for all available UI components
// This is part of the core system, not prototype - always available as reference
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/ui/container'
import { QuickForm, validators, type QuickFieldConfig } from '@prototype/components/ui/QuickForm'
import { SmartField } from '@prototype/components/ui/SmartField'
import { Card } from '@prototype/components/ui/Card'
import {
  Palette,
  Copy,
  Check,
  FormInput,
  ToggleLeft,
  Calendar,
  ListChecks,
  ChevronRight,
  Type,
  Hash,
  Mail,
  Lock,
  Phone,
  Globe,
  DollarSign,
  KeyRound,
  Search,
  FileText,
  MousePointerClick,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { Toggle } from '@prototype/components/ui/Toggle'
import { ToggleGroup, ToggleGroupItem } from '@prototype/components/ui/ToggleGroup'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@prototype/components/ui/Tabs'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@prototype/components/ui/Accordion'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@prototype/components/ui/Dialog'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '@prototype/components/ui/DropdownMenu'
import { SimpleTooltip } from '@prototype/components/ui/Tooltip'
import { Avatar } from '@prototype/components/ui/Avatar'
import { SkeletonList, SkeletonCard } from '@prototype/components/ui/Skeleton'
import { toast, Toaster } from '@prototype/components/ui/Toaster'
import { Button } from '@prototype/components/ui/Button'
import { Layers, MessageSquare, MoreVertical, Edit, Copy as CopyIcon, Trash2, User, Settings, LogOut, HelpCircle, Smartphone, Bell, Home, Heart, Share2, Wifi, Moon, Volume2, Shield, CreditCard, Plus, ImageIcon } from 'lucide-react'
import { MobileList, MobileListItem } from '@prototype/components/mobile/MobileList'
import { TopBar, TopBarAction } from '@prototype/components/mobile/TopBar'
import { type BottomNavItem } from '@prototype/components/mobile/BottomNav'
import { ActionSheet } from '@prototype/components/mobile/ActionSheet'
import { ScrollTabs } from '@prototype/components/mobile/HorizontalScroll'
import { ProductCard, StoryCard, HorizontalCard } from '@prototype/components/mobile/MobileCard'
import { CardSlider, ProductSlider, BannerSlider } from '@prototype/components/mobile/CardSlider'
import { MobileFrame, SimpleFrame } from '@prototype/components/mobile/MobileFrame'
import { Screen, ScreenHeader, ScreenBody, ScreenFooter } from '@prototype/components/mobile/MobileLayout'
import { BottomNav } from '@prototype/components/mobile/BottomNav'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from '@prototype/components/ui/Carousel'
import { Slider, RangeSlider } from '@prototype/components/ui/Slider'
import { StarRating } from '@prototype/components/ui/StarRating'
import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from '@prototype/components/ui/Drawer'
import { Lightbox } from '@prototype/components/ui/Lightbox'
import { IconButton } from '@prototype/components/ui/IconButton'
import { Counter, CompactCounter } from '@prototype/components/ui/Counter'
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@prototype/components/ui/Sheet'
import { Progress, CircularProgress, GaugeProgress, StepProgress } from '@prototype/components/ui/Progress'
import { Timeline, DeliveryTracker, OrderStatus } from '@prototype/components/ui/Timeline'
import { Loader2 } from 'lucide-react'

// Sidebar sections configuration
const sections = [
  {
    id: 'forms',
    title: 'Forms',
    icon: FormInput,
    subsections: [
      { id: 'quickform', title: 'QuickForm' },
      { id: 'smartfield', title: 'SmartField' },
      { id: 'validators', title: 'Validators' },
    ],
  },
  {
    id: 'inputs',
    title: 'Input Fields',
    icon: Type,
    subsections: [
      { id: 'text-inputs', title: 'Text Inputs' },
      { id: 'number-inputs', title: 'Number & Currency' },
      { id: 'special-inputs', title: 'Phone, OTP, URL' },
    ],
  },
  {
    id: 'selection',
    title: 'Selection',
    icon: ListChecks,
    subsections: [
      { id: 'checkbox', title: 'Checkbox' },
      { id: 'switch', title: 'Switch' },
      { id: 'radio', title: 'Radio Group' },
      { id: 'select', title: 'Select / Dropdown' },
      { id: 'autocomplete', title: 'Autocomplete' },
      { id: 'chips', title: 'Chip Select' },
      { id: 'tags', title: 'Tag Input' },
    ],
  },
  {
    id: 'datetime',
    title: 'Date & Time',
    icon: Calendar,
    subsections: [
      { id: 'datepicker', title: 'Date Picker' },
      { id: 'timepicker', title: 'Time Picker' },
    ],
  },
  {
    id: 'actions',
    title: 'Actions',
    icon: MousePointerClick,
    subsections: [
      { id: 'button', title: 'Button' },
      { id: 'toggle', title: 'Toggle' },
      { id: 'toggle-group', title: 'Toggle Group' },
      { id: 'counter', title: 'Counter' },
    ],
  },
  {
    id: 'layout',
    title: 'Layout',
    icon: Layers,
    subsections: [
      { id: 'tabs', title: 'Tabs' },
      { id: 'accordion', title: 'Accordion' },
    ],
  },
  {
    id: 'feedback',
    title: 'Feedback',
    icon: MessageSquare,
    subsections: [
      { id: 'dialog', title: 'Dialog / Modal' },
      { id: 'toast', title: 'Toast' },
      { id: 'dropdown', title: 'Dropdown Menu' },
      { id: 'tooltip', title: 'Tooltip' },
      { id: 'avatar', title: 'Avatar' },
      { id: 'skeleton', title: 'Skeleton' },
      { id: 'drawer', title: 'Drawer' },
      { id: 'sheet', title: 'Sheet (Side Panel)' },
      { id: 'lightbox', title: 'Lightbox' },
    ],
  },
  {
    id: 'media',
    title: 'Media',
    icon: ImageIcon,
    subsections: [
      { id: 'carousel', title: 'Carousel' },
      { id: 'slider', title: 'Slider' },
      { id: 'star-rating', title: 'Star Rating' },
      { id: 'icon-button', title: 'Icon Button' },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile',
    icon: Smartphone,
    subsections: [
      { id: 'mobile-frame', title: 'MobileFrame' },
      { id: 'screen-layout', title: 'Screen Layout' },
      { id: 'mobile-list', title: 'MobileList' },
      { id: 'topbar', title: 'TopBar' },
      { id: 'bottomnav', title: 'BottomNav' },
      { id: 'actionsheet', title: 'ActionSheet' },
      { id: 'scroll-tabs', title: 'ScrollTabs' },
      { id: 'mobile-cards', title: 'Cards' },
      { id: 'card-slider', title: 'CardSlider' },
    ],
  },
  {
    id: 'status',
    title: 'Status',
    icon: Loader2,
    subsections: [
      { id: 'progress', title: 'Progress Bar' },
      { id: 'circular-progress', title: 'Circular Progress' },
      { id: 'timeline', title: 'Timeline' },
    ],
  },
  {
    id: 'states',
    title: 'States',
    icon: ToggleLeft,
    subsections: [
      { id: 'error-states', title: 'Error States' },
      { id: 'disabled-states', title: 'Disabled States' },
    ],
  },
]

// Code examples
const codeExamples = {
  quickform: `<QuickForm
  fields={[
    { name: 'name', type: 'string', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'role', type: 'enum', options: ['User', 'Admin'] },
  ]}
  onSubmit={(data) => console.log(data)}
  columns={2}
/>`,
  smartfield: `<SmartField
  name="email"
  type="email"
  label="Email"
  value={value}
  onChange={setValue}
  required
/>`,
  validators: `import { validators } from '@prototype/components/ui/QuickForm'

// Available validators:
validators.required('Custom message')
validators.email()
validators.minLength(3)
validators.maxLength(100)
validators.min(0)
validators.max(999)
validators.pattern(/^[A-Z]/, 'Must start with capital')
validators.match('password', 'Passwords must match')`,
}

// Field type definitions with icons
const fieldTypeGroups = {
  text: [
    { type: 'string', icon: Type, desc: 'Text input', code: `<SmartField name="title" type="string" label="Title" />` },
    { type: 'email', icon: Mail, desc: 'Email with validation', code: `<SmartField name="email" type="email" label="Email" />` },
    { type: 'password', icon: Lock, desc: 'Password field', code: `<SmartField name="pass" type="password" label="Password" />` },
    { type: 'text', icon: FileText, desc: 'Multiline textarea', code: `<SmartField name="bio" type="text" rows={4} />` },
    { type: 'search', icon: Search, desc: 'Search input', code: `<SmartField name="q" type="search" placeholder="Search..." />` },
  ],
  numbers: [
    { type: 'number', icon: Hash, desc: 'Numeric input', code: `<SmartField name="age" type="number" min={0} max={120} />` },
    { type: 'currency', icon: DollarSign, desc: 'Money input', code: `<SmartField name="price" type="currency" currency="USD" />` },
  ],
  special: [
    { type: 'phone', icon: Phone, desc: 'Phone with country', code: `<SmartField name="phone" type="phone" />` },
    { type: 'url', icon: Globe, desc: 'URL input', code: `<SmartField name="website" type="url" />` },
    { type: 'otp', icon: KeyRound, desc: 'Verification code', code: `<SmartField name="code" type="otp" otpLength={6} />` },
  ],
  selection: [
    { type: 'checkbox', desc: 'Radix checkbox', code: `<SmartField name="agree" type="checkbox" label="I agree" />` },
    { type: 'switch', desc: 'Toggle switch', code: `<SmartField name="active" type="switch" label="Active" />` },
    { type: 'radio', desc: 'Radio group', code: `<SmartField name="size" type="radio" options={['S', 'M', 'L']} />` },
    { type: 'enum', desc: 'Dropdown select', code: `<SmartField name="role" type="enum" options={['A', 'B']} />` },
    { type: 'autocomplete', desc: 'Searchable dropdown', code: `<SmartField name="country" type="autocomplete" options={['USA', 'UK', 'Germany']} />` },
    { type: 'chip', desc: 'Single chip select', code: `<SmartField name="size" type="chip" options={['S', 'M', 'L', 'XL']} />` },
    { type: 'chips', desc: 'Multi chip select', code: `<SmartField name="tags" type="chips" options={['React', 'Vue', 'Angular']} />` },
    { type: 'tags', desc: 'Free-form tag input', code: `<SmartField name="keywords" type="tags" maxTags={5} />` },
  ],
  datetime: [
    { type: 'date', icon: Calendar, desc: 'Date picker', code: `<SmartField name="date" type="date" locale="ru" />` },
    { type: 'time', desc: 'Time picker', code: `<SmartField name="time" type="time" />` },
  ],
}

export default function UIKit() {
  const [activeSection, setActiveSection] = useState('forms')
  const [activeSubsection, setActiveSubsection] = useState('quickform')
  const [formResult, setFormResult] = useState<Record<string, unknown> | null>(null)
  const [standaloneValues, setStandaloneValues] = useState<Record<string, unknown>>({})
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  // Mobile section states (must be at top level for hooks rules)
  const [mobileActiveTab, setMobileActiveTab] = useState('home')
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [scrollTabValue, setScrollTabValue] = useState('all')
  // Media section states
  const [sliderValue, setSliderValue] = useState([50])
  const [rangeValue, setRangeValue] = useState<[number, number]>([20, 80])
  const [ratingValue, setRatingValue] = useState(3.5)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Full form example
  const registrationFields: QuickFieldConfig[] = [
    { name: 'name', type: 'string', label: 'Full Name', placeholder: 'John Doe', required: true, validation: [validators.minLength(2)] },
    { name: 'email', type: 'email', label: 'Email', required: true, validation: [validators.email()] },
    { name: 'password', type: 'password', label: 'Password', required: true, validation: [validators.minLength(6, 'Min 6 characters')] },
    { name: 'phone', type: 'phone', label: 'Phone Number', required: true },
    { name: 'birthDate', type: 'date', label: 'Birth Date', locale: 'ru' },
    { name: 'role', type: 'enum', label: 'Role', options: ['User', 'Admin', 'Moderator'], required: true },
    { name: 'salary', type: 'currency', label: 'Expected Salary', currency: 'USD' },
    { name: 'bio', type: 'text', label: 'About You', placeholder: 'Tell us about yourself...', rows: 3, colSpan: 2 },
    { name: 'acceptTerms', type: 'checkbox', label: 'I accept the terms and conditions', required: true },
  ]

  const handleRegistration = (data: Record<string, unknown>) => {
    setFormResult(data)
  }

  const updateValue = (key: string) => (value: unknown) => {
    setStandaloneValues((prev) => ({ ...prev, [key]: value }))
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const handleSectionClick = (sectionId: string, subsectionId?: string) => {
    setActiveSection(sectionId)
    if (subsectionId) {
      setActiveSubsection(subsectionId)
    } else {
      const section = sections.find((s) => s.id === sectionId)
      if (section?.subsections[0]) {
        setActiveSubsection(section.subsections[0].id)
      }
    }
  }

  // Code block component
  const CodeBlock = ({ code, id }: { code: string; id: string }) => (
    <div className="relative group">
      <pre className="text-xs bg-muted p-3 rounded-lg overflow-x-auto">
        <code>{code}</code>
      </pre>
      <button
        onClick={() => copyCode(code, id)}
        className="absolute top-2 right-2 p-1.5 rounded bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Copy code"
      >
        {copiedCode === id ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
      </button>
    </div>
  )

  // Render active content based on section/subsection
  const renderContent = () => {
    // Forms section
    if (activeSection === 'forms') {
      if (activeSubsection === 'quickform') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">QuickForm</h2>
              <p className="text-muted-foreground">
                Declarative form builder with built-in validation. Define fields as config and get a fully functional form.
              </p>
            </div>

            <CodeBlock code={codeExamples.quickform} id="quickform" />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example: Registration Form</h3>
              <QuickForm
                fields={registrationFields}
                onSubmit={handleRegistration}
                submitLabel="Register"
                showReset
                columns={2}
                gap="md"
              />
              {formResult && (
                <div className="mt-6 p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Form Result:</h4>
                  <pre className="text-sm overflow-auto">{JSON.stringify(formResult, null, 2)}</pre>
                </div>
              )}
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">fields</code>
                  <span className="text-muted-foreground">QuickFieldConfig[] - Field definitions</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onSubmit</code>
                  <span className="text-muted-foreground">(data) =&gt; void - Submit handler</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">columns</code>
                  <span className="text-muted-foreground">1 | 2 | 3 - Grid columns (default: 1)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">gap</code>
                  <span className="text-muted-foreground">'sm' | 'md' | 'lg' - Grid gap</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">showReset</code>
                  <span className="text-muted-foreground">boolean - Show reset button</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'smartfield') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">SmartField</h2>
              <p className="text-muted-foreground">
                Universal form field component. Automatically renders the right input based on type.
              </p>
            </div>

            <CodeBlock code={codeExamples.smartfield} id="smartfield" />

            <div className="space-y-3">
              <h3 className="font-semibold">Supported Types</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                {['string', 'email', 'password', 'number', 'text', 'checkbox', 'switch', 'enum', 'radio', 'autocomplete', 'chip', 'chips', 'tags', 'date', 'time', 'phone', 'currency', 'otp', 'url', 'search'].map((type) => (
                  <code key={type} className="bg-muted px-2 py-1 rounded text-center">
                    {type}
                  </code>
                ))}
              </div>
            </div>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Interactive Examples</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SmartField name="demo-string" type="string" label="String" placeholder="Enter text..." value={standaloneValues.string} onChange={updateValue('string')} />
                <SmartField name="demo-email" type="email" label="Email" value={standaloneValues.email} onChange={updateValue('email')} />
                <SmartField name="demo-number" type="number" label="Number" min={0} max={100} value={standaloneValues.number} onChange={updateValue('number')} />
                <SmartField name="demo-enum" type="enum" label="Select" options={['Option A', 'Option B', 'Option C']} value={standaloneValues.enum} onChange={updateValue('enum')} />
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'validators') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Validators</h2>
              <p className="text-muted-foreground">Built-in validation functions for QuickForm fields.</p>
            </div>

            <CodeBlock code={codeExamples.validators} id="validators" />

            <div className="space-y-4">
              <h3 className="font-semibold">Available Validators</h3>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.required(message?)</code>
                  <p className="text-muted-foreground mt-1">Field must have a value</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.email(message?)</code>
                  <p className="text-muted-foreground mt-1">Must be valid email format</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.minLength(min, message?)</code>
                  <p className="text-muted-foreground mt-1">Minimum string length</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.maxLength(max, message?)</code>
                  <p className="text-muted-foreground mt-1">Maximum string length</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.min(value, message?)</code>
                  <p className="text-muted-foreground mt-1">Minimum numeric value</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.max(value, message?)</code>
                  <p className="text-muted-foreground mt-1">Maximum numeric value</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.pattern(regex, message?)</code>
                  <p className="text-muted-foreground mt-1">Must match regex pattern</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <code className="font-medium">validators.match(fieldName, message?)</code>
                  <p className="text-muted-foreground mt-1">Must match another field (e.g., confirm password)</p>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    // Inputs section
    if (activeSection === 'inputs') {
      const groups: Record<string, typeof fieldTypeGroups.text> = {
        'text-inputs': fieldTypeGroups.text,
        'number-inputs': fieldTypeGroups.numbers,
        'special-inputs': fieldTypeGroups.special,
      }
      const items = groups[activeSubsection] || []
      const titles: Record<string, string> = {
        'text-inputs': 'Text Inputs',
        'number-inputs': 'Number & Currency',
        'special-inputs': 'Phone, OTP, URL',
      }

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{titles[activeSubsection]}</h2>
            <p className="text-muted-foreground">Input field variations with different purposes and validations.</p>
          </div>

          <div className="space-y-4">
            {items.map(({ type, icon: Icon, desc, code }) => (
              <Card key={type} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
                    <code className="font-medium">{type}</code>
                    <span className="text-muted-foreground text-sm">— {desc}</span>
                  </div>
                  <button onClick={() => copyCode(code, type)} className="p-1 hover:bg-muted rounded" title="Copy code">
                    {copiedCode === type ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                  </button>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <SmartField name={`demo-${type}`} type={type as any} label={`${type} example`} value={standaloneValues[type]} onChange={updateValue(type)} {...(type === 'currency' ? { currency: 'USD' } : {})} {...(type === 'otp' ? { otpLength: 6 } : {})} />
                  <pre className="text-xs bg-muted p-2 rounded overflow-x-auto">
                    <code>{code}</code>
                  </pre>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )
    }

    // Selection section
    if (activeSection === 'selection') {
      // Special handling for autocomplete subsection
      if (activeSubsection === 'autocomplete') {
        const countries = ['United States', 'United Kingdom', 'Germany', 'France', 'Japan', 'Canada', 'Australia', 'Brazil', 'India', 'China']
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Autocomplete</h2>
              <p className="text-muted-foreground">
                Searchable dropdown with filtering. Built on cmdk for fast keyboard navigation.
                Great for large lists of options (countries, cities, users, etc.).
              </p>
            </div>

            <CodeBlock
              code={`<SmartField
  name="country"
  type="autocomplete"
  label="Select country"
  options={['USA', 'UK', 'Germany', 'France', ...]}
  placeholder="Search..."
/>`}
              id="autocomplete-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <div className="max-w-sm">
                <SmartField
                  name="demo-autocomplete"
                  type="autocomplete"
                  label="Select country"
                  options={countries}
                  placeholder="Search countries..."
                  value={standaloneValues.autocomplete}
                  onChange={updateValue('autocomplete')}
                />
              </div>
              {typeof standaloneValues.autocomplete === 'string' && standaloneValues.autocomplete && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Selected: <strong>{standaloneValues.autocomplete}</strong>
                </p>
              )}
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Features</h3>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Keyboard navigation (arrows, enter, escape)</li>
                <li>Type to filter options</li>
                <li>Empty state when no matches</li>
                <li>Supports both string[] and object[] options</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">options</code>
                  <span className="text-muted-foreground">string[] | {'{ value, label }'}[]</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">placeholder</code>
                  <span className="text-muted-foreground">Trigger button placeholder</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">searchPlaceholder</code>
                  <span className="text-muted-foreground">Search input placeholder</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">emptyText</code>
                  <span className="text-muted-foreground">Text when no results found</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // Special handling for chips subsection
      if (activeSubsection === 'chips') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Chip Select</h2>
              <p className="text-muted-foreground">
                Tag-based selection components. Works like radio (single) or checkbox (multi) but displayed as chips/tags.
                Popular in mobile UI for filters, categories, sizes, etc.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="font-semibold mb-3">Single Select (chip)</h3>
                <CodeBlock code={`<SmartField name="size" type="chip" options={['S', 'M', 'L', 'XL']} />`} id="chip-single" />
                <div className="mt-4">
                  <SmartField name="demo-chip" type="chip" label="Select size" options={['S', 'M', 'L', 'XL']} value={standaloneValues.chip} onChange={updateValue('chip')} />
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold mb-3">Multi Select (chips)</h3>
                <CodeBlock code={`<SmartField name="tags" type="chips" options={['React', 'Vue', 'Angular']} />`} id="chip-multi" />
                <div className="mt-4">
                  <SmartField name="demo-chips" type="chips" label="Select technologies" options={['React', 'Vue', 'Angular', 'Svelte']} value={standaloneValues.chips} onChange={updateValue('chips')} />
                </div>
              </Card>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Variants</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Outline (default)</p>
                  <SmartField name="demo-chip-outline" type="chips" options={['Option A', 'Option B', 'Option C']} value={standaloneValues.chipsOutline ?? ['Option A']} chipVariant="outline" onChange={updateValue('chipsOutline')} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Solid</p>
                  <SmartField name="demo-chip-solid" type="chips" options={['Option A', 'Option B', 'Option C']} value={standaloneValues.chipsSolid ?? ['Option B']} chipVariant="solid" onChange={updateValue('chipsSolid')} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Soft</p>
                  <SmartField name="demo-chip-soft" type="chips" options={['Option A', 'Option B', 'Option C']} value={standaloneValues.chipsSoft ?? ['Option C']} chipVariant="soft" onChange={updateValue('chipsSoft')} />
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">chipVariant</code>
                  <span className="text-muted-foreground">'outline' | 'solid' | 'soft'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">showChipIndicator</code>
                  <span className="text-muted-foreground">boolean - Show check/circle indicator</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">chipWrap</code>
                  <span className="text-muted-foreground">boolean - Wrap chips or horizontal scroll</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      // Special handling for tags subsection
      if (activeSubsection === 'tags') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tag Input</h2>
              <p className="text-muted-foreground">
                Free-form tag input for entering multiple values as chips. Perfect for keywords, categories,
                email recipients, etc. Unlike Chip Select, users can type any value, not just from predefined options.
                Data is stored as an array of strings.
              </p>
            </div>

            <CodeBlock
              code={`<SmartField
  name="keywords"
  type="tags"
  label="Keywords"
  placeholder="Type and press Enter..."
  maxTags={5}
/>`}
              id="tags-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <div className="max-w-md">
                <SmartField
                  name="demo-tags"
                  type="tags"
                  label="Add tags"
                  placeholder="Type and press Enter..."
                  value={standaloneValues.tags}
                  onChange={updateValue('tags')}
                  maxTags={5}
                />
              </div>
              {Array.isArray(standaloneValues.tags) && standaloneValues.tags.length > 0 && (
                <p className="mt-4 text-sm text-muted-foreground">
                  Tags: <strong>{(standaloneValues.tags as string[]).join(', ')}</strong>
                </p>
              )}
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Variants</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Default (filled)</p>
                  <SmartField name="demo-tags-default" type="tags" value={standaloneValues.tagsDefault ?? ['React', 'TypeScript']} tagVariant="default" onChange={updateValue('tagsDefault')} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Outline</p>
                  <SmartField name="demo-tags-outline" type="tags" value={standaloneValues.tagsOutline ?? ['React', 'TypeScript']} tagVariant="outline" onChange={updateValue('tagsOutline')} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Soft</p>
                  <SmartField name="demo-tags-soft" type="tags" value={standaloneValues.tagsSoft ?? ['React', 'TypeScript']} tagVariant="soft" onChange={updateValue('tagsSoft')} />
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Features</h3>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc list-inside">
                <li>Press Enter or comma to add a tag</li>
                <li>Press Backspace on empty input to remove last tag</li>
                <li>Click X to remove a specific tag</li>
                <li>Paste multiple values (comma or newline separated)</li>
                <li>Optional max tags limit</li>
                <li>Optional duplicate prevention (default: no duplicates)</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">maxTags</code>
                  <span className="text-muted-foreground">number - Maximum number of tags allowed</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">allowDuplicates</code>
                  <span className="text-muted-foreground">boolean - Allow same tag multiple times (default: false)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">tagVariant</code>
                  <span className="text-muted-foreground">'default' | 'outline' | 'soft'</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      const typeMap: Record<string, typeof fieldTypeGroups.selection[0]> = {
        checkbox: fieldTypeGroups.selection[0],
        switch: fieldTypeGroups.selection[1],
        radio: fieldTypeGroups.selection[2],
        select: fieldTypeGroups.selection[3],
      }
      const item = typeMap[activeSubsection]

      if (item) {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2 capitalize">{activeSubsection}</h2>
              <p className="text-muted-foreground">{item.desc}</p>
            </div>

            <CodeBlock code={item.code} id={activeSubsection} />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <div className="max-w-sm">
                {activeSubsection === 'checkbox' && (
                  <SmartField name="demo-checkbox" type="checkbox" label="I agree to the terms and conditions" value={standaloneValues.checkbox} onChange={updateValue('checkbox')} />
                )}
                {activeSubsection === 'switch' && (
                  <SmartField name="demo-switch" type="switch" label="Enable notifications" value={standaloneValues.switch} onChange={updateValue('switch')} />
                )}
                {activeSubsection === 'radio' && (
                  <SmartField name="demo-radio" type="radio" label="Select size" options={['Small', 'Medium', 'Large']} value={standaloneValues.radio} onChange={updateValue('radio')} />
                )}
                {activeSubsection === 'select' && (
                  <SmartField name="demo-select" type="enum" label="Select role" options={['User', 'Admin', 'Moderator', 'Guest']} value={standaloneValues.select} onChange={updateValue('select')} />
                )}
              </div>
            </Card>
          </div>
        )
      }
    }

    // DateTime section
    if (activeSection === 'datetime') {
      const isDate = activeSubsection === 'datepicker'

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{isDate ? 'Date Picker' : 'Time Picker'}</h2>
            <p className="text-muted-foreground">{isDate ? 'Calendar-based date selection with locale support.' : 'Time selection with hour and minute pickers.'}</p>
          </div>

          <CodeBlock code={isDate ? fieldTypeGroups.datetime[0].code : fieldTypeGroups.datetime[1].code} id={activeSubsection} />

          <Card className="p-6">
            <h3 className="font-semibold mb-4">Live Example</h3>
            <div className="max-w-sm">
              {isDate ? (
                <SmartField name="demo-date" type="date" label="Select date" locale="ru" value={standaloneValues.date} onChange={updateValue('date')} />
              ) : (
                <SmartField name="demo-time" type="time" label="Select time" value={standaloneValues.time} onChange={updateValue('time')} />
              )}
            </div>
          </Card>

          {isDate && (
            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">locale</code>
                  <span className="text-muted-foreground">'en' | 'ru' - Calendar locale (default: 'en')</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">minDate</code>
                  <span className="text-muted-foreground">Date - Minimum selectable date</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">maxDate</code>
                  <span className="text-muted-foreground">Date - Maximum selectable date</span>
                </div>
              </div>
            </div>
          )}
        </div>
      )
    }

    // Actions section (Button, Toggle, ToggleGroup, Counter)
    if (activeSection === 'actions') {
      if (activeSubsection === 'button') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Button</h2>
              <p className="text-muted-foreground">
                Versatile button component with multiple variants, sizes, and states.
              </p>
            </div>

            <CodeBlock
              code={`import { Button } from '@prototype/components/ui/Button'

// Variants
<Button variant="default">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="success">Success</Button>
<Button variant="warning">Warning</Button>
<Button variant="link">Link</Button>

// Soft variants (lighter background)
<Button variant="soft">Soft</Button>
<Button variant="soft-destructive">Soft Destructive</Button>
<Button variant="soft-success">Soft Success</Button>

// Sizes
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Icon buttons
<Button size="icon-sm"><Plus /></Button>
<Button size="icon"><Plus /></Button>
<Button size="icon-lg"><Plus /></Button>

// Rounded
<Button rounded="full">Rounded Full</Button>
<Button rounded="none">No Radius</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>
<Button fullWidth>Full Width</Button>`}
              id="button-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Variants</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="link">Link</Button>
              </div>

              <h3 className="font-semibold mb-4">Soft Variants</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="soft">Soft</Button>
                <Button variant="soft-destructive">Soft Destructive</Button>
                <Button variant="soft-success">Soft Success</Button>
              </div>

              <h3 className="font-semibold mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>

              <h3 className="font-semibold mb-4">Icon Buttons</h3>
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <Button size="icon-sm"><Plus className="h-3 w-3" /></Button>
                <Button size="icon"><Plus className="h-4 w-4" /></Button>
                <Button size="icon-lg"><Plus className="h-5 w-5" /></Button>
                <Button size="icon" variant="outline"><Edit className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost"><Settings className="h-4 w-4" /></Button>
                <Button size="icon" variant="destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>

              <h3 className="font-semibold mb-4">Rounded Variants</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button rounded="default">Default Radius</Button>
                <Button rounded="full">Rounded Full</Button>
                <Button rounded="none">No Radius</Button>
                <Button size="icon" rounded="full"><Plus className="h-4 w-4" /></Button>
              </div>

              <h3 className="font-semibold mb-4">States</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>

              <h3 className="font-semibold mb-4">Full Width</h3>
              <Button fullWidth>Full Width Button</Button>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">variant</code>
                  <span className="text-muted-foreground">'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success' | 'warning' | 'link' | 'soft' | 'soft-destructive' | 'soft-success'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">size</code>
                  <span className="text-muted-foreground">'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm' | 'icon-lg'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">rounded</code>
                  <span className="text-muted-foreground">'default' | 'full' | 'none'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">loading</code>
                  <span className="text-muted-foreground">boolean - Shows spinner and disables button</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">fullWidth</code>
                  <span className="text-muted-foreground">boolean - Makes button full width</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'toggle') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Toggle</h2>
              <p className="text-muted-foreground">
                A two-state button that can be either on or off. Perfect for toolbar buttons like Bold, Italic, etc.
              </p>
            </div>

            <CodeBlock
              code={`import { Toggle } from '@prototype/components/ui/Toggle'
import { Bold } from 'lucide-react'

<Toggle aria-label="Toggle bold">
  <Bold className="h-4 w-4" />
</Toggle>

<Toggle variant="outline">
  <Bold className="h-4 w-4" />
</Toggle>`}
              id="toggle-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Default variant</p>
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
                    <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
                    <Toggle aria-label="Toggle underline"><Underline className="h-4 w-4" /></Toggle>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Outline variant</p>
                  <div className="flex gap-2">
                    <Toggle variant="outline" aria-label="Toggle bold"><Bold className="h-4 w-4" /></Toggle>
                    <Toggle variant="outline" aria-label="Toggle italic"><Italic className="h-4 w-4" /></Toggle>
                    <Toggle variant="outline" aria-label="Toggle underline"><Underline className="h-4 w-4" /></Toggle>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">With text</p>
                  <div className="flex gap-2">
                    <Toggle aria-label="Toggle bold"><Bold className="h-4 w-4" /> Bold</Toggle>
                    <Toggle aria-label="Toggle italic"><Italic className="h-4 w-4" /> Italic</Toggle>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sizes</p>
                  <div className="flex items-center gap-2">
                    <Toggle size="sm" aria-label="Small"><Bold className="h-4 w-4" /></Toggle>
                    <Toggle size="default" aria-label="Default"><Bold className="h-4 w-4" /></Toggle>
                    <Toggle size="lg" aria-label="Large"><Bold className="h-4 w-4" /></Toggle>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">variant</code>
                  <span className="text-muted-foreground">'default' | 'outline'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">size</code>
                  <span className="text-muted-foreground">'sm' | 'default' | 'lg'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">pressed</code>
                  <span className="text-muted-foreground">boolean - Controlled state</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onPressedChange</code>
                  <span className="text-muted-foreground">(pressed: boolean) =&gt; void</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'toggle-group') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Toggle Group</h2>
              <p className="text-muted-foreground">
                A set of two-state buttons grouped together. Can be single or multiple selection.
                Great for text alignment, view modes, etc.
              </p>
            </div>

            <CodeBlock
              code={`import { ToggleGroup, ToggleGroupItem } from '@prototype/components/ui/ToggleGroup'

// Single selection (like radio)
<ToggleGroup type="single" defaultValue="center">
  <ToggleGroupItem value="left"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center"><AlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right"><AlignRight /></ToggleGroupItem>
</ToggleGroup>

// Multiple selection (like checkboxes)
<ToggleGroup type="multiple">
  <ToggleGroupItem value="bold"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic"><Italic /></ToggleGroupItem>
</ToggleGroup>`}
              id="toggle-group-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Single selection (alignment)</p>
                  <ToggleGroup type="single" defaultValue="center">
                    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Multiple selection (formatting)</p>
                  <ToggleGroup type="multiple">
                    <ToggleGroupItem value="bold" aria-label="Bold"><Bold className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="italic" aria-label="Italic"><Italic className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="underline" aria-label="Underline"><Underline className="h-4 w-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Outline variant</p>
                  <ToggleGroup type="single" variant="outline" defaultValue="left">
                    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Small size</p>
                  <ToggleGroup type="single" size="sm" defaultValue="center">
                    <ToggleGroupItem value="left" aria-label="Align left"><AlignLeft className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center"><AlignCenter className="h-4 w-4" /></ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right"><AlignRight className="h-4 w-4" /></ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">type</code>
                  <span className="text-muted-foreground">'single' | 'multiple' - Selection mode</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">value</code>
                  <span className="text-muted-foreground">string | string[] - Controlled value</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onValueChange</code>
                  <span className="text-muted-foreground">(value) =&gt; void</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">variant</code>
                  <span className="text-muted-foreground">'default' | 'outline'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">size</code>
                  <span className="text-muted-foreground">'sm' | 'default' | 'lg'</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'counter') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Counter</h2>
              <p className="text-muted-foreground">
                Numeric input with increment/decrement buttons. Perfect for quantity selectors, cart items, etc.
              </p>
            </div>

            <CodeBlock
              code={`import { Counter, CompactCounter } from '@prototype/components/ui/Counter'

// Basic counter
<Counter defaultValue={1} min={0} max={10} />

// Controlled
const [count, setCount] = useState(5)
<Counter value={count} onChange={setCount} />

// Variants
<Counter variant="default" />
<Counter variant="outline" />
<Counter variant="ghost" />

// Sizes
<Counter size="sm" />
<Counter size="md" />
<Counter size="lg" />

// With step
<Counter step={5} min={0} max={100} />

// Compact (preset for cart items)
<CompactCounter defaultValue={1} />`}
              id="counter-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Variants</h3>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Default</p>
                  <Counter defaultValue={5} min={0} max={10} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Outline</p>
                  <Counter variant="outline" defaultValue={5} min={0} max={10} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Ghost</p>
                  <Counter variant="ghost" defaultValue={5} min={0} max={10} />
                </div>
              </div>

              <h3 className="font-semibold mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Small</p>
                  <Counter size="sm" defaultValue={3} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Medium</p>
                  <Counter size="md" defaultValue={3} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Large</p>
                  <Counter size="lg" defaultValue={3} />
                </div>
              </div>

              <h3 className="font-semibold mb-4">With Min/Max</h3>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Min: 0, Max: 5</p>
                  <Counter defaultValue={2} min={0} max={5} />
                </div>
              </div>

              <h3 className="font-semibold mb-4">Compact Counter (for cart)</h3>
              <div className="flex flex-wrap items-center gap-4">
                <CompactCounter defaultValue={1} min={1} max={99} />
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">value</code>
                  <span className="text-muted-foreground">number - Controlled value</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">defaultValue</code>
                  <span className="text-muted-foreground">number - Initial value (uncontrolled)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onChange</code>
                  <span className="text-muted-foreground">(value: number) =&gt; void</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">min / max</code>
                  <span className="text-muted-foreground">number - Min/max constraints</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">step</code>
                  <span className="text-muted-foreground">number - Increment/decrement step (default: 1)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">variant</code>
                  <span className="text-muted-foreground">'default' | 'outline' | 'ghost'</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">size</code>
                  <span className="text-muted-foreground">'sm' | 'md' | 'lg'</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    // Layout section
    if (activeSection === 'layout') {
      if (activeSubsection === 'tabs') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tabs</h2>
              <p className="text-muted-foreground">
                Organize content into separate views where only one view is visible at a time.
                Built on Radix UI for full keyboard navigation and accessibility.
              </p>
            </div>

            <CodeBlock
              code={`import { Tabs, TabsList, TabsTrigger, TabsContent } from '@prototype/components/ui'

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account settings...</TabsContent>
  <TabsContent value="password">Password settings...</TabsContent>
</Tabs>`}
              id="tabs-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <Tabs defaultValue="account" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="account">Account</TabsTrigger>
                  <TabsTrigger value="password">Password</TabsTrigger>
                  <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">Account</h4>
                  <p className="text-sm text-muted-foreground">
                    Make changes to your account here. Click save when you're done.
                  </p>
                </TabsContent>
                <TabsContent value="password" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">Password</h4>
                  <p className="text-sm text-muted-foreground">
                    Change your password here. After saving, you'll be logged out.
                  </p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure your preferences and app behavior.
                  </p>
                </TabsContent>
              </Tabs>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Components</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">Tabs</code>
                  <span className="text-muted-foreground">Root container with defaultValue or controlled value</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">TabsList</code>
                  <span className="text-muted-foreground">Container for tab triggers</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">TabsTrigger</code>
                  <span className="text-muted-foreground">Clickable tab button (value required)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">TabsContent</code>
                  <span className="text-muted-foreground">Content panel (value must match trigger)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'accordion') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Accordion</h2>
              <p className="text-muted-foreground">
                Vertically stacked headers that reveal/hide associated content.
                Supports single or multiple expanded items.
              </p>
            </div>

            <CodeBlock
              code={`import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@prototype/components/ui'

<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Is it accessible?</AccordionTrigger>
    <AccordionContent>
      Yes. It adheres to the WAI-ARIA design pattern.
    </AccordionContent>
  </AccordionItem>
</Accordion>`}
              id="accordion-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Single Mode (collapsible)</h3>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is it accessible?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It adheres to the WAI-ARIA design pattern for accordions.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Is it styled?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It comes with default styles that match your design system.
                    You can customize it with className props.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Is it animated?</AccordionTrigger>
                  <AccordionContent>
                    Yes. It uses CSS animations for smooth open/close transitions.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Multiple Mode</h3>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>First section</AccordionTrigger>
                  <AccordionContent>
                    Multiple items can be expanded at the same time.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Second section</AccordionTrigger>
                  <AccordionContent>
                    Each section operates independently.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">type</code>
                  <span className="text-muted-foreground">'single' | 'multiple' - Allow one or many open</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">collapsible</code>
                  <span className="text-muted-foreground">boolean - Allow closing all (single mode only)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">defaultValue</code>
                  <span className="text-muted-foreground">string | string[] - Initially open item(s)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    // Feedback section
    if (activeSection === 'feedback') {
      if (activeSubsection === 'dialog') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dialog / Modal</h2>
              <p className="text-muted-foreground">
                Modal dialog for important interactions. Blocks interaction with the rest of the page.
                Supports keyboard navigation (Escape to close) and focus trapping.
              </p>
            </div>

            <CodeBlock
              code={`import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@prototype/components/ui'

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Continue</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
              id="dialog-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="py-4">
                    <SmartField name="dialog-name" type="string" label="Name" placeholder="Enter your name" />
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Cancel</Button>
                    <Button>Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'toast') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Toast Notifications</h2>
              <p className="text-muted-foreground">
                Brief messages that appear temporarily. Using Sonner for beautiful, accessible toasts.
                Don't forget to add {'<Toaster />'} to your app root.
              </p>
            </div>

            <CodeBlock
              code={`import { toast, Toaster } from '@prototype/components/ui'

// In your app root
<Toaster />

// Anywhere in your code
toast('Event has been created')
toast.success('Saved successfully!')
toast.error('Something went wrong')
toast.info('Did you know?')
toast.warning('Please check this')

// With description
toast('Event created', {
  description: 'Monday, January 3rd at 6:00pm',
})

// With action
toast('Deleted', {
  action: { label: 'Undo', onClick: () => {} },
})`}
              id="toast-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => toast('Event has been created')}>Default</Button>
                <Button onClick={() => toast.success('Saved successfully!')}>Success</Button>
                <Button onClick={() => toast.error('Something went wrong')}>Error</Button>
                <Button onClick={() => toast.info('Did you know?')}>Info</Button>
                <Button onClick={() => toast.warning('Please check this')}>Warning</Button>
                <Button onClick={() => toast('Event created', { description: 'Monday, January 3rd at 6:00pm' })}>
                  With Description
                </Button>
              </div>
            </Card>

            <div className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-lg">
              <h3 className="font-semibold text-yellow-600 dark:text-yellow-400 mb-2">⚠️ Required Setup</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Add <code className="bg-muted px-1.5 py-0.5 rounded">{'<Toaster />'}</code> to your app root (e.g., App.tsx or main.tsx).
                Without it, toasts will not appear.
              </p>
              <CodeBlock
                code={`// In App.tsx or main.tsx
import { Toaster } from '@prototype/components/ui'

function App() {
  return (
    <>
      {/* Your app content */}
      <Toaster />
    </>
  )
}`}
                id="toast-setup"
              />
            </div>
          </div>
        )
      }

      if (activeSubsection === 'dropdown') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Dropdown Menu</h2>
              <p className="text-muted-foreground">
                Action menu for context menus, "more" buttons, etc. Supports keyboard navigation,
                submenus, checkbox/radio items, and shortcuts.
              </p>
            </div>

            <CodeBlock
              code={`import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@prototype/components/ui'

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem><Edit /> Edit</DropdownMenuItem>
    <DropdownMenuItem><Copy /> Duplicate</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem variant="destructive"><Trash /> Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
              id="dropdown-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="flex gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Actions menu</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                      <DropdownMenuItem><CopyIcon className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-2">User menu</p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <Avatar size="sm" fallback="JD" />
                        John Doe
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
                      <DropdownMenuItem><Settings className="mr-2 h-4 w-4" /> Settings</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'tooltip') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Tooltip</h2>
              <p className="text-muted-foreground">
                Contextual information shown on hover. Use for additional hints, explanations,
                or keyboard shortcut indicators.
              </p>
            </div>

            <CodeBlock
              code={`import { SimpleTooltip } from '@prototype/components/ui'

// Simple usage
<SimpleTooltip content="Add new item">
  <Button>+</Button>
</SimpleTooltip>

// With side
<SimpleTooltip content="Help" side="right">
  <HelpCircle />
</SimpleTooltip>`}
              id="tooltip-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="flex gap-4 items-center">
                <SimpleTooltip content="Top tooltip (default)" side="top">
                  <Button variant="outline">Top</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Right tooltip" side="right">
                  <Button variant="outline">Right</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Bottom tooltip" side="bottom">
                  <Button variant="outline">Bottom</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Left tooltip" side="left">
                  <Button variant="outline">Left</Button>
                </SimpleTooltip>
                <SimpleTooltip content="Click for help">
                  <Button variant="ghost" size="icon"><HelpCircle className="h-4 w-4" /></Button>
                </SimpleTooltip>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'avatar') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Avatar</h2>
              <p className="text-muted-foreground">
                User avatar with image or fallback initials. Automatically generates initials
                from name if no image provided.
              </p>
            </div>

            <CodeBlock
              code={`import { Avatar } from '@prototype/components/ui'

// With image
<Avatar src="/path/to/image.jpg" alt="John Doe" />

// Fallback with initials (auto-generated from alt)
<Avatar alt="John Doe" />

// Custom fallback
<Avatar fallback="JD" />

// Sizes
<Avatar size="sm" alt="Small" />
<Avatar size="md" alt="Medium" />
<Avatar size="lg" alt="Large" />
<Avatar size="xl" alt="Extra Large" />`}
              id="avatar-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Sizes</p>
                  <div className="flex items-center gap-3">
                    <Avatar size="sm" alt="Small User" />
                    <Avatar size="md" alt="Medium User" />
                    <Avatar size="lg" alt="Large User" />
                    <Avatar size="xl" alt="Extra Large" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Different initials</p>
                  <div className="flex items-center gap-3">
                    <Avatar alt="John Doe" />
                    <Avatar alt="Alice Smith" />
                    <Avatar alt="Bob" />
                    <Avatar fallback="?" />
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'skeleton') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Skeleton</h2>
              <p className="text-muted-foreground">
                Loading placeholders that match content shape. Improves perceived performance
                by showing layout structure before content loads.
              </p>
            </div>

            <CodeBlock
              code={`import { Skeleton, SkeletonCard, SkeletonList, SkeletonText, SkeletonAvatar } from '@prototype/components/ui'

// Basic shapes
<Skeleton className="h-4 w-full" />
<Skeleton variant="circular" className="h-10 w-10" />

// Pre-built patterns
<SkeletonCard />
<SkeletonList items={3} />
<SkeletonText lines={3} />
<SkeletonAvatar size="lg" />`}
              id="skeleton-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Examples</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">List skeleton</p>
                  <SkeletonList items={3} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Card skeleton</p>
                  <SkeletonCard />
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Variants</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">Skeleton</code>
                  <span className="text-muted-foreground">Basic building block</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">SkeletonCard</code>
                  <span className="text-muted-foreground">Image + text lines</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">SkeletonList</code>
                  <span className="text-muted-foreground">Avatar + text rows</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">SkeletonText</code>
                  <span className="text-muted-foreground">Multiple text lines</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">SkeletonAvatar</code>
                  <span className="text-muted-foreground">Circular avatar placeholder</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'drawer') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Drawer</h2>
              <p className="text-muted-foreground">
                Slide-in panel from bottom using Vaul. Great for mobile menus, filters, details.
              </p>
            </div>

            <CodeBlock
              code={`import { Drawer, DrawerTrigger, DrawerContent, DrawerHeader, DrawerTitle } from '@prototype/components/ui'

<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Settings</DrawerTitle>
    </DrawerHeader>
    {/* Content */}
  </DrawerContent>
</Drawer>`}
              id="drawer-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button>Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Edit Profile</DrawerTitle>
                    <DrawerDescription>Make changes to your profile here.</DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4 space-y-4">
                    <SmartField name="drawer-name" type="string" label="Name" value="John Doe" onChange={() => {}} />
                    <SmartField name="drawer-email" type="email" label="Email" value="john@example.com" onChange={() => {}} />
                  </div>
                  <DrawerFooter>
                    <Button onClick={() => { toast.success('Saved!'); setDrawerOpen(false) }}>Save changes</Button>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'sheet') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Sheet (Side Panel)</h2>
              <p className="text-muted-foreground">
                Slide-in panel from any side (left, right, top, bottom). Built on Radix Dialog. Use for side menus, filters, settings panels.
              </p>
            </div>

            <CodeBlock
              code={`import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@prototype/components/ui'

// Right side (default)
<Sheet>
  <SheetTrigger asChild>
    <Button>Open Right</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>Configure your preferences</SheetDescription>
    </SheetHeader>
    {/* Content */}
    <SheetFooter>
      <SheetClose asChild>
        <Button>Close</Button>
      </SheetClose>
    </SheetFooter>
  </SheetContent>
</Sheet>

// Left side (for menus)
<SheetContent side="left">...</SheetContent>

// Top/Bottom (for mobile)
<SheetContent side="top">...</SheetContent>
<SheetContent side="bottom">...</SheetContent>

// Without close button
<SheetContent showClose={false}>...</SheetContent>`}
              id="sheet-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Side Variants</h3>
              <div className="flex flex-wrap gap-2 mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Right (default)</Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <SheetHeader>
                      <SheetTitle>Right Panel</SheetTitle>
                      <SheetDescription>This panel slides in from the right</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Great for settings, filters, or detail views.</p>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Left</Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <SheetHeader>
                      <SheetTitle>Left Panel</SheetTitle>
                      <SheetDescription>This panel slides in from the left</SheetDescription>
                    </SheetHeader>
                    <div className="py-4">
                      <p className="text-sm text-muted-foreground">Perfect for navigation menus.</p>
                    </div>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Top</Button>
                  </SheetTrigger>
                  <SheetContent side="top">
                    <SheetHeader>
                      <SheetTitle>Top Panel</SheetTitle>
                      <SheetDescription>This panel slides down from the top</SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>

                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline">Bottom</Button>
                  </SheetTrigger>
                  <SheetContent side="bottom">
                    <SheetHeader>
                      <SheetTitle>Bottom Panel</SheetTitle>
                      <SheetDescription>This panel slides up from the bottom</SheetDescription>
                    </SheetHeader>
                  </SheetContent>
                </Sheet>
              </div>

              <h3 className="font-semibold mb-4">With Form Content</h3>
              <Sheet>
                <SheetTrigger asChild>
                  <Button>Edit Profile</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Edit Profile</SheetTitle>
                    <SheetDescription>Make changes to your profile here.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <SmartField name="sheet-name" type="string" label="Name" value="John Doe" onChange={() => {}} />
                    <SmartField name="sheet-email" type="email" label="Email" value="john@example.com" onChange={() => {}} />
                  </div>
                  <SheetFooter>
                    <SheetClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </SheetClose>
                    <Button onClick={() => toast.success('Saved!')}>Save changes</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">side</code>
                  <span className="text-muted-foreground">'top' | 'bottom' | 'left' | 'right' (default: 'right')</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">showClose</code>
                  <span className="text-muted-foreground">boolean - Show/hide close button (default: true)</span>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Sheet vs Drawer</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li><strong>Sheet:</strong> Any side (left, right, top, bottom), uses Radix Dialog</li>
                <li><strong>Drawer:</strong> Bottom only, uses Vaul with drag-to-close gesture</li>
              </ul>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'lightbox') {
        const demoImages = [
          { src: 'https://picsum.photos/800/600?random=1', alt: 'Image 1', caption: 'Beautiful landscape' },
          { src: 'https://picsum.photos/800/600?random=2', alt: 'Image 2', caption: 'City at night' },
          { src: 'https://picsum.photos/800/600?random=3', alt: 'Image 3', caption: 'Mountain view' },
        ]

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Lightbox</h2>
              <p className="text-muted-foreground">
                Fullscreen image viewer with zoom, navigation, and thumbnails.
              </p>
            </div>

            <CodeBlock
              code={`import { Lightbox, LightboxImage } from '@prototype/components/ui'

// Single image - auto-opens on click
<LightboxImage src="/photo.jpg" alt="Photo" caption="My photo" />

// Gallery with multiple images
<Lightbox
  images={[
    { src: '/1.jpg', alt: 'Image 1', caption: 'First' },
    { src: '/2.jpg', alt: 'Image 2', caption: 'Second' },
  ]}
  open={open}
  onOpenChange={setOpen}
/>`}
              id="lightbox-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <div className="flex gap-2">
                {demoImages.map((img, i) => (
                  <img
                    key={i}
                    src={img.src}
                    alt={img.alt}
                    className="w-24 h-24 object-cover rounded cursor-pointer hover:opacity-80"
                    onClick={() => setLightboxOpen(true)}
                  />
                ))}
              </div>
              <Lightbox
                images={demoImages}
                open={lightboxOpen}
                onOpenChange={setLightboxOpen}
              />
            </Card>
          </div>
        )
      }
    }

    // Media section
    if (activeSection === 'media') {
      if (activeSubsection === 'carousel') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Carousel</h2>
              <p className="text-muted-foreground">
                Responsive slider using Embla Carousel. Supports autoplay, dots, arrows.
              </p>
            </div>

            <CodeBlock
              code={`import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselDots } from '@prototype/components/ui'

<Carousel autoplay={{ delay: 3000 }}>
  <CarouselContent>
    <CarouselItem>Slide 1</CarouselItem>
    <CarouselItem>Slide 2</CarouselItem>
    <CarouselItem>Slide 3</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
  <CarouselDots />
</Carousel>`}
              id="carousel-code"
            />

            <div className="px-12">
              <Carousel autoplay={{ delay: 4000, stopOnInteraction: true }}>
                <CarouselContent>
                  {[1, 2, 3, 4].map((i) => (
                    <CarouselItem key={i}>
                      <Card className="p-0 overflow-hidden">
                        <img
                          src={`https://picsum.photos/600/300?random=${i}`}
                          alt={`Slide ${i}`}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <h3 className="font-semibold">Slide {i}</h3>
                          <p className="text-sm text-muted-foreground">Description for slide {i}</p>
                        </div>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
                <CarouselDots />
              </Carousel>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'slider') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Slider</h2>
              <p className="text-muted-foreground">
                Range input using Radix UI. Single value and range (two thumbs) variants.
              </p>
            </div>

            <CodeBlock
              code={`import { Slider, RangeSlider } from '@prototype/components/ui'

// Single value
<Slider
  value={[50]}
  onValueChange={setValue}
  max={100}
  step={1}
  label="Volume"
  showValue
/>

// Range (two thumbs)
<RangeSlider
  value={[20, 80]}
  onValueChange={setRange}
  max={100}
  label="Price Range"
  showValue
  formatRange={(min, max) => \`$\${min} - $\${max}\`}
/>`}
              id="slider-code"
            />

            <Card className="p-6 space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Single Slider</h3>
                <Slider
                  value={sliderValue}
                  onValueChange={setSliderValue}
                  max={100}
                  step={1}
                  label="Volume"
                  showValue
                  formatValue={(v) => `${v}%`}
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Range Slider</h3>
                <RangeSlider
                  value={rangeValue}
                  onValueChange={(v) => setRangeValue(v as [number, number])}
                  max={100}
                  label="Price Range"
                  showValue
                  formatRange={(min, max) => `$${min} - $${max}`}
                />
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'star-rating') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Star Rating</h2>
              <p className="text-muted-foreground">
                Rating input with stars. Supports half stars, readonly mode, sizes.
              </p>
            </div>

            <CodeBlock
              code={`import { StarRating } from '@prototype/components/ui'

<StarRating
  value={3.5}
  onChange={setValue}
  max={5}
  allowHalf
  showValue
  label="Your rating"
/>

// Readonly (display only)
<StarRating value={4.5} readOnly showValue />`}
              id="star-rating-code"
            />

            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Interactive</h3>
                <StarRating
                  value={ratingValue}
                  onChange={setRatingValue}
                  max={5}
                  allowHalf
                  showValue
                  label="Your rating"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Sizes</h3>
                <div className="flex flex-col gap-4">
                  <StarRating value={4} size="sm" label="Small" />
                  <StarRating value={4} size="md" label="Medium" />
                  <StarRating value={4} size="lg" label="Large" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Readonly</h3>
                <StarRating value={4.5} readOnly showValue />
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'icon-button') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Icon Button</h2>
              <p className="text-muted-foreground">
                Round buttons for icons. Multiple sizes, shapes, variants. Includes FAB component.
              </p>
            </div>

            <CodeBlock
              code={`import { IconButton, FAB } from '@prototype/components/ui'

// Basic icon button
<IconButton variant="outline" size="md" shape="circle">
  <Plus />
</IconButton>

// With badge
<IconButton badge={5}>
  <Bell />
</IconButton>

// Floating Action Button
<FAB position="bottom-right">
  <Plus />
</FAB>

// Extended FAB with label
<FAB extended label="Create" position="bottom-right">
  <Plus />
</FAB>`}
              id="icon-button-code"
            />

            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Variants</h3>
                <div className="flex flex-wrap gap-3">
                  <IconButton variant="default"><Plus /></IconButton>
                  <IconButton variant="secondary"><Heart /></IconButton>
                  <IconButton variant="outline"><Settings /></IconButton>
                  <IconButton variant="ghost"><Search /></IconButton>
                  <IconButton variant="destructive"><Trash2 /></IconButton>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Sizes</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <IconButton size="xs"><Plus /></IconButton>
                  <IconButton size="sm"><Plus /></IconButton>
                  <IconButton size="md"><Plus /></IconButton>
                  <IconButton size="lg"><Plus /></IconButton>
                  <IconButton size="xl"><Plus /></IconButton>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Shapes</h3>
                <div className="flex flex-wrap gap-3">
                  <IconButton shape="circle"><Plus /></IconButton>
                  <IconButton shape="rounded"><Plus /></IconButton>
                  <IconButton shape="square"><Plus /></IconButton>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">With Badge</h3>
                <div className="flex flex-wrap gap-3">
                  <IconButton badge={3} variant="outline"><Bell /></IconButton>
                  <IconButton badge={99} variant="outline"><MessageSquare /></IconButton>
                  <IconButton badge="New" badgeVariant="default" variant="outline"><Heart /></IconButton>
                </div>
              </div>
            </Card>
          </div>
        )
      }
    }

    // Mobile section
    if (activeSection === 'mobile') {
      if (activeSubsection === 'mobile-frame') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">MobileFrame</h2>
              <p className="text-muted-foreground">
                Device mockup container for testing mobile UIs on desktop.
                Includes iPhone/Android frames with status bar, notch, and home indicator.
              </p>
            </div>

            <CodeBlock
              code={`import { MobileFrame, SimpleFrame } from '@prototype/components/ui'

// Full iPhone mockup
<MobileFrame device="iphone" size="md">
  <YourMobileApp />
</MobileFrame>

// Android style
<MobileFrame device="android" size="md">
  <YourMobileApp />
</MobileFrame>

// Minimal frame (just border)
<SimpleFrame width={375} height={667}>
  <YourMobileApp />
</SimpleFrame>

// Scaled for embedding
<MobileFrame scale={0.6} size="md">
  <YourMobileApp />
</MobileFrame>`}
              id="mobile-frame-code"
            />

            <div className="flex flex-wrap gap-8 justify-center items-end">
              <div className="text-center">
                <MobileFrame device="iphone" size="md">
                  <div className="h-full bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">375×812</span>
                  </div>
                </MobileFrame>
                <p className="text-sm text-muted-foreground mt-2">iPhone (size="md")</p>
              </div>
              <div className="text-center">
                <MobileFrame device="android" size="md">
                  <div className="h-full bg-gradient-to-b from-green-500 to-teal-600 flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">375×812</span>
                  </div>
                </MobileFrame>
                <p className="text-sm text-muted-foreground mt-2">Android (size="md")</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              Размеры соответствуют CSS viewport устройства. 375×812 — это реальный viewport iPhone 12 в CSS пикселях.
            </p>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Size Presets</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Size</th>
                      <th className="text-left py-2">Dimensions</th>
                      <th className="text-left py-2">Model</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>sm</code></td>
                      <td className="py-2">320×568</td>
                      <td className="py-2">iPhone SE</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>md</code></td>
                      <td className="py-2">375×812</td>
                      <td className="py-2">iPhone X/11/12</td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>lg</code></td>
                      <td className="py-2">428×926</td>
                      <td className="py-2">iPhone 12 Pro Max</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'screen-layout') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Screen Layout</h2>
              <p className="text-muted-foreground">
                Mobile screen structure with fixed header, scrollable body, and fixed footer.
                Use inside MobileFrame for proper layout.
              </p>
            </div>

            <CodeBlock
              code={`import {
  MobileFrame, Screen, ScreenHeader, ScreenBody, ScreenFooter,
  TopBar, BottomNav, Button
} from '@prototype/components/ui'

<MobileFrame device="iphone" size="md">
  <Screen bg="muted">
    {/* Fixed header */}
    <ScreenHeader>
      <TopBar title="Profile" back />
    </ScreenHeader>

    {/* Scrollable content */}
    <ScreenBody padding="md">
      <div className="space-y-4">
        <Card>Content 1</Card>
        <Card>Content 2</Card>
        {/* ... more content scrolls */}
      </div>
    </ScreenBody>

    {/* Fixed footer */}
    <ScreenFooter className="p-4">
      <Button className="w-full">Save</Button>
    </ScreenFooter>
  </Screen>
</MobileFrame>`}
              id="screen-layout-code"
            />

            <div className="flex justify-center">
              <MobileFrame device="iphone" size="md">
                <Screen bg="muted">
                  <ScreenHeader border>
                    <TopBar title="Settings" back />
                  </ScreenHeader>
                  <ScreenBody padding="md">
                    <div className="space-y-3">
                      <MobileListItem icon={<User className="h-5 w-5" />} iconBg="bg-blue-500" title="Account" chevron />
                      <MobileListItem icon={<Bell className="h-5 w-5" />} iconBg="bg-red-500" title="Notifications" chevron />
                      <MobileListItem icon={<Shield className="h-5 w-5" />} iconBg="bg-green-500" title="Privacy" chevron />
                      <MobileListItem icon={<Moon className="h-5 w-5" />} iconBg="bg-purple-500" title="Appearance" chevron />
                      <MobileListItem icon={<HelpCircle className="h-5 w-5" />} iconBg="bg-orange-500" title="Help" chevron />
                      <div className="h-32" /> {/* Extra space to show scroll */}
                    </div>
                  </ScreenBody>
                  <ScreenFooter className="p-4" border>
                    <Button className="w-full">Log Out</Button>
                  </ScreenFooter>
                </Screen>
              </MobileFrame>
            </div>

            <Card className="p-4">
              <h3 className="font-semibold mb-3">Components</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Component</th>
                      <th className="text-left py-2">Description</th>
                      <th className="text-left py-2">Props</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2"><code>Screen</code></td>
                      <td className="py-2">Root container (absolute, flex-col)</td>
                      <td className="py-2"><code>bg</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>ScreenHeader</code></td>
                      <td className="py-2">Fixed top area</td>
                      <td className="py-2"><code>border</code>, <code>transparent</code></td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2"><code>ScreenBody</code></td>
                      <td className="py-2">Scrollable middle</td>
                      <td className="py-2"><code>padding</code>, <code>scroll</code></td>
                    </tr>
                    <tr>
                      <td className="py-2"><code>ScreenFooter</code></td>
                      <td className="py-2">Fixed bottom area</td>
                      <td className="py-2"><code>border</code>, <code>safeArea</code></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'mobile-list') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">MobileList</h2>
              <p className="text-muted-foreground">
                iOS/Android style list for settings, profile menus, and grouped content.
                Supports icons with colored backgrounds, subtitles, values, and chevrons.
              </p>
            </div>

            <CodeBlock
              code={`import { MobileList, MobileListItem } from '@prototype/components/ui'

<MobileList title="Settings">
  <MobileListItem
    icon={<Wifi />}
    iconBg="bg-blue-500"
    title="Wi-Fi"
    value="Connected"
    chevron
    onPress={() => {}}
  />
  <MobileListItem
    icon={<Moon />}
    iconBg="bg-purple-500"
    title="Dark Mode"
    subtitle="System default"
    chevron
  />
</MobileList>`}
              id="mobile-list-code"
            />

            <div className="max-w-sm mx-auto bg-muted/30 rounded-xl p-4">
              <MobileList title="General">
                <MobileListItem
                  icon={<Wifi />}
                  iconBg="bg-blue-500"
                  title="Wi-Fi"
                  value="Home Network"
                  chevron
                  onPress={() => toast('Wi-Fi settings')}
                />
                <MobileListItem
                  icon={<Moon />}
                  iconBg="bg-purple-500"
                  title="Dark Mode"
                  subtitle="Follow system"
                  chevron
                  onPress={() => toast('Appearance settings')}
                />
                <MobileListItem
                  icon={<Bell />}
                  iconBg="bg-red-500"
                  title="Notifications"
                  chevron
                  onPress={() => toast('Notification settings')}
                />
                <MobileListItem
                  icon={<Volume2 />}
                  iconBg="bg-pink-500"
                  title="Sounds"
                  value="On"
                  chevron
                  onPress={() => toast('Sound settings')}
                />
              </MobileList>

              <MobileList title="Account">
                <MobileListItem
                  icon={<User />}
                  iconBg="bg-gray-500"
                  title="Profile"
                  subtitle="john@example.com"
                  chevron
                  onPress={() => toast('Profile')}
                />
                <MobileListItem
                  icon={<Shield />}
                  iconBg="bg-green-500"
                  title="Privacy"
                  chevron
                  onPress={() => toast('Privacy settings')}
                />
                <MobileListItem
                  icon={<CreditCard />}
                  iconBg="bg-orange-500"
                  title="Payment Methods"
                  chevron
                  onPress={() => toast('Payment methods')}
                />
              </MobileList>

              <MobileList>
                <MobileListItem
                  title="Log Out"
                  destructive
                  onPress={() => toast.error('Logged out')}
                />
              </MobileList>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">MobileListItem Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">icon</code>
                  <span className="text-muted-foreground">React node (usually Lucide icon)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">iconBg</code>
                  <span className="text-muted-foreground">Tailwind bg class like "bg-blue-500"</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">title</code>
                  <span className="text-muted-foreground">Main text (required)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">subtitle</code>
                  <span className="text-muted-foreground">Secondary text below title</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">value</code>
                  <span className="text-muted-foreground">Right-aligned value or badge</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">chevron</code>
                  <span className="text-muted-foreground">Show arrow indicator</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">destructive</code>
                  <span className="text-muted-foreground">Red text for dangerous actions</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onPress</code>
                  <span className="text-muted-foreground">Click handler (makes item a button)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'topbar') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">TopBar</h2>
              <p className="text-muted-foreground">
                Mobile navigation header with back button, title, and action buttons.
                Supports transparent mode for overlay on images.
              </p>
            </div>

            <CodeBlock
              code={`import { TopBar, TopBarAction } from '@prototype/components/ui'

<TopBar
  title="Settings"
  back
  rightAction={
    <TopBarAction icon={<Settings />} onClick={() => {}} />
  }
/>`}
              id="topbar-code"
            />

            <Card className="p-0 overflow-hidden">
              <TopBar
                title="Profile"
                back={() => toast('Back pressed')}
                rightAction={
                  <TopBarAction icon={<Settings />} onClick={() => toast('Settings')} />
                }
              />
              <div className="p-4 text-sm text-muted-foreground">
                Page content goes here...
              </div>
            </Card>

            <Card className="p-0 overflow-hidden">
              <TopBar
                title="Edit Post"
                subtitle="Draft"
                close={() => toast('Close pressed')}
                rightAction={
                  <TopBarAction label="Save" onClick={() => toast.success('Saved!')} />
                }
              />
              <div className="p-4 text-sm text-muted-foreground">
                Close button instead of back...
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">title</code>
                  <span className="text-muted-foreground">Page title (centered)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">subtitle</code>
                  <span className="text-muted-foreground">Secondary text under title</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">back</code>
                  <span className="text-muted-foreground">true | () =&gt; void - Show back button</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">close</code>
                  <span className="text-muted-foreground">true | () =&gt; void - Show X button</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">rightAction</code>
                  <span className="text-muted-foreground">Action buttons on right side</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">transparent</code>
                  <span className="text-muted-foreground">No background (for overlays)</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'bottomnav') {
        const navItems: BottomNavItem[] = [
          { icon: <Home />, label: 'Home', value: 'home' },
          { icon: <Search />, label: 'Search', value: 'search' },
          { icon: <Heart />, label: 'Favorites', value: 'favorites', badge: 3 },
          { icon: <User />, label: 'Profile', value: 'profile' },
        ]

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">BottomNav</h2>
              <p className="text-muted-foreground">
                Fixed bottom tab navigation. Supports badges for notifications.
                Use with MobileLayout that has hasBottomNav=true for proper spacing.
              </p>
            </div>

            <CodeBlock
              code={`import { BottomNav, type BottomNavItem } from '@prototype/components/ui'

const items: BottomNavItem[] = [
  { icon: <Home />, label: 'Home', value: 'home' },
  { icon: <Search />, label: 'Search', value: 'search' },
  { icon: <Heart />, label: 'Favorites', value: 'favorites', badge: 3 },
  { icon: <User />, label: 'Profile', value: 'profile' },
]

<BottomNav
  items={items}
  value={activeTab}
  onValueChange={setActiveTab}
/>`}
              id="bottomnav-code"
            />

            <Card className="p-0 overflow-hidden">
              <div className="relative h-48 bg-muted/30">
                <div className="p-4 text-sm text-muted-foreground">
                  Active tab: <strong>{mobileActiveTab}</strong>
                </div>
                <div className="absolute bottom-0 left-0 right-0 border-t bg-background">
                  <div className="flex items-stretch h-14">
                    {navItems.map((item) => {
                      const isActive = mobileActiveTab === item.value
                      return (
                        <button
                          key={item.value}
                          onClick={() => setMobileActiveTab(item.value)}
                          className={cn(
                            'flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors relative',
                            isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          <span className="relative [&>svg]:h-5 [&>svg]:w-5">
                            {item.icon}
                            {item.badge !== undefined && (
                              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 text-[10px] font-medium leading-4 text-center bg-destructive text-destructive-foreground rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </span>
                          <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">BottomNavItem</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">icon</code>
                  <span className="text-muted-foreground">React node (icon)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">label</code>
                  <span className="text-muted-foreground">Tab label text</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">value</code>
                  <span className="text-muted-foreground">Unique identifier</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">badge</code>
                  <span className="text-muted-foreground">Number or string for badge</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'actionsheet') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">ActionSheet</h2>
              <p className="text-muted-foreground">
                iOS-style bottom action sheet for contextual actions. Slides up from bottom
                with overlay. Great for share menus, delete confirmations, etc.
              </p>
            </div>

            <CodeBlock
              code={`import { ActionSheet } from '@prototype/components/ui'

<ActionSheet
  open={open}
  onOpenChange={setOpen}
  title="Share Post"
  actions={[
    { label: 'Copy Link', onPress: () => {}, icon: <Copy /> },
    { label: 'Share to...', onPress: () => {}, icon: <Share2 /> },
    { label: 'Delete', onPress: () => {}, destructive: true, icon: <Trash2 /> },
  ]}
/>`}
              id="actionsheet-code"
            />

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Live Example</h3>
              <Button onClick={() => setActionSheetOpen(true)}>Open Action Sheet</Button>
              <ActionSheet
                open={actionSheetOpen}
                onOpenChange={setActionSheetOpen}
                title="Post Options"
                description="What would you like to do with this post?"
                actions={[
                  { label: 'Copy Link', onPress: () => toast('Link copied!'), icon: <CopyIcon /> },
                  { label: 'Share', onPress: () => toast('Share dialog'), icon: <Share2 /> },
                  { label: 'Edit', onPress: () => toast('Edit mode'), icon: <Edit /> },
                  { label: 'Delete', onPress: () => toast.error('Deleted!'), destructive: true, icon: <Trash2 /> },
                ]}
              />
            </Card>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">open</code>
                  <span className="text-muted-foreground">Controlled open state</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">onOpenChange</code>
                  <span className="text-muted-foreground">Callback when state changes</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">title</code>
                  <span className="text-muted-foreground">Header title</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">description</code>
                  <span className="text-muted-foreground">Subtitle text</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">actions</code>
                  <span className="text-muted-foreground">Array of action buttons</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">cancelLabel</code>
                  <span className="text-muted-foreground">Cancel button text (default: "Cancel")</span>
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'scroll-tabs') {
        const scrollTabItems = [
          { value: 'all', label: 'All' },
          { value: 'electronics', label: 'Electronics' },
          { value: 'clothing', label: 'Clothing' },
          { value: 'books', label: 'Books' },
          { value: 'sports', label: 'Sports' },
          { value: 'home', label: 'Home & Garden' },
          { value: 'toys', label: 'Toys' },
        ]

        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">ScrollTabs</h2>
              <p className="text-muted-foreground">
                Horizontally scrollable tabs/chips. Great for categories, filters.
              </p>
            </div>

            <CodeBlock
              code={`import { ScrollTabs, HorizontalScroll, HorizontalScrollItem } from '@prototype/components/ui'

// Chip-style tabs
<ScrollTabs
  items={[
    { value: 'all', label: 'All' },
    { value: 'new', label: 'New', icon: <Star /> },
  ]}
  value={activeTab}
  onValueChange={setActiveTab}
  variant="filled" // filled | outline | pill
/>

// Custom horizontal scroll
<HorizontalScroll gap="md" padding="md" fadeEdges>
  <HorizontalScrollItem>Item 1</HorizontalScrollItem>
  <HorizontalScrollItem>Item 2</HorizontalScrollItem>
</HorizontalScroll>`}
              id="scroll-tabs-code"
            />

            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Filled (default)</h3>
                <ScrollTabs
                  items={scrollTabItems}
                  value={scrollTabValue}
                  onValueChange={setScrollTabValue}
                  variant="filled"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Outline</h3>
                <ScrollTabs
                  items={scrollTabItems}
                  value={scrollTabValue}
                  onValueChange={setScrollTabValue}
                  variant="outline"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Pill</h3>
                <ScrollTabs
                  items={scrollTabItems}
                  value={scrollTabValue}
                  onValueChange={setScrollTabValue}
                  variant="pill"
                />
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'mobile-cards') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Mobile Cards</h2>
              <p className="text-muted-foreground">
                Card variants optimized for mobile: Product, Horizontal, Story cards.
              </p>
            </div>

            <CodeBlock
              code={`import { ProductCard, HorizontalCard, StoryCard, MobileCard } from '@prototype/components/ui'

// Product card
<ProductCard
  image="/product.jpg"
  title="Product Name"
  subtitle="Category"
  price="$99"
  originalPrice="$149"
  badge="Sale"
  rating={4.5}
  onPress={() => {}}
/>

// Horizontal card (list item)
<HorizontalCard
  image="/avatar.jpg"
  title="Title"
  subtitle="Subtitle"
  meta="2 hours ago"
  onPress={() => {}}
/>

// Story card (Instagram style)
<StoryCard
  image="/user.jpg"
  title="Username"
  isNew
  onPress={() => {}}
/>`}
              id="mobile-cards-code"
            />

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-4">Product Cards</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <ProductCard
                    image="https://picsum.photos/300/300?random=10"
                    title="Wireless Headphones"
                    subtitle="Electronics"
                    price="$79"
                    originalPrice="$99"
                    badge="Sale"
                    rating={4.5}
                    onPress={() => toast('Product clicked')}
                    onMenuPress={() => toast('Menu opened')}
                  />
                  <ProductCard
                    image="https://picsum.photos/300/300?random=11"
                    title="Smart Watch"
                    subtitle="Wearables"
                    price="$199"
                    rating={4.2}
                    onPress={() => toast('Product clicked')}
                  />
                  <ProductCard
                    image="https://picsum.photos/300/300?random=12"
                    title="Running Shoes"
                    subtitle="Sports"
                    price="$129"
                    badge="New"
                    onPress={() => toast('Product clicked')}
                  />
                  <ProductCard
                    image="https://picsum.photos/300/300?random=13"
                    title="Backpack"
                    subtitle="Bags"
                    price="$59"
                    rating={4.8}
                    onPress={() => toast('Product clicked')}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Horizontal Cards</h3>
                <div className="space-y-2 max-w-md">
                  <HorizontalCard
                    image="https://picsum.photos/100/100?random=20"
                    title="New Message"
                    subtitle="From John Doe"
                    meta="2 min ago"
                    onPress={() => toast('Card clicked')}
                  />
                  <HorizontalCard
                    image="https://picsum.photos/100/100?random=21"
                    title="Order Shipped"
                    subtitle="Your order #12345 is on its way"
                    meta="1 hour ago"
                    onPress={() => toast('Card clicked')}
                  />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Story Cards</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  <StoryCard
                    image="https://picsum.photos/100/100?random=30"
                    title="Your story"
                    onPress={() => toast('Add story')}
                  />
                  <StoryCard
                    image="https://picsum.photos/100/100?random=31"
                    title="john_doe"
                    isNew
                    onPress={() => toast('View story')}
                  />
                  <StoryCard
                    image="https://picsum.photos/100/100?random=32"
                    title="jane_smith"
                    isNew
                    onPress={() => toast('View story')}
                  />
                  <StoryCard
                    image="https://picsum.photos/100/100?random=33"
                    title="mike_123"
                    onPress={() => toast('View story')}
                  />
                </div>
              </div>
            </div>
          </div>
        )
      }

      if (activeSubsection === 'card-slider') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">CardSlider</h2>
              <p className="text-muted-foreground">
                Swipeable card carousel for mobile. Touch-friendly with momentum scrolling.
                Multiple presets: ProductSlider, StorySlider, BannerSlider.
              </p>
            </div>

            <CodeBlock
              code={`import { CardSlider, ProductSlider, BannerSlider, ProductCard } from '@prototype/components/ui'

// Basic slider with custom slides-to-show
<CardSlider slidesToShow={2.2} gap="md" padding="md" showDots>
  <ProductCard ... />
  <ProductCard ... />
</CardSlider>

// Product slider preset (2.2 cards visible)
<ProductSlider>
  <ProductCard ... />
  <ProductCard ... />
</ProductSlider>

// Banner slider preset (1.1 cards, with dots)
<BannerSlider showDots>
  <div>Slide 1</div>
  <div>Slide 2</div>
</BannerSlider>

// Story slider preset (4.5 items, free scroll)
<StorySlider>
  <StoryCard ... />
  <StoryCard ... />
</StorySlider>`}
              id="card-slider-code"
            />

            <div className="space-y-8">
              <div>
                <h3 className="font-semibold mb-4">Product Slider (swipe to see more)</h3>
                <ProductSlider>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <ProductCard
                      key={i}
                      image={`https://picsum.photos/300/300?random=${i + 40}`}
                      title={`Product ${i}`}
                      subtitle="Category"
                      price={`$${i * 29}`}
                      rating={4 + Math.random()}
                      onPress={() => toast(`Product ${i} clicked`)}
                    />
                  ))}
                </ProductSlider>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Banner Slider (full width with peek)</h3>
                <BannerSlider showDots>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="aspect-[2/1] rounded-xl bg-gradient-to-r from-primary/80 to-primary flex items-center justify-center text-white text-xl font-bold"
                    >
                      Banner {i}
                    </div>
                  ))}
                </BannerSlider>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Custom CardSlider (3 cards)</h3>
                <CardSlider slidesToShow={3} gap="md" padding="md">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="p-4 text-center">
                      <div className="text-2xl mb-2">📦</div>
                      <div className="font-medium">Item {i}</div>
                    </Card>
                  ))}
                </CardSlider>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Props</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">slidesToShow</code>
                  <span className="text-muted-foreground">Number of visible cards (e.g., 2.2 for peek effect)</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">gap</code>
                  <span className="text-muted-foreground">sm | md | lg - gap between cards</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">padding</code>
                  <span className="text-muted-foreground">none | sm | md - side padding</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">showDots</code>
                  <span className="text-muted-foreground">Show dot indicators</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">loop</code>
                  <span className="text-muted-foreground">Enable infinite loop</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">freeScroll</code>
                  <span className="text-muted-foreground">No snap, free momentum scroll</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Presets</h3>
              <div className="text-sm space-y-2">
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">ProductSlider</code>
                  <span className="text-muted-foreground">2.2 cards visible, good for products</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">BannerSlider</code>
                  <span className="text-muted-foreground">1.1 cards, dots, for hero banners</span>
                </div>
                <div className="flex gap-2">
                  <code className="bg-muted px-2 py-0.5 rounded">StorySlider</code>
                  <span className="text-muted-foreground">4.5 items, free scroll, for stories/avatars</span>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    // Status section
    if (activeSection === 'status') {
      if (activeSubsection === 'progress') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Progress Bar</h2>
              <p className="text-muted-foreground">
                Linear progress indicator with percentage display. Supports multiple colors, sizes, and stripe animation.
              </p>
            </div>

            <CodeBlock
              code={`import { Progress } from '@prototype/components/ui'

// Basic with percentage
<Progress value={65} showValue />

// With value on top
<Progress value={40} showValue valuePosition="top" color="success" />

// Striped and animated
<Progress value={80} striped animated size="lg" color="blue" />

// Step progress (3/5)
<StepProgress currentStep={3} totalSteps={5} />`}
              id="progress-code"
            />

            <Card className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-3">Basic Progress</h3>
                <div className="space-y-4">
                  <Progress value={25} showValue />
                  <Progress value={50} showValue color="success" />
                  <Progress value={75} showValue color="blue" />
                  <Progress value={90} showValue color="warning" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Value Position: Top</h3>
                <Progress value={65} showValue valuePosition="top" color="primary" />
              </div>

              <div>
                <h3 className="font-semibold mb-3">Sizes</h3>
                <div className="space-y-4">
                  <Progress value={60} size="sm" showValue />
                  <Progress value={60} size="md" showValue />
                  <Progress value={60} size="lg" showValue />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Striped & Animated</h3>
                <div className="space-y-4">
                  <Progress value={70} striped size="lg" showValue />
                  <Progress value={85} striped animated size="lg" showValue color="success" />
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3">Step Progress</h3>
                <StepProgress currentStep={3} totalSteps={5} />
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'circular-progress') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Circular Progress</h2>
              <p className="text-muted-foreground">
                SVG-based circular progress indicator. Shows percentage in center. Also includes GaugeProgress (semi-circle).
              </p>
            </div>

            <CodeBlock
              code={`import { CircularProgress, GaugeProgress } from '@prototype/components/ui'

// Basic circular
<CircularProgress value={75} />

// Custom size and color
<CircularProgress value={60} size={100} color="success" />

// With custom content
<CircularProgress value={3} max={10} size={80}>
  <span className="text-sm font-medium">3/10</span>
</CircularProgress>

// Gauge (semi-circle)
<GaugeProgress value={72} label="CPU Usage" />`}
              id="circular-progress-code"
            />

            <Card className="p-6">
              <div className="flex flex-wrap gap-8 items-end justify-center">
                <div className="text-center">
                  <CircularProgress value={25} color="primary" />
                  <p className="text-sm text-muted-foreground mt-2">Primary</p>
                </div>
                <div className="text-center">
                  <CircularProgress value={50} color="success" />
                  <p className="text-sm text-muted-foreground mt-2">Success</p>
                </div>
                <div className="text-center">
                  <CircularProgress value={75} color="warning" />
                  <p className="text-sm text-muted-foreground mt-2">Warning</p>
                </div>
                <div className="text-center">
                  <CircularProgress value={90} color="danger" />
                  <p className="text-sm text-muted-foreground mt-2">Danger</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-8 items-end justify-center">
                <div className="text-center">
                  <CircularProgress value={65} size={80} strokeWidth={6} />
                  <p className="text-sm text-muted-foreground mt-2">Small (80px)</p>
                </div>
                <div className="text-center">
                  <CircularProgress value={65} size={120} />
                  <p className="text-sm text-muted-foreground mt-2">Default (120px)</p>
                </div>
                <div className="text-center">
                  <CircularProgress value={65} size={160} strokeWidth={12} />
                  <p className="text-sm text-muted-foreground mt-2">Large (160px)</p>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-8 items-end justify-center">
                <div className="text-center">
                  <CircularProgress value={3} max={10} size={100}>
                    <div className="text-center">
                      <span className="text-lg font-bold">3</span>
                      <span className="text-muted-foreground">/10</span>
                    </div>
                  </CircularProgress>
                  <p className="text-sm text-muted-foreground mt-2">Custom content</p>
                </div>
                <div className="text-center">
                  <GaugeProgress value={72} label="CPU" />
                  <p className="text-sm text-muted-foreground mt-2">Gauge style</p>
                </div>
              </div>
            </Card>
          </div>
        )
      }

      if (activeSubsection === 'timeline') {
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Timeline</h2>
              <p className="text-muted-foreground">
                Vertical stepper for order tracking, delivery status, onboarding progress.
                Includes presets: DeliveryTracker, OrderStatus.
              </p>
            </div>

            <CodeBlock
              code={`import { Timeline, DeliveryTracker, OrderStatus } from '@prototype/components/ui'

// Basic Timeline
<Timeline
  steps={[
    { id: 1, title: 'Order Placed', description: 'Confirmed', time: '10:00' },
    { id: 2, title: 'Processing', description: 'Preparing' },
    { id: 3, title: 'Shipped' },
    { id: 4, title: 'Delivered' },
  ]}
  currentStep={1}
  color="success"
/>

// DeliveryTracker preset
<DeliveryTracker status="shipped" />

// OrderStatus preset
<OrderStatus steps={[
  { title: 'Payment', completed: true },
  { title: 'Confirmed', completed: true },
  { title: 'Preparing', completed: false },
]} />`}
              id="timeline-code"
            />

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Basic Timeline</h3>
                <Timeline
                  steps={[
                    { id: 1, title: 'Order Placed', description: 'Your order has been confirmed', time: '10:00 AM' },
                    { id: 2, title: 'Processing', description: 'Preparing your items', time: '11:30 AM' },
                    { id: 3, title: 'Shipped', description: 'Package handed to courier' },
                    { id: 4, title: 'Delivered', description: 'Package delivered' },
                  ]}
                  currentStep={2}
                  color="success"
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">DeliveryTracker Preset</h3>
                <DeliveryTracker
                  status="shipped"
                  timestamps={{
                    ordered: 'Dec 10, 10:00 AM',
                    packed: 'Dec 10, 2:00 PM',
                    shipped: 'Dec 11, 9:00 AM',
                  }}
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Compact Variant</h3>
                <Timeline
                  steps={[
                    { id: 1, title: 'Step 1' },
                    { id: 2, title: 'Step 2' },
                    { id: 3, title: 'Step 3' },
                    { id: 4, title: 'Step 4' },
                  ]}
                  currentStep={1}
                  variant="compact"
                  color="blue"
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">OrderStatus Preset</h3>
                <OrderStatus
                  steps={[
                    { title: 'Payment received', time: 'Yesterday', completed: true },
                    { title: 'Order confirmed', time: 'Today, 9:00', completed: true },
                    { title: 'Preparing', completed: false },
                    { title: 'Ready for pickup', completed: false },
                  ]}
                />
              </Card>
            </div>
          </div>
        )
      }
    }

    // States section
    if (activeSection === 'states') {
      const isError = activeSubsection === 'error-states'

      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">{isError ? 'Error States' : 'Disabled States'}</h2>
            <p className="text-muted-foreground">{isError ? 'How form fields display validation errors.' : 'Disabled fields that cannot be interacted with.'}</p>
          </div>

          <Card className="p-6">
            <div className="grid md:grid-cols-2 gap-4">
              {isError ? (
                <>
                  <SmartField name="error-string" type="string" label="With Error" value="Invalid value" error="This field has an error" onChange={() => {}} />
                  <SmartField name="error-email" type="email" label="Invalid Email" value="not-an-email" error="Please enter a valid email" onChange={() => {}} />
                  <SmartField name="error-select" type="enum" label="Selection Required" options={['A', 'B', 'C']} error="Please select an option" onChange={() => {}} />
                  <SmartField name="error-checkbox" type="checkbox" label="Must accept terms" error="This field is required" onChange={() => {}} />
                </>
              ) : (
                <>
                  <SmartField name="disabled-string" type="string" label="Disabled Input" value="Cannot edit this" disabled onChange={() => {}} />
                  <SmartField name="disabled-select" type="enum" label="Disabled Select" options={['A', 'B', 'C']} value="B" disabled onChange={() => {}} />
                  <SmartField name="disabled-checkbox" type="checkbox" label="Disabled Checkbox" value={true} disabled onChange={() => {}} />
                  <SmartField name="disabled-switch" type="switch" label="Disabled Switch" value={true} disabled onChange={() => {}} />
                </>
              )}
            </div>
          </Card>

          <CodeBlock
            code={
              isError
                ? `<SmartField
  name="email"
  type="email"
  label="Email"
  value="invalid"
  error="Please enter a valid email"
  onChange={...}
/>`
                : `<SmartField
  name="field"
  type="string"
  label="Disabled"
  value="Cannot edit"
  disabled
  onChange={...}
/>`
            }
            id={activeSubsection}
          />
        </div>
      )
    }

    return null
  }

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/30 overflow-y-auto hidden md:block">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5 text-primary" />
            <span className="font-semibold">UI Kit</span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Component Reference</p>
        </div>
        <nav className="p-2">
          {sections.map((section) => (
            <div key={section.id} className="mb-1">
              <button
                onClick={() => handleSectionClick(section.id)}
                className={cn(
                  'w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  activeSection === section.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted text-foreground'
                )}
              >
                <section.icon className="h-4 w-4" />
                {section.title}
              </button>
              {activeSection === section.id && (
                <div className="ml-6 mt-1 space-y-0.5">
                  {section.subsections.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => handleSectionClick(section.id, sub.id)}
                      className={cn(
                        'w-full flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors',
                        activeSubsection === sub.id ? 'bg-muted text-foreground font-medium' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}
                    >
                      <ChevronRight className={cn('h-3 w-3 transition-transform', activeSubsection === sub.id && 'rotate-90')} />
                      {sub.title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Mobile section selector */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-2 z-50">
        <select
          value={`${activeSection}:${activeSubsection}`}
          onChange={(e) => {
            const [section, sub] = e.target.value.split(':')
            handleSectionClick(section, sub)
          }}
          className="w-full p-2 border rounded-md text-sm"
        >
          {sections.map((section) =>
            section.subsections.map((sub) => (
              <option key={`${section.id}:${sub.id}`} value={`${section.id}:${sub.id}`}>
                {section.title} / {sub.title}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
        <Container size="md" className="py-6">
          {renderContent()}
        </Container>
      </main>

      {/* Toast notifications */}
      <Toaster />
    </div>
  )
}
