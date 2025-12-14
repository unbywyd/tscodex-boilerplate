// Demo login page - select a user to login
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import {
  Container,
  Card, CardHeader, CardTitle, CardDescription,
  Badge
} from '@/components/ui'
import { User, Shield, LogIn } from 'lucide-react'

// Define your user type
interface DemoUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  avatar?: string
}

// Demo users for selection
const DEMO_USERS: DemoUser[] = [
  { id: '1', name: 'Admin User', email: 'admin@demo.com', role: 'admin' },
  { id: '2', name: 'Regular User', email: 'user@demo.com', role: 'user' },
]

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth<DemoUser>()
  const navigate = useNavigate()

  // Already logged in - redirect
  if (isAuthenticated) {
    return <Navigate to="/prototype" replace />
  }

  const handleLogin = (user: DemoUser) => {
    login(user)
    navigate('/prototype')
  }

  return (
    <Container size="sm" className="py-8 md:py-16">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-2">
            <LogIn className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Demo Login</h1>
          <p className="text-muted-foreground">
            Select a user to login and explore the prototype
          </p>
        </div>

        <div className="grid gap-4">
          {DEMO_USERS.map((user) => (
            <Card
              key={user.id}
              className="cursor-pointer hover:border-primary hover:shadow-md transition-all"
              onClick={() => handleLogin(user)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {user.role === 'admin' ? (
                      <Shield className="w-6 h-6 text-primary" />
                    ) : (
                      <User className="w-6 h-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                  <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                    {user.role}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground">
          This is a demo login. In production, implement real authentication.
        </p>
      </div>
    </Container>
  )
}
