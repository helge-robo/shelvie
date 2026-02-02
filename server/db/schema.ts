import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text('email').unique().notNull(),
  name: text('name').notNull(),
  username: text('username').unique().notNull(),
  image: text('image'),
  bio: text('bio'),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false).notNull(),

  // Connected social handles
  tiktokHandle: text('tiktok_handle'),
  instagramHandle: text('instagram_handle'),
  linkedinHandle: text('linkedin_handle'),
  blueskyHandle: text('bluesky_handle'),

  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
})

// Sessions table (for Better Auth)
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').unique().notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
})

// Accounts table (OAuth accounts for Better Auth)
export const accounts = sqliteTable('accounts', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  accessTokenExpiresAt: integer('access_token_expires_at', { mode: 'timestamp' }),
  refreshTokenExpiresAt: integer('refresh_token_expires_at', { mode: 'timestamp' }),
  scope: text('scope'),
  idToken: text('id_token'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
})

// Verification tokens (for Better Auth)
export const verifications = sqliteTable('verifications', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
})

// Shelves table
export const shelves = sqliteTable('shelves', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  isDefault: integer('is_default', { mode: 'boolean' }).default(false).notNull(),
  sortOrder: integer('sort_order').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
})

// Items table (books on shelves)
export const items = sqliteTable('items', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  shelfId: text('shelf_id').references(() => shelves.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

  // Media metadata
  mediaType: text('media_type').default('book').notNull(),
  externalId: text('external_id').notNull(),
  title: text('title').notNull(),
  creator: text('creator').notNull(),
  imageUrl: text('image_url'),
  isbn: text('isbn'),

  // User additions
  personalNote: text('personal_note'),
  rating: integer('rating'),
  sortOrder: integer('sort_order').default(0).notNull(),

  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()).notNull(),
})

// Type exports
export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Shelf = typeof shelves.$inferSelect
export type NewShelf = typeof shelves.$inferInsert
export type Item = typeof items.$inferSelect
export type NewItem = typeof items.$inferInsert
