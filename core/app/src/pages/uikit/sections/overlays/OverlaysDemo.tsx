import { useState } from 'react'
import { Bell, Settings, Trash2, Info } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/Dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/Drawer'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/Sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/Popover'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  ConfirmDialog,
  Alert,
} from '@/components/ui/AlertDialog'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  SimpleTooltip,
} from '@/components/ui/Tooltip'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function OverlaysDemo() {
  useScrollToSection()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Overlays"
        description="Modal dialogs, drawers, sheets, popovers, alerts, and tooltips for layered content and interactions."
      />

      {/* Dialog */}
      <DemoCard id="dialog" title="Dialog - Modal Window">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Modal dialog for focused tasks. Blocks interaction with underlying page until dismissed.
          </p>
          <CodeBlock
            code={`<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <div>... content ...</div>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save Changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
            id="dialog"
          />
          <div className="pt-2">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
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
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <input
                      className="w-full h-9 px-3 rounded-md border"
                      defaultValue="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email</label>
                    <input
                      className="w-full h-9 px-3 rounded-md border"
                      defaultValue="john@example.com"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setDialogOpen(false)}>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </DemoCard>

      {/* Drawer */}
      <DemoCard id="drawer" title="Drawer - Mobile-style Bottom Sheet">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Mobile-optimized drawer that slides from bottom. Great for mobile UX. Uses Vaul library.
          </p>
          <CodeBlock
            code={`<Drawer>
  <DrawerTrigger asChild>
    <Button>Open Drawer</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>Are you sure?</DrawerTitle>
      <DrawerDescription>This action cannot be undone.</DrawerDescription>
    </DrawerHeader>
    <div className="p-4">... content ...</div>
    <DrawerFooter>
      <Button>Submit</Button>
      <DrawerClose asChild>
        <Button variant="outline">Cancel</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
            id="drawer"
          />
          <div className="pt-2">
            <Drawer>
              <DrawerTrigger asChild>
                <Button>Open Drawer</Button>
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Mobile Drawer</DrawerTitle>
                  <DrawerDescription>
                    Swipe down or click outside to close.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 space-y-3">
                  <p className="text-sm">
                    This drawer component is optimized for mobile devices and provides a
                    smooth swipe-to-dismiss interaction.
                  </p>
                  <div className="flex gap-2">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        You have 3 unread messages
                      </p>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <Button>View All</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Close</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </DemoCard>

      {/* Sheet */}
      <DemoCard id="sheet" title="Sheet - Slide-in Panel (Any Side)">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Slide-in panel from any side (left, right, top, bottom). Perfect for side navigation or settings.
          </p>
          <CodeBlock
            code={`<Sheet>
  <SheetTrigger asChild>
    <Button>Open Sheet</Button>
  </SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Settings</SheetTitle>
      <SheetDescription>
        Configure your preferences
      </SheetDescription>
    </SheetHeader>
    <div>... content ...</div>
  </SheetContent>
</Sheet>`}
            id="sheet"
          />
          <div className="flex gap-2 pt-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Left</Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>App menu from left side</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-2">
                  <div className="p-2 hover:bg-muted rounded cursor-pointer">Home</div>
                  <div className="p-2 hover:bg-muted rounded cursor-pointer">Products</div>
                  <div className="p-2 hover:bg-muted rounded cursor-pointer">Settings</div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Right</Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Settings</SheetTitle>
                  <SheetDescription>Configure preferences</SheetDescription>
                </SheetHeader>
                <div className="py-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Dark Mode</span>
                    <Button variant="outline" size="sm">Toggle</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Notifications</span>
                    <Button variant="outline" size="sm">On</Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Top</Button>
              </SheetTrigger>
              <SheetContent side="top">
                <SheetHeader>
                  <SheetTitle>Announcement</SheetTitle>
                  <SheetDescription>From top of screen</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Bottom</Button>
              </SheetTrigger>
              <SheetContent side="bottom">
                <SheetHeader>
                  <SheetTitle>Quick Actions</SheetTitle>
                  <SheetDescription>From bottom of screen</SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </DemoCard>

      {/* Popover */}
      <DemoCard id="popover" title="Popover - Floating Content">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Lightweight floating content. Great for menus, filters, or additional info.
          </p>
          <CodeBlock
            code={`<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline">Open Popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="space-y-2">
      <h4 className="font-medium">Dimensions</h4>
      <p className="text-sm text-muted-foreground">
        Set the dimensions for the layer.
      </p>
    </div>
  </PopoverContent>
</Popover>`}
            id="popover"
          />
          <div className="flex gap-2 pt-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="space-y-3">
                  <h4 className="font-medium leading-none">Quick Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Auto-save</span>
                      <input type="checkbox" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Notifications</span>
                      <input type="checkbox" defaultChecked />
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Notifications</h4>
                  <div className="space-y-2 text-sm">
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">New message</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                    <div className="p-2 bg-muted rounded">
                      <p className="font-medium">Update available</p>
                      <p className="text-xs text-muted-foreground">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </DemoCard>

      {/* AlertDialog */}
      <DemoCard id="alert-dialog" title="AlertDialog - Confirmation Dialogs">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Critical dialogs that require user action. Cannot dismiss by clicking outside.
          </p>
          <CodeBlock
            code={`// Basic AlertDialog
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

// High-level ConfirmDialog
<ConfirmDialog
  open={open}
  onOpenChange={setOpen}
  title="Delete Item?"
  description="This will permanently delete this item."
  variant="destructive"
  onConfirm={() => console.log('Confirmed')}
/>`}
            id="alert-dialog"
          />
          <div className="flex gap-2 pt-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your
                    account and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button onClick={() => setConfirmOpen(true)}>
              ConfirmDialog (Helper)
            </Button>

            <Button variant="outline" onClick={() => setAlertOpen(true)}>
              Simple Alert
            </Button>
          </div>

          <ConfirmDialog
            open={confirmOpen}
            onOpenChange={setConfirmOpen}
            title="Save Changes?"
            description="You have unsaved changes. Do you want to save them before leaving?"
            confirmText="Save"
            cancelText="Discard"
            onConfirm={() => {
              console.log('Saved')
              setConfirmOpen(false)
            }}
          />

          <Alert
            open={alertOpen}
            onOpenChange={setAlertOpen}
            title="Success!"
            description="Your changes have been saved successfully."
            buttonText="OK"
            onClose={() => setAlertOpen(false)}
          />
        </div>
      </DemoCard>

      {/* Tooltip */}
      <DemoCard id="tooltip" title="Tooltip - Hover Information">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Small hints shown on hover. Great for icons or abbreviated text.
          </p>
          <CodeBlock
            code={`// Basic Tooltip
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger asChild>
      <Button variant="outline">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      <p>Helpful information</p>
    </TooltipContent>
  </Tooltip>
</TooltipProvider>

// Simple wrapper
<SimpleTooltip content="Delete item" side="top">
  <Button variant="destructive" size="icon">
    <Trash2 className="h-4 w-4" />
  </Button>
</SimpleTooltip>`}
            id="tooltip"
          />
          <div className="flex flex-wrap gap-4 pt-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Top (default)</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Tooltip on top</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Right</Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Tooltip on right</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Bottom</Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Tooltip on bottom</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Left</Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>Tooltip on left</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <SimpleTooltip content="Settings" side="top">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Delete" side="top">
              <Button variant="destructive" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </SimpleTooltip>

            <SimpleTooltip content="Info" side="top">
              <Button variant="ghost" size="icon">
                <Info className="h-4 w-4" />
              </Button>
            </SimpleTooltip>
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
                <td className="py-2 pr-4">Dialog</td>
                <td className="py-2 pr-4">open, onOpenChange</td>
                <td className="py-2">Centered modal, can close outside</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Drawer</td>
                <td className="py-2 pr-4">shouldScaleBackground</td>
                <td className="py-2">From bottom, mobile-first (Vaul)</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Sheet</td>
                <td className="py-2 pr-4">side (left/right/top/bottom), showClose</td>
                <td className="py-2">Slide from any side</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Popover</td>
                <td className="py-2 pr-4">align, sideOffset</td>
                <td className="py-2">Lightweight floating content</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">AlertDialog</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Blocks closing outside</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">ConfirmDialog</td>
                <td className="py-2 pr-4">variant (destructive), onConfirm</td>
                <td className="py-2">High-level helper</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Tooltip</td>
                <td className="py-2 pr-4">side, delayDuration</td>
                <td className="py-2">Hover only, auto-dismiss</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
