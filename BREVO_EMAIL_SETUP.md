# Brevo Email Setup - Important Steps

## Current Status
According to the logs, emails ARE being sent successfully from the API, but subscribers might not receive them because the domain is not verified.

## Why Subscribers Might Not Receive Emails

### 1. Domain Not Verified
The sender email `info@envsetup.dev` needs to be verified in your Brevo account.

**Emails will be sent but may:**
- Go to spam/junk folder
- Be blocked by recipient email servers
- Not be delivered at all

### 2. How to Verify Your Domain in Brevo

#### Step 1: Login to Brevo
- Go to https://app.brevo.com/
- Login with your account

#### Step 2: Add Domain
1. Click on **Settings** (gear icon)
2. Click on **Senders & IP**
3. Click on **Domains**
4. Click **Add a domain**
5. Enter: `envsetup.dev`

#### Step 3: Add DNS Records
Brevo will provide you with DNS records. Add these to your domain:

**Example DNS Records:**
\`\`\`
Type: TXT
Host: @
Value: [Brevo will provide this]

Type: TXT  
Host: mail._domainkey
Value: [Brevo will provide this - DKIM record]

Type: CNAME
Host: [Brevo will provide]
Value: [Brevo will provide]
\`\`\`

#### Step 4: Verify
- After adding DNS records, click **Verify** in Brevo
- DNS propagation can take 24-48 hours

### 3. Check Email Deliverability

**Test Checklist:**
- [ ] Domain verified in Brevo
- [ ] SPF record added to DNS
- [ ] DKIM record added to DNS
- [ ] Tested with multiple email providers (Gmail, Outlook, etc.)
- [ ] Checked spam folders

### 4. Current Email Status

**Working:**
- Admin notifications to kbrahmateja@gmail.com ✅
- Emails are being sent by Brevo API ✅

**Needs Setup:**
- Domain verification for envsetup.dev
- DNS records (SPF, DKIM)

### 5. Temporary Solution

Until domain is verified, subscribers will receive emails but they may go to spam. 

**Advise subscribers to:**
1. Check spam/junk folder
2. Mark emails from info@envsetup.dev as "Not Spam"
3. Add info@envsetup.dev to contacts

### 6. Alternative: Use Verified Domain

If you want immediate delivery, you can temporarily use your verified swiftstrikesolutions.com domain:

Change in `app/api/subscribe/route.ts`:
\`\`\`typescript
sender: {
  name: "EnvSetup Team",
  email: "envsetup@swiftstrikesolutions.com", // Use your verified domain
}
\`\`\`

## Monitoring

Check Brevo dashboard for:
- Email delivery rates
- Bounces
- Opens and clicks
- Spam reports

## Support

If issues persist after domain verification:
- Check Brevo logs: https://app.brevo.com/log
- Contact Brevo support: https://help.brevo.com/
</parameter>
