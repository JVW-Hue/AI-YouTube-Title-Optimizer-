import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// In-memory storage (per user)
const savedTitlesStore = new Map<string, any[]>()

function getUserId() {
  const authToken = cookies().get('auth-token')
  if (!authToken) return null
  try {
    const { userId } = JSON.parse(authToken.value)
    return userId
  } catch {
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { title, thumbnail_text, topic, style, ctr_score } = await request.json()

    if (!title || !topic || !style) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const savedTitle = {
      id: Date.now().toString(),
      title,
      thumbnail_text,
      topic,
      style,
      ctr_score,
      is_favorite: false,
      created_at: new Date().toISOString()
    }

    const userTitles = savedTitlesStore.get(userId) || []
    userTitles.unshift(savedTitle)
    savedTitlesStore.set(userId, userTitles)

    return NextResponse.json(savedTitle)
  } catch (error) {
    console.error('Save title error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTitles = savedTitlesStore.get(userId) || []
    return NextResponse.json(userTitles)
  } catch (error) {
    console.error('Fetch saved titles error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const userTitles = savedTitlesStore.get(userId) || []
    const filtered = userTitles.filter(t => t.id !== id)
    savedTitlesStore.set(userId, filtered)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete title error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    const updates = await request.json()

    if (!id) {
      return NextResponse.json({ error: 'ID required' }, { status: 400 })
    }

    const userTitles = savedTitlesStore.get(userId) || []
    const updated = userTitles.map(t => t.id === id ? { ...t, ...updates } : t)
    savedTitlesStore.set(userId, updated)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update title error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
