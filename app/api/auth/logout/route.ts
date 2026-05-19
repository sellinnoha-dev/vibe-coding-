import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json(
    { message: 'Logged out successfully' },
    { status: 200 }
  )

  response.cookies.set('auth-token', '', {
    maxAge: 0,
  })

  return response
}
