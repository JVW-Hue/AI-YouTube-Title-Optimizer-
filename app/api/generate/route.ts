import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { generateTitles } from '@/lib/ai-service'
import { TitleRequest } from '@/types'

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

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authUser = getAuthUser()
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse request
    const body: TitleRequest = await request.json()
    const { topic, styles, includeEmojis, targetAudience, niche } = body

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 })
    }

    // Generate titles
    const result = await generateTitles({
      topic: topic.trim(),
      styles,
      includeEmojis,
      targetAudience,
      niche
    })

    return NextResponse.json({
      ...result,
      credits_used: 1,
      credits_limit: 100
    })
  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate titles' },
      { status: 500 }
    )
  }
}
