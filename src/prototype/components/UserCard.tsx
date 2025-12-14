// UserCard - Reusable user profile card component
// Used in: Users page, user lists, dashboards

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Badge,
  Button,
  Doc,
} from '@/components/ui'
import { Calendar, Shield, User, Trash2 } from 'lucide-react'

export interface UserCardProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar: string
    createdAt?: string
  }
  onDelete?: (id: string) => void
  showDelete?: boolean
}

const getRoleBadgeVariant = (role: string) => {
  return role === 'admin' ? 'default' : 'secondary'
}

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function UserCard({ user, onDelete, showDelete = true }: UserCardProps) {
  return (
    <Doc of="components.user-card" entityId={user.id}>
      <Card className="hover:shadow-lg transition-shadow group">
        <CardHeader className="pb-3">
          <div className="flex items-start gap-2 sm:gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-full border-2 border-border shrink-0"
            />
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base sm:text-lg truncate">{user.name}</CardTitle>
              <CardDescription className="text-xs sm:text-sm truncate">{user.email}</CardDescription>
            </div>
            {showDelete && onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 sm:group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive shrink-0 h-8 w-8 sm:h-10 sm:w-10"
                onClick={() => onDelete(user.id)}
                aria-label={`Delete ${user.name}`}
              >
                <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2 sm:space-y-3 pt-0">
          <div className="flex items-center gap-2">
            {user.role === 'admin' ? (
              <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-primary shrink-0" />
            ) : (
              <User className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground shrink-0" />
            )}
            <Badge variant={getRoleBadgeVariant(user.role)} className="capitalize text-xs">
              {user.role}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />
            <span className="break-words">Joined {formatDate(user.createdAt)}</span>
          </div>
        </CardContent>
      </Card>
    </Doc>
  )
}

export default UserCard
