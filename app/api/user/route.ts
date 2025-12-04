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

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const profile = {
      id: authUser.userId,
      email: authUser.email,
      full_name: authUser.email.split('@')[0],
      credits: 100,
      subscription_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authUser = getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const updates = await request.json()
    
    const profile = {
      id: authUser.userId,
      email: authUser.email,
      full_name: updates.full_name || authUser.email.split('@')[0],
      credits: updates.credits ?? 100,
      subscription_tier: updates.subscription_tier || 'pro',
      updated_at: new Date().toISOString()
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}