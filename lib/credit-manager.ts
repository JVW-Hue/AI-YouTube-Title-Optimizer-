import { createServerClient } from './supabase'

export interface CreditInfo {
  credits_used: number
  credits_limit: number
  credits_remaining: number
  plan: string
}

export async function getUserCredits(userId: string): Promise<CreditInfo | null> {
  const supabase = createServerClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('credits_used, credits_limit, plan')
    .eq('id', userId)
    .single()

  if (error || !data) return null

  return {
    ...data,
    credits_remaining: data.credits_limit - data.credits_used
  }
}

export async function incrementCredits(userId: string): Promise<boolean> {
  const supabase = createServerClient()
  
  // Use atomic increment to prevent race conditions
  const { error } = await supabase.rpc('increment_user_credits', { user_id: userId })
  
  if (error) {
    console.error('Failed to increment credits:', error)
    return false
  }
  
  return true
}

export async function hasCreditsAvailable(userId: string): Promise<boolean> {
  const credits = await getUserCredits(userId)
  if (!credits) return false
  
  return credits.credits_used < credits.credits_limit
}

export async function updateCreditLimit(userId: string, newLimit: number): Promise<boolean> {
  const supabase = createServerClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ credits_limit: newLimit })
    .eq('id', userId)

  return !error
}

export async function resetUserCredits(userId: string): Promise<boolean> {
  const supabase = createServerClient()
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      credits_used: 0,
      credits_reset_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    })
    .eq('id', userId)

  return !error
}
