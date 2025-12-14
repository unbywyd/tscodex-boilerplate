import { useState } from 'react'
import {
  Plus, Edit, Trash2, MoreVertical, Settings, User,
  LogOut, Copy, Share, Download, Heart, Bell, Mail
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { IconButton } from '@/components/ui/IconButton'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuShortcut,
} from '@/components/ui/DropdownMenu'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function ActionsDemo() {
  useScrollToSection()
  const [loading, setLoading] = useState(false)
  const [showNotifications, setShowNotifications] = useState(true)
  const [theme, setTheme] = useState('light')

  const simulateLoading = () => {
    setLoading(true)
    setTimeout(() => setLoading(false), 2000)
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Actions"
        description="Buttons, icon buttons, and dropdown menus for user interactions."
      />

      {/* Button */}
      <DemoCard id="button" title="Button - Primary Actions">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Standard button with variants, sizes, and loading state.
          </p>
          <CodeBlock
            code={`<Button variant="default" size="md" loading={loading}>
  Submit
</Button>

// Variants: default, destructive, outline, secondary, ghost, link
// Sizes: default, sm, lg, icon`}
            id="button"
          />
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon"><Plus className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button loading={loading} onClick={simulateLoading}>
                {loading ? 'Loading...' : 'Click to Load'}
              </Button>
              <Button disabled>Disabled</Button>
              <Button>
                <Mail className="h-4 w-4" />
                With Icon
              </Button>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* IconButton */}
      <DemoCard id="icon-button" title="IconButton - Icon Actions">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Circular/rounded buttons for icon-only actions. Supports badges and multiple sizes.
          </p>
          <CodeBlock
            code={`<IconButton variant="outline" size="md" shape="circle">
  <Heart />
</IconButton>

<IconButton badge={5} badgeVariant="destructive">
  <Bell />
</IconButton>

// Variants: default, outline, ghost, destructive, secondary
// Sizes: xs, sm, md, lg, xl
// Shapes: circle, rounded, square`}
            id="iconbutton"
          />
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <IconButton variant="default"><Plus /></IconButton>
              <IconButton variant="outline"><Edit /></IconButton>
              <IconButton variant="ghost"><Settings /></IconButton>
              <IconButton variant="secondary"><Copy /></IconButton>
              <IconButton variant="destructive"><Trash2 /></IconButton>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <IconButton size="xs"><Plus /></IconButton>
              <IconButton size="sm"><Plus /></IconButton>
              <IconButton size="md"><Plus /></IconButton>
              <IconButton size="lg"><Plus /></IconButton>
              <IconButton size="xl"><Plus /></IconButton>
            </div>
            <div className="flex flex-wrap gap-2">
              <IconButton shape="circle" variant="outline"><Heart /></IconButton>
              <IconButton shape="rounded" variant="outline"><Heart /></IconButton>
              <IconButton shape="square" variant="outline"><Heart /></IconButton>
            </div>
            <div className="flex flex-wrap gap-4">
              <IconButton badge={3} variant="outline"><Bell /></IconButton>
              <IconButton badge={99} variant="outline"><Mail /></IconButton>
              <IconButton badge="NEW" badgeVariant="default" variant="outline"><Share /></IconButton>
              <IconButton loading variant="outline"><Download /></IconButton>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* FAB */}
      <DemoCard title="FAB - Floating Action Button">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Floating action button for primary screen actions. Can be extended with label.
          </p>
          <CodeBlock
            code={`// Simple FAB
<FAB position="bottom-right">
  <Plus />
</FAB>

// Extended FAB with label
<FAB extended label="Create">
  <Plus />
</FAB>`}
            id="fab"
          />
          <div className="relative h-32 bg-muted/30 rounded-lg">
            <div className="absolute bottom-4 right-4">
              <IconButton size="lg" className="shadow-lg"><Plus /></IconButton>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-4 h-12 rounded-full bg-primary text-primary-foreground shadow-lg">
              <Plus className="h-5 w-5" />
              <span className="font-medium">Create</span>
            </div>
            <p className="text-xs text-muted-foreground p-4">FAB preview area (actual FAB uses fixed positioning)</p>
          </div>
        </div>
      </DemoCard>

      {/* DropdownMenu */}
      <DemoCard id="dropdown" title="DropdownMenu - Action Menu">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Dropdown menu with items, checkboxes, radio groups, and submenus. Built on Radix UI.
          </p>
          <CodeBlock
            code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User /> Profile
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem variant="destructive">
      <Trash2 /> Delete
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
            id="dropdown"
          />
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Basic Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Basic Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Edit className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Copy className="mr-2 h-4 w-4" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* With Shortcuts */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">With Shortcuts</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" /> Profile
                  <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" /> Settings
                  <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" /> Log out
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* With Checkboxes */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Checkboxes</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={showNotifications}
                  onCheckedChange={setShowNotifications}
                >
                  Show Notifications
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem checked>
                  Email Updates
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* With Radio */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Radio Group</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* With Submenu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">With Submenu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>New Tab</DropdownMenuItem>
                <DropdownMenuItem>New Window</DropdownMenuItem>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Share</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem>Email</DropdownMenuItem>
                    <DropdownMenuItem>Twitter</DropdownMenuItem>
                    <DropdownMenuItem>Facebook</DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Icon Trigger */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <IconButton variant="ghost">
                  <MoreVertical />
                </IconButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Share</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
                <td className="py-2 pr-4">Button</td>
                <td className="py-2 pr-4">variant, size, loading, asChild</td>
                <td className="py-2">asChild for Link wrapping</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">IconButton</td>
                <td className="py-2 pr-4">variant, size, shape, badge, loading</td>
                <td className="py-2">badge: number | string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">FAB</td>
                <td className="py-2 pr-4">position, extended, label</td>
                <td className="py-2">Fixed positioning</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">DropdownMenu</td>
                <td className="py-2 pr-4">Compound component pattern</td>
                <td className="py-2">Radix UI based</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
