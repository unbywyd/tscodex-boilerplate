import { useState } from 'react'
import { TrendingUp, Users, ShoppingCart, DollarSign, Package } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { StatusBadge, StatusDot } from '@/components/ui/StatusBadge'
import { StatCard, StatGrid, MiniStat } from '@/components/ui/StatCard'
import { Timeline, DeliveryTracker, OrderStatus } from '@/components/ui/Timeline'
import { Banner, TopBanner, InlineAlert, Callout } from '@/components/ui/Banner'
import { Button } from '@/components/ui/Button'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function DataDisplayDemo() {
  useScrollToSection()
  const [bannerVisible, setBannerVisible] = useState(true)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Data Display"
        description="Badges, status indicators, stat cards, timelines, and banners for displaying information."
      />

      {/* Badge */}
      <DemoCard id="badge" title="Badge - Status & Labels">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Small labels for status, categories, or counts.
          </p>
          <CodeBlock
            code={`<Badge variant="default">Default</Badge>
<Badge variant="primary">Primary</Badge>
<Badge variant="success">Success</Badge>
<Badge variant="warning">Warning</Badge>
<Badge variant="error">Error</Badge>
<Badge variant="outline">Outline</Badge>

// Sizes: sm, md
<Badge size="sm">Small</Badge>
<Badge size="md">Medium</Badge>`}
            id="badge"
          />
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="primary">Primary</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="error">Error</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge size="sm">Small Badge</Badge>
              <Badge size="md">Medium Badge</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="primary">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
              <Badge variant="success">
                New
              </Badge>
              <Badge variant="outline">
                Beta
              </Badge>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* StatusBadge */}
      <DemoCard id="status-badge" title="StatusBadge - Semantic Status">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Status indicators with icons and semantic colors for various states.
          </p>
          <CodeBlock
            code={`<StatusBadge status="success" />
<StatusBadge status="error" label="Failed" />
<StatusBadge status="warning" size="lg" />
<StatusBadge status="loading" />
<StatusBadge status="active" pulse />

// Dot only variant
<StatusBadge status="success" dotOnly />

// Status dot (simple)
<StatusDot status="active" pulse />`}
            id="status-badge"
          />
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap gap-2">
              <StatusBadge status="success" />
              <StatusBadge status="error" />
              <StatusBadge status="warning" />
              <StatusBadge status="info" />
              <StatusBadge status="pending" />
              <StatusBadge status="loading" />
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" />
              <StatusBadge status="inactive" />
              <StatusBadge status="draft" />
              <StatusBadge status="published" />
              <StatusBadge status="archived" />
              <StatusBadge status="paused" />
              <StatusBadge status="cancelled" />
            </div>

            <div className="flex flex-wrap gap-2">
              <StatusBadge status="active" pulse />
              <StatusBadge status="loading" size="sm" />
              <StatusBadge status="success" size="lg" />
              <StatusBadge status="error" label="Custom Error" />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm">Dot only:</span>
              <StatusBadge status="success" dotOnly />
              <StatusBadge status="error" dotOnly />
              <StatusBadge status="warning" dotOnly />
              <StatusBadge status="active" dotOnly pulse />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <StatusDot status="success" />
                <span className="text-sm">Online</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="error" />
                <span className="text-sm">Offline</span>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status="active" pulse />
                <span className="text-sm">Active</span>
              </div>
            </div>
          </div>
        </div>
      </DemoCard>

      {/* StatCard */}
      <DemoCard id="stat-card" title="StatCard - KPI & Metrics">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Display key metrics and statistics with trends and icons.
          </p>
          <CodeBlock
            code={`<StatCard
  value="2,543"
  label="Total Users"
  description="Active in last 30 days"
  icon={<Users className="h-5 w-5" />}
  trend={{ value: 12, label: "vs last month" }}
  variant="success"
/>

// In a grid
<StatGrid columns={4}>
  <StatCard value="..." label="..." />
  <StatCard value="..." label="..." />
</StatGrid>

// Mini stat (compact)
<MiniStat value="1,234" label="Views" trend={5} />`}
            id="stat-card"
          />
          <div className="space-y-6 pt-2">
            <StatGrid columns={4}>
              <StatCard
                value="2,543"
                label="Total Users"
                description="Active in last 30 days"
                icon={<Users />}
                trend={{ value: 12, label: 'vs last month' }}
                variant="success"
              />
              <StatCard
                value="$45,231"
                label="Revenue"
                description="Total sales this month"
                icon={<DollarSign />}
                trend={{ value: 8, label: 'from last month' }}
                variant="primary"
              />
              <StatCard
                value="142"
                label="Orders"
                description="Pending fulfillment"
                icon={<ShoppingCart />}
                trend={{ value: -3, label: 'vs yesterday' }}
                variant="warning"
              />
              <StatCard
                value="98.2%"
                label="Uptime"
                description="Last 30 days"
                icon={<TrendingUp />}
                trend={{ value: 0, label: 'stable' }}
              />
            </StatGrid>

            <div className="grid grid-cols-3 gap-4">
              <StatCard
                value="456"
                label="Products"
                icon={<Package />}
                size="sm"
              />
              <StatCard
                value="89"
                label="Low Stock"
                icon={<Package />}
                size="sm"
                variant="warning"
              />
              <StatCard
                value="23"
                label="Out of Stock"
                icon={<Package />}
                size="sm"
                variant="danger"
              />
            </div>

            <div className="flex gap-6">
              <MiniStat value="1,234" label="Views" trend={5} />
              <MiniStat value="456" label="Clicks" trend={-2} />
              <MiniStat value="78%" label="CTR" trend={0} />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Timeline */}
      <DemoCard id="timeline" title="Timeline - Progress Tracking">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vertical timeline for order tracking, delivery status, or progress indicators.
          </p>
          <CodeBlock
            code={`<Timeline
  steps={[
    { id: 1, title: 'Order Placed', description: 'Confirmed', time: '2h ago' },
    { id: 2, title: 'Processing', description: 'In progress', time: '1h ago' },
    { id: 3, title: 'Shipped', description: 'Pending' },
    { id: 4, title: 'Delivered', description: 'Pending' },
  ]}
  currentStep={1}
  color="success"
  variant="default"
/>

// Delivery tracker preset
<DeliveryTracker
  status="shipped"
  timestamps={{ ordered: '10:00 AM', packed: '11:30 AM', shipped: '2:00 PM' }}
/>

// Order status preset
<OrderStatus
  steps={[
    { title: 'Order confirmed', time: '10:00 AM', completed: true },
    { title: 'Payment received', time: '10:05 AM', completed: true },
    { title: 'Preparing shipment', time: '11:00 AM', completed: false },
  ]}
/>`}
            id="timeline"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Default timeline:
              </p>
              <Timeline
                steps={[
                  {
                    id: 1,
                    title: 'Order Placed',
                    description: 'Your order has been confirmed',
                    time: '2 hours ago',
                  },
                  {
                    id: 2,
                    title: 'Processing',
                    description: 'We are preparing your items',
                    time: '1 hour ago',
                  },
                  {
                    id: 3,
                    title: 'Shipped',
                    description: 'Package is on the way',
                  },
                  {
                    id: 4,
                    title: 'Delivered',
                    description: 'Estimated delivery',
                  },
                ]}
                currentStep={1}
                color="primary"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Delivery tracker (preset):
              </p>
              <DeliveryTracker
                status="shipped"
                timestamps={{
                  ordered: '10:00 AM',
                  packed: '11:30 AM',
                  shipped: '2:00 PM',
                }}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Compact variant:
              </p>
              <OrderStatus
                steps={[
                  { title: 'Order confirmed', time: '10:00 AM', completed: true },
                  { title: 'Payment received', time: '10:05 AM', completed: true },
                  { title: 'Preparing shipment', time: '11:00 AM', completed: true },
                  { title: 'Ready to ship', completed: false },
                ]}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Banner */}
      <DemoCard id="banner" title="Banner - Inline Notifications">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Inline notification banners for alerts, announcements, and messages.
          </p>
          <CodeBlock
            code={`<Banner
  variant="info"
  title="Information"
  dismissible
  onDismiss={() => console.log('Dismissed')}
>
  This is an informational message.
</Banner>

// With action button
<Banner
  variant="warning"
  title="Warning"
  action={<Button size="sm">Fix Now</Button>}
>
  Action required
</Banner>

// Inline alert (simple)
<InlineAlert variant="success">
  Changes saved successfully
</InlineAlert>

// Callout (highlighted block)
<Callout variant="tip" title="Pro Tip">
  Use keyboard shortcuts to work faster
</Callout>`}
            id="banner"
          />
          <div className="space-y-4 pt-2">
            <Banner variant="default">
              This is a default banner message.
            </Banner>

            <Banner variant="info" title="New Feature Available">
              We've added new analytics tools to help you track your performance.
            </Banner>

            <Banner
              variant="success"
              title="Success!"
              dismissible
              onDismiss={() => console.log('Dismissed')}
            >
              Your changes have been saved successfully.
            </Banner>

            <Banner
              variant="warning"
              title="Action Required"
              action={
                <Button variant="outline" size="sm">
                  Update Now
                </Button>
              }
            >
              Your subscription will expire in 7 days. Please update your payment method.
            </Banner>

            <Banner
              variant="error"
              title="Error"
              dismissible
            >
              There was an error processing your request. Please try again.
            </Banner>

            <Banner variant="promo" title="Special Offer" dismissible>
              Get 50% off your first month with code WELCOME50
            </Banner>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Inline alerts:</p>
              <InlineAlert variant="info">
                This is an informational message
              </InlineAlert>
              <InlineAlert variant="success">
                Operation completed successfully
              </InlineAlert>
              <InlineAlert variant="warning">
                Please review these changes
              </InlineAlert>
              <InlineAlert variant="error">
                An error occurred
              </InlineAlert>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">Callouts:</p>
              <Callout variant="tip" title="Pro Tip">
                Use keyboard shortcuts to navigate faster: Ctrl+K for search
              </Callout>
              <Callout variant="info" title="Did you know?">
                You can customize your dashboard by dragging widgets around
              </Callout>
              <Callout variant="warning" title="Important">
                Backup your data before performing this operation
              </Callout>
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
                <td className="py-2 pr-4">Badge</td>
                <td className="py-2 pr-4">variant, size</td>
                <td className="py-2">8 variants, 2 sizes</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">StatusBadge</td>
                <td className="py-2 pr-4">status, showIcon, dotOnly, pulse</td>
                <td className="py-2">16 status types</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">StatCard</td>
                <td className="py-2 pr-4">value, label, icon, trend, variant</td>
                <td className="py-2">KPI display with trends</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Timeline</td>
                <td className="py-2 pr-4">steps, currentStep, color, variant</td>
                <td className="py-2">Vertical/horizontal</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Banner</td>
                <td className="py-2 pr-4">variant, title, dismissible, action</td>
                <td className="py-2">7 variants</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
