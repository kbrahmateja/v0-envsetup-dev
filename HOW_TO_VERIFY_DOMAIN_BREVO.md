# How to Verify envsetup.dev Domain in Brevo (Sendinblue)

Follow these steps to verify your domain so emails from info@envsetup.dev will be delivered successfully.

## Step-by-Step Guide

### 1. Login to Brevo Dashboard
- Go to https://app.brevo.com
- Login with your account credentials

### 2. Navigate to Senders & IP
- Click on **"Senders, Domains & Dedicated IPs"** in the left sidebar
- Or go directly to: https://app.brevo.com/senders/domain/list

### 3. Add Your Domain
- Click the **"Add a Domain"** button
- Enter: `envsetup.dev`
- Click **"Verify this Domain"**

### 4. Get DNS Records
Brevo will provide you with 3 DNS records to add:

#### **SPF Record** (Sender Policy Framework)
\`\`\`
Type: TXT
Name: @ (or leave blank)
Value: v=spf1 include:spf.brevo.com ~all
TTL: 3600
\`\`\`

#### **DKIM Record** (DomainKeys Identified Mail)
\`\`\`
Type: TXT
Name: mail._domainkey
Value: [Brevo will provide unique value - copy exactly]
TTL: 3600
\`\`\`

#### **DMARC Record** (Domain-based Message Authentication)
\`\`\`
Type: TXT
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:kbrahmateja@gmail.com
TTL: 3600
\`\`\`

### 5. Add DNS Records to Your Domain

#### **If using Cloudflare:**
1. Go to your Cloudflare dashboard
2. Select `envsetup.dev` domain
3. Click on **DNS** tab
4. Click **Add record** for each DNS record
5. Add all 3 records (SPF, DKIM, DMARC)
6. Set Proxy status to **DNS only** (grey cloud)
7. Click **Save**

#### **If using GoDaddy:**
1. Login to GoDaddy
2. Go to **My Products** > **DNS**
3. Select `envsetup.dev`
4. Click **Add** for each record
5. Choose Type: **TXT**
6. Enter Name and Value from Brevo
7. Click **Save**

#### **If using Namecheap:**
1. Login to Namecheap
2. Go to **Domain List** > Manage
3. Select **Advanced DNS**
4. Click **Add New Record**
5. Choose Type: **TXT Record**
6. Add all 3 records
7. Click checkmark to save

### 6. Verify in Brevo
- Wait 15-30 minutes for DNS propagation
- Return to Brevo > Senders & Domains
- Click **"Verify"** button next to envsetup.dev
- If successful, you'll see a green checkmark ✓

### 7. Test Your Setup
Once verified, try these:
- Send a test email from your app
- Check if it arrives in inbox (not spam)
- Verify sender shows as "info@envsetup.dev"

## Troubleshooting

### DNS Not Propagating
- Wait 24-48 hours for full propagation
- Use DNS checker: https://dnschecker.org
- Check TXT records for envsetup.dev

### Still Going to Spam
- Ensure all 3 records are added
- Check DKIM value is copied exactly
- Warm up your domain by sending slowly at first

### Verification Failed
- Double-check record names (no typos)
- Ensure no extra spaces in values
- Try removing and re-adding records
- Contact Brevo support if needed

## Important Notes

- **Free Tier**: Brevo's free tier only allows 1 verified domain
- If you already have swiftstrikesolutions.com verified, you'll need to:
  - Remove that domain, OR
  - Upgrade to paid plan (€25/month for multiple domains)
  
## Alternative: Use Subdomain

If you can't verify the main domain, use a subdomain:
- Add: `mail.envsetup.dev` instead of `envsetup.dev`
- Use sender: `info@mail.envsetup.dev`
- This doesn't look as professional but will work

## DNS Propagation Check

To check if your DNS records are live:
\`\`\`bash
# Check SPF
nslookup -type=TXT envsetup.dev

# Check DKIM
nslookup -type=TXT mail._domainkey.envsetup.dev

# Check DMARC
nslookup -type=TXT _dmarc.envsetup.dev
\`\`\`

Or use online tool: https://mxtoolbox.com/SuperTool.aspx

---

**Need Help?**
- Brevo Documentation: https://help.brevo.com/hc/en-us/articles/209467485
- Brevo Support: https://www.brevo.com/support/
- Email: kbrahmateja@gmail.com for technical assistance
