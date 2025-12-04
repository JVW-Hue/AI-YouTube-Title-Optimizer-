import OpenAI from 'openai'
import { TitleRequest, TitleResponse, GeneratedTitle, TitleStyle } from '@/types'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'demo-key',
})

const SYSTEM_PROMPT = `You generate SHORT, HIGH-CTR, CLEAR YouTube titles.

# TITLE LENGTH RULES (CRITICAL):
- Maximum: 45-55 characters
- Never exceed 60 characters
- Prefer 6-10 words
- Remove filler: "the", "very", "really", "actually", "literally"

# CORE FORMULA (Every Title Must Have):

1. CURIOSITY
Use: "secret", "truth", "nobody tells you", "exposed", "I tried", "this mistake"

2. SPECIFICITY
Include: money amounts, time frames, quantities, measurable results
Example: "Made $347 in 1 Day With This Method"

3. CLARITY
Topic must be instantly understood. Never vague.
✅ "I Tried Dropshipping for 7 Days"
❌ "This Was Crazy…"

# APPROVED STRUCTURES (Pick 1):

A. Result + Time: "Made $1,000 in 48 Hours With This"
B. Challenge: "I Tried TikTok Ads for 7 Days"
C. Secret: "The Secret to Growing on YouTube Fast"
D. Mistake: "New Creators: Stop Doing This"
E. Truth: "The Truth About Dropshipping in 2025"
F. Before→After: "From $0 to $2,500 in 30 Days"
G. Call-Out: "Beginners: Use This AI Tool"

# EMOTIONAL TRIGGERS (Pick 1):
- Surprise: "I can't believe this worked"
- Fear: "Don't do this mistake"
- Hope: "This changed everything"
- Curiosity: "Nobody talks about this"
- Shock: "The results shocked me"
- Money: "How I made"

# KEYWORD RULE:
Include ONE short keyword only (e.g., "YouTube growth", "AI tools", "Dropshipping")

# AVOID:
- Titles over 60 characters
- ALL CAPS
- Clickbait lies
- Too many numbers
- "Must Watch", "Ultimate Guide"

# FINAL CHECKLIST:
✔ Under 55 characters?
✔ Uses curiosity?
✔ Instantly clear?
✔ 1 keyword max?
✔ Triggers emotion?
✔ Follows approved structure?
✔ Sounds human?

Output ONLY valid JSON:
{
  "titles": [{"title": "45-55 char title", "style": "curiosity", "ctr_score": 85}],
  "thumbnail_texts": ["$0→$2,918", "SHOCKED", "Day 30", "Watch"],
  "keywords": ["keyword1", "keyword2"]
}`

export async function generateTitles(request: TitleRequest): Promise<TitleResponse> {
  const { topic, styles = ['clickbait', 'curiosity', 'seo'], includeEmojis = false, niche = 'general' } = request

  // If no API key, return fallback
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'demo-key') {
    console.log('Using fallback titles (no OpenAI API key)')
    return generateFallbackResponse(topic, styles, includeEmojis)
  }

  const userPrompt = `Topic: "${topic}"
Niche: ${niche}
Target Audience: ${request.targetAudience || 'general viewers'}

Generate 10 title variations following ALL rules:

CRITICAL:
- Each title: 45-55 characters MAX (never exceed 60)
- 6-10 words only
- Use approved structures (Result+Time, Challenge, Secret, Mistake, Truth, Before→After, Call-Out)
- Include specificity: numbers, timeframes, dollar amounts
- Pick ONE emotional trigger per title
- Include ONE keyword max per title
- Sound human and conversational
- NO emojis
- NO filler words

Also generate:
- 4 thumbnail texts (3-8 characters each, punchy)
- 3 relevant keywords`

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.8,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    })

    const response = completion.choices[0]?.message?.content
    if (!response) throw new Error('No response from AI')

    const parsed = JSON.parse(response) as TitleResponse
    
    // Ensure CTR scores
    parsed.titles = parsed.titles.map(title => ({
      ...title,
      ctr_score: title.ctr_score || Math.floor(Math.random() * 30) + 70
    }))

    return parsed
  } catch (error) {
    console.error('AI generation error:', error)
    return generateFallbackResponse(topic, styles, includeEmojis)
  }
}

function generateFallbackResponse(topic: string, styles: TitleStyle[], includeEmojis: boolean): TitleResponse {
  const shortTopic = topic.length > 15 ? topic.split(' ').slice(0, 2).join(' ') : topic
  
  const titles: GeneratedTitle[] = [
    // Structure A: Result + Time
    { title: `Made $847 in 7 Days With ${shortTopic}`, style: 'clickbait', ctr_score: 89 },
    // Structure F: Before→After
    { title: `${shortTopic}: $0 to $2,400 in 30 Days`, style: 'trending', ctr_score: 87 },
    // Structure B: Challenge
    { title: `I Tried ${shortTopic} for 7 Days`, style: 'curiosity', ctr_score: 85 },
    // Structure E: Truth
    { title: `The Truth About ${shortTopic}`, style: 'curiosity', ctr_score: 83 },
    // Structure D: Mistake
    { title: `Stop Doing This ${shortTopic} Mistake`, style: 'emotional', ctr_score: 86 },
    // Structure C: Secret
    { title: `The ${shortTopic} Secret Nobody Shares`, style: 'curiosity', ctr_score: 88 },
    // Structure D: Warning
    { title: `Before You Try ${shortTopic}, Watch This`, style: 'emotional', ctr_score: 84 },
    // Structure A: Result + Time
    { title: `Built ${shortTopic} in 24 Hours`, style: 'trending', ctr_score: 82 },
    // Structure B: Challenge
    { title: `${shortTopic} Results After 90 Days`, style: 'emotional', ctr_score: 81 },
    // Structure G: Call-Out
    { title: `Beginners: Use This ${shortTopic} Method`, style: 'listicle', ctr_score: 79 }
  ]
  
  return {
    titles: titles.slice(0, 10),
    thumbnail_texts: ['$0→$2.9K', 'SHOCKED', 'Day 30', 'Watch'],
    keywords: extractKeywords(topic).slice(0, 3),
    trending_formats: ['Result + Time', 'Challenge', 'Secret']
  }
}

function extractKeywords(topic: string): string[] {
  const words = topic.toLowerCase().split(' ')
  const keywords = words.filter(word => word.length > 3).slice(0, 3)
  return keywords.length > 0 ? keywords : [topic.toLowerCase()]
}
