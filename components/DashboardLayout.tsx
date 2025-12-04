'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  Home, 
  Heart, 
  Settings, 
  CreditCard, 
  LogOut, 
  Menu, 
  X,
  Zap,
  Sparkles
} from 'lucide-react'
import { User } from '@/types'

interface DashboardLayoutProps {
  children: React.ReactNode
  user: User
}

export default function DashboardLayout({ children, user }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Saved Titles', href: '/dashboard/saved', icon: Heart },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  ]

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'pro': return 'bg-gold/20 text-gold border border-gold/30'
      case 'creator': return 'bg-gold/30 text-gold border border-gold/50'
      case 'agency': return 'bg-gold/40 text-gold border border-gold/70'
      default: return 'bg-gray-700 text-gray-300 border border-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-marble-bg">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-dark-gray border-r border-gold/30">
          <div className="flex h-16 items-center justify-between px-4 border-b border-gold/30">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gold-gradient rounded-lg flex items-center justify-center shadow-gold-glow animate-pulse-gold">
                <span className="text-marble-black font-bold">J</span>
              </div>
              <span className="text-lg font-bold gold-text">AI Optimizer</span>
            </div>
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gold" />
            </button>
          </div>
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gold/10 hover:text-gold transition-all duration-300 border border-transparent hover:border-gold/30"
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-dark-gray border-r border-gold/30">
          <div className="flex items-center h-16 px-4 border-b border-gold/30">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gold-gradient rounded-xl flex items-center justify-center shadow-gold-glow-strong animate-pulse-gold relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gold-shine animate-shine-move" />
                <span className="text-marble-black font-bold text-lg relative z-10">J</span>
              </div>
              <span className="text-xl font-extrabold gold-text animate-text-shimmer">AI Optimizer</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-gold/10 hover:text-gold transition-all duration-300 border border-transparent hover:border-gold/30 hover:shadow-[0_0_15px_rgba(255,215,0,0.2)]"
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* User info */}
            <div className="p-4 border-t border-gold/30">
              <div className="flex items-center space-x-3 mb-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 bg-gold-gradient rounded-full flex items-center justify-center shadow-gold-glow">
                    <span className="text-marble-black text-sm font-bold">
                      {user.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-100 truncate">
                    {user.full_name || user.email}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full capitalize ${getPlanColor(user.plan)}`}>
                    {user.plan}
                  </span>
                </div>
              </div>
              
              {user.plan === 'free' && (
                <div className="mb-3 p-3 bg-medium-gray rounded-lg border border-gold/20">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-300 flex items-center">
                      <Sparkles className="h-4 w-4 mr-1 text-gold" />
                      Credits
                    </span>
                    <span className="font-bold text-gold">
                      {Math.max(0, user.credits_limit - user.credits_used)}/{user.credits_limit}
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gold-gradient h-2 rounded-full shadow-gold-glow transition-all duration-500" 
                      style={{ 
                        width: `${Math.max(0, (user.credits_limit - user.credits_used) / user.credits_limit * 100)}%` 
                      }}
                    />
                  </div>
                </div>
              )}
              
              {user.plan === 'free' && (
                <Link 
                  href="/dashboard/billing" 
                  className="w-full btn-primary text-sm py-2 mb-2 flex items-center justify-center"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Upgrade to Pro
                </Link>
              )}
              
              <button
                onClick={handleSignOut}
                className="w-full flex items-center px-3 py-2 text-sm text-gray-300 hover:text-gold hover:bg-gold/10 rounded-lg transition-all duration-300 border border-transparent hover:border-gold/30"
              >
                <LogOut className="mr-3 h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-dark-gray/90 backdrop-blur-lg border-b border-gold/30 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gold hover:text-light-gold transition-colors"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gold-gradient rounded-lg flex items-center justify-center shadow-gold-glow">
                <span className="text-marble-black font-bold text-xs">J</span>
              </div>
              <span className="font-bold gold-text">AI Optimizer</span>
            </div>
            <div className="w-6" />
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
