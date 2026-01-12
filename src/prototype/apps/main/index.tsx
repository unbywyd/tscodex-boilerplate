import {
  Navigator,
  useNavigate,
  useQuery,
  Screen,
  Header,
  ScrollView,
  Card,
  List,
  ListItem,
  Avatar,
  Text,
  Badge,
} from 'protomobilekit'
import { Home, Users } from 'lucide-react'
import type { User } from '../../entities'

// Home Screen
function HomeScreen() {
  return (
    <Screen header={<Header title="Home" />}>
      <ScrollView padding="md">
        <Card className="p-4">
          <Text size="lg" semibold className="mb-2">Welcome!</Text>
          <Text secondary>
            This is a basic prototype. Edit files in src/prototype/ to customize.
          </Text>
        </Card>
      </ScrollView>
    </Screen>
  )
}

// Users Screen
function UsersScreen() {
  const { items: users } = useQuery<User>('User')

  return (
    <Screen header={<Header title="Users" />}>
      <ScrollView>
        <List
          items={users}
          keyExtractor={(u) => u.id}
          renderItem={(user) => (
            <ListItem
              left={<Avatar src={user.avatar} name={user.name} />}
              subtitle={user.email}
              right={
                <Badge variant={user.role === 'admin' ? 'danger' : 'default'}>
                  {user.role}
                </Badge>
              }
            >
              {user.name}
            </ListItem>
          )}
        />
      </ScrollView>
    </Screen>
  )
}

// Main App with Tab Navigation
export function MainApp() {
  return (
    <Navigator initial="home" type="tabs">
      <Navigator.Screen
        name="home"
        component={HomeScreen}
        icon={<Home size={24} />}
        label="Home"
      />
      <Navigator.Screen
        name="users"
        component={UsersScreen}
        icon={<Users size={24} />}
        label="Users"
      />
    </Navigator>
  )
}
