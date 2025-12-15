import { useState, useEffect } from 'react'
import {
  Home,
  Search,
  Heart,
  User,
  Settings,
  Share,
  Trash2,
  Star,
  Bell,
  Mail,
  Plus,
  Phone,
  Camera,
  MoreVertical,
  ChevronRight,
} from 'lucide-react'
import { ActionSheet } from '@/components/ui/ActionSheet'
import { BottomNav } from '@/components/ui/BottomNav'
import { SimpleBottomSheet, OptionSheet } from '@/components/ui/BottomSheet'
import { ProductSlider } from '@/components/ui/CardSlider'
import { CartBadge, NotificationBadge, WishlistBadge } from '@/components/ui/CartBadge'
import { FilterChips, RemovableChips, FilterButton } from '@/components/ui/FilterChips'
import { FloatingButton } from '@/components/ui/FloatingButton'
import { HorizontalScroll, ScrollTabs } from '@/components/ui/HorizontalScroll'
import { MobileCard, ProductCard, HorizontalCard, StoryCard } from '@/components/ui/MobileCard'
import { MobileFrame } from '@/components/ui/MobileFrame'
import { MobilePicker } from '@/components/ui/MobilePicker'
import { Screen, ScreenHeader, ScreenBody, ScreenFooter } from '@/components/ui/MobileLayout'
import { MobileList, MobileListItem } from '@/components/ui/MobileList'
import { MobileToastProvider, useToast, Snackbar, InlineToast } from '@/components/ui/MobileToast'
import { PageIndicator, NumberedIndicator } from '@/components/ui/PageIndicator'
import { ProductGallery } from '@/components/ui/ProductGallery'
import { SearchBar, SearchHeader, SearchSuggestions } from '@/components/ui/SearchBar'
import { SegmentedControl, SimpleSegment, IconSegment } from '@/components/ui/SegmentedControl'
import { FullScreenResult, Confetti } from '@/components/ui/SuccessAnimation'
import { SwipeActions, SwipeableListItem, createDeleteAction, createArchiveAction } from '@/components/ui/SwipeActions'
import { TopBar, TopBarAction } from '@/components/ui/TopBar'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

function MobileDemoContent() {
  useScrollToSection()

  // State
  const [actionSheetOpen, setActionSheetOpen] = useState(false)
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false)
  const [optionSheetOpen, setOptionSheetOpen] = useState(false)
  const [bottomNavValue, setBottomNavValue] = useState('home')
  const [cartCount, setCartCount] = useState(3)
  const [filterSelected, setFilterSelected] = useState<string[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [segmentValue, setSegmentValue] = useState('all')
  const [simpleSegment, setSimpleSegment] = useState<'left' | 'right'>('left')
  const [iconSegment, setIconSegment] = useState('grid')
  const [pageIndex, setPageIndex] = useState(0)
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [successShow, setSuccessShow] = useState(false)
  const [confettiShow, setConfettiShow] = useState(false)
  const [pickerValue, setPickerValue] = useState('')
  const [multiPickerValue, setMultiPickerValue] = useState<string[]>([])

  const toast = useToast()

  // Reset confetti after animation
  useEffect(() => {
    if (confettiShow) {
      const timer = setTimeout(() => setConfettiShow(false), 3500)
      return () => clearTimeout(timer)
    }
  }, [confettiShow])

  const filterOptions = [
    { id: 'new', label: 'New', count: 24 },
    { id: 'sale', label: 'Sale', count: 12 },
    { id: 'featured', label: 'Featured', count: 8 },
    { id: 'trending', label: 'Trending', count: 15 },
  ]

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Mobile Components"
        description="Mobile-optimized components for building iOS/Android-style interfaces."
      />

      {/* ==================== SECTION: LAYOUT ==================== */}

      {/* Mobile Frame */}
      <DemoCard id="mobile-frame" title="MobileFrame - Phone Mockup">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Phone frame for previewing mobile UIs with status bar, notch, and home indicator.
          </p>
          <CodeBlock
            code={`<MobileFrame device="iphone" size="md">
  <Screen>
    <ScreenHeader><TopBar title="App" /></ScreenHeader>
    <ScreenBody>Content</ScreenBody>
  </Screen>
</MobileFrame>`}
            id="mobileframe-code"
          />
          <div className="flex justify-center">
            <MobileFrame device="iphone" size="sm" scale={0.8}>
              <Screen>
                <ScreenHeader>
                  <TopBar title="Demo App" />
                </ScreenHeader>
                <ScreenBody>
                  <div className="p-4">
                    <h2 className="font-semibold mb-2">Welcome</h2>
                    <p className="text-sm text-muted-foreground">Content inside mobile frame</p>
                  </div>
                </ScreenBody>
              </Screen>
            </MobileFrame>
          </div>
        </div>
      </DemoCard>

      {/* Screen Layout */}
      <DemoCard id="screen-layout" title="Screen Layout - Screen Structure">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Complete mobile screen layout with header, body, and footer sections.
          </p>
          <CodeBlock
            code={`<Screen>
  <ScreenHeader>
    <TopBar title="Page" />
  </ScreenHeader>
  <ScreenBody>
    Content here
  </ScreenBody>
  <ScreenFooter>
    <BottomNav items={[...]} />
  </ScreenFooter>
</Screen>`}
            id="screenlayout-code"
          />
          <div className="relative border rounded-lg overflow-hidden max-w-sm mx-auto h-[400px]">
            <Screen>
              <ScreenHeader>
                <TopBar title="Demo App" />
              </ScreenHeader>
              <ScreenBody>
                <div className="p-4 space-y-2">
                  <p className="font-semibold">Screen Content</p>
                  <p className="text-sm text-muted-foreground">Main content area with scroll</p>
                </div>
              </ScreenBody>
              <ScreenFooter>
                <BottomNav
                  value={bottomNavValue}
                  onValueChange={setBottomNavValue}
                  fixed={false}
                  items={[
                    { icon: <Home className="h-5 w-5" />, label: 'Home', value: 'home' },
                    { icon: <Search className="h-5 w-5" />, label: 'Search', value: 'search' },
                    { icon: <User className="h-5 w-5" />, label: 'Profile', value: 'profile' },
                  ]}
                />
              </ScreenFooter>
            </Screen>
          </div>
        </div>
      </DemoCard>

      {/* MobileList */}
      <DemoCard id="mobile-list" title="MobileList - Settings-style List">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            iOS/Android style list for settings, menus, and profiles with icons and chevrons.
          </p>
          <CodeBlock
            code={`<MobileList title="Settings">
  <MobileListItem
    icon={<User />}
    iconBg="bg-blue-500"
    title="Profile"
    subtitle="Manage account"
    chevron
  />
</MobileList>`}
            id="mobilelist-code"
          />
          <MobileList title="Account Settings">
            <MobileListItem
              icon={<User className="h-4 w-4" />}
              iconBg="bg-blue-500"
              title="Profile"
              subtitle="Manage your account"
              chevron
            />
            <MobileListItem
              icon={<Bell className="h-4 w-4" />}
              iconBg="bg-green-500"
              title="Notifications"
              value="On"
              chevron
            />
            <MobileListItem
              icon={<Settings className="h-4 w-4" />}
              iconBg="bg-purple-500"
              title="Preferences"
              chevron
            />
            <MobileListItem
              icon={<Trash2 className="h-4 w-4" />}
              title="Delete Account"
              destructive
            />
          </MobileList>
        </div>
      </DemoCard>

      {/* TopBar */}
      <DemoCard id="topbar" title="TopBar - Mobile Header">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mobile navigation header with back button, title, and action buttons.
          </p>
          <CodeBlock
            code={`<TopBar
  title="Settings"
  back={() => navigate(-1)}
  rightAction={<TopBarAction icon={<Search />} />}
/>`}
            id="topbar-code"
          />
          <div className="border rounded-lg overflow-hidden">
            <TopBar
              title="Settings"
              subtitle="Preferences"
              back={() => console.log('Back')}
              rightAction={<TopBarAction icon={<MoreVertical className="h-5 w-5" />} onClick={() => {}} />}
            />
            <div className="p-4 text-muted-foreground text-sm">Page content</div>
          </div>
        </div>
      </DemoCard>

      {/* BottomNav */}
      <DemoCard id="bottomnav" title="BottomNav - Tab Bar">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Fixed bottom navigation bar with icons, labels, and badge support.
          </p>
          <CodeBlock
            code={`<BottomNav
  value={tab}
  onValueChange={setTab}
  items={[
    { icon: <Home />, label: 'Home', value: 'home' },
    { icon: <Heart />, label: 'Favorites', value: 'fav', badge: 3 },
  ]}
/>`}
            id="bottomnav-code"
          />
          <div className="relative border rounded-lg overflow-hidden h-48 bg-muted/30">
            <div className="p-4 text-center text-muted-foreground">
              Current: <strong>{bottomNavValue}</strong>
            </div>
            <div className="absolute bottom-0 left-0 right-0">
              <BottomNav
                value={bottomNavValue}
                onValueChange={setBottomNavValue}
                fixed={false}
                items={[
                  { icon: <Home className="h-5 w-5" />, label: 'Home', value: 'home' },
                  { icon: <Search className="h-5 w-5" />, label: 'Search', value: 'search' },
                  { icon: <Heart className="h-5 w-5" />, label: 'Favorites', value: 'favorites', badge: 3 },
                  { icon: <User className="h-5 w-5" />, label: 'Profile', value: 'profile' },
                ]}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* ActionSheet */}
      <DemoCard id="actionsheet" title="ActionSheet - iOS Action Menu">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bottom action sheet for presenting choices with icons and destructive options.
          </p>
          <CodeBlock
            code={`<ActionSheet
  open={open}
  onOpenChange={setOpen}
  title="Share Photo"
  actions={[
    { label: 'Message', icon: <Mail />, onPress: () => {} },
    { label: 'Delete', destructive: true, onPress: () => {} },
  ]}
/>`}
            id="actionsheet-code"
          />
          <button
            onClick={() => setActionSheetOpen(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Open Action Sheet
          </button>
          <ActionSheet
            open={actionSheetOpen}
            onOpenChange={setActionSheetOpen}
            title="Share Photo"
            description="Choose how to share"
            actions={[
              { label: 'Message', onPress: () => {}, icon: <Mail className="h-5 w-5" /> },
              { label: 'Copy Link', onPress: () => {}, icon: <Share className="h-5 w-5" /> },
              { label: 'Delete', onPress: () => {}, destructive: true, icon: <Trash2 className="h-5 w-5" /> },
            ]}
          />
        </div>
      </DemoCard>

      {/* ScrollTabs */}
      <DemoCard id="scroll-tabs" title="ScrollTabs - Horizontal Tabs">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Horizontal scrollable tabs for category navigation.
          </p>
          <CodeBlock
            code={`<ScrollTabs
  items={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
  ]}
  value={tab}
  onValueChange={setTab}
/>`}
            id="scrolltabs-code"
          />
          <ScrollTabs
            items={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'pending', label: 'Pending' },
              { value: 'completed', label: 'Completed' },
              { value: 'archived', label: 'Archived' },
            ]}
            value={segmentValue}
            onValueChange={setSegmentValue}
          />
          <HorizontalScroll>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="w-28 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white shrink-0">
                Item {i + 1}
              </div>
            ))}
          </HorizontalScroll>
        </div>
      </DemoCard>

      {/* ==================== SECTION: CARDS ==================== */}

      {/* Mobile Cards */}
      <DemoCard id="mobile-cards" title="MobileCard - Card Variants">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Card components for mobile: ProductCard, HorizontalCard, StoryCard.
          </p>
          <CodeBlock
            code={`<ProductCard
  image="/product.jpg"
  title="Product"
  price="$99"
  originalPrice="$149"
  badge="Sale"
  rating={4.5}
/>`}
            id="mobilecard-code"
          />
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400"
              title="Classic Watch"
              subtitle="Accessories"
              price="$99.99"
              originalPrice="$149.99"
              badge="Sale"
              rating={4.5}
            />
            <ProductCard
              image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400"
              title="Sunglasses"
              subtitle="Eyewear"
              price="$79.99"
              rating={4.8}
            />
          </div>
          <HorizontalCard
            image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200"
            title="Product Title"
            subtitle="Description here"
            meta="In stock"
            action={<ChevronRight className="h-5 w-5" />}
          />
          <div className="flex gap-3">
            <StoryCard
              image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100"
              title="Story 1"
              isNew
            />
            <StoryCard
              image="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=100"
              title="Story 2"
            />
          </div>
        </div>
      </DemoCard>

      {/* CardSlider */}
      <DemoCard id="card-slider" title="CardSlider - Carousel">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Horizontal swipeable carousel. Presets: ProductSlider, StorySlider, BannerSlider.
          </p>
          <CodeBlock
            code={`<ProductSlider>
  <MobileCard className="h-40 bg-blue-500" />
  <MobileCard className="h-40 bg-green-500" />
</ProductSlider>`}
            id="cardslider-code"
          />
          <ProductSlider>
            <MobileCard className="h-32 bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
              Slide 1
            </MobileCard>
            <MobileCard className="h-32 bg-gradient-to-br from-green-500 to-teal-500 flex items-center justify-center text-white">
              Slide 2
            </MobileCard>
            <MobileCard className="h-32 bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white">
              Slide 3
            </MobileCard>
          </ProductSlider>
        </div>
      </DemoCard>

      {/* ==================== SECTION: ACTIONS ==================== */}

      {/* SwipeActions */}
      <DemoCard id="swipe-actions" title="SwipeActions - Swipe to Reveal">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            iOS-style swipe actions for list items. Swipe left/right to reveal.
          </p>
          <CodeBlock
            code={`<SwipeableListItem
  onDelete={() => {}}
  onArchive={() => {}}
>
  <div>Swipe me</div>
</SwipeableListItem>`}
            id="swipeactions-code"
          />
          <div className="space-y-2">
            <SwipeableListItem
              onDelete={() => toast.show({ message: 'Deleted', type: 'error' })}
              onArchive={() => toast.show({ message: 'Archived' })}
            >
              <div className="p-4 bg-card border-b">
                <p className="font-medium">Swipe left to delete/archive</p>
                <p className="text-sm text-muted-foreground">Try swiping this item</p>
              </div>
            </SwipeableListItem>
            <SwipeActions
              leftActions={[
                { id: 'star', label: 'Star', icon: <Star className="h-5 w-5" />, color: 'primary', onClick: () => toast.show({ message: 'Starred' }) }
              ]}
              rightActions={[
                createArchiveAction(() => toast.show({ message: 'Archived' })),
                createDeleteAction(() => toast.show({ message: 'Deleted', type: 'error' })),
              ]}
            >
              <div className="p-4 bg-card border-b">
                <p className="font-medium">Swipe both ways</p>
                <p className="text-sm text-muted-foreground">Left: Star | Right: Archive/Delete</p>
              </div>
            </SwipeActions>
          </div>
        </div>
      </DemoCard>

      {/* SegmentedControl */}
      <DemoCard id="segmented-control" title="SegmentedControl - iOS Tabs">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            iOS-style segmented control with sliding indicator.
          </p>
          <CodeBlock
            code={`<SegmentedControl
  options={[
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
  ]}
  value={value}
  onChange={setValue}
/>`}
            id="segmentedcontrol-code"
          />
          <SegmentedControl
            options={[
              { value: 'all', label: 'All' },
              { value: 'active', label: 'Active' },
              { value: 'completed', label: 'Completed' },
            ]}
            value={segmentValue}
            onChange={setSegmentValue}
            fullWidth
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-medium mb-2">SimpleSegment:</p>
              <SimpleSegment
                leftLabel="Grid"
                rightLabel="List"
                value={simpleSegment}
                onChange={setSimpleSegment}
              />
            </div>
            <div>
              <p className="text-xs font-medium mb-2">IconSegment:</p>
              <IconSegment
                options={[
                  { value: 'grid', icon: <Settings className="h-4 w-4" />, label: 'Grid' },
                  { value: 'list', icon: <Heart className="h-4 w-4" />, label: 'List' },
                ]}
                value={iconSegment}
                onChange={setIconSegment}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* PageIndicator */}
      <DemoCard id="page-indicator" title="PageIndicator - Pagination Dots">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Page indicator dots for carousels and onboarding screens.
          </p>
          <CodeBlock
            code={`<PageIndicator
  total={5}
  current={index}
  onPageChange={setIndex}
  variant="dots"
/>`}
            id="pageindicator-code"
          />
          <div className="space-y-4">
            <div className="flex justify-center">
              <PageIndicator total={5} current={pageIndex} onPageChange={setPageIndex} variant="dots" />
            </div>
            <div className="flex justify-center">
              <PageIndicator total={5} current={pageIndex} variant="lines" />
            </div>
            <div className="flex justify-center">
              <NumberedIndicator current={pageIndex} total={5} />
            </div>
          </div>
          <div className="flex justify-center gap-2">
            <button onClick={() => setPageIndex(Math.max(0, pageIndex - 1))} className="px-3 py-1 border rounded" disabled={pageIndex === 0}>
              Prev
            </button>
            <button onClick={() => setPageIndex(Math.min(4, pageIndex + 1))} className="px-3 py-1 border rounded" disabled={pageIndex === 4}>
              Next
            </button>
          </div>
        </div>
      </DemoCard>

      {/* FloatingButton */}
      <DemoCard id="floating-button" title="FloatingButton - FAB">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Floating action button with speed dial menu. Uses absolute positioning.
          </p>
          <CodeBlock
            code={`<div className="relative h-64">
  <FloatingButton
    icon={<Plus />}
    actions={[
      { id: '1', icon: <Phone />, label: 'Call', onClick: () => {} },
      { id: '2', icon: <Mail />, label: 'Email', onClick: () => {} },
    ]}
    position="bottom-right"
  />
</div>`}
            id="floatingbutton-code"
          />
          <div className="relative h-56 border rounded-lg overflow-hidden bg-muted/30">
            <p className="p-4 text-sm text-muted-foreground">Click the + button to expand speed dial</p>
            <FloatingButton
              icon={<Plus className="h-6 w-6" />}
              actions={[
                { id: '1', icon: <Phone className="h-5 w-5" />, label: 'Call', onClick: () => toast.show({ message: 'Call' }) },
                { id: '2', icon: <Mail className="h-5 w-5" />, label: 'Email', onClick: () => toast.show({ message: 'Email' }) },
                { id: '3', icon: <Camera className="h-5 w-5" />, label: 'Photo', onClick: () => toast.show({ message: 'Photo' }) },
              ]}
              position="bottom-right"
            />
          </div>
        </div>
      </DemoCard>

      {/* ==================== SECTION: INPUT/FILTERS ==================== */}

      {/* SearchBar */}
      <DemoCard id="search-bar" title="SearchBar - Mobile Search">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            iOS-style search bar with cancel button and filter options.
          </p>
          <CodeBlock
            code={`<SearchBar
  value={search}
  onChange={setSearch}
  placeholder="Search..."
  showCancel
  showFilter
/>`}
            id="searchbar-code"
          />
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            placeholder="Search products..."
            showCancel
            showFilter
            onFilter={() => console.log('Filter')}
          />
          <div className="border rounded-lg">
            <SearchHeader value={searchValue} onChange={setSearchValue} placeholder="Search..." onCancel={() => setSearchValue('')} />
          </div>
          <SearchSuggestions
            suggestions={['iPhone', 'iPad', 'MacBook', 'Apple Watch']}
            onSelect={(s) => setSearchValue(s)}
          />
        </div>
      </DemoCard>

      {/* FilterChips */}
      <DemoCard id="filter-chips" title="FilterChips - Scrollable Filters">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Horizontal scrollable filter chips with single/multiple selection.
          </p>
          <CodeBlock
            code={`<FilterChips
  options={[{ id: 'new', label: 'New', count: 24 }]}
  selected={selected}
  onChange={setSelected}
  multiple
/>`}
            id="filterchips-code"
          />
          <FilterChips
            options={filterOptions}
            selected={filterSelected}
            onChange={setFilterSelected}
            multiple
            variant="outline"
          />
          <RemovableChips
            chips={filterSelected.map(id => ({ id, label: filterOptions.find(o => o.id === id)?.label || id }))}
            onRemove={(id) => setFilterSelected(s => s.filter(i => i !== id))}
            onClearAll={() => setFilterSelected([])}
          />
          <FilterButton
            label="Filter"
            value={filterSelected.length > 0 ? `${filterSelected.length} selected` : undefined}
            active={filterSelected.length > 0}
            onClick={() => {}}
          />
        </div>
      </DemoCard>

      {/* BottomSheet */}
      <DemoCard id="bottom-sheet" title="BottomSheet - Draggable Modal">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Draggable bottom sheet with snap points. SimpleBottomSheet and OptionSheet variants.
          </p>
          <CodeBlock
            code={`<BottomSheet
  open={open}
  onClose={() => setOpen(false)}
  title="Filter"
  showHandle
>
  Content
</BottomSheet>`}
            id="bottomsheet-code"
          />
          <div className="flex gap-2">
            <button onClick={() => setBottomSheetOpen(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Simple Sheet
            </button>
            <button onClick={() => setOptionSheetOpen(true)} className="px-4 py-2 border rounded-lg">
              Option Sheet
            </button>
          </div>
          <SimpleBottomSheet open={bottomSheetOpen} onClose={() => setBottomSheetOpen(false)} title="Filter Options">
            <div className="py-4">
              <p>Drag to dismiss or click outside.</p>
            </div>
          </SimpleBottomSheet>
          <OptionSheet
            open={optionSheetOpen}
            onClose={() => setOptionSheetOpen(false)}
            title="Select Option"
            options={[
              { id: '1', label: 'Option 1', icon: <Star className="h-5 w-5" /> },
              { id: '2', label: 'Option 2', icon: <Bell className="h-5 w-5" /> },
              { id: '3', label: 'Delete', destructive: true, icon: <Trash2 className="h-5 w-5" /> },
            ]}
            onSelect={(id) => console.log('Selected:', id)}
          />
        </div>
      </DemoCard>

      {/* MobilePicker */}
      <DemoCard id="mobile-picker" title="MobilePicker - BottomSheet Select">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mobile-friendly select that opens a BottomSheet with searchable options. Works inside MobileFrame.
          </p>
          <CodeBlock
            code={`// Single selection
<MobilePicker
  label="Country"
  value={value}
  onChange={setValue}
  options={[
    { value: 'us', label: 'USA', description: 'United States' },
    { value: 'uk', label: 'UK', description: 'United Kingdom' },
  ]}
  searchable
  title="Select Country"
/>

// Multi-selection
<MobilePicker
  label="Tags"
  multiple
  value={values}
  onChange={setValues}
  options={['React', 'Vue', 'Angular']}
/>`}
            id="mobilepicker-code"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="border rounded-lg overflow-hidden">
              <MobileFrame device="iphone" size="sm">
                <Screen>
                  <ScreenHeader>
                    <TopBar title="Demo" />
                  </ScreenHeader>
                  <ScreenBody className="p-4 space-y-4">
                    <MobilePicker
                      label="Single Selection"
                      value={pickerValue}
                      onChange={setPickerValue}
                      options={[
                        { value: 'apple', label: 'Apple', description: 'Fresh red apples' },
                        { value: 'banana', label: 'Banana', description: 'Yellow bananas' },
                        { value: 'orange', label: 'Orange', description: 'Juicy oranges' },
                        { value: 'grape', label: 'Grape', description: 'Sweet grapes' },
                      ]}
                      placeholder="Select fruit..."
                      title="Choose a Fruit"
                      searchable
                    />
                    <MobilePicker
                      label="Multi Selection"
                      multiple
                      value={multiPickerValue}
                      onChange={setMultiPickerValue}
                      options={['React', 'Vue', 'Angular', 'Svelte', 'Solid']}
                      placeholder="Select frameworks..."
                      title="Choose Frameworks"
                      searchable
                    />
                  </ScreenBody>
                </Screen>
              </MobileFrame>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Single:</span>{' '}
                <code className="bg-muted px-1 rounded">{pickerValue || '(empty)'}</code>
              </div>
              <div>
                <span className="text-muted-foreground">Multi:</span>{' '}
                <code className="bg-muted px-1 rounded">[{multiPickerValue.join(', ')}]</code>
              </div>
              <ul className="mt-4 space-y-1 text-muted-foreground">
                <li>• Looks like Select, opens BottomSheet</li>
                <li>• Works inside MobileFrame (absolute positioning)</li>
                <li>• Searchable with filter input</li>
                <li>• Multi-select with OK confirmation</li>
                <li>• Supports descriptions and icons</li>
              </ul>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* ==================== SECTION: FEEDBACK ==================== */}

      {/* SuccessAnimation */}
      <DemoCard id="success-animation" title="SuccessAnimation - Result Screens">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Full screen result for success/error states after completing actions. Includes Confetti for celebrations.
          </p>
          <CodeBlock
            code={`<FullScreenResult
  type="success"
  title="Payment Successful!"
  description="Your order has been confirmed"
  primaryAction={{ label: 'Continue', onClick: () => {} }}
/>

// Confetti (place in relative container)
<div className="relative h-48 overflow-hidden">
  <Confetti show={true} duration={3000} />
</div>`}
            id="successanimation-code"
          />
          <div className="flex gap-2">
            <button onClick={() => setSuccessShow(true)} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
              Show Result Screen
            </button>
            <button onClick={() => setConfettiShow(true)} className="px-4 py-2 border rounded-lg">
              Trigger Confetti
            </button>
          </div>
          {successShow && (
            <div className="relative border rounded-lg overflow-hidden h-[350px] bg-background">
              <FullScreenResult
                type="success"
                title="Payment Successful!"
                description="Your order has been confirmed"
                primaryAction={{ label: 'Continue', onClick: () => setSuccessShow(false) }}
              />
            </div>
          )}
          {confettiShow && (
            <div className="relative border rounded-lg overflow-hidden h-48 bg-muted/30">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                🎉 Confetti Demo
              </div>
              <Confetti show={confettiShow} duration={3000} />
            </div>
          )}
        </div>
      </DemoCard>

      {/* ProductGallery */}
      <DemoCard id="product-gallery" title="ProductGallery - Image Gallery">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Image gallery with thumbnails for product images. SimpleGallery variant included.
          </p>
          <CodeBlock
            code={`<ProductGallery
  images={['/img1.jpg', '/img2.jpg']}
  initialIndex={0}
/>`}
            id="productgallery-code"
          />
          <ProductGallery
            images={[
              'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
              'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400',
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            ]}
            initialIndex={0}
            onImageChange={(index: number) => console.log('Image:', index)}
          />
        </div>
      </DemoCard>

      {/* CartBadge */}
      <DemoCard id="cart-badge" title="CartBadge - Icon with Count">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Icon button with badge count. NotificationBadge and WishlistBadge variants.
          </p>
          <CodeBlock
            code={`<CartBadge count={3} icon="cart" animate onClick={() => {}} />
<NotificationBadge hasNotification />
<WishlistBadge count={5} filled />`}
            id="cartbadge-code"
          />
          <div className="flex items-center gap-4">
            <CartBadge count={cartCount} onClick={() => setCartCount(c => c + 1)} />
            <NotificationBadge hasNotification icon="bell" />
            <WishlistBadge count={5} filled />
            <CartBadge count={99} maxCount={99} icon="mail" size="sm" />
          </div>
          <button onClick={() => setCartCount(c => c + 1)} className="text-sm text-primary">
            Increment ({cartCount})
          </button>
        </div>
      </DemoCard>

      {/* MobileToast */}
      <DemoCard id="mobile-toast" title="MobileToast - Notifications">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Toast notifications with types. useToast hook, Snackbar, and InlineToast.
          </p>
          <CodeBlock
            code={`const toast = useToast()
toast.show({ message: 'Success!', type: 'success' })

<Snackbar open={open} message="Deleted" onClose={() => {}} />`}
            id="mobiletoast-code"
          />
          <div className="flex flex-wrap gap-2">
            <button onClick={() => toast.show({ message: 'Default toast' })} className="px-3 py-1 border rounded">
              Default
            </button>
            <button onClick={() => toast.show({ message: 'Success!', type: 'success' })} className="px-3 py-1 border rounded">
              Success
            </button>
            <button onClick={() => toast.show({ message: 'Error', type: 'error' })} className="px-3 py-1 border rounded">
              Error
            </button>
            <button onClick={() => toast.show({ message: 'Warning', type: 'warning' })} className="px-3 py-1 border rounded">
              Warning
            </button>
          </div>
          <button onClick={() => setSnackbarOpen(true)} className="px-3 py-1 border rounded">
            Show Snackbar
          </button>
          <Snackbar
            open={snackbarOpen}
            message="Item deleted"
            onClose={() => setSnackbarOpen(false)}
            action={{ label: 'Undo', onClick: () => setSnackbarOpen(false) }}
            position="bottom"
          />
          <InlineToast type="info" message="Inline toast for embedding in UI" />
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
                <th className="text-left py-2">Use Case</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">MobileFrame</td>
                <td className="py-2 pr-4">device, size, scale</td>
                <td className="py-2">Phone preview</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Screen</td>
                <td className="py-2 pr-4">children</td>
                <td className="py-2">Page structure</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">TopBar</td>
                <td className="py-2 pr-4">title, back, rightAction</td>
                <td className="py-2">Page header</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">BottomNav</td>
                <td className="py-2 pr-4">items, value, badge</td>
                <td className="py-2">Tab navigation</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ActionSheet</td>
                <td className="py-2 pr-4">actions, title, destructive</td>
                <td className="py-2">Options menu</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">BottomSheet</td>
                <td className="py-2 pr-4">snapPoints, showHandle</td>
                <td className="py-2">Modals, filters</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SwipeActions</td>
                <td className="py-2 pr-4">leftActions, rightActions</td>
                <td className="py-2">List actions</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">FloatingButton</td>
                <td className="py-2 pr-4">actions, position</td>
                <td className="py-2">Quick actions</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SearchBar</td>
                <td className="py-2 pr-4">showCancel, showFilter</td>
                <td className="py-2">Search pages</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">MobileToast</td>
                <td className="py-2 pr-4">type, duration, action</td>
                <td className="py-2">Feedback</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}

export function MobileDemo() {
  return (
    <MobileToastProvider position="bottom">
      <MobileDemoContent />
    </MobileToastProvider>
  )
}
