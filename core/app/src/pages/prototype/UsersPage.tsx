import { useEffect, useState } from 'react'
import { Container } from '@/components/ui/container'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui'
import { Users, Calendar, Shield, User } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { loadMock } from '@/lib/docs-loader'

interface User {
  id: number
  name: string
  email: string
  role: string
  avatar: string
  createdAt: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await loadMock('users')
        setUsers(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'default' : 'secondary'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <Container size="lg" className="py-4 sm:py-6 md:py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Users</h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage and view all users in the system
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        {!loading && (
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-2xl">{users.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Admins</CardDescription>
                <CardTitle className="text-2xl">
                  {users.filter(u => u.role === 'admin').length}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Regular Users</CardDescription>
                <CardTitle className="text-2xl">
                  {users.filter(u => u.role === 'user').length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>
        )}

        {/* Users List */}
        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <Card key={user.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="h-12 w-12 rounded-full border-2 border-border"
                    />
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">{user.name}</CardTitle>
                      <CardDescription className="truncate">{user.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    {user.role === 'admin' ? (
                      <Shield className="h-4 w-4 text-primary" />
                    ) : (
                      <User className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize">
                      {user.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Joined {formatDate(user.createdAt)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}
