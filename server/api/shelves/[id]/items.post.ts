import { db, schema } from '../../../db'
import { auth } from '../../../utils/auth'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

const bodySchema = z.object({
  externalId: z.string().min(1),
  title: z.string().min(1),
  creator: z.string().min(1),
  imageUrl: z.string().nullable().optional(),
  isbn: z.string().nullable().optional(),
  mediaType: z.enum(['book', 'movie', 'game', 'music']).default('book'),
  personalNote: z.string().nullable().optional(),
  rating: z.number().min(1).max(5).nullable().optional(),
})

export default defineEventHandler(async (event) => {
  // Get session
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const shelfId = getRouterParam(event, 'id')
  if (!shelfId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Shelf ID is required',
    })
  }

  // Verify shelf belongs to user
  const shelf = await db.query.shelves.findFirst({
    where: and(
      eq(schema.shelves.id, shelfId),
      eq(schema.shelves.userId, session.user.id)
    ),
  })

  if (!shelf) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Shelf not found',
    })
  }

  const body = await readBody(event)
  const parsed = bodySchema.safeParse(body)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body',
    })
  }

  // Check if item already exists in shelf
  const existingItem = await db.query.items.findFirst({
    where: and(
      eq(schema.items.shelfId, shelfId),
      eq(schema.items.externalId, parsed.data.externalId)
    ),
  })

  if (existingItem) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Book already in shelf',
    })
  }

  const [newItem] = await db.insert(schema.items).values({
    shelfId,
    userId: session.user.id,
    externalId: parsed.data.externalId,
    title: parsed.data.title,
    creator: parsed.data.creator,
    imageUrl: parsed.data.imageUrl || null,
    isbn: parsed.data.isbn || null,
    mediaType: parsed.data.mediaType,
    personalNote: parsed.data.personalNote || null,
    rating: parsed.data.rating || null,
    sortOrder: 0,
  }).returning()

  return newItem
})
