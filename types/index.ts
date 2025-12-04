export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: 'free' | 'pro' | 'creator' | 'agency'
  stripe_customer_id?: string
  subscription_status: string
  credits_used: number
  credits_limit: number
  created_at: string
  updated_at: string
}

export interface TitleGeneration {
  id: string
  user_id: string
  input_topic: string
  generated_titles: GeneratedTitle[]
  thumbnail_texts?: string[]
  style_preferences?: string[]
  ctr_scores?: { [key: string]: number }
  created_at: string
}

export interface GeneratedTitle {
  title: string
  style: TitleStyle
  ctr_score?: number
  keywords?: string[]
}

export interface SavedTitle {
  id: string
  user_id: string
  title: string
  thumbnail_text?: string
  topic: string
  style: string
  ctr_score?: number
  is_favorite: boolean
  created_at: string
}

export type TitleStyle = 
  | 'clickbait'
  | 'curiosity'
  | 'seo'
  | 'minimalistic'
  | 'emotional'
  | 'trending'
  | 'listicle'
  | 'question'

export interface TitleRequest {
  topic: string
  styles?: TitleStyle[]
  includeEmojis?: boolean
  targetAudience?: string
  niche?: string
}

export interface TitleResponse {
  titles: GeneratedTitle[]
  thumbnail_texts: string[]
  keywords: string[]
  trending_formats: string[]
}

export interface PlanFeatures {
  name: string
  price: number
  credits: number
  features: string[]
  popular?: boolean
}

export interface AnalyticsEvent {
  action: string
  metadata?: Record<string, any>
}