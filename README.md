# 🚀 JVW AI YouTube Title Optimizer

My customized AI-powered tool for generating high-CTR YouTube titles and thumbnail text. Built with Next.js 14, Supabase, and OpenAI.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/JVW-Hue/AI-YouTube-Title-Optimizer-)

👉 **[Click here for step-by-step deployment guide](QUICK_DEPLOY.md)**

## ✨ Features

- **AI-Powered Title Generation**: Generate 10+ title variations using GPT-4
- **Multiple Title Styles**: Clickbait, curiosity, SEO, emotional, trending formats
- **CTR Prediction**: AI-powered click-through rate scoring
- **Thumbnail Text Generator**: Short, punchy text for thumbnails
- **Save & Organize**: Save favorite titles with search and filtering
- **User Authentication**: Google OAuth and magic link login
- **Subscription Management**: Stripe integration with multiple plans
- **Responsive Design**: Works perfectly on desktop and mobile

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 API
- **Payments**: Stripe
- **Deployment**: Vercel (recommended)

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd ai-youtube-title-optimizer
npm install
```

### 2. Environment Setup

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `OPENAI_API_KEY`: Your OpenAI API key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key

### 3. Database Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the SQL commands from `supabase/schema.sql` in your Supabase SQL editor
3. Enable Google OAuth in Supabase Auth settings

### 4. Stripe Setup

1. Create a Stripe account and get your API keys
2. Create products and prices in Stripe dashboard:
   - Pro Plan: $9/month
   - Creator Plan: $19/month
3. Set up webhooks for subscription events

### 5. OpenAI Setup

1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Ensure you have access to GPT-4 API

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📁 Project Structure

```
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript types
├── supabase/             # Database schema
└── public/               # Static assets
```

## 🔧 Configuration

### Supabase Configuration

1. **Authentication**: Enable Google OAuth provider
2. **Database**: Run the schema from `supabase/schema.sql`
3. **RLS**: Row Level Security is enabled for all tables
4. **Triggers**: User profile creation trigger is set up

### Stripe Configuration

Create the following products in your Stripe dashboard:

1. **Pro Plan**
   - Price: $9/month
   - Product ID: `pro`

2. **Creator Plan**
   - Price: $19/month
   - Product ID: `creator`

### OpenAI Configuration

- Model: GPT-4 (falls back to GPT-3.5-turbo if needed)
- Temperature: 0.8 for creative title generation
- Max tokens: 2000

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set all environment variables in your production environment:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
OPENAI_API_KEY=your_openai_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 💰 Monetization

### Pricing Plans

- **Free**: 5 titles/day, basic features
- **Pro ($9/month)**: Unlimited titles, all features
- **Creator ($19/month)**: Advanced features, analytics

### Revenue Streams

1. Monthly subscriptions (primary)
2. Annual plans (discount for yearly payment)
3. Lifetime deals (launch only)
4. Affiliate program

## 📈 Marketing Strategy

1. **Content Marketing**: Create YouTube videos showing the tool
2. **Social Media**: TikTok/YouTube Shorts demonstrations
3. **SEO**: Target "YouTube title generator" keywords
4. **Partnerships**: Collaborate with YouTubers
5. **Product Hunt**: Launch for initial traction

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- API routes protected with authentication
- Rate limiting on AI generation endpoints
- Input validation and sanitization
- Secure environment variable handling

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 📊 Analytics

Track key metrics:
- User signups
- Title generations
- Subscription conversions
- Feature usage
- Churn rate

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For questions or issues, please open an issue on GitHub.

## 🎯 Roadmap

- [ ] A/B testing for titles
- [ ] Competitor analysis
- [ ] Bulk title generation
- [ ] API for developers
- [ ] Mobile app
- [ ] Integration with YouTube Analytics
- [ ] Multi-language support

---

Built by JVW-Hue for YouTube creators