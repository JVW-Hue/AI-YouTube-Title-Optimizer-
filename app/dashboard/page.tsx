import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import TitleGenerator from '@/components/TitleGenerator'
import DashboardLayout from '@/components/DashboardLayout'

export default async function DashboardPage() {
  const userSession = cookies().get('user_session')
  
  if (!userSession) {
    redirect('/auth/login')
  }

  const profile = JSON.parse(userSession.value)

  const creditsRemaining = Math.max(0, profile.credits_limit - profile.credits_used)

  return (
    <DashboardLayout user={profile}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gold-text animate-text-shimmer mb-3">
            Welcome back, {profile.full_name || 'Creator'}!
          </h1>
          <p className="text-gray-300 text-lg">
            Generate viral YouTube titles that get more clicks and views
          </p>
        </div>

        <TitleGenerator 
          userCredits={creditsRemaining}
          userPlan={profile.plan}
        />
      </div>
    </DashboardLayout>
  )
}
