# Google Sheets Contact Form Setup Guide

## Quick Troubleshooting Checklist

If the form is not saving data to Google Sheets, check:

1. ✅ **Environment Variable Set**: Check `.env.local` has `VITE_GOOGLE_SHEETS_WEB_APP_URL`
2. ✅ **Dev Server Restarted**: Restart `npm run dev` after changing `.env.local`
3. ✅ **Apps Script Deployed**: Must deploy as Web App, not just save
4. ✅ **Correct URL**: URL should end with `/exec` not `/dev`
5. ✅ **Access Settings**: Apps Script must have "Who has access: Anyone"
6. ✅ **Sheet Name**: Sheet must be named "Contact Submissions" (or update script)
7. ✅ **Headers Present**: Row 1 must have all column headers

## Detailed Setup Steps

### Step 1: Create Google Sheet

1. Go to https://sheets.google.com
2. Create a new sheet
3. Rename it to "Hindonix Contact Submissions"
4. In Row 1, add these headers:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Name | Email | Phone | Company | Country | City | Subject | Message | Submission ID |

### Step 2: Setup Google Apps Script

1. In your Google Sheet, click: **Extensions → Apps Script**
2. Delete any existing code in the editor
3. Copy ALL code from `google-apps-script-code.gs`
4. Paste into the Apps Script editor
5. **Save the project** (Ctrl+S or click the disk icon)
6. Name it: "Hindonix Contact Form"

### Step 3: Deploy as Web App

**IMPORTANT**: You must DEPLOY, not just save!

1. Click **Deploy** button (top right)
2. Select **New deployment**
3. Click the gear icon next to "Select type"
4. Choose **Web app**
5. Configure settings:
   - **Description**: "Contact Form Handler" (optional)
   - **Execute as**: **Me** (your Google account)
   - **Who has access**: **Anyone** (IMPORTANT!)
6. Click **Deploy**
7. **Authorize** the script when prompted:
   - Click "Authorize access"
   - Choose your Google account
   - Click "Advanced" if you see a warning
   - Click "Go to [Project Name] (unsafe)"
   - Click "Allow"
8. **Copy the Web App URL** - it looks like:
   ```
   https://script.google.com/macros/s/AKfycby.../exec
   ```
   **MUST END WITH `/exec`** not `/dev`

### Step 4: Configure Environment Variable

1. Open `.env.local` in your project root
2. Find the line:
   ```
   VITE_GOOGLE_SHEETS_WEB_APP_URL=...
   ```
3. Replace with your Web App URL:
   ```
   VITE_GOOGLE_SHEETS_WEB_APP_URL=https://script.google.com/macros/s/YOUR_ACTUAL_ID/exec
   ```
4. **Save the file**

### Step 5: Restart Dev Server

**CRITICAL**: Environment variables only load on startup!

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 6: Test the Form

1. Open http://localhost:5173/contact
2. Open browser DevTools (F12) and go to Console tab
3. Fill out the contact form
4. Click Submit
5. Check the Console for logs:
   - Should see: "Submitting form to Google Sheets..."
   - Should see: "Form submitted successfully: {...}"
6. Check your Google Sheet - you should see the submission!

## Common Issues & Solutions

### Issue: "Google Sheets Web App URL not configured"

**Solution**: 
- Check `.env.local` has the variable
- Restart the dev server with `npm run dev`
- The URL must start with `VITE_` prefix

### Issue: "Network error" or "Failed to fetch"

**Solutions**:
- Check you're connected to the internet
- Check the URL is correct and ends with `/exec`
- Make sure you DEPLOYED (not just saved) the Apps Script
- Verify "Who has access" is set to "Anyone"

### Issue: Form submits but no data in sheet

**Solutions**:
- Check the sheet name matches `SHEET_NAME` in Apps Script (default: "Contact Submissions")
- Verify row 1 has the correct headers
- Check Apps Script execution logs:
  1. Go to Apps Script editor
  2. Click "Executions" (clock icon on left)
  3. Look for recent runs and any errors

### Issue: "Authorization required"

**Solution**:
- The script needs to be authorized once
- Go to Apps Script editor
- Run the `testSubmission` function manually
- Follow the authorization prompts
- Then try the form again

### Issue: CORS error in console

**Solution**:
- This usually means the deployment settings are wrong
- Redeploy and ensure "Who has access" is "Anyone"
- Make sure you're using the `/exec` URL, not `/dev`

## Testing the Script Directly

To test if the Apps Script is working:

1. Go to Apps Script editor
2. Change the function dropdown to `testSubmission`
3. Click the Run button
4. Check your Google Sheet - should see a test entry
5. If this works but the form doesn't, the issue is with the frontend

## Updating the Script

If you need to change the Apps Script code:

1. Edit the code in Apps Script editor
2. **Save** the changes
3. Click **Deploy → Manage deployments**
4. Click the pencil icon (Edit) next to your deployment
5. Change **Version** to "New version"
6. Click **Deploy**
7. The URL stays the same - no need to update `.env.local`

## Optional: Email Notifications

To receive an email when someone submits the form:

1. In `google-apps-script-code.gs`, find the `sendEmailNotification` function
2. Uncomment it (remove the `/*` and `*/`)
3. Change `your-admin-email@example.com` to your email
4. In the `appendToSheet` function, uncomment:
   ```javascript
   sendEmailNotification(data);
   ```
5. Save and redeploy

## Monitoring Submissions

### View in Google Sheet
- Open your sheet to see all submissions in real-time
- Data is appended, never overwrites

### Check Script Logs
1. Apps Script editor → Executions (clock icon)
2. See all recent runs, execution time, and any errors

### Export Data
- File → Download → CSV or Excel
- All submission data is exportable anytime

## Security Notes

✅ **Safe**:
- The Web App URL is public - this is intentional and safe
- No sensitive credentials are exposed
- Input validation prevents malicious data
- Rate limiting prevents spam

⚠️ **Optional Improvements**:
- Add Google reCAPTCHA to the form
- Implement IP-based rate limiting
- Add webhook for spam detection
- Use Google Sheets API instead (requires backend)

## Need Help?

1. Check browser DevTools Console for errors
2. Check Apps Script Executions for server-side errors  
3. Verify all steps in this guide
4. Make sure dev server was restarted after env changes
