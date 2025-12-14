import { Link } from 'react-router-dom'
import { Container, Card, CardContent, Button } from '@/components/ui'
import { Home, FileQuestion } from 'lucide-react'

export default function NotFound() {
  return (
    <Container size="lg" className="py-12">
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <FileQuestion className="h-16 w-16 text-muted-foreground mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <p className="text-muted-foreground mb-6">Page not found</p>
          <div className="flex gap-3">
            <Button asChild>
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/docs">View Documentation</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}

