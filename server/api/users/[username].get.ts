import { db, schema } from '../../db'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const username = getRouterParam(event, 'username')
  if (!username) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username is required',
    })
  }

  const user = await db.query.users.findFirst({
    where: eq(schema.users.username, username),
    columns: {
      id: true,
      username: true,
      name: true,
      image: true,
      bio: true,
      tiktokHandle: true,
      instagramHandle: true,
      linkedinHandle: true,
      createdAt: true,
    },
  })

  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'User not found',
    })
  }

  return user
})
