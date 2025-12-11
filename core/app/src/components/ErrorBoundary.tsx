import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Container } from './ui/container'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

class ErrorBoundaryClass extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error, errorInfo)
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

function ErrorFallback({ error }: { error: Error | null }) {
  const navigate = useNavigate()

  const handleReload = () => {
    window.location.reload()
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <Container size="lg" className="py-12">
      <Card className="border-destructive">
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-destructive" />
            <CardTitle>Something went wrong</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page or return to the home page.
          </p>

          {error && import.meta.env.DEV && (
            <div className="rounded-lg bg-muted p-4">
              <div className="font-mono text-sm">
                <div className="font-semibold mb-2">Error:</div>
                <div className="text-destructive">{error.message}</div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleReload} variant="default">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
            <Button onClick={handleGoHome} variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  )
}

export function ErrorBoundary({ children, fallback }: Props) {
  return <ErrorBoundaryClass fallback={fallback}>{children}</ErrorBoundaryClass>
}

export default ErrorBoundary

