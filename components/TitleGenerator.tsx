'use client'

import { useState, useEffect } from 'react'
import { Wand2, Copy, Heart, Download, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { TitleRequest, TitleResponse, TitleStyle } from '@/types'

const TITLE_STYLES: { value: TitleStyle; label: string; description: string }[] = [
  { value: 'clickbait', label: 'Clickbait', description: 'Attention-grabbing titles' },
  { value: 'curiosity', label: 'Curiosity', description: 'Mystery-driven titles' },
  { value: 'seo', label: 'SEO', description: 'Search-optimized titles' },
  { value: 'emotional', label: 'Emotional', description: 'Emotionally compelling' },
  { value: 'trending', label: 'Trending', description: 'Viral format titles' },
  { value: 'listicle', label: 'Listicle', description: 'Numbered list titles' },
]

interface TitleGeneratorProps {
  userCredits: number
  userPlan: string
}

export default function TitleGenerator({ userCredits, userPlan }: TitleGeneratorProps) {
  const [topic, setTopic] = useState('')
  const [selectedStyles, setSelectedStyles] = useState<TitleStyle[]>(['clickbait', 'curiosity', 'seo'])
  const [includeEmojis, setIncludeEmojis] = useState(false)
  const [niche, setNiche] = useState('general')
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState<TitleResponse | null>(null)

  // Load saved results from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lastGeneratedTitles')
    if (saved) {
      const data = JSON.parse(saved)
      setResults(data.results)
      setTopic(data.topic || '')
    }
  }, [])

  // Save results to localStorage whenever they change
  useEffect(() => {
    if (results) {
      localStorage.setItem('lastGeneratedTitles', JSON.stringify({ results, topic }))
    }
  }, [results, topic])

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a video topic')
      return
    }

    if (userPlan === 'free' && userCredits <= 0) {
      toast.error('You\'ve reached your daily limit. Upgrade to continue!')
      return
    }

    setIsGenerating(true)
    
    try {
      const request: TitleRequest = {
        topic: topic.trim(),
        styles: selectedStyles,
        includeEmojis,
        niche
      }

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to generate titles')
      }

      const data: TitleResponse = await response.json()
      setResults(data)
      toast.success('Titles generated successfully!')
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
    } catch (error) {
      console.error('Generation error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to generate titles')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const saveTitle = async (title: string, style: string, ctrScore?: number) => {
    try {
      const response = await fetch('/api/save-title', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          topic,
          style,
          ctr_score: ctrScore
        })
      })

      if (response.ok) {
        toast.success('Title saved!')
      } else {
        throw new Error('Failed to save title')
      }
    } catch (error) {
      toast.error('Failed to save title')
    }
  }

  const toggleStyle = (style: TitleStyle) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    )
  }

  const clearResults = () => {
    setResults(null)
    localStorage.removeItem('lastGeneratedTitles')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="card">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gold">
          <Sparkles className="h-6 w-6 mr-2 animate-pulse" />
          Generate YouTube Titles
        </h2>
        
        <div className="space-y-6">
          {/* Topic Input */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Topic or Description
            </label>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., I tried eating only McDonald's for 30 days"
              className="input-field h-24 resize-none"
              maxLength={500}
            />
            <p className="text-sm text-gray-400 mt-1">
              {topic.length}/500 characters
            </p>
          </div>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Title Styles (select 1-3)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {TITLE_STYLES.map((style) => (
                <button
                  key={style.value}
                  onClick={() => toggleStyle(style.value)}
                  className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                    selectedStyles.includes(style.value)
                      ? 'border-gold bg-gold/10 text-gold shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                      : 'border-gold/20 hover:border-gold/50 text-gray-300 hover:bg-gold/5'
                  }`}
                >
                  <div className="font-medium">{style.label}</div>
                  <div className="text-xs text-gray-400">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={includeEmojis}
                onChange={(e) => setIncludeEmojis(e.target.checked)}
                className="mr-2 w-4 h-4 accent-gold"
              />
              Include emojis
            </label>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-300">Niche:</label>
              <select
                value={niche}
                onChange={(e) => setNiche(e.target.value)}
                className="bg-medium-gray border border-gold/30 rounded px-3 py-1 text-sm text-gray-100 focus:border-gold outline-none transition-all"
              >
                <option value="general">General</option>
                <option value="tech">Tech</option>
                <option value="gaming">Gaming</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="education">Education</option>
                <option value="entertainment">Entertainment</option>
                <option value="business">Business</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim() || selectedStyles.length === 0}
            className="btn-primary w-full py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-marble-black mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5 mr-2" />
                Generate Titles
              </>
            )}
          </button>

          {userPlan === 'free' && (
            <p className="text-sm text-gray-400 text-center">
              <span className="text-gold font-bold">{userCredits}</span> credits remaining today
            </p>
          )}
        </div>
      </div>

      {/* Results Section */}
      {results && (
        <div className="space-y-6">
          {/* New Titles Button */}
          <div className="flex justify-center">
            <button
              onClick={clearResults}
              className="btn-secondary flex items-center px-6 py-3"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              New Titles
            </button>
          </div>
          {/* Generated Titles */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-gold">Generated Titles</h3>
            <div className="space-y-3">
              {results.titles.map((titleObj, index) => (
                <div key={index} className="p-4 bg-medium-gray border border-gold/20 rounded-lg hover:border-gold transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-gray-100 mb-2">{titleObj.title}</p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="bg-gold/20 text-gold px-2 py-1 rounded capitalize border border-gold/30">
                          {titleObj.style}
                        </span>
                        {titleObj.ctr_score && (
                          <span className="bg-gold/30 text-gold px-2 py-1 rounded border border-gold/50">
                            CTR: {titleObj.ctr_score}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => copyToClipboard(titleObj.title)}
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                        title="Copy title"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => saveTitle(titleObj.title, titleObj.style, titleObj.ctr_score)}
                        className="p-2 text-gray-400 hover:text-gold transition-colors"
                        title="Save title"
                      >
                        <Heart className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Texts */}
          {results.thumbnail_texts && results.thumbnail_texts.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gold">Thumbnail Text Ideas</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {results.thumbnail_texts.map((text, index) => (
                  <button
                    key={index}
                    onClick={() => copyToClipboard(text)}
                    className="p-3 bg-medium-gray border border-gold/20 rounded-lg hover:border-gold transition-all duration-300 text-center font-medium text-gray-100 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Keywords */}
          {results.keywords && results.keywords.length > 0 && (
            <div className="card">
              <h3 className="text-xl font-semibold mb-4 text-gold">SEO Keywords</h3>
              <div className="flex flex-wrap gap-2">
                {results.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-gold/20 text-gold px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gold/30 transition-all border border-gold/30 hover:shadow-[0_0_10px_rgba(255,215,0,0.3)]"
                    onClick={() => copyToClipboard(keyword)}
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Export Options */}
          <div className="card">
            <h3 className="text-xl font-semibold mb-4 text-gold">Export Options</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => {
                  const allTitles = results.titles.map(t => t.title).join('\n')
                  copyToClipboard(allTitles)
                }}
                className="btn-secondary flex items-center"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy All Titles
              </button>
              <button
                onClick={() => {
                  const content = `Video Topic: ${topic}\n\nGenerated Titles:\n${results.titles.map((t, i) => `${i + 1}. ${t.title} (${t.style})`).join('\n')}\n\nThumbnail Texts:\n${results.thumbnail_texts?.join(', ')}\n\nKeywords:\n${results.keywords?.join(', ')}`
                  const blob = new Blob([content], { type: 'text/plain' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `youtube-titles-${Date.now()}.txt`
                  a.click()
                  URL.revokeObjectURL(url)
                }}
                className="btn-secondary flex items-center"
              >
                <Download className="h-4 w-4 mr-2" />
                Download as TXT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
