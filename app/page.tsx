'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Zap, Target, TrendingUp, Star, Check, ArrowRight, Rocket, Brain, BarChart3, Users, Award, Clock, Shield, Lightbulb, Video, FileText } from 'lucide-react'

const DYNAMIC_WORDS = ['Viral', 'Engaging', 'Clickable', 'Trending', 'Powerful', 'Optimized', 'Winning', 'Magnetic']

export default function HomePage() {
  const [currentWord, setCurrentWord] = useState(DYNAMIC_WORDS[0])
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % DYNAMIC_WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    setCurrentWord(DYNAMIC_WORDS[wordIndex])
  }, [wordIndex])

  return (
    <div className="min-h-screen bg-marble-bg text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-float" style={{
            width: `${Math.random() * 100 + 50}px`,
            height: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            animationDuration: `${Math.random() * 30 + 20}s`,
            animationDelay: `${Math.random() * 10}s`,
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.15) 0%, rgba(255, 215, 0, 0) 70%)',
          }} />
        ))}
      </div>

      {/* Header */}
      <header className="fixed w-full z-50 bg-marble-black/90 backdrop-blur-lg border-b border-gold/30">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold-glow-strong animate-pulse-gold relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gold-shine animate-shine-move" />
                <span className="text-marble-black font-bold text-xl relative z-10">J</span>
              </div>
              <span className="text-2xl font-extrabold gold-text animate-text-shimmer">AI Title Optimizer</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-gold transition-all duration-300 relative group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#FFD700]" />
              </a>
              <a href="#features" className="text-gray-300 hover:text-gold transition-all duration-300 relative group">
                Features
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#FFD700]" />
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-gold transition-all duration-300 relative group">
                Pricing
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold-gradient group-hover:w-full transition-all duration-300 shadow-[0_0_8px_#FFD700]" />
              </a>
            </nav>
            <Link href="/auth/login" className="btn-primary px-6 py-2 text-sm">Get Started</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="pt-32 pb-12 relative">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gold/10 border border-gold/30 text-gold text-sm font-medium mb-6 shadow-gold-glow">
            <Sparkles className="h-4 w-4 mr-2 animate-pulse" />
            AI-Powered Title Generation
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Generate <span className="gold-text animate-title-glow inline-block transition-all duration-500 ease-in-out" key={currentWord}>{currentWord}</span> YouTube Titles
          </h1>
          <p className="text-lg text-gray-300 mb-6 max-w-3xl mx-auto">Stop wasting hours brainstorming. Our AI creates high-CTR titles that get more clicks and views.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
            <Link href="/auth/login" className="btn-primary inline-flex items-center px-8 py-3">
              <Rocket className="mr-2 h-5 w-5" />Start Free<ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <a href="#features" className="btn-secondary inline-flex items-center px-8 py-3">
              <Brain className="mr-2 h-5 w-5" />How It Works
            </a>
          </div>
          <p className="text-sm text-gray-400 mb-8">✨ 5 free titles daily • No credit card</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, value: '10K+', label: 'Creators' },
              { icon: Sparkles, value: '500K+', label: 'Titles' },
              { icon: TrendingUp, value: '40%', label: 'CTR Boost' },
              { icon: Star, value: '4.9/5', label: 'Rating' }
            ].map((stat, i) => (
              <div key={i} className="card text-center py-4">
                <stat.icon className="h-6 w-6 text-gold mx-auto mb-2" />
                <div className="text-2xl font-bold gold-text">{stat.value}</div>
                <div className="text-xs text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Bar */}
      <section className="py-6 bg-dark-gray/60 border-y border-gold/20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: Clock, text: 'Save 2+ Hours' },
              { icon: Award, text: 'Proven Formulas' },
              { icon: Shield, text: 'No Clickbait' },
              { icon: Lightbulb, text: '6 Style Variants' }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <item.icon className="h-8 w-8 text-gold mb-2" />
                <p className="text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">How It Works</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: '01', icon: Brain, title: 'Enter Topic', desc: 'Describe your video or paste script' },
              { step: '02', icon: Sparkles, title: 'AI Generates', desc: 'Get 10+ titles in multiple styles' },
              { step: '03', icon: Rocket, title: 'Pick & Publish', desc: 'Choose favorite and get clicks' }
            ].map((item, i) => (
              <div key={i} className="card relative">
                <div className="absolute -top-4 left-4 w-10 h-10 bg-gold-gradient rounded-full flex items-center justify-center text-marble-black font-bold shadow-gold-glow">{item.step}</div>
                <div className="mt-6">
                  <item.icon className="h-10 w-10 text-gold mb-3" />
                  <h3 className="text-xl font-bold text-gold mb-2">{item.title}</h3>
                  <p className="text-gray-300 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Title Examples */}
      <section className="py-12 bg-dark-gray/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">Real Examples</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                input: 'How to learn programming',
                titles: [
                  { text: 'I Learned to Code in 30 Days - Here\'s What Happened', style: 'Curiosity', score: 85 },
                  { text: 'Complete Programming Guide 2024', style: 'SEO', score: 78 }
                ]
              },
              {
                input: 'Best budget smartphones',
                titles: [
                  { text: 'Top 5 Budget Phones Under $300', style: 'Listicle', score: 82 },
                  { text: 'Nobody Talks About These Cheap Phones', style: 'Trending', score: 86 }
                ]
              }
            ].map((example, i) => (
              <div key={i} className="card">
                <div className="flex items-center mb-4 text-gold">
                  <Video className="h-5 w-5 mr-2" />
                  <span className="font-semibold text-sm">"{example.input}"</span>
                </div>
                <div className="space-y-3">
                  {example.titles.map((title, j) => (
                    <div key={j} className="bg-medium-gray p-3 rounded-lg border border-gold/20">
                      <p className="text-gray-100 text-sm mb-2">{title.text}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-gold/20 text-gold px-2 py-1 rounded">{title.style}</span>
                        <span className="text-gold font-bold">CTR: {title.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">Features</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Zap, title: 'AI-Powered', desc: 'GPT-4 trained on viral videos' },
              { icon: Target, title: '6 Styles', desc: 'Clickbait, SEO, emotional, more' },
              { icon: TrendingUp, title: 'CTR Scores', desc: 'Predict click-through rates' },
              { icon: Sparkles, title: 'Thumbnail Text', desc: 'Punchy 2-4 word suggestions' },
              { icon: BarChart3, title: 'SEO Keywords', desc: 'Auto-extract 5-8 keywords' },
              { icon: Star, title: 'Save Favorites', desc: 'Build title template library' }
            ].map((feature, i) => (
              <div key={i} className="card text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-glow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-full bg-gold-shine animate-shine-move" />
                  <feature.icon className="h-8 w-8 text-marble-black relative z-10" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-gold">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-12 bg-dark-gray/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">For Every Creator</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Video, title: 'Vloggers', desc: 'Daily content' },
              { icon: Users, title: 'Educators', desc: 'Tutorials' },
              { icon: TrendingUp, title: 'Marketers', desc: 'Brand videos' },
              { icon: FileText, title: 'Reviewers', desc: 'Product reviews' }
            ].map((use, i) => (
              <div key={i} className="card text-center">
                <use.icon className="h-10 w-10 text-gold mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gold mb-2">{use.title}</h3>
                <p className="text-gray-400 text-sm">{use.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">Simple Pricing</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="card">
              <h3 className="text-xl font-semibold mb-2 text-gold">Free</h3>
              <div className="text-3xl font-bold mb-4 text-white">$0<span className="text-base text-gray-400">/mo</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-300">
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />5 titles/day</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />All 6 styles</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />Thumbnail text</li>
              </ul>
              <Link href="/auth/login" className="btn-secondary w-full block text-center py-2 text-sm">Start Free</Link>
            </div>
            <div className="card border-2 border-gold shadow-gold-glow transform scale-105 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gold-gradient text-marble-black px-3 py-1 rounded-full text-xs font-bold">Popular</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gold">Pro</h3>
              <div className="text-3xl font-bold mb-4 text-white">$9<span className="text-base text-gray-400">/mo</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-300">
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />Unlimited titles</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />CTR scores</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />Export CSV</li>
              </ul>
              <Link href="/auth/login" className="btn-primary w-full block text-center py-2 text-sm">Start Pro</Link>
            </div>
            <div className="card">
              <h3 className="text-xl font-semibold mb-2 text-gold">Creator</h3>
              <div className="text-3xl font-bold mb-4 text-white">$19<span className="text-base text-gray-400">/mo</span></div>
              <ul className="space-y-2 mb-6 text-sm text-gray-300">
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />Everything Pro</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />A/B testing</li>
                <li className="flex items-center"><Check className="h-4 w-4 text-gold mr-2" />API access</li>
              </ul>
              <Link href="/auth/login" className="btn-secondary w-full block text-center py-2 text-sm">Start Creator</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-dark-gray/60">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">Loved by 10K+ Creators</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Sarah Chen', role: 'Tech, 250K subs', text: 'Increased CTR by 40%! Saves hours of brainstorming.' },
              { name: 'Mike Rodriguez', role: 'Gaming, 500K subs', text: '3x more clicks. The trending formats are pure gold!' },
              { name: 'Emma Thompson', role: 'Lifestyle, 100K subs', text: 'Doubled my engagement rate. Simple and effective!' }
            ].map((t, i) => (
              <div key={i} className="card">
                <div className="flex mb-4">{[...Array(5)].map((_, j) => <Star key={j} className="h-4 w-4 text-gold fill-current" />)}</div>
                <p className="text-gray-300 mb-4 text-sm">"{t.text}"</p>
                <div className="font-semibold text-gold text-sm">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold gold-text mb-3">FAQ</h2>
            <div className="w-24 h-1 bg-gold-gradient rounded-full shadow-gold-glow mx-auto" />
          </div>
          <div className="space-y-4">
            {[
              { q: 'How does the AI generate titles?', a: 'Our AI is trained on millions of viral videos, analyzing CTR patterns and engagement metrics to create optimized suggestions.' },
              { q: 'Does it work for any niche?', a: 'Yes! Works for tech, gaming, lifestyle, education, business, entertainment, and more.' },
              { q: 'Do I need an OpenAI API key?', a: 'No! We handle all AI processing for you. Just sign up and start generating titles immediately.' },
              { q: 'What if I don\'t like the titles?', a: 'You can regenerate unlimited times (Pro plan) or adjust style preferences. Each generation gives you 10+ unique variations.' }
            ].map((faq, i) => (
              <div key={i} className="card">
                <h3 className="text-lg font-semibold text-gold mb-2">{faq.q}</h3>
                <p className="text-gray-300 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-dark-gray/60">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-4 gold-text">Ready to Dominate YouTube?</h2>
          <p className="text-lg mb-8 text-gray-300">Join thousands boosting CTR with AI titles.</p>
          <Link href="/auth/login" className="btn-primary inline-flex items-center px-8 py-4">
            <Rocket className="mr-2 h-5 w-5" />Start Free<ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-400 mt-4">No credit card • 5 free daily</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-marble-black py-12 border-t border-gold/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center shadow-gold-glow">
                  <span className="text-marble-black font-bold">J</span>
                </div>
                <span className="font-bold gold-text">AI Optimizer</span>
              </div>
              <p className="text-gray-400 text-sm">AI-powered YouTube title generator.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/dashboard" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Dashboard</Link></li>
                <li><Link href="#pricing" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Pricing</Link></li>
                <li><Link href="#features" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Features</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Help Center</a></li>
                <li><a href="#" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Contact</a></li>
                <li><a href="#" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-gold shadow-[0_0_10px_rgba(255,215,0,0.3)]">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Privacy</a></li>
                <li><a href="#" className="hover:text-gold transition-colors hover:shadow-[0_0_8px_rgba(255,215,0,0.3)]">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2024 JVW Empire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
