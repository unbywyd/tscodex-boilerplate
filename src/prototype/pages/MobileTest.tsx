// Mobile Components Test Page
// Tests: DropdownMenu, Dialog, BottomSheet, Sheet, Drawer inside MobileFrame

import { useState } from 'react'
import { AppProvider } from '@/components/AppProvider'
import {
  MobileFrame,
  Button,
  SimpleBottomSheet,
  BottomSheet,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerTrigger,
  DrawerFooter,
  DrawerClose,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  TopBar,
  Card,
  CardContent,
  Doc,
} from '@/components/ui'
import { MoreVertical, Settings, User, LogOut, Bell, HelpCircle, ChevronRight } from 'lucide-react'

export default function MobileTestPage() {
  // State for custom bottom sheets
  const [simpleSheetOpen, setSimpleSheetOpen] = useState(false)
  const [draggableSheetOpen, setDraggableSheetOpen] = useState(false)

  return (
    <AppProvider showDocLinks={false} showEventToasts={false}>
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Mobile Components Test</h1>
          <p className="text-muted-foreground mt-2">
            Testing overlays inside MobileFrame. All components should render within the phone frame.
          </p>
        </div>

        <div className="flex flex-wrap gap-8 justify-center">
          {/* Test Frame */}
          <MobileFrame device="iphone" size="md">
            <Doc of="routes.prototype-home">
              <div className="h-full flex flex-col bg-background">
                {/* TopBar with DropdownMenu */}
                <TopBar
                  title="Test Screen"
                  rightAction={
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Notifications
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem variant="destructive">
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  }
                />

                {/* Content */}
                <div className="flex-1 overflow-auto p-4 space-y-4">
                  <Doc of="components.user-card">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">1. DropdownMenu (два в ряд)</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Тест двух дропдаунов рядом
                        </p>
                        <div className="flex gap-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex-1">
                                Left
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Left Option 1</DropdownMenuItem>
                              <DropdownMenuItem>Left Option 2</DropdownMenuItem>
                              <DropdownMenuItem>Left Option 3</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex-1">
                                Right
                                <ChevronRight className="h-4 w-4 ml-1" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem>Right Option 1</DropdownMenuItem>
                              <DropdownMenuItem>Right Option 2</DropdownMenuItem>
                              <DropdownMenuItem>Right Option 3</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </Doc>

                  <Doc of="components.dialog-test">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">2. Dialog (Modal)</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Radix Dialog with inline mode
                        </p>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="w-full">Open Dialog</Button>
                          </DialogTrigger>
                          <DialogContent inline className="max-w-[90%]">
                            <DialogHeader>
                              <DialogTitle>Modal Title</DialogTitle>
                              <DialogDescription>
                                This dialog should appear inside the mobile frame, not in body portal.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                              <p className="text-sm">Modal content goes here.</p>
                            </div>
                            <DialogFooter>
                              <Button variant="outline">Cancel</Button>
                              <Button>Confirm</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </CardContent>
                    </Card>
                  </Doc>

                  <Doc of="components.sheet-test">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">3. Sheet (Side Panel)</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Bottom sheet using Radix Sheet
                        </p>
                        <Sheet>
                          <SheetTrigger asChild>
                            <Button variant="outline" className="w-full">Open Sheet</Button>
                          </SheetTrigger>
                          <SheetContent side="bottom" inline>
                            <SheetHeader>
                              <SheetTitle>Sheet Title</SheetTitle>
                              <SheetDescription>
                                This sheet slides from bottom inside the frame.
                              </SheetDescription>
                            </SheetHeader>
                            <div className="py-4 space-y-2">
                              <Button className="w-full" variant="outline">Action 1</Button>
                              <Button className="w-full" variant="outline">Action 2</Button>
                              <Button className="w-full" variant="outline">Action 3</Button>
                            </div>
                          </SheetContent>
                        </Sheet>
                      </CardContent>
                    </Card>
                  </Doc>

                  <Doc of="components.drawer-test">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">4. Drawer (Vaul)</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Draggable drawer using Vaul library
                        </p>
                        <Drawer>
                          <DrawerTrigger asChild>
                            <Button variant="outline" className="w-full">Open Drawer</Button>
                          </DrawerTrigger>
                          <DrawerContent inline>
                            <DrawerHeader>
                              <DrawerTitle>Drawer Title</DrawerTitle>
                              <DrawerDescription>
                                Drag to dismiss or use buttons below.
                              </DrawerDescription>
                            </DrawerHeader>
                            <div className="p-4 space-y-2">
                              <Button className="w-full" variant="outline">
                                <HelpCircle className="mr-2 h-4 w-4" />
                                Help Center
                              </Button>
                              <Button className="w-full" variant="outline">
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </Button>
                            </div>
                            <DrawerFooter>
                              <DrawerClose asChild>
                                <Button variant="outline">Close</Button>
                              </DrawerClose>
                            </DrawerFooter>
                          </DrawerContent>
                        </Drawer>
                      </CardContent>
                    </Card>
                  </Doc>

                  <Doc of="components.simple-bottom-sheet-test">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">5. SimpleBottomSheet</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Custom bottom sheet (no Radix)
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setSimpleSheetOpen(true)}
                        >
                          Open Simple Sheet
                        </Button>
                      </CardContent>
                    </Card>
                  </Doc>

                  <Doc of="components.draggable-bottom-sheet-test">
                    <Card>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">6. BottomSheet (Draggable)</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Custom draggable with snap points
                        </p>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => setDraggableSheetOpen(true)}
                        >
                          Open Draggable Sheet
                        </Button>
                      </CardContent>
                    </Card>
                  </Doc>

                  {/* Spacer for scroll testing */}
                  <div className="h-32" />
                </div>

                {/* Custom Bottom Sheets - rendered at screen level */}
                <SimpleBottomSheet
                  open={simpleSheetOpen}
                  onClose={() => setSimpleSheetOpen(false)}
                  title="Simple Bottom Sheet"
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      This is a simple bottom sheet without drag functionality.
                    </p>
                    <Button
                      className="w-full"
                      onClick={() => setSimpleSheetOpen(false)}
                    >
                      Got it
                    </Button>
                  </div>
                </SimpleBottomSheet>

                <BottomSheet
                  open={draggableSheetOpen}
                  onClose={() => setDraggableSheetOpen(false)}
                  title="Draggable Sheet"
                  snapPoints={[40, 70, 90]}
                  defaultSnap={0}
                  showClose
                >
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Drag the handle to expand or collapse. Drag down to close.
                    </p>
                    <div className="space-y-2">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          Item {i + 1}
                        </div>
                      ))}
                    </div>
                  </div>
                </BottomSheet>
              </div>
            </Doc>
          </MobileFrame>
        </div>

        {/* Status */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2">Known Issues to Check:</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>DropdownMenu renders in body portal - escapes MobileFrame</li>
              <li>Dialog/Sheet without <code>inline</code> prop - escapes MobileFrame</li>
              <li>Drawer without <code>inline</code> prop - escapes MobileFrame</li>
              <li>Z-index conflicts between overlays</li>
              <li>Backdrop click not working properly</li>
              <li>Touch events not propagating correctly</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
    </AppProvider>
  )
}
