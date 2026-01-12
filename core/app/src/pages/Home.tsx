import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, Monitor, FolderOpen, GitBranch, Bot, Zap, Sparkles, ExternalLink, Smartphone } from 'lucide-react'
import { Container, Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@/components/ui'
import { loadDocFile } from '@/lib/docs-loader'
import { AnimatedBackground } from '@/components/AnimatedBackground'


// Project about data types
interface AboutData {
  project: {
    id: string
    name: string
    type: string
    description: string
  }
  features?: {
    list: string[]
  }
  owner?: {
    name: string
    email: string
  }
}


export default function HomePage() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null)

  useEffect(() => {
    // Load about.toml for project name and description
    loadDocFile('layers/project/about.toml')
      .then((file) => {
        if (file.content) {
          setAboutData(file.content as AboutData)
        }
      })
      .catch((err) => {
        console.error('Failed to load about:', err)
      })
  }, [])

  const features = [
    {
      icon: FolderOpen,
      title: 'File-Driven',
      description: 'No database required. All content in markdown and TOML files.',
    },
    {
      icon: Bot,
      title: 'LLM-Friendly',
      description: 'Structure optimized for AI-assisted development.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Prototyping',
      description: 'Build interactive mobile prototypes with protomobilekit framework.',
    },
    {
      icon: FileText,
      title: 'Documentation Portal',
      description: 'Beautiful docs from your markdown and TOML files.',
    },
    {
      icon: Monitor,
      title: 'Multi-Platform',
      description: 'Manage multiple platforms with separate workflows.',
    },
    {
      icon: GitBranch,
      title: 'Version Controlled',
      description: 'All project knowledge versioned in Git.',
    },
  ]

  return (
    <>
      <AnimatedBackground />
      <Container size="lg" className="space-y-16 py-12 relative">
        {/* Hero */}
        <section className="text-center space-y-6 py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {aboutData?.project?.name || 'tscodex-boilerplate-simple'}
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {aboutData?.project?.description || 'File-driven specification system for LLM-assisted development. Define your project in TOML/Markdown, get documentation portal + working prototype.'}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button asChild size="lg" className="text-base">
              <Link to="/docs">
                <FileText className="h-5 w-5" />
                Browse Docs
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-base">
              <Link to="/platforms">
                <Monitor className="h-5 w-5" />
                View Platforms
              </Link>
            </Button>
          </div>
        </section>

        {/* Features */}
        <section className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Powerful Features</h2>
            <p className="text-muted-foreground">Everything you need to build better projects</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, idx) => {
              // Gradient colors from background palette
              const gradientColors = [
                'from-purple-400 to-purple-600',
                'from-blue-400 to-blue-600',
                'from-pink-400 to-pink-600',
                'from-green-400 to-green-600',
                'from-purple-500 to-pink-500',
                'from-blue-500 to-cyan-500',
              ]
              const gradient = gradientColors[idx % gradientColors.length]

              return (
                <Card key={title} className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 !shadow-none hover:!bg-white/60 dark:hover:!bg-slate-900/60 transition-all duration-300" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`rounded-lg bg-gradient-to-br ${gradient} p-2.5`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {description}
                    </CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* About Section */}
        <section>
          <Card className="!backdrop-blur-xl !bg-white/50 dark:!bg-slate-900/50 !border-white/40 !shadow-none overflow-hidden" style={{ backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)' }}>
            <CardContent className="p-8 sm:p-12 text-center space-y-6">
              <div className="space-y-3">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Learn More About the Project</h2>
                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                  Explore the system architecture, development workflow, and how the boilerplate helps turn ideas into working prototypes
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button asChild size="lg" className="text-base">
                  <Link to="/about">
                    <FileText className="h-5 w-5 mr-2" />
                    About
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/docs">
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Documentation
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </Container>
    </>
  )
}
