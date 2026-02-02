import { db, schema } from '../../db'
import { eq } from 'drizzle-orm'
import { auth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // Get session
  const session = await auth.api.getSession({ headers: event.headers })
  if (!session?.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  // Fetch user's shelves with items
  const userShelves = await db.query.shelves.findMany({
    where: eq(schema.shelves.userId, session.user.id),
    orderBy: (shelves, { asc }) => [asc(shelves.sortOrder)],
  })

  // Get items for each shelf
  const shelvesWithItems = await Promise.all(
    userShelves.map(async (shelf) => {
      const shelfItems = await db.query.items.findMany({
        where: eq(schema.items.shelfId, shelf.id),
        orderBy: (items, { asc }) => [asc(items.sortOrder)],
        limit: 10,
      })

      return {
        ...shelf,
        items: shelfItems,
        itemCount: shelfItems.length,
      }
    })
  )

  return shelvesWithItems
})
