# Web Development

## Stack
- React 19 + Vite
- Tailwind CSS + shadcn/ui
- React Router (file-based routing)
- Zustand (state)
- React Hook Form + Zod (forms)

## Layout
```
src/prototype/
├── pages/          # Route components
├── components/     # Shared components
├── stores/         # Zustand stores
├── schemas/        # Zod schemas
├── hooks/          # Custom hooks
└── mocks/          # JSON mock data
```

## Responsive
- Mobile-first approach
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Use `flex` and `grid` for layouts

## Auth Pattern
```tsx
// Protected route wrapper
function ProtectedRoute({ children, role }) {
  const user = useAuthStore((s) => s.user)
  if (!user) return <Navigate to="/login" />
  if (role && user.role !== role) return <Navigate to="/" />
  return children
}
```

## Data Fetching
Mock data for prototype:
```tsx
import users from '@prototype/mocks/users.json'

function UsersPage() {
  return <UserList data={users} />
}
```

## Components
Use shadcn/ui components:
- Button, Input, Card
- Dialog, Sheet, Dropdown
- Table, Form, Toast
