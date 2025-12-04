# Credit System Documentation

## Overview
This document explains how the credit tracking system works to ensure accurate billing and prevent revenue loss.

## Key Features

### 1. **Database-Persisted Credits**
- All credit data is stored in PostgreSQL via Supabase
- Credits persist across login sessions
- No data loss on logout or session expiration

### 2. **Atomic Operations**
- Uses database functions to prevent race conditions
- `increment_user_credits()` function ensures thread-safe credit increments
- Prevents double-counting or missed counts

### 3. **Real-Time Tracking**
- Credits are checked BEFORE generation
- Credits are incremented AFTER successful generation
- Failed generations don't consume credits

### 4. **Plan-Based Limits**
```
Free Plan: 5 credits/month
Pro Plan: Unlimited (9999 credits/month)
Creator Plan: Unlimited (9999 credits/month)
```

## Database Schema

### profiles table
```sql
- credits_used: INTEGER (current usage, resets monthly)
- credits_limit: INTEGER (max allowed per plan)
- credits_reset_date: TIMESTAMP (when credits reset)
- plan: TEXT (free, pro, creator, agency)
```

### Constraints
- `credits_used >= 0` (cannot be negative)
- `credits_limit > 0` (must have positive limit)
- Indexed for fast queries

## API Endpoints

### GET /api/credits
Returns current credit balance:
```json
{
  "credits_used": 3,
  "credits_limit": 5,
  "credits_remaining": 2,
  "plan": "free"
}
```

### POST /api/generate
Generates titles and increments credits:
1. Authenticates user
2. Fetches current credits from database
3. Checks if credits available
4. Generates titles
5. Atomically increments credits_used
6. Returns result with updated credit count

## Credit Flow

```
User Login
    ↓
Fetch Profile from DB (includes current credits)
    ↓
User Requests Generation
    ↓
Check: credits_used < credits_limit?
    ↓ YES
Generate Titles
    ↓
Increment credits_used in DB (atomic)
    ↓
Log to title_generations table
    ↓
Return result + updated credits
```

## Safety Mechanisms

### 1. **Pre-Generation Check**
```typescript
if (profile.credits_used >= profile.credits_limit) {
  return error 403 // Prevents generation
}
```

### 2. **Atomic Increment**
```sql
UPDATE profiles 
SET credits_used = credits_used + 1
WHERE id = user_id AND credits_used < credits_limit;
```

### 3. **Transaction Logging**
Every generation is logged in `title_generations` table for audit trail.

### 4. **Error Handling**
If credit increment fails, user gets error and can retry without losing credits.

## Monthly Reset

### Automatic Reset (Recommended)
Set up a cron job to run daily:
```sql
SELECT public.reset_monthly_credits();
```

This resets credits for paid users on their billing cycle.

### Manual Reset
```sql
UPDATE profiles 
SET credits_used = 0, 
    credits_reset_date = NOW() + INTERVAL '1 month'
WHERE id = 'user_id';
```

## Subscription Upgrades

When user upgrades plan:
```typescript
await supabase.rpc('update_user_plan', {
  user_id: userId,
  new_plan: 'pro',
  new_limit: 9999
})
```

This:
- Updates plan
- Sets new credit limit
- Resets credits_used to 0
- Sets next reset date

## Monitoring

### Check Total Usage
```sql
SELECT 
  plan,
  COUNT(*) as users,
  SUM(credits_used) as total_credits_used,
  AVG(credits_used) as avg_credits_per_user
FROM profiles
GROUP BY plan;
```

### Find Users Near Limit
```sql
SELECT email, credits_used, credits_limit
FROM profiles
WHERE credits_used >= credits_limit * 0.8
AND plan = 'free';
```

### Audit Trail
```sql
SELECT 
  p.email,
  COUNT(tg.id) as generations,
  p.credits_used
FROM profiles p
LEFT JOIN title_generations tg ON p.id = tg.user_id
GROUP BY p.id, p.email, p.credits_used
HAVING COUNT(tg.id) != p.credits_used;
```

## Testing Checklist

- [ ] User logs in → credits load from database
- [ ] User generates title → credits increment by 1
- [ ] User logs out and back in → credits persist
- [ ] User hits limit → generation blocked
- [ ] User upgrades → credits reset and limit increases
- [ ] Failed generation → credits not consumed
- [ ] Concurrent requests → no race conditions

## Security

1. **Row Level Security (RLS)** enabled on all tables
2. Users can only access their own credit data
3. Credit increments use SECURITY DEFINER functions
4. API routes verify authentication before credit operations

## Revenue Protection

✅ Credits stored in database (not cookies/sessions)
✅ Atomic operations prevent double-counting
✅ Pre-checks prevent unauthorized usage
✅ Audit trail for all generations
✅ Constraints prevent negative credits
✅ Failed operations don't consume credits

This system ensures you never lose money due to:
- Session issues
- Race conditions
- User manipulation
- System errors
