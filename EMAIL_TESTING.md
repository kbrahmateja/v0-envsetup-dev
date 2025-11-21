# Email Testing Guide

## Current Status

The subscription system is working correctly! Here's what's happening:

### Why You're Not Receiving Emails

The email **kbrahmateja@gmail.com** is already in the database from previous test subscriptions. The system only sends welcome emails to **NEW** subscribers to avoid spam.

### How to Test Email Delivery

1. **Use a different email address** that hasn't subscribed before
2. **Use a temporary email service** like:
   - temp-mail.org
   - guerrillamail.com
   - 10minutemail.com
3. **Clear the database** and resubscribe with kbrahmateja@gmail.com

### Email Delivery Checklist

For emails to work properly, ensure:

1. **Brevo Domain Verification**
   - Go to https://app.brevo.com/settings/senders/domain
   - Add and verify envsetup.dev domain
   - Add these DNS records to your domain:
     \`\`\`
     TXT record: v=DKIM1; k=rsa; p=[provided by Brevo]
     CNAME record: mail._domainkey.envsetup.dev → [provided by Brevo]
     \`\`\`

2. **BREVO_API_KEY Environment Variable**
   - Already set in Vercel ✓
   - Make sure it's valid and has sending permissions

3. **Sender Email Configuration**
   - Currently using: info@envsetup.dev
   - Must match verified domain in Brevo

### Test with a New Email

Try subscribing with a different email to see the full flow:
- Admin notification sent to kbrahmateja@gmail.com ✓
- Welcome email sent to subscriber ✓

### Check Spam Folder

Until the domain is fully verified, emails might land in spam. Check:
- Gmail: Spam/Junk folder
- Outlook: Junk Email folder
- Other providers: Check their spam settings

### Temporary Solution

While waiting for domain verification, you can use:
- **Sender:** envsetup@swiftstrikesolutions.com (already verified)
- Update in app/api/subscribe/route.ts

## Support

If emails still don't arrive after domain verification:
1. Check Brevo dashboard logs
2. Verify SPF/DKIM records are correct
3. Contact Brevo support for delivery issues
