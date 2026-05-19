import bcrypt from 'bcryptjs'

// Mock database - replace with real database in production
const users: Map<string, { email: string; passwordHash: string; name: string }> = new Map()

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export async function comparePassword(password: string, hash: string) {
  return bcrypt.compare(password, hash)
}

export async function createUser(email: string, password: string, name: string) {
  if (users.has(email)) {
    throw new Error('User already exists')
  }

  const passwordHash = await hashPassword(password)
  users.set(email, { email, passwordHash, name })
  return { email, name }
}

export async function findUser(email: string) {
  return users.get(email)
}

export async function validateUser(email: string, password: string) {
  const user = users.get(email)
  if (!user) return null

  const isValid = await comparePassword(password, user.passwordHash)
  return isValid ? user : null
}
