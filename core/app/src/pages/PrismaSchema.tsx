import { useEffect, useState } from 'react'
import PrismaSchemaRenderer from '../components/renderers/PrismaSchemaRenderer'
import { Container, Card, CardContent, CardHeader, CardTitle, Button, Skeleton } from '@/components/ui'
import { loadPrismaSchema, type PrismaSchemaData } from '@/lib/docs-loader'

export default function PrismaSchemaPage() {
  const [data, setData] = useState<PrismaSchemaData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const result = await loadPrismaSchema()
        if (!result.schema) {
          setError('Prisma schema not found. Create src/prisma/schema.prisma to get started.')
          return
        }
        setData(result)
      } catch (err) {
        setError('Failed to fetch Prisma schema')
      } finally {
        setLoading(false)
      }
    }

    fetchSchema()
  }, [])

  if (loading) {
    return (
      <Container size="lg" className="py-8 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-96 w-full" />
      </Container>
    )
  }

  if (error) {
    return (
      <Container size="lg" className="py-8">
        <Card className="border-amber-200 dark:border-amber-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 text-amber-700 dark:text-amber-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">{error}</span>
            </div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  if (!data?.schema) {
    return (
      <Container size="lg" className="py-8">
        <Card>
          <CardContent className="py-8 text-center">
            <div className="text-muted-foreground">No Prisma schema available</div>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container size="lg" className="py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Database Schema</h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Prisma ORM schema definition
          </p>
        </div>

        {data.metadata && (
          <div className="text-xs text-muted-foreground text-left sm:text-right space-y-1 shrink-0">
            <div>Last modified: {new Date(data.metadata.modified).toLocaleString()}</div>
            <div className="font-mono break-all sm:break-normal">{data.metadata.path}</div>
          </div>
        )}
      </div>

      {/* Schema Renderer */}
      <Card>
        <CardContent className="pt-6">
          <PrismaSchemaRenderer schema={data.schema} title="schema.prisma" />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => data.schema && navigator.clipboard.writeText(data.schema)}
            >
              Copy Schema
            </Button>
            <Button
              variant="outline"
              asChild
            >
              <a
                href="https://www.prisma.io/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Prisma Docs
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}
