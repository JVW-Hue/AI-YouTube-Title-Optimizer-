'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import SavedTitlesView from '@/components/SavedTitlesView'
import { SavedTitle } from '@/types'

export default function SavedTitlesPage() {
  const [profile, setProfile] = useState<any>(null)
  const [savedTitles, setSavedTitles] = useState<SavedTitle[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function loadData() {
      try {
        const userRes = await fetch('/api/user')
        if (!userRes.ok) {
          router.push('/auth/login')
          return
        }
        const userData = await userRes.json()
        setProfile(userData)

        const titlesRes = await fetch('/api/save-title')
        if (titlesRes.ok) {
          const titlesData = await titlesRes.json()
          setSavedTitles(titlesData)
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-marble-bg flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold"></div>
      </div>
    )
  }

  return (
    <DashboardLayout user={profile}>
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold gold-text animate-text-shimmer mb-3">
            💾 Saved Titles
          </h1>
          <p className="text-gray-300 text-lg">
            Your collection of high-CTR YouTube titles
          </p>
        </div>

        <SavedTitlesView savedTitles={savedTitles} onUpdate={setSavedTitles} />
      </div>
    </DashboardLayout>
  )
}
