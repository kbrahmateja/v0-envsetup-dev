# Admin Dashboard Setup Guide

## Overview
The admin dashboard is now fully configured and ready to use at `/admin` route.

## Features Implemented

### 1. Dashboard Overview
- **Location**: `/admin`
- **Features**:
  - Total subscribers count
  - Monthly visitors count
  - Newsletters sent count
  - Growth rate metrics
  - Recent subscribers list
  - Recent visitors list

### 2. Subscribers Management
- **Location**: `/admin/subscribers`
- **Features**:
  - View all subscribers
  - Filter by status (active/inactive)
  - See subscription dates
  - Export capabilities

### 3. Newsletter Management
- **Location**: `/admin/newsletters`
- **Features**:
  - Create new newsletters
  - Edit draft newsletters
  - Preview before sending
  - Send to all active subscribers
  - Track send status
  - View newsletter history

### 4. Visitor Analytics
- **Location**: `/admin/visitors`
- **Features**:
  - Track page visits
  - View visitor locations
  - See popular pages
  - 30-day trend chart
  - Real-time visitor data

### 5. Settings
- **Location**: `/admin/settings`
- **Features**:
  - Email configuration
  - Database status
  - Analytics tracking status
  - API keys management

## Database Tables Created

### subscribers
- Stores newsletter subscriber emails
- Tracks subscription status and dates

### newsletters
- Stores newsletter content
- Tracks draft/sent status
- Includes HTML content generation

### newsletter_sends
- Tracks individual email sends
- Logs success/failure status
- Records error messages

### visitors
- Tracks page visits
- Stores IP addresses (anonymized)
- Records page URLs and referrers
- Captures location data

## Email Integration

The system uses **Brevo (Sendinblue)** for sending emails:

1. **Current Configuration**:
   - Sender: info@swiftstrikesolutions.com
   - Admin notifications: kbrahmateja@gmail.com
   - Free tier: 300 emails/day

2. **To Update Domain**:
   - Verify envsetup.dev domain in Brevo
   - Update sender email in API routes
   - Test email delivery

## Security Notes

### Authentication
- **Current**: No authentication (development mode)
- **Production**: Add authentication before deployment
  - Recommended: Use Stack Auth (already integrated)
  - Or implement custom admin login
  - Protect `/admin/*` routes with middleware

### Environment Variables Required
\`\`\`
DATABASE_URL=your_neon_database_url
BREVO_API_KEY=your_brevo_api_key
\`\`\`

## Running SQL Scripts

To initialize the database tables, run the SQL script:

\`\`\`bash
# The script is located at:
scripts/create-admin-tables.sql
\`\`\`

Or execute in the v0 preview to create tables automatically.

## Usage Instructions

### Creating a Newsletter
1. Go to `/admin/newsletters`
2. Click "Create Newsletter"
3. Fill in title, subject, and content
4. Save as draft or mark as ready
5. Review and send to subscribers

### Sending a Newsletter
1. Open the newsletter
2. Click "Send"
3. Review subscriber count
4. Confirm to send to all active subscribers
5. Monitor send status in the dashboard

### Viewing Analytics
1. Navigate to `/admin/visitors`
2. View real-time visitor data
3. Check the 30-day trend chart
4. Export data as needed

## API Endpoints

### Newsletter Management
- `POST /api/admin/newsletters` - Create newsletter
- `PUT /api/admin/newsletters` - Update newsletter
- `POST /api/admin/newsletters/send` - Send newsletter

### Visitor Tracking
- `POST /api/track-visitor` - Track page visit

## Next Steps

1. **Add Authentication**: Protect admin routes with login
2. **Email Templates**: Create rich HTML email templates
3. **Export Features**: Add CSV export for subscribers
4. **Advanced Analytics**: Add more detailed visitor insights
5. **Scheduled Sends**: Add scheduling for newsletters
6. **A/B Testing**: Test different email subjects
7. **Segmentation**: Create subscriber segments

## Support

For issues or questions, contact: kbrahmateja@gmail.com
