import { auth } from '../../utils/auth'
import { toWebRequest } from 'h3'

export default defineEventHandler(async (event) => {
  const request = toWebRequest(event)
  const response = await auth.handler(request)

  // Copy response headers
  for (const [key, value] of response.headers.entries()) {
    setHeader(event, key, value)
  }

  // Set status
  setResponseStatus(event, response.status, response.statusText)

  // Return body
  if (response.body) {
    return response.body
  }

  return null
})
