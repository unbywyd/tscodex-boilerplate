import { useEffect, useState } from 'react';
import {
  loadProjectData,
  loadUseCases,
  loadRouting,
  loadRoles,
  loadGuards,
  loadBusiness,
  loadStories,
  loadFlows,
} from '../lib/data-loader';

export default function DocumentationPage() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'use-cases' | 'routing' | 'roles' | 'flows'>('overview');

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [project, useCases, routing, roles, guards, business, stories, flows] = await Promise.all([
          loadProjectData(),
          loadUseCases(),
          loadRouting(),
          loadRoles(),
          loadGuards(),
          loadBusiness(),
          loadStories(),
          loadFlows(),
        ]);

        setData({
          project,
          useCases,
          routing,
          roles,
          guards,
          business,
          stories,
          flows,
        });
      } catch (error) {
        console.error('Error loading documentation:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return <div className="loading">Loading documentation...</div>;
  }

  return (
    <div className="documentation-page">
      <header>
        <h1>Project Documentation</h1>
      </header>

      <div className="tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'use-cases' ? 'active' : ''}
          onClick={() => setActiveTab('use-cases')}
        >
          Use Cases
        </button>
        <button
          className={activeTab === 'routing' ? 'active' : ''}
          onClick={() => setActiveTab('routing')}
        >
          Routing
        </button>
        <button
          className={activeTab === 'roles' ? 'active' : ''}
          onClick={() => setActiveTab('roles')}
        >
          Roles & Guards
        </button>
        <button
          className={activeTab === 'flows' ? 'active' : ''}
          onClick={() => setActiveTab('flows')}
        >
          Flows
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div>
            <section>
              <h2>Project Information</h2>
              {data.project && (
                <div className="info-card">
                  <h3>{data.project.name}</h3>
                  <p><strong>ID:</strong> {data.project.id}</p>
                  <p><strong>Type:</strong> {data.project.type}</p>
                  <p><strong>Description:</strong> {data.project.description}</p>
                  {data.project.owner && (
                    <p>
                      <strong>Owner:</strong> {data.project.owner.name}
                      {data.project.owner.email && ` (${data.project.owner.email})`}
                    </p>
                  )}
                </div>
              )}

              {data.business?.domains && (
                <div>
                  <h3>Business Domains</h3>
                  <ul>
                    {data.business.domains.map((domain: any) => (
                      <li key={domain.id}>
                        <strong>{domain.name}</strong> - {domain.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </section>
          </div>
        )}

        {activeTab === 'use-cases' && (
          <div>
            <h2>Use Cases</h2>
            {data.useCases && data.useCases.length > 0 ? (
              <div className="use-cases-list">
                {data.useCases.map((uc: any) => (
                  <div key={uc.id} className="use-case-card">
                    <h3>{uc.name}</h3>
                    <p><strong>ID:</strong> {uc.id}</p>
                    <p><strong>As Role:</strong> {uc.asRole}</p>
                    <p><strong>I Want:</strong> {uc.iWant}</p>
                    <p><strong>So That:</strong> {uc.soThat}</p>
                    <p><strong>Description:</strong> {uc.description}</p>
                    {uc.steps && (
                      <div>
                        <strong>Steps:</strong>
                        <ol>
                          {Object.entries(uc.steps).map(([key, value]: [string, any]) => (
                            <li key={key}>{value}</li>
                          ))}
                        </ol>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No use cases available</p>
            )}
          </div>
        )}

        {activeTab === 'routing' && (
          <div>
            <h2>Routing Configuration</h2>
            {data.routing && (
              <div>
                <section>
                  <h3>API Routes</h3>
                  {data.routing.apiRoutes && data.routing.apiRoutes.length > 0 ? (
                    <ul className="routes-list">
                      {data.routing.apiRoutes.map((route: any) => (
                        <li key={route.id} className="route-item">
                          <code className="method">{route.method}</code>
                          <code className="path">{route.path}</code>
                          <span className="summary">{route.summary}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No API routes defined</p>
                  )}
                </section>

                <section>
                  <h3>UI Routes</h3>
                  {data.routing.uiRoutes && data.routing.uiRoutes.length > 0 ? (
                    <ul className="routes-list">
                      {data.routing.uiRoutes.map((route: any) => (
                        <li key={route.id} className="route-item">
                          <code className="path">{route.path}</code>
                          <span className="summary">→ {route.viewId}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No UI routes defined</p>
                  )}
                </section>
              </div>
            )}
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <section>
              <h2>Roles</h2>
              {data.roles?.roles && data.roles.roles.length > 0 ? (
                <ul className="roles-list">
                  {data.roles.roles.map((role: any) => (
                    <li key={role.id} className="role-card">
                      <h3>{role.name}</h3>
                      <p><strong>ID:</strong> {role.id}</p>
                      <p>{role.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No roles defined</p>
              )}
            </section>

            <section>
              <h2>Guards</h2>
              {data.guards?.guards && data.guards.guards.length > 0 ? (
                <ul className="guards-list">
                  {data.guards.guards.map((guard: any) => (
                    <li key={guard.id} className="guard-card">
                      <h3>{guard.name}</h3>
                      <p><strong>ID:</strong> {guard.id}</p>
                      <p>{guard.description}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No guards defined</p>
              )}
            </section>
          </div>
        )}

        {activeTab === 'flows' && (
          <div>
            <h2>Flow Diagrams</h2>
            {data.flows && data.flows.length > 0 ? (
              <div className="flows-list">
                {data.flows.map((flow: any) => (
                  <div key={flow.id} className="flow-card">
                    <h3>{flow.title}</h3>
                    <p><strong>ID:</strong> {flow.id}</p>
                    <p><strong>Use Case:</strong> {flow.useCaseId}</p>
                    <p><strong>Direction:</strong> {flow.direction}</p>
                    {flow.nodes && (
                      <div>
                        <strong>Nodes:</strong> {flow.nodes.length}
                      </div>
                    )}
                    {flow.edges && (
                      <div>
                        <strong>Edges:</strong> {flow.edges.length}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p>No flows defined</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

