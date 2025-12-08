# Authentication

## Overview

The prototype includes a mock authentication system for demonstrating protected routes.

## Mock Users

| Email | Password | Role |
|-------|----------|------|
| admin@example.com | admin123 | admin |
| user@example.com | user123 | user |

## Guards

- **Public** - No authentication required
- **Authenticated** - Must be logged in
- **Admin** - Must have admin role

## Usage

```tsx
import { useAuthStore } from '@prototype/stores/auth.store'

const { login, logout, isAuthenticated, user } = useAuthStore()
```
