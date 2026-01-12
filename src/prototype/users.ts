import { defineUsers, defineRoles } from 'protomobilekit'

// Define roles for the app
defineRoles({
  appId: 'main',
  roles: [
    { value: 'user', label: 'User', description: 'Regular user' },
    { value: 'admin', label: 'Admin', description: 'Administrator', color: '#ef4444' },
  ],
})

// Define test users for quick switching in DevTools
defineUsers({
  appId: 'main',
  users: [
    {
      id: 'alice',
      name: 'Alice Smith',
      email: 'alice@example.com',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?u=alice',
    },
    {
      id: 'bob',
      name: 'Bob Jones',
      email: 'bob@example.com',
      role: 'user',
      avatar: 'https://i.pravatar.cc/150?u=bob',
    },
  ],
})
