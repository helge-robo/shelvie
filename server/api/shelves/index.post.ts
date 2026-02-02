import { db, schema } from '../../db'
import { auth } from '../../utils/auth'
import { z } from 'zod'

const bodySchema = z.object({
  name: z.string().min(1).max(100),
})

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

export default defineEventHandler(async (event) => {
  // Get session
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
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

  const slug = slugify(parsed.data.name)

  const [newShelf] = await db.insert(schema.shelves).values({
    userId: session.user.id,
    name: parsed.data.name,
    slug,
    isDefault: false,
    sortOrder: 0,
  }).returning()

  return newShelf
})
