'use client'

import { useState } from 'react'
import { Copy, Trash2, Heart, Search, Filter } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { SavedTitle } from '@/types'

interface SavedTitlesViewProps {
  savedTitles: SavedTitle[]
  onUpdate?: (titles: SavedTitle[]) => void
}

export default function SavedTitlesView({ savedTitles: initialTitles, onUpdate }: SavedTitlesViewProps) {
  const [titles, setTitles] = useState(initialTitles)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStyle, setFilterStyle] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const deleteTitle = async (id: string) => {
    try {
      const response = await fetch(`/api/save-title?id=${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const newTitles = titles.filter(title => title.id !== id)
        setTitles(newTitles)
        onUpdate?.(newTitles)
        toast.success('Title deleted')
      } else {
        throw new Error('Failed to delete title')
      }
    } catch (error) {
      toast.error('Failed to delete title')
    }
  }

  const toggleFavorite = async (id: string) => {
    try {
      const title = titles.find(t => t.id === id)
      if (!title) return

      const response = await fetch(`/api/save-title?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_favorite: !title.is_favorite })
      })

      if (response.ok) {
        const newTitles = titles.map(t => 
          t.id === id ? { ...t, is_favorite: !t.is_favorite } : t
        )
        setTitles(newTitles)
        onUpdate?.(newTitles)
        toast.success(title.is_favorite ? 'Removed from favorites' : 'Added to favorites')
      } else {
        throw new Error('Failed to update favorite')
      }
    } catch (error) {
      toast.error('Failed to update favorite')
    }
  }

  // Filter and sort titles
  const filteredTitles = titles
    .filter(title => {
      const matchesSearch = title.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           title.topic.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStyle === 'all' || title.style === filterStyle
      return matchesSearch && matchesFilter
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'oldest':
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        case 'ctr':
          return (b.ctr_score || 0) - (a.ctr_score || 0)
        case 'favorites':
          return b.is_favorite === a.is_favorite ? 0 : b.is_favorite ? 1 : -1
        default:
          return 0
      }
    })

  const uniqueStyles = Array.from(new Set(titles.map(t => t.style)))

  if (titles.length === 0) {
    return (
      <div className="card text-center py-16">
        <Heart className="h-16 w-16 text-gold mx-auto mb-4 opacity-50" />
        <h3 className="text-2xl font-bold text-white mb-3">No saved titles yet</h3>
        <p className="text-gray-400 mb-8 text-lg">
          Start generating titles and save your favorites to see them here
        </p>
        <a href="/dashboard" className="btn-primary inline-block">
          Generate Titles Now
        </a>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search titles or topics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterStyle}
              onChange={(e) => setFilterStyle(e.target.value)}
              className="input-field text-sm"
            >
              <option value="all">All Styles</option>
              {uniqueStyles.map(style => (
                <option key={style} value={style} className="capitalize">
                  {style}
                </option>
              ))}
            </select>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="ctr">Highest CTR</option>
              <option value="favorites">Favorites First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-400">
        Showing {filteredTitles.length} of {titles.length} saved titles
      </div>

      {/* Titles Grid */}
      <div className="space-y-4">
        {filteredTitles.map((title) => (
          <div key={title.id} className="card hover:shadow-xl transition-all hover:scale-[1.01]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white text-lg mb-3 leading-relaxed">
                  {title.title}
                </h3>
                
                <div className="flex items-center flex-wrap gap-2 text-sm mb-3">
                  <span className="bg-gold/20 text-gold px-3 py-1 rounded-full capitalize font-medium">
                    {title.style}
                  </span>
                  {title.ctr_score && (
                    <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full font-medium">
                      CTR: {title.ctr_score}%
                    </span>
                  )}
                  <span className="text-gray-400">
                    {new Date(title.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400">
                  Topic: <span className="text-gray-300">{title.topic}</span>
                </p>
                
                {title.thumbnail_text && (
                  <p className="text-sm text-gray-400 mt-1">
                    Thumbnail: <span className="text-gray-300">"{title.thumbnail_text}"</span>
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleFavorite(title.id)}
                  className={`p-2 rounded-lg transition-all ${
                    title.is_favorite 
                      ? 'text-red-500 hover:bg-red-500/10' 
                      : 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                  }`}
                  title={title.is_favorite ? 'Remove from favorites' : 'Add to favorites'}
                >
                  <Heart className={`h-5 w-5 ${title.is_favorite ? 'fill-current' : ''}`} />
                </button>
                
                <button
                  onClick={() => copyToClipboard(title.title)}
                  className="p-2 rounded-lg text-gray-400 hover:text-gold hover:bg-gold/10 transition-all"
                  title="Copy title"
                >
                  <Copy className="h-5 w-5" />
                </button>
                
                <button
                  onClick={() => deleteTitle(title.id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all"
                  title="Delete title"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTitles.length === 0 && searchTerm && (
        <div className="card text-center py-12">
          <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No titles found</h3>
          <p className="text-gray-400">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  )
}