import { Package, Heart, ShoppingCart, Star, User, CreditCard, Settings } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/Card'
import { Container } from '@/components/ui/container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/Accordion'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function LayoutDemo() {
  useScrollToSection()
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Layout Components"
        description="Cards, containers, and accordions for organizing and structuring content."
      />

      {/* Card */}
      <DemoCard id="card" title="Card - Content Container">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Versatile content container with header, content, and footer sections.
          </p>
          <CodeBlock
            code={`<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>`}
            id="card"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <Card>
              <CardHeader>
                <CardTitle>Product Card</CardTitle>
                <CardDescription>Featured product of the week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-muted rounded-md mb-4 flex items-center justify-center">
                  <Package className="h-12 w-12 text-muted-foreground" />
                </div>
                <p className="text-sm">
                  High-quality product with excellent reviews. Available in multiple colors.
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground ml-1">(4.0)</span>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button variant="outline" size="icon">
                  <Heart className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Minimal Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  A simple card without description or footer. Perfect for quick content
                  blocks.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Featured</CardTitle>
                    <CardDescription>Special offer card</CardDescription>
                  </div>
                  <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                    NEW
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  This card has a primary border to make it stand out from the rest.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-muted">
              <CardHeader>
                <CardTitle>Colored Background</CardTitle>
                <CardDescription>With muted background</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Cards can have different background colors to create visual hierarchy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </DemoCard>

      {/* Container */}
      <DemoCard id="container" title="Container - Content Width Wrapper">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Responsive container with max-width and padding. Available in different sizes.
          </p>
          <CodeBlock
            code={`<Container size="lg">
  Content with max-width and responsive padding
</Container>

// Available sizes:
// sm: max-w-3xl
// md: max-w-5xl
// lg: max-w-7xl (default)
// xl: max-w-[90rem]
// full: max-w-full`}
            id="container"
          />
          <div className="space-y-4 pt-2">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs font-medium mb-2">Small (sm) - max-w-3xl:</p>
              <Container size="sm" className="bg-background p-4 rounded">
                <p className="text-sm">Container content with sm size</p>
              </Container>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs font-medium mb-2">Medium (md) - max-w-5xl:</p>
              <Container size="md" className="bg-background p-4 rounded">
                <p className="text-sm">Container content with md size</p>
              </Container>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs font-medium mb-2">Large (lg) - max-w-7xl:</p>
              <Container size="lg" className="bg-background p-4 rounded">
                <p className="text-sm">Container content with lg size (default)</p>
              </Container>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-xs font-medium mb-2">Extra Large (xl) - max-w-[90rem]:</p>
              <Container size="xl" className="bg-background p-4 rounded">
                <p className="text-sm">Container content with xl size</p>
              </Container>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Tabs */}
      <DemoCard id="tabs" title="Tabs - Tabbed Content">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tabbed interface for switching between different views or sections. Built on Radix UI.
          </p>
          <CodeBlock
            code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content
  </TabsContent>
  <TabsContent value="password">
    Password settings content
  </TabsContent>
</Tabs>`}
            id="tabs-code"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Default tabs:
              </p>
              <Tabs defaultValue="account" className="w-full">
                <TabsList>
                  <TabsTrigger value="account">
                    <User className="h-4 w-4 mr-2" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="billing">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing
                  </TabsTrigger>
                  <TabsTrigger value="settings">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="account" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">Account Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences here.
                  </p>
                </TabsContent>
                <TabsContent value="billing" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">Billing Information</h4>
                  <p className="text-sm text-muted-foreground">
                    View and manage your billing details and payment methods.
                  </p>
                </TabsContent>
                <TabsContent value="settings" className="p-4 border rounded-lg mt-2">
                  <h4 className="font-medium mb-2">General Settings</h4>
                  <p className="text-sm text-muted-foreground">
                    Configure your application preferences and notifications.
                  </p>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Full-width tabs:
              </p>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                  <TabsTrigger value="analytics" className="flex-1">Analytics</TabsTrigger>
                  <TabsTrigger value="reports" className="flex-1">Reports</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="p-4 border rounded-lg mt-2">
                  <p className="text-sm text-muted-foreground">Overview tab content</p>
                </TabsContent>
                <TabsContent value="analytics" className="p-4 border rounded-lg mt-2">
                  <p className="text-sm text-muted-foreground">Analytics tab content</p>
                </TabsContent>
                <TabsContent value="reports" className="p-4 border rounded-lg mt-2">
                  <p className="text-sm text-muted-foreground">Reports tab content</p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Accordion */}
      <DemoCard id="accordion" title="Accordion - Collapsible Content">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Collapsible sections for FAQs, settings, or grouped content. Built on Radix UI.
          </p>
          <CodeBlock
            code={`// Single item open at a time
<Accordion type="single" collapsible>
  <AccordionItem value="item-1">
    <AccordionTrigger>Question 1?</AccordionTrigger>
    <AccordionContent>
      Answer to question 1
    </AccordionContent>
  </AccordionItem>
</Accordion>

// Multiple items can be open
<Accordion type="multiple">
  <AccordionItem value="item-1">
    <AccordionTrigger>Section 1</AccordionTrigger>
    <AccordionContent>Content 1</AccordionContent>
  </AccordionItem>
  <AccordionItem value="item-2">
    <AccordionTrigger>Section 2</AccordionTrigger>
    <AccordionContent>Content 2</AccordionContent>
  </AccordionItem>
</Accordion>`}
            id="accordion"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Single (only one open at a time):
              </p>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>What is tscodex-boilerplate?</AccordionTrigger>
                  <AccordionContent>
                    tscodex-boilerplate is a file-driven specification system for LLM-assisted
                    development. It helps you build prototypes quickly through structured
                    dialogue with AI.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>How does it work?</AccordionTrigger>
                  <AccordionContent>
                    You describe your project idea, answer questions about scope and features,
                    and the system generates TOML specifications that are then used to create
                    a working React prototype.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>What technologies does it use?</AccordionTrigger>
                  <AccordionContent>
                    It uses React, TypeScript, Tailwind CSS, Radix UI, and various other modern
                    web technologies to generate production-ready prototypes.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger>Is it free to use?</AccordionTrigger>
                  <AccordionContent>
                    Yes, the boilerplate is open source and free to use for your projects.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Multiple (multiple can be open):
              </p>
              <Accordion type="multiple" className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Shipping Information</AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-2">We offer several shipping options:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Standard: 5-7 business days</li>
                      <li>Express: 2-3 business days</li>
                      <li>Overnight: Next business day</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger>Return Policy</AccordionTrigger>
                  <AccordionContent>
                    You can return items within 30 days of purchase for a full refund.
                    Items must be in original condition with tags attached.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger>Payment Methods</AccordionTrigger>
                  <AccordionContent>
                    We accept Visa, Mastercard, American Express, PayPal, and Apple Pay.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
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
                <td className="py-2 pr-4">Card</td>
                <td className="py-2 pr-4">-</td>
                <td className="py-2">Composed of Header/Content/Footer</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Container</td>
                <td className="py-2 pr-4">size (sm/md/lg/xl/full)</td>
                <td className="py-2">Responsive max-width wrapper</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Tabs</td>
                <td className="py-2 pr-4">defaultValue, value, onValueChange</td>
                <td className="py-2">Built on Radix UI</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Accordion</td>
                <td className="py-2 pr-4">type (single/multiple), collapsible</td>
                <td className="py-2">Built on Radix UI</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
