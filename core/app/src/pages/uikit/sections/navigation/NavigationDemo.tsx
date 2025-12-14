import { useState } from 'react'
import { Package } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/Tabs'
import { Breadcrumb, SimpleBreadcrumb } from '@/components/ui/Breadcrumb'
import { Pagination, SimplePagination, PaginationInfo } from '@/components/ui/Pagination'
import { CodeBlock } from '../../components/CodeBlock'
import { SectionHeader } from '../../components/SectionHeader'
import { DemoCard } from '../../components/DemoCard'
import { useScrollToSection } from '../../hooks/useScrollToSection'

export function NavigationDemo() {
  useScrollToSection()
  const [currentPage, setCurrentPage] = useState(1)
  const [simpleCurrentPage, setSimpleCurrentPage] = useState(1)

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Navigation"
        description="Tabs, breadcrumbs, and pagination for navigating through content and pages."
      />

      {/* Tabs */}
      <DemoCard id="tabs" title="Tabs - Content Sections">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Organize content into tabbed sections. Built on Radix UI Tabs.
          </p>
          <CodeBlock
            code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
    <TabsTrigger value="settings">Settings</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account content here
  </TabsContent>
  <TabsContent value="password">
    Password content here
  </TabsContent>
  <TabsContent value="settings">
    Settings content here
  </TabsContent>
</Tabs>`}
            id="tabs"
          />
          <div className="pt-2">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
                <TabsTrigger value="notifications" disabled>
                  Notifications
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-4 mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Overview Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    View your key metrics and recent activity. This tab shows a summary
                    of your account status.
                  </p>
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">2,543</p>
                      <p className="text-xs text-muted-foreground">Total Views</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">142</p>
                      <p className="text-xs text-muted-foreground">Active Users</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-2xl font-bold">98%</p>
                      <p className="text-xs text-muted-foreground">Uptime</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Analytics</h3>
                  <p className="text-sm text-muted-foreground">
                    Detailed analytics and performance metrics would appear here.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <div className="border rounded-lg p-6">
                  <h3 className="font-semibold mb-2">Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate and view custom reports for your data.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DemoCard>

      {/* Breadcrumb */}
      <DemoCard id="breadcrumb" title="Breadcrumb - Navigation Path">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Show current location in navigation hierarchy. Auto-collapses with ellipsis.
          </p>
          <CodeBlock
            code={`// Full control
<Breadcrumb
  items={[
    { label: 'Products', href: '/products' },
    { label: 'Electronics', href: '/products/electronics' },
    { label: 'Phones', href: '/products/electronics/phones' },
    { label: 'iPhone 15 Pro' },
  ]}
  showHome
  maxItems={4}
/>

// Simple version
<SimpleBreadcrumb
  path={['Products', 'Electronics', 'Phones', 'iPhone 15 Pro']}
  baseHref="/catalog"
/>`}
            id="breadcrumb"
          />
          <div className="space-y-4 pt-2">
            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                With home icon:
              </p>
              <Breadcrumb
                items={[
                  { label: 'Products', href: '/products', icon: <Package className="h-4 w-4" /> },
                  { label: 'Electronics', href: '/products/electronics' },
                  { label: 'Phones' },
                ]}
                showHome
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Long path (with collapse):
              </p>
              <Breadcrumb
                items={[
                  { label: 'Dashboard', href: '/' },
                  { label: 'Settings', href: '/settings' },
                  { label: 'Profile', href: '/settings/profile' },
                  { label: 'Security', href: '/settings/profile/security' },
                  { label: 'Two-Factor Auth' },
                ]}
                maxItems={3}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-2 text-muted-foreground">
                Simple version:
              </p>
              <SimpleBreadcrumb
                path={['Catalog', 'Men', 'Shoes', 'Sneakers']}
              />
            </div>
          </div>
        </div>
      </DemoCard>

      {/* Pagination */}
      <DemoCard id="pagination" title="Pagination - Page Navigation">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Navigate through pages of content. Supports various sizes and configurations.
          </p>
          <CodeBlock
            code={`// Full pagination
<Pagination
  page={currentPage}
  totalPages={10}
  onPageChange={setCurrentPage}
  siblingCount={1}
  boundaryCount={1}
  showFirstLast
/>

// Simple pagination
<SimplePagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
/>

// Pagination info
<PaginationInfo
  page={1}
  pageSize={20}
  totalItems={152}
/>`}
            id="pagination"
          />
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Full pagination (default size):
              </p>
              <Pagination
                page={currentPage}
                totalPages={10}
                onPageChange={setCurrentPage}
                showFirstLast
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Small size:
              </p>
              <Pagination
                page={currentPage}
                totalPages={8}
                onPageChange={setCurrentPage}
                size="sm"
                showFirstLast={false}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Large size:
              </p>
              <Pagination
                page={currentPage}
                totalPages={15}
                onPageChange={setCurrentPage}
                size="lg"
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                Simple pagination (compact):
              </p>
              <SimplePagination
                page={simpleCurrentPage}
                totalPages={5}
                onPageChange={setSimpleCurrentPage}
              />
            </div>

            <div>
              <p className="text-xs font-medium mb-3 text-muted-foreground">
                With info text:
              </p>
              <div className="flex items-center justify-between">
                <PaginationInfo
                  page={currentPage}
                  pageSize={20}
                  totalItems={152}
                />
                <SimplePagination
                  page={currentPage}
                  totalPages={8}
                  onPageChange={setCurrentPage}
                />
              </div>
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
                <th className="text-left py-2">Value Type</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs">
              <tr className="border-b">
                <td className="py-2 pr-4">Tabs</td>
                <td className="py-2 pr-4">defaultValue, value, onValueChange</td>
                <td className="py-2">string</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Breadcrumb</td>
                <td className="py-2 pr-4">items, showHome, maxItems, separator</td>
                <td className="py-2">{`BreadcrumbItem[]`}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SimpleBreadcrumb</td>
                <td className="py-2 pr-4">path, baseHref</td>
                <td className="py-2">string[]</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">Pagination</td>
                <td className="py-2 pr-4">page, totalPages, onPageChange, size</td>
                <td className="py-2">number</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 pr-4">SimplePagination</td>
                <td className="py-2 pr-4">page, totalPages, onPageChange</td>
                <td className="py-2">number</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">PaginationInfo</td>
                <td className="py-2 pr-4">page, pageSize, totalItems</td>
                <td className="py-2">number</td>
              </tr>
            </tbody>
          </table>
        </div>
      </DemoCard>
    </div>
  )
}
