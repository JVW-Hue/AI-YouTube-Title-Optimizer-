# 🚀 Deployment Guide

## Quick Deploy to Vercel (Recommended)

### 1. Prepare for Deployment

```bash
# Ensure all files are committed
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (see below)
5. Click "Deploy"

### 3. Environment Variables for Production

Add these in Vercel dashboard under Settings > Environment Variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
OPENAI_API_KEY=sk-your_openai_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### 4. Update External Services

**Supabase:**
- Add your Vercel domain to allowed origins
- Update redirect URLs in Auth settings

**Stripe:**
- Update webhook endpoint URL
- Switch to live keys for production

**Google OAuth:**
- Add production redirect URL

## Alternative Deployment Options

### Deploy to Netlify

1. Build the project:
```bash
npm run build
npm run export
```

2. Deploy to Netlify:
- Drag and drop the `out` folder
- Or connect GitHub repository
- Add environment variables
- Configure redirects

### Deploy to Railway

1. Connect GitHub repository
2. Add environment variables
3. Deploy automatically

### Deploy to DigitalOcean App Platform

1. Create new app from GitHub
2. Configure build settings
3. Add environment variables
4. Deploy

## Post-Deployment Checklist

- [ ] Test user registration
- [ ] Test Google OAuth login
- [ ] Test title generation
- [ ] Test subscription flow
- [ ] Test webhook delivery
- [ ] Set up monitoring
- [ ] Configure custom domain
- [ ] Set up SSL certificate
- [ ] Test all features end-to-end

## Monitoring and Analytics

### Set up Vercel Analytics
```bash
npm install @vercel/analytics
```

Add to your layout:
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### Error Monitoring with Sentry

1. Sign up for Sentry
2. Install Sentry SDK:
```bash
npm install @sentry/nextjs
```

3. Configure Sentry in `next.config.js`

## Performance Optimization

### Enable Vercel Speed Insights
```bash
npm install @vercel/speed-insights
```

### Optimize Images
- Use Next.js Image component
- Compress images before upload
- Use WebP format when possible

### Database Optimization
- Add indexes for frequently queried columns
- Use connection pooling
- Monitor query performance

## Security Checklist

- [ ] Environment variables are secure
- [ ] API routes are protected
- [ ] Database has RLS enabled
- [ ] HTTPS is enforced
- [ ] CORS is properly configured
- [ ] Rate limiting is implemented
- [ ] Input validation is in place

## Backup Strategy

### Database Backups
- Supabase provides automatic backups
- Set up additional backup schedule if needed

### Code Backups
- Code is backed up in Git repository
- Consider multiple remote repositories

## Scaling Considerations

### Database Scaling
- Monitor connection usage
- Consider read replicas for heavy read workloads
- Implement caching where appropriate

### API Scaling
- Monitor OpenAI API usage and costs
- Implement request queuing for high traffic
- Consider API response caching

### CDN and Caching
- Vercel provides global CDN automatically
- Implement appropriate cache headers
- Use static generation where possible

## Cost Optimization

### Vercel Costs
- Monitor bandwidth usage
- Optimize bundle size
- Use static generation to reduce function invocations

### Supabase Costs
- Monitor database size and requests
- Optimize queries
- Clean up old data regularly

### OpenAI Costs
- Monitor token usage
- Implement request caching
- Use appropriate model for each use case

## Troubleshooting Production Issues

### Common Issues

**Build Failures:**
- Check TypeScript errors
- Verify all dependencies are installed
- Check environment variables

**Runtime Errors:**
- Check Vercel function logs
- Verify API endpoints are working
- Check database connections

**Performance Issues:**
- Monitor Core Web Vitals
- Check bundle size
- Optimize database queries

### Debugging Tools

- Vercel Function Logs
- Supabase Logs
- Browser DevTools
- Sentry Error Tracking

## Maintenance

### Regular Tasks
- [ ] Update dependencies monthly
- [ ] Monitor error rates
- [ ] Review performance metrics
- [ ] Check security updates
- [ ] Backup verification
- [ ] Cost analysis

### Updates and Releases
1. Test changes locally
2. Deploy to staging environment
3. Run automated tests
4. Deploy to production
5. Monitor for issues
6. Rollback if necessary

## Support and Documentation

- Keep deployment documentation updated
- Document any custom configurations
- Maintain runbook for common issues
- Set up alerts for critical failures

Your AI YouTube Title Optimizer is now ready for production! 🎉