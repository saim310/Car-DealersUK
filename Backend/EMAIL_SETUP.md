# Finance Enquiry Email Notification Setup

## Overview
Finance enquiry notifications are now automatically sent to your company email when customers submit a finance enquiry form.

## Configuration Steps

### 1. Gmail Setup (Recommended)
If using Gmail for sending emails:

1. **Enable 2-Factor Authentication** on your Google Account
2. **Generate an App Password**:
   - Go to [Google Account Security](https://myaccount.google.com/security)
   - Click on "App passwords"
   - Select "Mail" and "Windows Computer" (or your device)
   - Google will generate a 16-character password
   - Copy this password

### 2. Update `.env` File
Edit `Backend/.env` and add your email credentials:

```env
# Email Configuration for Enquiries Notification
EMAIL_USER=your_company_email@gmail.com
EMAIL_PASSWORD=your_16_character_app_password

# Admin email - receives enquiry notifications
ADMIN_EMAIL=admin@yourdomain.com

# Dashboard URL for email links
ADMIN_DASHBOARD_URL=https://ukaautotrade.co.uk/dashboard/finance-enquiries
```

### 3. Environment Variables Explained

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Gmail address sending the emails | `noreply@company.com` |
| `EMAIL_PASSWORD` | App-specific password from Google | `abcd efgh ijkl mnop` |
| `ADMIN_EMAIL` | Email to receive enquiry notifications | `finance@company.com` |
| `ADMIN_DASHBOARD_URL` | Link in email to view enquiry | `https://yourdomain.com/dashboard` |

### 4. Alternative Email Providers
If not using Gmail, update `Backend/services/emailService.js`:

```javascript
const transporter = nodemailer.createTransport({
  service: 'your-email-service', // e.g., 'outlook', 'yahoo'
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

## Features

✅ **Automatic Notifications**: Email sent when new finance enquiry is submitted
✅ **Rich HTML Email**: Formatted email with all enquiry details
✅ **Customer Info**: Full name, phone, email, contact details
✅ **Finance Details**: Borrow amount, term, use type
✅ **Personal Info**: Employment, residency, property owner status
✅ **Dashboard Link**: Direct link to view enquiry in dashboard
✅ **Graceful Fallback**: Enquiry saved even if email fails

## Email Content Includes

- Customer information (name, email, phone)
- Finance details (amount, term, use type)
- Personal information (employment, residency, property owner status)
- Previous finance and credit history
- Customer message (if provided)
- Submission timestamp
- Link to view in dashboard

## Troubleshooting

### Email Not Sending?
1. Check `.env` file has correct credentials
2. Verify Gmail 2FA is enabled and app password is generated
3. Check Backend console logs for errors
4. Ensure firewall/antivirus allows SMTP connections
5. Try using a Gmail test address first

### Common Issues
- **Authentication Failed**: Wrong app password - regenerate in Google Account
- **Connection Refused**: Check internet connection or firewall
- **Invalid Email**: Verify EMAIL_USER is a valid Gmail address
- **403 Error**: Enable "Less secure app access" if not using app passwords

## Production Setup

For production, use:
- **Email Service**: SendGrid, AWS SES, or Mailgun (more reliable)
- **Admin Email**: Dedicated support email (e.g., finance@yourdomain.com)
- **Dashboard URL**: Your production dashboard URL

Update `.env`:
```env
EMAIL_USER=sendgrid_api_key
EMAIL_PASSWORD=sendgrid_api_value
ADMIN_EMAIL=finance@yourdomain.com
ADMIN_DASHBOARD_URL=https://yourdomain.com/dashboard/finance-enquiries
```

## Testing

To test the email functionality:
1. Fill out a finance enquiry form on the frontend
2. Check the admin email inbox
3. Verify email contains all enquiry details
4. Click "View in Dashboard" link to verify connectivity

## Support

If emails are not working:
1. Check Backend logs: `npm run dev`
2. Verify `.env` variables are set correctly
3. Test with a simpler email provider first (Gmail)
4. Check spam folder in email account
