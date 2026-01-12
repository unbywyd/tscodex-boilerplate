import { Link } from 'react-router-dom'
import { 
  Github, 
  Bot, 
  Sparkles,
  ArrowRight,
  Copy,
  Check
} from 'lucide-react'
import { Container, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { useState } from 'react'

export default function GetStartedPage() {
  const [copied, setCopied] = useState(false)
  const repoUrl = 'https://github.com/AiRchitects/tscodex-boilerplate-simple'
  const cloneCommand = 'git clone https://github.com/AiRchitects/tscodex-boilerplate-simple.git'

  const handleCopy = () => {
    navigator.clipboard.writeText(cloneCommand)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
      <AnimatedBackground />
      <Container size="lg" className="py-12 space-y-12 relative">
        {/* Hero */}
        <section className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Get Started
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Start building your project with tscodex-boilerplate in minutes
          </p>
        </section>

        {/* Clone Section */}
        <section>
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <CardHeader>
              <CardTitle>Clone Repository</CardTitle>
              <CardDescription>
                Install this project and hand it over to Cursor or Claude Code. Follow the instructions to get started.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <code className="text-sm text-muted-foreground font-mono">Terminal</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="h-7 px-3"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-1" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <code className="text-sm font-mono text-foreground break-all">
                  {cloneCommand}
                </code>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg" className="flex-1">
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4 mr-2" />
                    Open on GitHub
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="flex-1">
                  <Link to="/challenge">
                    <Bot className="h-4 w-4 mr-2" />
                    Learn How It Works
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Resources */}
        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">Resources</h2>
            <p className="text-muted-foreground">Learn more about the workflow</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all duration-300" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Challenge Workflow
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Understand how the LLM interacts with the tool and follows the workflow process.
                </p>
                <Button asChild variant="outline">
                  <Link to="/challenge">
                    View Challenge
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all duration-300" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Github className="h-5 w-5" />
                  GitHub Repository
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  Explore the source code, read the documentation, and contribute to the project.
                </p>
                <Button asChild variant="outline">
                  <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                    Open on GitHub
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

      </Container>
    </>
  )
}

