import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'

export default async function SettingsPage() {
  const userSession = cookies().get('user_session')
  
  if (!userSession) {
    redirect('/auth/login')
  }

  const profile = JSON.parse(userSession.value)

  return (
    <DashboardLayout user={profile}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gold-text animate-text-shimmer mb-3">
            Settings
          </h1>
          <p className="text-gray-300">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold text-gold mb-6">Account Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" value={profile.email} disabled className="input-field bg-medium-gray" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
              <input type="text" value={profile.full_name || ''} disabled className="input-field bg-medium-gray" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Plan</label>
              <div className="inline-flex px-4 py-2 bg-gold/20 text-gold border border-gold/30 rounded-lg font-bold capitalize">
                {profile.plan}
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
