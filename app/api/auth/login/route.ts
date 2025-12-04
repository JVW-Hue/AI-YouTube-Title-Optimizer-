import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // Local development auth - accept any credentials
    const userId = 'local-user-' + Buffer.from(email).toString('base64').slice(0, 10)
    
    const profile = {
      id: userId,
      email: email,
      full_name: email.split('@')[0],
      credits: 100,
      credits_used: 0,
      credits_limit: 100,
      plan: 'pro',
      subscription_tier: 'pro',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Set auth cookies
    const cookieStore = cookies()
    cookieStore.set('user_session', JSON.stringify(profile), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    cookieStore.set('auth-token', JSON.stringify({ userId, email }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return NextResponse.json({ 
      success: true, 
      user: profile
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
