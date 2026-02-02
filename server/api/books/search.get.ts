import { z } from 'zod'

const querySchema = z.object({
  q: z.string().min(1),
})

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  isbn?: string[]
  cover_i?: number
  first_publish_year?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
  numFound: number
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const parsed = querySchema.safeParse(query)
  if (!parsed.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid query parameter',
    })
  }

  const searchQuery = encodeURIComponent(parsed.data.q)

  try {
    // Search Open Library
    const response = await $fetch<OpenLibraryResponse>(
      `https://openlibrary.org/search.json?q=${searchQuery}&limit=20`
    )

    // Transform results
    const books = response.docs.map((doc) => {
      const isbn = doc.isbn?.[0] || null
      const coverId = doc.cover_i

      return {
        externalId: `openlibrary:${doc.key}`,
        title: doc.title,
        creator: doc.author_name?.join(', ') || 'Unknown Author',
        imageUrl: coverId
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : null,
        isbn,
        firstPublishYear: doc.first_publish_year,
      }
    })

    return books
  } catch (e) {
    console.error('Open Library search failed:', e)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to search books',
    })
  }
})
