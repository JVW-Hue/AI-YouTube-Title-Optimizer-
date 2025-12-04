# 🏆 AI YouTube Title Optimizer - Complete Implementation Guide

## Architecture Overview

**Tech Stack:**
- Frontend: Next.js 14 (React, TypeScript, Tailwind CSS)
- Backend: Next.js API Routes (Serverless)
- Database: PostgreSQL (Supabase or direct)
- Auth: Cookie-based sessions (upgradeable to Supabase Auth)
- AI: OpenAI GPT-4o/GPT-4o-mini
- Payments: Stripe Billing
- Hosting: Vercel
- Monitoring: Sentry + Custom Analytics

## MVP Features

1. ✅ Email/Password Authentication
2. ✅ Title Generation (topic-based)
3. ✅ Multiple Style Variants (clickbait, curiosity, SEO, emotional, trending, listicle)
4. ✅ Thumbnail Text Generator
5. ✅ Keyword Extraction
6. ✅ Save Favorites
7. ✅ Usage Limits & Free Tier
8. ⏳ Stripe Integration (ready for implementation)
9. ⏳ Admin Dashboard

## Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  plan TEXT DEFAULT 'free', -- 'free' | 'pro' | 'creator' | 'agency'
  credits_limit INTEGER DEFAULT 5,
  credits_used INTEGER DEFAULT 0,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Projects table (optional organization)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Title generation requests
CREATE TABLE title_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id),
  input_type TEXT NOT NULL, -- 'topic' | 'script' | 'competitor'
  input_text TEXT NOT NULL,
  style_preferences JSONB,
  response JSONB NOT NULL, -- Full AI response
  chosen_title TEXT,
  model_used TEXT DEFAULT 'gpt-4o-mini',
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Saved favorites
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  thumbnail_text TEXT,
  topic TEXT,
  style TEXT,
  ctr_score INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B tests (future feature)
CREATE TABLE ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title_a TEXT NOT NULL,
  title_b TEXT NOT NULL,
  video_id TEXT,
  winner TEXT, -- 'a' | 'b' | null
  ctr_a NUMERIC(5,2),
  ctr_b NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Usage analytics
CREATE TABLE usage_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- 'title_generated' | 'favorite_saved' | 'export'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_title_requests_user_id ON title_requests(user_id);
CREATE INDEX idx_title_requests_created_at ON title_requests(created_at DESC);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_usage_analytics_user_id ON usage_analytics(user_id);
CREATE INDEX idx_usage_analytics_created_at ON usage_analytics(created_at DESC);
```

## AI Prompt Engineering

### System Prompt (Fixed)

```typescript
const SYSTEM_PROMPT = `You are an expert YouTube title copywriter with deep knowledge of viral content psychology, SEO optimization, and audience engagement strategies.

Your task is to generate compelling YouTube titles that maximize click-through rates (CTR) while maintaining authenticity and avoiding misleading clickbait.

Output Format: Return ONLY valid JSON with this exact structure:
{
  "titles": [
    {
      "text": "Title text under 90 characters",
      "variant": "curiosity|seo|emotional|clickbait|trending|listicle",
      "score": 75,
      "reasoning": "Brief explanation of why this works"
    }
  ],
  "thumbnail_texts": ["Short text 1", "Short text 2", "Short text 3"],
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "metadata": {
    "primary_emotion": "curiosity|excitement|fear|surprise",
    "target_audience": "general|niche-specific",
    "optimal_posting_time": "suggestion"
  }
}

Rules:
- Titles must be under 90 characters
- Avoid explicit misinformation or deceptive claims
- Use power words strategically
- Include numbers when relevant
- Create curiosity gaps without being misleading
- Optimize for both human readers and YouTube's algorithm
- Consider mobile display (first 40 chars are critical)
- Balance emotion with credibility`;
```

### User Prompt Template

```typescript
interface TitleGenerationRequest {
  inputType: 'topic' | 'script' | 'competitor';
  inputText: string;
  n: number; // number of titles to generate
  stylePref: 'curiosity' | 'seo' | 'emotional' | 'clickbait' | 'trending' | 'listicle' | 'mixed';
  niche: 'technology' | 'gaming' | 'health' | 'finance' | 'lifestyle' | 'education' | 'entertainment' | 'general';
  language: string; // 'en', 'es', etc.
  tone: 'casual' | 'urgent' | 'professional' | 'humorous';
  includeEmojis: boolean;
  targetAudience?: string;
}

function buildUserPrompt(req: TitleGenerationRequest): string {
  return `Generate ${req.n} YouTube titles based on the following:

Input Type: ${req.inputType}
Content: "${req.inputText}"

Requirements:
- Style Preference: ${req.stylePref}
- Niche: ${req.niche}
- Tone: ${req.tone}
- Language: ${req.language}
- Include Emojis: ${req.includeEmojis ? 'Yes' : 'No'}
${req.targetAudience ? `- Target Audience: ${req.targetAudience}` : ''}

Generate diverse title variations that would perform well for this content. Include CTR score predictions (0-100) based on title psychology and best practices.

Also provide:
- 3-4 thumbnail text suggestions (2-4 words each)
- 5-8 relevant SEO keywords
- Metadata about the content strategy

Return ONLY the JSON object, no additional text.`;
}
```

### Few-Shot Examples (Embedded in System)

```typescript
const FEW_SHOT_EXAMPLES = `
Example 1 - Health/Lifestyle:
Input: "I quit sugar for 30 days"
Output: {
  "titles": [
    {"text": "I Quit Sugar for 30 Days — Here's What Happened to My Body", "variant": "curiosity", "score": 82},
    {"text": "30-Day No Sugar Challenge: Shocking Results (Before & After)", "variant": "emotional", "score": 78},
    {"text": "What Happens When You Stop Eating Sugar for a Month", "variant": "seo", "score": 75}
  ],
  "thumbnail_texts": ["Day 1 vs Day 30", "No Sugar", "Shocking Results"],
  "keywords": ["quit sugar", "30 day challenge", "sugar detox", "health transformation"]
}

Example 2 - Technology:
Input: "Review of the new iPhone 15 Pro"
Output: {
  "titles": [
    {"text": "iPhone 15 Pro Review: The ONE Feature Apple Didn't Tell You About", "variant": "curiosity", "score": 85},
    {"text": "iPhone 15 Pro - Brutally Honest Review After 2 Weeks", "variant": "emotional", "score": 80},
    {"text": "iPhone 15 Pro Complete Review: Camera, Battery, Performance Test", "variant": "seo", "score": 73}
  ],
  "thumbnail_texts": ["Worth It?", "Hidden Feature", "2 Week Review"],
  "keywords": ["iPhone 15 Pro review", "iPhone 15 Pro camera", "should you upgrade"]
}

Example 3 - Gaming:
Input: "Tips for winning in Fortnite"
Output: {
  "titles": [
    {"text": "This ONE Trick Got Me 20 Wins in a Row (Fortnite Season 5)", "variant": "clickbait", "score": 88},
    {"text": "Top 10 Fortnite Tips Pro Players Don't Want You to Know", "variant": "listicle", "score": 81},
    {"text": "How to Win Every Fortnite Match: Advanced Strategy Guide", "variant": "seo", "score": 76}
  ],
  "thumbnail_texts": ["20 Wins", "Pro Tips", "Secret Strategy"],
  "keywords": ["fortnite tips", "how to win fortnite", "fortnite strategy", "fortnite season 5"]
}`;
```

## API Implementation

### Complete Generate Title Endpoint

```typescript
// app/api/generate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

const SYSTEM_PROMPT = `You are an expert YouTube title copywriter...` // Full prompt from above

export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const userSession = cookies().get('user_session')
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userSession.value)

    // 2. Check rate limits
    if (user.plan === 'free' && user.credits_used >= user.credits_limit) {
      return NextResponse.json({ 
        error: 'Credit limit reached. Please upgrade your plan.' 
      }, { status: 403 })
    }

    // 3. Parse and validate request
    const body = await request.json()
    const {
      inputType = 'topic',
      inputText,
      n = 10,
      stylePref = 'mixed',
      niche = 'general',
      language = 'en',
      tone = 'casual',
      includeEmojis = false,
      targetAudience
    } = body

    if (!inputText || inputText.trim().length === 0) {
      return NextResponse.json({ error: 'Input text is required' }, { status: 400 })
    }

    if (inputText.length > 2000) {
      return NextResponse.json({ error: 'Input text too long (max 2000 chars)' }, { status: 400 })
    }

    // 4. Build user prompt
    const userPrompt = `Generate ${n} YouTube titles based on the following:

Input Type: ${inputType}
Content: "${inputText}"

Requirements:
- Style Preference: ${stylePref}
- Niche: ${niche}
- Tone: ${tone}
- Language: ${language}
- Include Emojis: ${includeEmojis ? 'Yes' : 'No'}
${targetAudience ? `- Target Audience: ${targetAudience}` : ''}

Generate diverse title variations that would perform well for this content. Include CTR score predictions (0-100).

Also provide:
- 3-4 thumbnail text suggestions (2-4 words each)
- 5-8 relevant SEO keywords
- Metadata about the content strategy

Return ONLY the JSON object, no additional text.`

    // 5. Call OpenAI API
    const startTime = Date.now()
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.3,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const responseTime = Date.now() - startTime
    const aiResponse = completion.choices[0]?.message?.content || '{}'
    
    // 6. Parse AI response
    let parsedResponse
    try {
      parsedResponse = JSON.parse(aiResponse)
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      return NextResponse.json({ 
        error: 'Failed to generate valid titles. Please try again.' 
      }, { status: 500 })
    }

    // 7. Calculate cost (approximate)
    const tokensIn = completion.usage?.prompt_tokens || 0
    const tokensOut = completion.usage?.completion_tokens || 0
    const costUsd = (tokensIn * 0.00015 + tokensOut * 0.0006) / 1000 // GPT-4o-mini pricing

    // 8. Format response
    const formattedResponse = {
      titles: parsedResponse.titles || [],
      thumbnail_texts: parsedResponse.thumbnail_texts || [],
      keywords: parsedResponse.keywords || [],
      metadata: {
        ...parsedResponse.metadata,
        model: 'gpt-4o-mini',
        tokensUsed: tokensIn + tokensOut,
        costUsd: costUsd.toFixed(6),
        responseTime: `${responseTime}ms`
      }
    }

    // 9. Update user credits
    user.credits_used += 1
    cookies().set('user_session', JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7
    })

    // 10. Log to analytics (in production, save to DB)
    console.log(`[ANALYTICS] User ${user.id} generated ${formattedResponse.titles.length} titles. Cost: $${costUsd.toFixed(6)}`)

    return NextResponse.json(formattedResponse)

  } catch (error) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate titles. Please try again.' },
      { status: 500 }
    )
  }
}
```

## Rate Limiting Implementation

```typescript
// lib/rate-limiter.ts
import { cookies } from 'next/headers'

interface RateLimitConfig {
  free: { limit: number; window: number }
  pro: { limit: number; window: number }
  creator: { limit: number; window: number }
}

const RATE_LIMITS: RateLimitConfig = {
  free: { limit: 5, window: 86400 }, // 5 per day
  pro: { limit: 1000, window: 86400 }, // 1000 per day
  creator: { limit: 10000, window: 86400 } // 10000 per day
}

export function checkRateLimit(user: any): { allowed: boolean; remaining: number } {
  const plan = user.plan || 'free'
  const config = RATE_LIMITS[plan as keyof RateLimitConfig]
  
  const remaining = config.limit - user.credits_used
  
  return {
    allowed: remaining > 0,
    remaining: Math.max(0, remaining)
  }
}

export function resetDailyCredits() {
  // This should be called by a cron job daily
  // In production: UPDATE users SET credits_used = 0 WHERE plan = 'free'
  console.log('Daily credits reset')
}
```

## Stripe Integration

```typescript
// app/api/stripe/create-checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  try {
    const userSession = cookies().get('user_session')
    if (!userSession) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = JSON.parse(userSession.value)
    const { priceId } = await request.json()

    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
      metadata: { userId: user.id }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
```

```typescript
// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
})

export async function POST(request: NextRequest) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session
      // Update user plan in database
      console.log('Subscription created:', session.customer)
      break

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription
      // Update user subscription status
      console.log('Subscription updated:', subscription.id)
      break

    case 'customer.subscription.deleted':
      const deletedSub = event.data.object as Stripe.Subscription
      // Downgrade user to free plan
      console.log('Subscription canceled:', deletedSub.id)
      break

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}
```

## Cost Optimization Strategies

1. **Caching**: Cache identical prompts for 24 hours
2. **Token Limits**: Use `max_tokens` to control costs
3. **Model Selection**: Use GPT-4o-mini for most requests, GPT-4o for premium features
4. **Batch Processing**: Offer bulk generation at discounted rates
5. **Rate Limiting**: Prevent abuse with strict rate limits

```typescript
// lib/cache.ts
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

export function getCached(key: string): any | null {
  const cached = cache.get(key)
  if (!cached) return null
  
  if (Date.now() - cached.timestamp > CACHE_TTL) {
    cache.delete(key)
    return null
  }
  
  return cached.data
}

export function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export function generateCacheKey(input: any): string {
  return JSON.stringify(input)
}
```

## Testing Strategy

```typescript
// __tests__/api/generate.test.ts
import { POST } from '@/app/api/generate/route'
import { NextRequest } from 'next/server'

describe('Title Generation API', () => {
  it('should generate titles successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({
        inputText: 'How to learn programming',
        inputType: 'topic',
        n: 5
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.titles).toHaveLength(5)
    expect(data.thumbnail_texts).toBeDefined()
    expect(data.keywords).toBeDefined()
  })

  it('should reject unauthorized requests', async () => {
    // Test without auth cookie
    const request = new NextRequest('http://localhost:3000/api/generate', {
      method: 'POST',
      body: JSON.stringify({ inputText: 'test' })
    })

    const response = await POST(request)
    expect(response.status).toBe(401)
  })

  it('should enforce rate limits', async () => {
    // Test exceeding free tier limits
    // Mock user with credits_used >= credits_limit
  })
})
```

## Deployment Checklist

- [ ] Set environment variables in Vercel
- [ ] Configure Stripe webhooks
- [ ] Set up database (PostgreSQL)
- [ ] Run database migrations
- [ ] Configure domain and SSL
- [ ] Set up error monitoring (Sentry)
- [ ] Configure analytics
- [ ] Test payment flow end-to-end
- [ ] Set up backup strategy
- [ ] Configure rate limiting
- [ ] Test AI generation with various inputs
- [ ] Set up monitoring dashboards

## Environment Variables

```bash
# .env.local
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://...
NODE_ENV=development
```

## Monitoring & Analytics

```typescript
// lib/analytics.ts
export function trackEvent(event: string, properties: Record<string, any>) {
  // Send to analytics service
  console.log('[ANALYTICS]', event, properties)
  
  // In production, send to:
  // - Google Analytics
  // - Mixpanel
  // - PostHog
  // - Custom analytics DB
}

export function trackError(error: Error, context: Record<string, any>) {
  // Send to Sentry
  console.error('[ERROR]', error, context)
}

export function trackCost(userId: string, cost: number, metadata: Record<string, any>) {
  // Track AI costs per user
  console.log('[COST]', { userId, cost, metadata })
}
```

## Future Roadmap

### Phase 1 (MVP) ✅
- Basic title generation
- Authentication
- Rate limiting
- Save favorites

### Phase 2 (Q1 2024)
- Stripe integration
- A/B testing
- Bulk generation
- Export to CSV/PDF

### Phase 3 (Q2 2024)
- ML-based CTR prediction
- YouTube API integration
- Team workspaces
- API access for developers

### Phase 4 (Q3 2024)
- Multi-language support
- Thumbnail generation (AI images)
- Advanced analytics dashboard
- White-label solution

## Support & Documentation

- User Guide: `/docs/user-guide.md`
- API Documentation: `/docs/api.md`
- Troubleshooting: `/docs/troubleshooting.md`
- FAQ: `/docs/faq.md`

---

**Built with ❤️ for the YouTube creator community**
