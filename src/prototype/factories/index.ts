// Prototype Data Factories
// Register fake data generators for each entity type
//
// These factories are used by useRepo().populate() to generate test data

import { registerFactory, faker } from '@/lib/data-factory'
import type { BaseEntity } from '@/lib/repository'

// ============================================
// Entity Interfaces
// ============================================

export interface UserEntity extends BaseEntity {
  name: string
  email: string
  role: string
  avatar: string
}

export interface ProductEntity extends BaseEntity {
  name: string
  description: string
  price: number
  category: string
  image: string
  stock: number
}

export interface OrderEntity extends BaseEntity {
  userId: string
  status: string
  total: number
  items: number
}

export interface PostEntity extends BaseEntity {
  title: string
  content: string
  author: string
  published: boolean
  tags: string[]
}

export interface CommentEntity extends BaseEntity {
  postId: string
  author: string
  content: string
  likes: number
}

export interface TaskEntity extends BaseEntity {
  title: string
  description: string
  status: string
  priority: string
  assignee: string
  dueDate: string
}

// ============================================
// Factory Registration
// ============================================

registerFactory<UserEntity>('users', () => ({
  name: faker.person.fullName(),
  email: faker.internet.email(),
  role: faker.helpers.arrayElement(['admin', 'user', 'moderator']),
  avatar: faker.image.avatar(),
}))

registerFactory<ProductEntity>('products', () => ({
  name: faker.commerce.productName(),
  description: faker.commerce.productDescription(),
  price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
  category: faker.commerce.department(),
  image: faker.image.urlPicsumPhotos({ width: 400, height: 300 }),
  stock: faker.number.int({ min: 0, max: 100 }),
}))

registerFactory<OrderEntity>('orders', () => ({
  userId: faker.string.uuid(),
  status: faker.helpers.arrayElement(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  total: parseFloat(faker.commerce.price({ min: 50, max: 1000 })),
  items: faker.number.int({ min: 1, max: 10 }),
}))

registerFactory<PostEntity>('posts', () => ({
  title: faker.lorem.sentence(),
  content: faker.lorem.paragraphs(3),
  author: faker.person.fullName(),
  published: faker.datatype.boolean(),
  tags: faker.helpers.arrayElements(['tech', 'news', 'tutorial', 'review', 'opinion'], { min: 1, max: 3 }),
}))

registerFactory<CommentEntity>('comments', () => ({
  postId: faker.string.uuid(),
  author: faker.person.fullName(),
  content: faker.lorem.paragraph(),
  likes: faker.number.int({ min: 0, max: 100 }),
}))

registerFactory<TaskEntity>('tasks', () => ({
  title: faker.lorem.sentence({ min: 3, max: 8 }),
  description: faker.lorem.paragraph(),
  status: faker.helpers.arrayElement(['todo', 'in_progress', 'review', 'done']),
  priority: faker.helpers.arrayElement(['low', 'medium', 'high', 'urgent']),
  assignee: faker.person.fullName(),
  dueDate: faker.date.future().toISOString(),
}))
