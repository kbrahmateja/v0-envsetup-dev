# Brevo (Sendinblue) Email Setup for EnvSetup.dev

## Why Brevo?
Brevo (formerly Sendinblue) is a free email service that allows:
- 300 emails per day (FREE forever)
- Custom domain support (info@envsetup.dev)
- Professional email templates
- No credit card required

## Setup Instructions

### Step 1: Create Brevo Account
1. Go to [brevo.com](https://www.brevo.com) (or [sendinblue.com](https://www.sendinblue.com))
2. Sign up for a FREE account
3. Verify your email address

### Step 2: Get API Key
1. Log in to your Brevo dashboard
2. Go to **Settings** (top right)
3. Click **SMTP & API**
4. Click **Create a new API key**
5. Give it a name like "EnvSetup Production"
6. Copy the API key

### Step 3: Add to Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add new variable:
   - **Name:** `BREVO_API_KEY`
   - **Value:** (paste your API key)
   - **Environment:** Production, Preview, Development
4. Click **Save**

### Step 4: Verify Domain (Required for info@envsetup.dev)
1. In Brevo dashboard, go to **Senders & IP**
2. Click **Add a sender**
3. Enter:
   - **Email:** info@envsetup.dev
   - **Name:** EnvSetup Team
4. Brevo will send verification instructions
5. Add the required DNS records to your domain:
   - **SPF Record** (TXT)
   - **DKIM Record** (TXT)
   - **MX Record** (optional, for receiving emails)

### Step 5: DNS Setup
Add these DNS records to your envsetup.dev domain (exact values provided by Brevo):

\`\`\`
Type: TXT
Name: @
Value: v=spf1 include:spf.brevo.com ~all

Type: TXT
Name: mail._domainkey
Value: (provided by Brevo - looks like k=rsa; p=...)

Type: MX (optional)
Name: @
Value: mx.brevo.com
Priority: 10
\`\`\`

### Step 6: Test Emails
1. Wait 5-10 minutes for DNS propagation
2. Click **Verify** in Brevo dashboard
3. Test by submitting the subscription form on your site

## Current Configuration

**Sender Address:** info@envsetup.dev  
**Admin Notifications:** kbrahmateja@gmail.com  
**Daily Limit:** 300 emails  
**Monthly Limit:** 9,000 emails (FREE)

## Troubleshooting

### Domain Not Verified
- Wait for DNS propagation (up to 24 hours)
- Check DNS records using [mxtoolbox.com](https://mxtoolbox.com)
- Ensure records are added to root domain (not subdomain)

### Emails Not Sending
- Check BREVO_API_KEY is set in Vercel
- Verify domain is approved in Brevo dashboard
- Check console logs for error messages

### Using Test Mode
Until domain is verified, you can test with:
- Change sender to your verified email in Brevo
- Or use Brevo sandbox mode

## Free Tier Limits
- 300 emails per day
- 9,000 emails per month
- Unlimited contacts
- No credit card required
- No expiration

## Upgrade Options
If you exceed 300/day:
- **Lite Plan:** $25/month - 20,000 emails/month
- **Premium Plan:** $65/month - Unlimited emails
- **Enterprise:** Custom pricing

For a coming soon page, the FREE tier is more than enough!
