// Simple in-memory rate limiting
// For production, use Redis or similar
const requestMap = new Map<string, number[]>()

export function rateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 60000 // 1 minute
): boolean {
  const now = Date.now()
  const requests = requestMap.get(identifier) || []

  // Remove old requests outside the window
  const validRequests = requests.filter((time) => now - time < windowMs)

  if (validRequests.length >= limit) {
    return false
  }

  validRequests.push(now)
  requestMap.set(identifier, validRequests)

  return true
}
