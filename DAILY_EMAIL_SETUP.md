# Daily Email Summary Setup

## How It Works

Vercel Cron Jobs will automatically trigger the `/api/cron/daily-summary` endpoint every day at midnight UTC.

## Setup Steps

### 1. Add Environment Variable

In Vercel Dashboard → Settings → Environment Variables, add:

\`\`\`
CRON_SECRET=your-random-secret-here
\`\`\`

Generate a random secret: `openssl rand -base64 32`

### 2. Deploy

The `vercel.json` file configures the cron schedule:
- `"0 0 * * *"` = Daily at midnight UTC
- `"0 18 * * *"` = Daily at 6 PM UTC (adjust for your timezone)

### 3. Test Manually

You can test the cron job by calling:

\`\`\`bash
curl -X GET https://envsetup.dev/api/cron/daily-summary \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
\`\`\`

## Cron Schedule Examples

- `"0 0 * * *"` - Daily at midnight UTC
- `"0 18 * * *"` - Daily at 6 PM UTC
- `"0 9 * * 1"` - Every Monday at 9 AM UTC
- `"0 0 1 * *"` - First day of every month at midnight

## What Gets Sent

Daily email includes:
- Number of new subscribers today
- Total visitors today
- Link to admin dashboard

Email is sent to: kbrahmateja@gmail.com

## Free Tier Limits

Vercel Hobby Plan:
- ✅ Unlimited cron jobs
- ✅ Free forever
- ✅ No credit card required

## Alternative: Change Time

To send at end of day (11:59 PM UTC):

\`\`\`json
"schedule": "59 23 * * *"
\`\`\`

To send at 6 PM IST (12:30 PM UTC):

\`\`\`json
"schedule": "30 12 * * *"
