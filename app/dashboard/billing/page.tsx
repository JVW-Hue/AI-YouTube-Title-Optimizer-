import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/DashboardLayout'
import PricingPlans from '@/components/PricingPlans'

export const dynamic = 'force-dynamic'

export default async function BillingPage() {
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
            Billing & Subscription
          </h1>
          <p className="text-gray-300">
            Manage your subscription and billing information
          </p>
        </div>

        <PricingPlans currentPlan={profile.plan} userId={profile.id} />
      </div>
    </DashboardLayout>
  )
}
