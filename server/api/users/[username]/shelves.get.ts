import { db, schema } from '../../../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required',
    })
  }

  // Get user
  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  // Get user's shelves with items
  const userShelves = await db.query.shelves.findMany({
    where: eq(schema.shelves.userId, user.id),
    orderBy: (shelves, { asc }) => [asc(shelves.sortOrder)],
  })

  // Get items for each shelf
  const shelvesWithItems = await Promise.all(
    userShelves.map(async (shelf) => {
      const shelfItems = await db.query.items.findMany({
        where: eq(schema.items.shelfId, shelf.id),
        orderBy: (items, { asc }) => [asc(items.sortOrder)],
      })

      return {
        ...shelf,
        items: shelfItems,
      }
    })
  )

  return shelvesWithItems
})
