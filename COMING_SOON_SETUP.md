# Coming Soon Page Setup

## Overview
The homepage has been replaced with a stunning 3D coming soon page featuring:
- Animated programming language logos spiraling into a package
- Realistic 3D computer model with glowing effects
- Email subscription form
- Futuristic dark theme with vibrant gradients

## Original Homepage Backup
The original homepage has been backed up to `app/page-backup.tsx` and can be restored when ready to launch.

## Email Notifications

### Setup Required
To receive email notifications when users subscribe, add the following environment variable:

\`\`\`
RESEND_API_KEY=your_resend_api_key_here
\`\`\`

### How to Get Resend API Key
1. Go to [resend.com](https://resend.com) and sign up
2. Create a new API key in your dashboard
3. Add the API key to your Vercel project environment variables

### Email Flow
When a user subscribes:
1. **Admin Notification**: You (kbrahmateja@gmail.com) receive an email with subscriber details
2. **User Confirmation**: Subscriber receives a welcome email

### Without API Key
If `RESEND_API_KEY` is not set:
- Subscriptions still work (form submits successfully)
- Emails are not sent
- Subscription details are logged to console

## Restoring Original Homepage

When ready to launch the full site, restore the original homepage:

1. Rename or delete current `app/page.tsx`
2. Rename `app/page-backup.tsx` to `app/page.tsx`
3. Update `app/layout.tsx` to include Header and Footer again:

\`\`\`typescript
// In app/layout.tsx, restore this structure:
<body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
    <PageTracker />
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  </ThemeProvider>
</body>
\`\`\`

## Theme
The coming soon page uses a dark theme with:
- Deep black background
- Blue (#3b82f6) and purple (#8b5cf6) gradients
- White text with proper contrast
- Glassmorphism effects (backdrop blur)

## 3D Features
- **Animated Logos**: 15 programming language/tool logos orbit in a spiral pattern
- **Computer Model**: Realistic laptop with glowing screen and floating package
- **Auto-Rotation**: Scene slowly rotates for visual interest
- **Performance**: Uses React Three Fiber with optimized rendering
