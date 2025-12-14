import {
  Container,
  Card, CardContent, CardDescription, CardHeader, CardTitle,
  Doc,
  Button,
  Skeleton
} from '@/components/ui'
import { Users, Plus, RefreshCw, Wand2, Trash2 } from 'lucide-react'
import { useRepo } from '@/hooks/useRepo'
import { dispatchEvent } from '@/lib/events'
import { UserCard, type UserCardProps } from '@prototype/components/UserCard'

type UserEntity = UserCardProps['user']

export default function UsersPage() {
  const {
    data: users,
    loading,
    delete: deleteUser,
    reset,
    deleteAll,
    populate,
  } = useRepo<UserEntity>('users')

  const handleAddUser = () => {
    populate(1)
    dispatchEvent('user.create', { userId: 'new', userName: 'Generated User' })
  }

  const handlePopulate = () => {
    populate(20)
    dispatchEvent('user.populate', { count: 20 })
  }

  const handleDeleteUser = (id: string) => {
    deleteUser(id)
    dispatchEvent('user.delete', { userId: id })
  }

  const handleResetData = async () => {
    try {
      const response = await fetch('/generated/mocks/users.json')
      if (response.ok) {
        const mockData = await response.json()
        reset(Array.isArray(mockData) ? mockData : [])
      }
    } catch (error) {
      console.error('Failed to reset data:', error)
    }
  }

  const handleDeleteAll = () => {
    if (confirm('Delete all users?')) {
      deleteAll()
    }
  }

  return (
    <>
      <Doc of="pages.users" floating position="bottom-right" />
      <Container size="lg" className="py-4 sm:py-6 md:py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="rounded-lg bg-primary/10 p-1.5 sm:p-2">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Users</h1>
                  <p className="text-muted-foreground text-xs sm:text-sm md:text-base">
                    Manage users with Repository (localStorage persistence)
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={handleResetData} title="Reset to mock data" className="flex-1 sm:flex-none">
                  <RefreshCw className="h-4 w-4 sm:mr-0" />
                  <span className="hidden sm:inline ml-2">Reset</span>
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDeleteAll} title="Delete all" className="flex-1 sm:flex-none">
                  <Trash2 className="h-4 w-4 sm:mr-0" />
                  <span className="hidden sm:inline ml-2">Delete All</span>
                </Button>
                <Button variant="outline" size="sm" onClick={handlePopulate} title="Generate 20 fake users" className="flex-1 sm:flex-none">
                  <Wand2 className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">+20</span>
                  <span className="sm:hidden">Generate</span>
                </Button>
                <Button size="sm" onClick={handleAddUser} className="flex-1 sm:flex-none">
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Stats */}
          {!loading && (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardDescription className="text-xs sm:text-sm">Total Users</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl">{users.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardDescription className="text-xs sm:text-sm">Admins</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl">
                    {users.filter(u => u.role === 'admin').length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardDescription className="text-xs sm:text-sm">Regular Users</CardDescription>
                  <CardTitle className="text-xl sm:text-2xl">
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
          ) : users.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground mb-4">No users found</p>
              <Button onClick={handleAddUser}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </Card>
          ) : (
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={handleDeleteUser}
                />
              ))}
            </div>
          )}
        </div>
      </Container>
    </>
  )
}
