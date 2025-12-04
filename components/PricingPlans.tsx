'use client'

import { useState } from 'react'
import { Check, Zap, Crown, Building, Star } from 'lucide-react'
import { toast } from 'react-hot-toast'

interface PricingPlansProps {
  currentPlan: string
  userId: string
}

const plans = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Zap,
    description: 'Perfect for getting started',
    features: [
      '5 titles per day',
      'All 6 title styles',
      'Thumbnail text',
      'SEO keywords'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 9,
    icon: Crown,
    description: 'Most popular for active creators',
    popular: true,
    features: [
      'Unlimited titles',
      'All styles & formats',
      'CTR prediction scores',
      'Save unlimited',
      'Priority AI',
      'Export CSV/TXT'
    ]
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 19,
    icon: Building,
    description: 'Advanced features for pros',
    features: [
      'Everything in Pro',
      'A/B testing',
      'Bulk generation',
      'Team collaboration',
      'API access',
      'Priority support'
    ]
  }
]

export default function PricingPlans({ currentPlan, userId }: PricingPlansProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleUpgrade = async (planId: string) => {
    toast.success('Upgrade feature coming soon! This is a demo.')
  }

  return (
    <div className="space-y-8">
      {/* Current Plan */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xl font-medium capitalize text-gray-100">{currentPlan} Plan</p>
            <p className="text-gray-400">
              {currentPlan === 'free' 
                ? 'You\'re on the free plan with 5 daily credits'
                : `You have unlimited access to all ${currentPlan} features`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isCurrentPlan = plan.id === currentPlan
          const isUpgrade = plan.id !== 'free' && currentPlan === 'free'

          return (
            <div
              key={plan.id}
              className={`card relative transition-all duration-300 ${
                plan.popular 
                  ? 'border-2 border-gold shadow-gold-glow-strong transform scale-105 bg-dark-gray/90' 
                  : 'border border-gold/20'
              } ${isCurrentPlan ? 'bg-medium-gray' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="bg-gold-gradient px-4 py-1.5 rounded-full shadow-gold-glow-strong animate-pulse-gold relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gold-shine animate-shine-move" />
                    <div className="flex items-center space-x-1 relative z-10">
                      <Star className="h-4 w-4 text-marble-black fill-current" />
                      <span className="text-marble-black font-bold text-sm">MOST POPULAR</span>
                      <Star className="h-4 w-4 text-marble-black fill-current" />
                    </div>
                  </div>
                </div>
              )}

              <div className="text-center mb-6 mt-2">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                  plan.popular 
                    ? 'bg-gold-gradient shadow-gold-glow-strong' 
                    : 'bg-gold/20 border border-gold/30'
                }`}>
                  <Icon className={`h-8 w-8 ${plan.popular ? 'text-marble-black' : 'text-gold'}`} />
                </div>
                <h3 className="text-2xl font-bold mb-2 text-gold">{plan.name}</h3>
                <div className="text-4xl font-bold mb-2 text-white">
                  ${plan.price}
                  <span className="text-lg text-gray-400 font-normal">/mo</span>
                </div>
                <p className="text-gray-400 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className={`h-5 w-5 mr-2 mt-0.5 flex-shrink-0 ${
                      plan.popular ? 'text-gold' : 'text-gold/70'
                    }`} />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {isCurrentPlan ? (
                  <div className="w-full py-3 px-4 bg-gold/20 text-gold border border-gold/30 rounded-lg text-center font-bold">
                    Current Plan
                  </div>
                ) : isUpgrade ? (
                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={isLoading === plan.id}
                    className={`w-full py-3 disabled:opacity-50 ${
                      plan.popular ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    {isLoading === plan.id ? 'Processing...' : `Upgrade to ${plan.name}`}
                  </button>
                ) : (
                  <div className="w-full py-3 px-4 bg-medium-gray text-gray-400 rounded-lg text-center text-sm border border-gold/10">
                    {plan.id === 'free' ? 'Current Plan' : 'Contact Sales'}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAQ */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gold mb-6">FAQ</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2 text-gold">Can I cancel anytime?</h3>
            <p className="text-gray-300 text-sm">
              Yes, cancel anytime. You'll keep access until the end of your billing period.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gold">What happens if I downgrade?</h3>
            <p className="text-gray-300 text-sm">
              Your saved titles remain accessible, but you'll be limited to free plan's daily limits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-gold">What's your refund policy?</h3>
            <p className="text-gray-300 text-sm">
              All sales are final. We recommend starting with our free plan to test the features before upgrading.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
