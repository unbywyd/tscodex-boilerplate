// Data loader utility
// In dev mode: loads data via API
// In prod mode: loads from generated static JSON

const isDev = import.meta.env.DEV

async function fetchData(endpoint: string) {
  if (isDev) {
    const response = await fetch(`/api${endpoint}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`)
    }
    return response.json()
  } else {
    // In production, fetch from generated static JSON
    const response = await fetch(`/generated/data${endpoint}.json`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${endpoint}`)
    }
    return response.json()
  }
}

export async function loadProjectData() {
  return fetchData('/project');
}

export async function loadUseCases() {
  return fetchData('/use-cases');
}

export async function loadRouting() {
  return fetchData('/routing');
}

export async function loadRoles() {
  return fetchData('/roles');
}

export async function loadGuards() {
  return fetchData('/guards');
}

export async function loadBusiness() {
  return fetchData('/business');
}

export async function loadStories() {
  return fetchData('/stories');
}

export async function loadFlows() {
  return fetchData('/flows');
}

export async function loadFlowById(id: string) {
  if (isDev) {
    const response = await fetch(`/api/flows/${id}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch flow ${id}`)
    }
    return response.json()
  } else {
    // In production, load all flows and find by id
    const flows = await loadFlows()
    return flows.find((f: any) => f.id === id)
  }
}

