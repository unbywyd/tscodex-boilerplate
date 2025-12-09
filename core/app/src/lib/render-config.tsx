// Render configuration for documentation
// Maps folder paths and file types to render functions

import { lazy, Suspense, createElement } from 'react'
import RelationsSection from '../components/renderers/RelationsSection'
import { componentRegistry } from '@prototype/components/ui'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export type RenderFunction = (content: any, metadata?: any) => React.ReactNode

// Helper to extract entity id from content
function extractId(content: any, fileName?: string): string | null {
  if (content.id) return content.id
  if (content.useCase?.id) return content.useCase.id
  if (content.guard?.id) return content.guard.id
  if (content.role?.id) return content.role.id
  if (content.route?.id) return content.route.id
  if (content.topic?.id) return content.topic.id
  if (content.project?.id) return content.project.id
  if (content.component?.id) return content.component.id
  if (content.entity?.id) return content.entity.id
  if (content.module?.id) return content.module.id
  if (content.event?.id) return content.event.id
  if (content.platform?.id) return content.platform.id
  if (fileName) return fileName.replace(/\.toml$/, '')
  return null
}

export interface RenderConfig {
  [folderPath: string]: {
    markdown?: RenderFunction
    toml?: RenderFunction
    default?: RenderFunction
  }
}

// Lazy load FlowDiagram to avoid loading ReactFlow for non-flow pages
const FlowDiagram = lazy(() => import('../components/renderers/FlowDiagram'))

// Default markdown renderer
const defaultMarkdownRenderer: RenderFunction = (content: string) => {
  return (
    <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: content }} />
  )
}

// Default TOML renderer (JSON display)
const defaultTomlRenderer: RenderFunction = (content: any) => {
  return (
    <Card>
      <CardContent className="p-6">
        <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
          <code className="font-mono break-words whitespace-pre-wrap">{JSON.stringify(content, null, 2)}</code>
        </pre>
      </CardContent>
    </Card>
  )
}


// Use case renderer (with embedded flow)
const useCaseRenderer: RenderFunction = (content: any) => {
  const uc = content.useCase || content
  const conditions = uc.conditions || {}
  const relations = content.relations || {}
  const flow = content.flow || []
  const entityId = extractId(content)

  return (
    <div className="use-case-renderer space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{uc.name || uc.id}</h2>
        {uc.description && <p className="text-muted-foreground text-lg">{uc.description}</p>}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-base"><span className="font-semibold text-primary">As</span> {uc.asRole}</p>
          <p className="text-base"><span className="font-semibold text-primary">I want</span> {uc.iWant}</p>
          <p className="text-base"><span className="font-semibold text-primary">So that</span> {uc.soThat}</p>
        </CardContent>
      </Card>

      {(conditions.pre?.length > 0 || conditions.post?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {conditions.pre?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preconditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {conditions.pre.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {conditions.post?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Postconditions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {conditions.post.map((c: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {flow.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading flow diagram...</div>}>
              <FlowDiagram content={{ id: 'use-case-flow', title: 'Flow', nodes: flow, edges: generateEdgesFromFlow(flow) }} />
            </Suspense>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Helper to generate edges from sequential flow nodes
function generateEdgesFromFlow(flow: any[]): any[] {
  const edges = []
  for (let i = 0; i < flow.length - 1; i++) {
    edges.push({ from: flow[i].id, to: flow[i + 1].id, label: '' })
  }
  return edges
}

// Knowledge/Facts renderer
const knowledgeRenderer: RenderFunction = (content: any) => {
  const topic = content.topic || {}
  const facts = content.facts || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="knowledge-renderer space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">{topic.name || topic.id}</h2>
        {topic.description && <p className="text-muted-foreground text-lg">{topic.description}</p>}
      </div>

      <div className="space-y-4">
        {facts.map((fact: any, i: number) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                <div className="flex-1 space-y-2 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-primary break-words">{fact.question}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">{fact.answer}</p>
                </div>
                <span className={`text-xs px-2 sm:px-2.5 py-1 rounded-full font-medium shrink-0 ${
                  fact.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                  fact.status === 'assumption' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                }`}>
                  {fact.status || 'unknown'}
                </span>
              </div>
              {fact.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {fact.tags.map((tag: string) => (
                    <span key={tag} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md font-medium">{tag}</span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Guard renderer
const guardRenderer: RenderFunction = (content: any) => {
  const guard = content.guard || content
  const access = content.access || {}
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="guard-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-yellow-500 shrink-0 mt-1.5 sm:mt-2" />
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{guard.name || guard.id}</h2>
          {guard.description && (
            <p className="text-muted-foreground text-base sm:text-lg break-words">{guard.description}</p>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Access Requirements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">Authenticated:</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
              access.authenticated 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
              {access.authenticated ? 'Yes' : 'No'}
            </span>
          </div>
          {access.roles?.length > 0 && (
            <div className="space-y-2">
              <span className="font-medium block">Roles:</span>
              <div className="flex flex-wrap gap-2">
                {access.roles.map((role: string) => (
                  <span key={role} className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-md text-sm font-medium">
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Role renderer
const roleRenderer: RenderFunction = (content: any) => {
  const role = content.role || content
  const permissions = content.permissions?.list || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="role-renderer space-y-8">
      <div className="flex items-center gap-3">
        <div className="w-4 h-4 rounded-full bg-blue-500 shrink-0" />
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">{role.name || role.id}</h2>
            {role.level !== undefined && (
              <span className="text-sm bg-muted px-3 py-1 rounded-md font-medium">Level {role.level}</span>
            )}
          </div>
          {role.description && (
            <p className="text-muted-foreground text-lg">{role.description}</p>
          )}
        </div>
      </div>

      {permissions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {permissions.map((perm: string) => (
                <span key={perm} className="inline-block bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-md text-sm font-medium">
                  {perm}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Route renderer
const routeRenderer: RenderFunction = (content: any) => {
  const route = content.route || {}
  const page = content.page || {}
  const features = content.features?.list || []
  const components = content.components?.used || []
  const api = content.api?.endpoints || []
  const navigation = content.navigation?.links || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="route-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{route.title || route.path}</h2>
        <code className="text-xs sm:text-sm bg-muted px-2 sm:px-3 py-1 sm:py-1.5 rounded-md font-mono break-all">{route.path}</code>
      </div>

      {route.description && (
        <p className="text-muted-foreground text-base sm:text-lg">{route.description}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <span className="text-sm text-muted-foreground">{page.type || 'public'}</span>
            </div>
            {page.role && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Role:</span>
                <span className="text-sm text-muted-foreground">{page.role}</span>
              </div>
            )}
            {page.layout && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Layout:</span>
                <span className="text-sm text-muted-foreground">{page.layout}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {features.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {features.map((f: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span className="text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>

      {components.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Components</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {components.map((c: string) => (
                <span key={c} className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-3 py-1 rounded-md text-sm font-medium">
                  {c}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {api.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>API Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {api.map((endpoint: string, i: number) => (
              <code key={i} className="block text-sm bg-muted px-3 py-2 rounded-md font-mono">{endpoint}</code>
            ))}
          </CardContent>
        </Card>
      )}

      {navigation.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Navigation Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {navigation.map((link: { label: string; path: string }) => (
                <span key={link.path} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-md text-sm font-medium">
                  {link.label} → {link.path}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Project renderer
const projectRenderer: RenderFunction = (content: any) => {
  const project = content.project || content
  const owner = content.owner
  const stack = content.stack
  const architecture = content.architecture
  const idea = content.idea
  const target = content.target
  const value = content.value
  const design = content.design
  const features = content.features?.list || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="project-renderer space-y-4 sm:space-y-6 md:space-y-8">
      {(project.name || design?.name) && (
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{project.name || design?.name}</h2>
            {project.type && <span className="text-xs sm:text-sm bg-muted px-2 sm:px-3 py-1 rounded-md font-medium whitespace-nowrap">{project.type}</span>}
          </div>
        </div>
      )}

      {(project.description || idea?.description || design?.description) && (
        <p className="text-muted-foreground text-base sm:text-lg whitespace-pre-line leading-relaxed break-words">
          {project.description || idea?.description || design?.description}
        </p>
      )}

      {features.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {features.map((f: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">✓</span>
                  <span className="text-sm">{f}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {owner && (
        <Card>
          <CardHeader>
            <CardTitle>Owner</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="text-sm">{owner.name}</p>
            {owner.email && <p className="text-sm text-muted-foreground">{owner.email}</p>}
          </CardContent>
        </Card>
      )}

      {stack && (
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
              {Object.entries(stack).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2 break-words">
                  <span className="font-medium capitalize shrink-0">{key}:</span>
                  <span className="text-muted-foreground break-words">{String(val)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {architecture && (
        <Card>
          <CardHeader>
            <CardTitle>Architecture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">Type:</span>
              <span className="text-sm text-muted-foreground">{architecture.type}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Pattern:</span>
              <span className="text-sm text-muted-foreground">{architecture.pattern}</span>
            </div>
            {architecture.description && (
              <p className="text-sm text-muted-foreground mt-3 whitespace-pre-line leading-relaxed">{architecture.description}</p>
            )}
          </CardContent>
        </Card>
      )}

      {target && (
        <Card>
          <CardHeader>
            <CardTitle>Target</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <span className="font-medium">Audience:</span>
              <p className="text-sm text-muted-foreground mt-1">{target.audience}</p>
            </div>
            <div>
              <span className="font-medium">Problem:</span>
              <p className="text-sm text-muted-foreground mt-1">{target.problem}</p>
            </div>
            <div>
              <span className="font-medium">Solution:</span>
              <p className="text-sm text-muted-foreground mt-1">{target.solution}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {value && (
        <Card>
          <CardHeader>
            <CardTitle>Value Proposition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="font-medium">Primary:</span>
              <p className="text-sm text-muted-foreground mt-1">{value.primary}</p>
            </div>
            {value.secondary && (
              <div>
                <span className="font-medium">Secondary:</span>
                <p className="text-sm text-muted-foreground mt-1">{value.secondary}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {design?.theme && (
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {Object.entries(design.theme).map(([key, val]) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="font-medium capitalize">{key}:</span>
                  <span className="text-muted-foreground">{String(val)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {design?.principles?.list && (
        <Card>
          <CardHeader>
            <CardTitle>Design Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {design.principles.list.map((p: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-sm">{p}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Entity renderer
const entityRenderer: RenderFunction = (content: any) => {
  const entity = content.entity || content
  const fields = content.fields || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  // Field type colors
  const typeColors: Record<string, string> = {
    string: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    text: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    number: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    integer: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    boolean: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    datetime: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    enum: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    array: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
    relation: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
  }

  return (
    <div className="entity-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-indigo-500 shrink-0 mt-1.5 sm:mt-2" />
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{entity.name || entity.id}</h2>
            {entity.table && (
              <code className="text-xs sm:text-sm bg-muted px-2 sm:px-3 py-0.5 sm:py-1 rounded-md font-mono whitespace-nowrap">{entity.table}</code>
            )}
          </div>
          {entity.description && (
            <p className="text-muted-foreground text-base sm:text-lg break-words">{entity.description}</p>
          )}
        </div>
      </div>

      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fields</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Name</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Type</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold">Constraints</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {fields.map((field: any, i: number) => (
                        <tr key={i} className={field.primary ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'hover:bg-muted/50'}>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono whitespace-nowrap">
                            {field.name}
                            {field.primary && <span className="ml-1 sm:ml-2 text-yellow-600 dark:text-yellow-400 font-semibold text-xs">PK</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                              <span className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md text-xs font-medium whitespace-nowrap ${typeColors[field.type] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
                                {field.type}
                              </span>
                              {field.format && (
                                <span className="text-xs text-muted-foreground whitespace-nowrap">({field.format})</span>
                              )}
                              {field.target && (
                                <span className="text-xs text-indigo-600 dark:text-indigo-400 whitespace-nowrap">→ {field.target}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <div className="flex flex-wrap gap-1 sm:gap-1.5">
                              {field.required && <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">required</span>}
                              {field.unique && <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">unique</span>}
                              {field.hidden && <span className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">hidden</span>}
                              {field.auto && <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">auto:{field.auto}</span>}
                              {field.default !== undefined && <span className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap">default:{String(field.default)}</span>}
                              {field.values && <span className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-1.5 sm:px-2 py-0.5 rounded text-xs font-medium break-words">[{field.values.join(', ')}]</span>}
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground min-w-[120px]">{field.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Status renderer - project progress tracker
const statusRenderer: RenderFunction = (content: any) => {
  const status = content.status || {}
  const phases = content.phases || {}

  const allPhases = ['assessment', 'discovery', 'design', 'access', 'data', 'schema', 'modules', 'features', 'prototype']
  const phaseLabels: Record<string, string> = {
    assessment: 'Assessment',
    discovery: 'Discovery',
    design: 'Design',
    access: 'Access Control',
    data: 'Data Model',
    modules: 'Modules',
    features: 'Features',
    prototype: 'Prototype',
    schema: 'Schema',
  }

  const profileColors: Record<string, string> = {
    simple: 'bg-green-100 text-green-800',
    medium: 'bg-blue-100 text-blue-800',
    complex: 'bg-purple-100 text-purple-800',
  }

  const statusColors: Record<string, string> = {
    pending: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
  }

  // Filter phases based on skip flags
  const activePhases = allPhases.filter(p => !phases[p]?.skip)
  const completedCount = activePhases.filter(p => phases[p]?.status === 'completed').length
  const progress = activePhases.length > 0 ? Math.round((completedCount / activePhases.length) * 100) : 0

  return (
    <div className="status-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-2 flex-1 min-w-0">
              <CardTitle className="text-xl sm:text-2xl break-words">{status.name || 'Project Status'}</CardTitle>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {status.profile && (
                  <span className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${profileColors[status.profile] || 'bg-gray-100'}`}>
                    {status.profile}
                  </span>
                )}
                <span className="text-xs sm:text-sm text-muted-foreground break-words">
                  Current: <strong className="text-foreground">{phaseLabels[status.currentPhase] || status.currentPhase}</strong>
                </span>
              </div>
            </div>
            <div className="text-left sm:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-bold text-primary">{progress}%</div>
              <div className="text-xs sm:text-sm text-muted-foreground">{completedCount}/{activePhases.length} phases</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-3">
            <div className="bg-primary h-3 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {allPhases.map((phaseKey, index) => {
          const phase = phases[phaseKey] || {}
          const checklist = phase.checklist || {}
          const checklistItems = Object.entries(checklist)
          const completedItems = checklistItems.filter(([_, v]) => v === true).length
          const isSkipped = phase.skip === true
          const isCurrent = status.currentPhase === phaseKey

          if (isSkipped) {
            return (
              <Card key={phaseKey} className="opacity-50 border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-mono text-muted-foreground">{index}</span>
                      <h3 className="font-semibold line-through">{phaseLabels[phaseKey]}</h3>
                    </div>
                    <span className="px-2.5 py-1 rounded-md text-xs bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 font-medium">skipped</span>
                  </div>
                </CardContent>
              </Card>
            )
          }

          return (
            <Card key={phaseKey} className={isCurrent ? 'border-primary bg-primary/5' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-mono text-muted-foreground">{index}</span>
                    <h3 className="font-semibold text-lg">{phaseLabels[phaseKey]}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusColors[phase.status] || statusColors.pending}`}>
                    {phase.status || 'pending'}
                  </span>
                </div>

                {phase.description && (
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{phase.description}</p>
                )}

                {checklistItems.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {completedItems}/{checklistItems.length} tasks completed
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary/50 h-2 rounded-full transition-all" style={{ width: `${(completedItems / checklistItems.length) * 100}%` }} />
                    </div>
                  </div>
                )}

                {phase.notes?.list?.length > 0 && (
                  <ul className="mt-4 text-sm space-y-2">
                    {phase.notes.list.map((note: string, i: number) => (
                      <li key={i} className="flex items-start gap-2 text-muted-foreground">
                        <span className="text-primary mt-1">•</span>
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {status.lastUpdated && (
        <p className="text-xs text-muted-foreground text-right">Last updated: {status.lastUpdated}</p>
      )}
    </div>
  )
}

// Component renderer - displays props, variants with live preview
const componentRenderer: RenderFunction = (content: any) => {
  const component = content.component || {}
  const props = content.props || []
  const variants = content.variants || []
  const usage = content.usage || {}
  const relations = content.relations || {}
  const entityId = extractId(content)

  const Component = componentRegistry[component.id]

  const categoryColors: Record<string, string> = {
    ui: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    forms: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    pages: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  }

  const typeColors: Record<string, string> = {
    string: 'text-green-600 dark:text-green-400',
    boolean: 'text-purple-600 dark:text-purple-400',
    enum: 'text-blue-600 dark:text-blue-400',
    ReactNode: 'text-orange-600 dark:text-orange-400',
    number: 'text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div className="component-renderer space-y-8">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{component.name}</h2>
          {component.category && (
            <span className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap ${categoryColors[component.category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'}`}>
              {component.category}
            </span>
          )}
        </div>
        {component.description && (
          <p className="text-muted-foreground text-base sm:text-lg break-words">{component.description}</p>
        )}
      </div>

      {props.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Props</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Name</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Type</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Default</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {props.map((prop: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono whitespace-nowrap">
                            {prop.name}
                            {prop.required && <span className="text-red-500 ml-1">*</span>}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <code className={`text-xs font-mono break-words ${typeColors[prop.type] || ''}`}>
                              {prop.type}
                              {prop.values && `: ${prop.values.join(' | ')}`}
                            </code>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground whitespace-nowrap">
                            {prop.default !== undefined ? String(prop.default) : '-'}
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground min-w-[120px]">{prop.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {variants.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Variants</h3>
          <div className="grid gap-6">
            {variants.map((variant: any, i: number) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-lg">{variant.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted/50 rounded-lg p-6 flex items-center justify-center min-h-[80px] border-2 border-dashed">
                    {Component ? (
                      createElement(Component, variant.props)
                    ) : (
                      <span className="text-muted-foreground text-sm">
                        Component not found in registry
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono bg-muted p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(variant.props, null, 2)}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {usage.code && (
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
              <code className="font-mono break-words whitespace-pre-wrap">{usage.code}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Module renderer - domain decomposition for complex projects
const moduleRenderer: RenderFunction = (content: any) => {
  const module = content.module || {}
  const scope = module.scope || {}
  const interfaces = module.interfaces || {}
  const relations = content.relations || {}
  const entityId = extractId(content)

  return (
    <div className="module-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-orange-500 shrink-0 mt-1.5 sm:mt-2" />
        <div className="space-y-1 flex-1 min-w-0">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{module.name || module.id}</h2>
          {module.description && (
            <p className="text-muted-foreground text-base sm:text-lg break-words">{module.description}</p>
          )}
        </div>
      </div>

      {(scope.entities?.length > 0 || scope.useCases?.length > 0 || scope.routes?.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Scope</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scope.entities?.length > 0 && (
              <div>
                <span className="text-sm font-semibold block mb-2">Entities:</span>
                <div className="flex flex-wrap gap-2">
                  {scope.entities.map((e: string) => (
                    <span key={e} className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 px-3 py-1 rounded-md text-sm font-medium">{e}</span>
                  ))}
                </div>
              </div>
            )}
            {scope.useCases?.length > 0 && (
              <div>
                <span className="text-sm font-semibold block mb-2">Use Cases:</span>
                <div className="flex flex-wrap gap-2">
                  {scope.useCases.map((u: string) => (
                    <span key={u} className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-md text-sm font-medium">{u}</span>
                  ))}
                </div>
              </div>
            )}
            {scope.routes?.length > 0 && (
              <div>
                <span className="text-sm font-semibold block mb-2">Routes:</span>
                <div className="flex flex-wrap gap-2">
                  {scope.routes.map((r: string) => (
                    <span key={r} className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 px-3 py-1 rounded-md text-xs font-mono">{r}</span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {(interfaces.exports?.length > 0 || interfaces.depends?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {interfaces.exports?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Exports</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {interfaces.exports.map((e: string) => (
                  <code key={e} className="block text-sm bg-muted px-3 py-2 rounded-md font-mono">{e}</code>
                ))}
              </CardContent>
            </Card>
          )}
          {interfaces.depends?.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Dependencies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {interfaces.depends.map((d: string) => (
                    <span key={d} className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400 px-3 py-1 rounded-md text-sm font-medium">{d}</span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Event renderer - displays event documentation with trigger info and payload
const eventRenderer: RenderFunction = (content: any) => {
  const event = content.event || {}
  const trigger = content.trigger || {}
  const payload = content.payload || []
  const relations = content.relations || {}
  const entityId = extractId(content)

  const categoryColors: Record<string, string> = {
    auth: 'bg-blue-500',
    commerce: 'bg-green-500',
    form: 'bg-purple-500',
    navigation: 'bg-orange-500',
    default: 'bg-slate-500',
  }

  const dotColor = categoryColors[event.category] || categoryColors.default

  return (
    <div className="event-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shrink-0 mt-1.5 sm:mt-2 ${dotColor}`} />
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{event.name || event.id}</h2>
            <code className="text-xs sm:text-sm bg-muted px-2 sm:px-3 py-0.5 sm:py-1 rounded-md font-mono whitespace-nowrap">{event.id}</code>
          </div>
          {event.description && (
            <p className="text-muted-foreground text-base sm:text-lg break-words">{event.description}</p>
          )}
        </div>
      </div>

      {(trigger.action || trigger.element) && (
        <Card>
          <CardHeader>
            <CardTitle>Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {trigger.action && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Action:</span>
                <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-md">{trigger.action}</span>
              </div>
            )}
            {trigger.element && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Element:</span>
                <span className="text-sm text-muted-foreground">{trigger.element}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {payload.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Payload</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden">
                  <table className="min-w-full divide-y divide-border text-xs sm:text-sm">
                    <thead className="bg-muted border-b">
                      <tr>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Name</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold whitespace-nowrap">Type</th>
                        <th className="text-left px-3 sm:px-4 py-2 sm:py-3 font-semibold">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border bg-background">
                      {payload.map((field: any, i: number) => (
                        <tr key={i} className="hover:bg-muted/50">
                          <td className="px-3 sm:px-4 py-2 sm:py-3 font-mono whitespace-nowrap">{field.name}</td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3">
                            <span className="text-xs bg-muted px-2 py-0.5 rounded font-mono">{field.type}</span>
                          </td>
                          <td className="px-3 sm:px-4 py-2 sm:py-3 text-muted-foreground min-w-[120px]">{field.description || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Usage Example</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-muted p-3 sm:p-4 rounded-lg overflow-x-auto text-xs sm:text-sm">
            <code className="font-mono break-words whitespace-pre-wrap">{`import { dispatchEvent } from '@/lib/events'

// Dispatch the event
dispatchEvent('${event.id}'${payload.length > 0 ? `, {
${payload.map((p: any) => `  ${p.name}: ${p.type === 'string' ? "'...'" : p.type === 'boolean' ? 'true' : p.type === 'number' ? '0' : "'...'"}`).join(',\n')}
}` : ''})`}</code>
          </pre>
        </CardContent>
      </Card>

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Platform renderer - displays platform/subsystem documentation
const platformRenderer: RenderFunction = (content: any) => {
  const platform = content.platform || {}
  const config = platform.config || {}
  const relations = content.relations || {}
  const entityId = extractId(content)

  const typeColors: Record<string, string> = {
    web: 'bg-blue-500',
    mobile: 'bg-green-500',
    api: 'bg-purple-500',
    desktop: 'bg-orange-500',
  }

  const typeLabels: Record<string, string> = {
    web: 'Web Application',
    mobile: 'Mobile App',
    api: 'API Service',
    desktop: 'Desktop App',
  }

  const dotColor = typeColors[platform.type] || 'bg-slate-500'

  return (
    <div className="platform-renderer space-y-4 sm:space-y-6 md:space-y-8">
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full shrink-0 mt-1.5 sm:mt-2 ${dotColor}`} />
        <div className="space-y-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight break-words">{platform.name || platform.id}</h2>
            {platform.type && (
              <span className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium whitespace-nowrap text-white ${dotColor}`}>
                {typeLabels[platform.type] || platform.type}
              </span>
            )}
          </div>
          {platform.description && (
            <p className="text-muted-foreground text-base sm:text-lg break-words">{platform.description}</p>
          )}
        </div>
      </div>

      {(config.baseRoute || config.theme) && (
        <Card>
          <CardHeader>
            <CardTitle>Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {config.baseRoute && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Base Route:</span>
                <code className="text-sm bg-muted px-2 py-0.5 rounded-md font-mono">{config.baseRoute}</code>
              </div>
            )}
            {config.theme && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Theme:</span>
                <span className="text-sm text-muted-foreground">{config.theme}</span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {entityId && <RelationsSection entityId={entityId} relations={relations} />}
    </div>
  )
}

// Render configuration - updated for layers/* structure
export const renderConfig: RenderConfig = {
  // Status file at root of spec
  '': {
    toml: statusRenderer,
  },

  // Layers - TOML files
  'layers/use-cases': {
    toml: useCaseRenderer,
  },
  'layers/guards': {
    toml: guardRenderer,
  },
  'layers/roles': {
    toml: roleRenderer,
  },
  'layers/routes': {
    toml: routeRenderer,
  },
  'layers/project': {
    toml: projectRenderer,
  },
  'layers/knowledge': {
    toml: knowledgeRenderer,
  },
  'layers/entities': {
    toml: entityRenderer,
  },
  'layers/components': {
    toml: componentRenderer,
  },
  'layers/modules': {
    toml: moduleRenderer,
  },
  'layers/events': {
    toml: eventRenderer,
  },
  'layers/platforms': {
    toml: platformRenderer,
  },

  // Docs - Markdown files
  'docs': {
    markdown: defaultMarkdownRenderer,
  },

  // Default for any other folder
  '*': {
    markdown: defaultMarkdownRenderer,
    toml: defaultTomlRenderer,
  },
}

// Get renderer for a specific path and file type
export function getRenderer(folderPath: string, fileType: 'markdown' | 'toml'): RenderFunction {
  // Try exact match first (e.g., "layers/flows")
  if (renderConfig[folderPath]?.[fileType]) {
    return renderConfig[folderPath][fileType]!
  }

  // Try parent folder match (e.g., "layers/flows" from "layers/flows/subfolder")
  const parts = folderPath.split('/')
  for (let i = parts.length - 1; i >= 0; i--) {
    const parentPath = parts.slice(0, i + 1).join('/')
    if (renderConfig[parentPath]?.[fileType]) {
      return renderConfig[parentPath][fileType]!
    }
  }

  // Try wildcard
  if (renderConfig['*']?.[fileType]) {
    return renderConfig['*'][fileType]!
  }

  // Fallback to default
  return fileType === 'markdown' ? defaultMarkdownRenderer : defaultTomlRenderer
}

// Check if folder has custom renderer
export function hasCustomRenderer(folderPath: string, fileType: 'markdown' | 'toml'): boolean {
  return !!(renderConfig[folderPath]?.[fileType] || renderConfig['*']?.[fileType])
}
