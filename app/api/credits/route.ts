import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

function getAuthUser() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('auth-token')
  if (!authCookie) return null
  try {
    return JSON.parse(authCookie.value)
  } catch {
    return null
  }
}

// GET current credit balance
export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return NextResponse.json({
      credits_used: 0,
      credits_limit: 100,
      credits_remaining: 100,
      plan: 'pro'
    })
  } catch (error) {
    console.error('Get credits error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
