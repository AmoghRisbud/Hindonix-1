# 🚀 Hostinger Deployment Guide - Hindonix

Complete step-by-step guide to deploy your Hindonix project to Hostinger shared hosting with Node.js support.

---

## 📋 Before You Start

### Required Access & Credentials

- ✅ Hostinger hPanel login
- ✅ MySQL database credentials (from Hostinger)
- ✅ Cloudinary account credentials
- ✅ Clerk authentication keys (production)
- ✅ Domain or subdomain configured

---

## 🔧 STEP 1: Prepare Your Project Locally

### 1.1 Build the Frontend

```bash
# From project root folder
npm run build
```

This creates a `dist/` folder with optimized static files.

### 1.2 Copy Frontend Build to Server Public Folder

```bash
# Windows PowerShell
xcopy /E /I dist server\public

# OR manually:
# Copy everything from dist/ folder → server/public/ folder
```

Your `server/` folder should now look like:

```
server/
├── node_modules/
├── prisma/
├── src/
├── public/          ⭐ NEW - Your built React app
│   ├── index.html
│   ├── assets/
│   ├── images/
│   └── env-config.js
├── package.json
└── tsconfig.json
```

### 1.3 Build the Server

```bash
cd server
npm run build
```

This creates a `server/dist/` folder with compiled JavaScript.

---

## 🌐 STEP 2: Set Up MySQL Database on Hostinger

### 2.1 Create Database

1. Log in to **Hostinger hPanel**
2. Go to **Databases** → **MySQL Databases**
3. Click **Create Database**
4. Fill in:
   - Database name: `hindonix_db` (or your choice)
   - Username: Will be auto-created (format: `cpanel_dbuser`)
   - Password: Create a strong password
5. Click **Create**

### 2.2 Note Your Database Credentials

You'll need these for the `.env` file:

```
Host: localhost
Port: 3306
Database: u123456789_hindonix_db
Username: u123456789_dbuser
Password: [your password]
```

---

## ☁️ STEP 3: Configure Cloudinary

### 3.1 Create Upload Presets

1. Go to **Cloudinary Dashboard** → **Settings** → **Upload**
2. Scroll to **Upload presets**
3. Click **Add upload preset**

**Create Preset 1: General Uploads**

- Preset name: `hindonix_unsigned`
- Signing mode: **Unsigned**
- Folder: `hindonix`
- Overwrite: `false`
- Unique filename: `true`
- Click **Save**

**Create Preset 2: Hero Images**

- Preset name: `hindonix_hero`
- Signing mode: **Unsigned**
- Folder: `hindonix`
- Overwrite: `true` ⭐ (allows replacing hero image)
- Unique filename: `false`
- Click **Save**

### 3.2 Get Your Cloudinary Credentials

From Cloudinary Dashboard:

- Cloud name: `dlt9vf8qk` (example)
- API Key: Found in dashboard
- API Secret: Found in settings (keep secure!)

---

## 🔐 STEP 4: Create Production Environment Files

### 4.1 Update `public/env-config.js`

In `server/public/env-config.js`, update with your production values:

```javascript
window.__ENV__ = {
  VITE_CLOUDINARY_CLOUD_NAME: "dlt9vf8qk",
  VITE_CLOUDINARY_UPLOAD_PRESET: "hindonix_unsigned",
  VITE_CLOUDINARY_HERO_UPLOAD_PRESET: "hindonix_hero",
  VITE_CLERK_PUBLISHABLE_KEY: "pk_live_xxxxxxxxxxxxxxxxxxxxxxx",
};
```

⚠️ **Important**: Use your Clerk **production** publishable key, not the test key!

### 4.2 Create `.env.production` (You'll create this on server)

Create a file `server/.env.production` with:

```env
# Database (from Step 2)
DATABASE_URL="mysql://u123456789_dbuser:YOUR_PASSWORD@localhost:3306/u123456789_hindonix_db"

# Cloudinary
CLOUDINARY_CLOUD_NAME=dlt9vf8qk
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_secret_here

# Server Port (Hostinger assigns this automatically)
PORT=${PORT:-3000}

# Node Environment
NODE_ENV=production
```

---

## 📤 STEP 5: Upload to Hostinger

### 5.1 Prepare Upload Package

Create a ZIP file of your `server/` folder:

**Windows:**

```bash
# In PowerShell, from project root
Compress-Archive -Path server\* -DestinationPath hindonix-server.zip
```

**What to include:**

- ✅ `dist/` (compiled server code)
- ✅ `public/` (built React app)
- ✅ `prisma/` (schema and seed)
- ✅ `package.json`
- ✅ `node_modules/` is NOT needed (will install on server)

### 5.2 Access Hostinger File Manager

1. Log in to **hPanel**
2. Go to **Files** → **File Manager**
3. Navigate to your web root (usually `/public_html`)

### 5.3 Upload Files

**Option A: Via File Manager (Recommended for first time)**

1. Click **Upload** in File Manager
2. Select your `hindonix-server.zip`
3. Wait for upload to complete
4. Right-click the ZIP → **Extract**
5. Delete the ZIP file after extraction

**Option B: Via FTP (For frequent updates)**

1. Get FTP credentials: hPanel → **Files** → **FTP Accounts**
2. Use FileZilla or WinSCP
3. Upload entire `server/` folder contents to `/public_html`

Your server structure should be:

```
/public_html/         (or /home/username/domains/yourdomain.com/public_html)
├── dist/
├── public/
├── prisma/
├── package.json
└── (no .env yet - create in next step)
```

---

## ⚙️ STEP 6: Configure Node.js Application

### 6.1 Create Node.js Application

1. In **hPanel**, go to **Advanced** → **Node.js**
2. Click **Create Application**
3. Fill in:
   - **Application Root**: `/public_html` (or your custom path)
   - **Application URL**: Select your domain
   - **Application Startup File**: `dist/index.js`
   - **Node.js Version**: Select **18.x** or **20.x** (LTS)
4. Click **Create**

### 6.2 Set Environment Variables

1. In Node.js panel, find your application
2. Click **Edit**
3. Scroll to **Environment Variables**
4. Add each variable (click **+ Add Variable** for each):

```
NODE_ENV = production
DATABASE_URL = mysql://u123456789_dbuser:password@localhost:3306/u123456789_hindonix_db
CLOUDINARY_CLOUD_NAME = dlt9vf8qk
CLOUDINARY_API_KEY = your_key_here
CLOUDINARY_API_SECRET = your_secret_here
```

5. Click **Save**

---

## 📦 STEP 7: Install Dependencies & Setup Database

### 7.1 Access Terminal

**Option A: hPanel Terminal** (if available)

1. hPanel → **Advanced** → **Terminal**

**Option B: SSH** (if enabled)

```bash
ssh username@yourdomain.com
```

### 7.2 Install Node Modules

```bash
cd /public_html  # Or your application root
npm install --production
```

This will install all dependencies from `package.json`.

### 7.3 Generate Prisma Client

```bash
npx prisma generate
```

### 7.4 Create Database Tables

```bash
npx prisma db push
```

This creates all tables based on your schema.

### 7.5 Seed Initial Data

```bash
npx prisma db seed
```

This populates your database with categories, finishes, sample products, etc.

---

## 🚀 STEP 8: Start Your Application

### 8.1 Start the Node.js App

1. Go back to **hPanel** → **Node.js**
2. Find your application
3. Click the **Toggle** button to start
4. Status should change to **Running** (green)

### 8.2 View Logs

If the app doesn't start:

1. Click on your application
2. Go to **Logs** tab
3. Check for errors

Common startup issues:

- ❌ Missing dependencies → Run `npm install`
- ❌ Database connection failed → Check DATABASE_URL
- ❌ Port already in use → Hostinger will assign a port automatically

---

## ✅ STEP 9: Verify Deployment

### 9.1 Test Your Website

Visit your domain: `https://yourdomain.com`

**Expected Results:**

- ✅ Homepage loads correctly
- ✅ Images display (Cloudinary)
- ✅ Navigation works
- ✅ All pages accessible

### 9.2 Test API Endpoints

Visit: `https://yourdomain.com/api/health`

Should return:

```json
{ "status": "ok" }
```

### 9.3 Test Admin Panel

1. Go to `https://yourdomain.com/admin`
2. Log in with Clerk (use your production Clerk account)
3. Verify:
   - ✅ Can view products
   - ✅ Can upload images
   - ✅ Can add/edit products
   - ✅ Hero images work

### 9.4 Test Full Flow

1. Upload a product with image
2. Visit products page
3. Verify product appears
4. Upload a hero image
5. Refresh homepage
6. Verify hero image updates

---

## 🔒 STEP 10: Enable HTTPS (SSL)

### 10.1 Activate SSL Certificate

1. hPanel → **Security** → **SSL/TLS**
2. Select your domain
3. Click **Install SSL** (Free Let's Encrypt)
4. Wait for activation (usually instant)

### 10.2 Force HTTPS Redirect

Create/edit `.htaccess` in `/public_html`:

```apache
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
```

---

## 🔄 Updating Your Site (Future Changes)

### For Frontend Changes:

```bash
# Local machine
npm run build
xcopy /E /Y dist server\public

# Upload server/public/ to Hostinger via FTP
# No need to restart - static files update immediately
```

### For Backend Changes:

```bash
# Local machine
cd server
npm run build

# Upload server/dist/ to Hostinger
# Then in hPanel → Node.js → Restart application
```

### For Database Schema Changes:

```bash
# Local machine
cd server
npx prisma migrate dev --name your_change_description

# On Hostinger via SSH/Terminal
npx prisma db push
```

---

## 🐛 Troubleshooting

### ❌ "Cannot GET /" or 404 Errors

**Cause**: Static files not being served or routes misconfigured

**Fix**:

1. Verify `server/public/` contains your built frontend
2. Check `dist/index.js` has the static file serving code
3. Ensure `NODE_ENV=production` is set in environment variables
4. Restart the Node.js application

### ❌ "Database connection failed"

**Cause**: Wrong DATABASE_URL

**Fix**:

1. Verify credentials in hPanel → MySQL Databases
2. Ensure host is `localhost` not `127.0.0.1`
3. Check format: `mysql://user:pass@localhost:3306/dbname`
4. Test connection via phpMyAdmin

### ❌ "Module not found" errors

**Cause**: Dependencies not installed

**Fix**:

```bash
cd /public_html
rm -rf node_modules
npm install --production
npx prisma generate
```

### ❌ Images not uploading

**Cause**: Cloudinary credentials incorrect

**Fix**:

1. Check `public/env-config.js` has correct values
2. Verify upload presets exist in Cloudinary
3. Ensure presets are set to **Unsigned** mode
4. Check browser console for specific errors

### ❌ Admin login doesn't work

**Cause**: Using test Clerk keys instead of production

**Fix**:

1. Go to Clerk Dashboard → Your App
2. Switch to **Production** environment
3. Copy production publishable key
4. Update `public/env-config.js`
5. Re-upload the file

### ❌ Carousel/Hero images not showing

**Cause**: Database not seeded or hero images not uploaded

**Fix**:

1. Visit `/admin` and upload a hero image
2. Or run: `npx prisma db seed`
3. Check MySQL database has `HeroImage` table with data

### ❌ "Too Many Redirects" error

**Cause**: HTTPS redirect loop

**Fix**:
Check `.htaccess` has correct redirect rules (see Step 10.2)

---

## 📊 Performance Optimization

### Enable Opcode Caching

Already enabled by default on most Hostinger plans (OPcache for PHP, but Node.js doesn't need this)

### Database Indexing

Prisma automatically creates indexes. Check `schema.prisma` for `@@index` directives.

### CDN Setup (Optional)

Consider using Cloudflare for:

- Faster global loading
- DDoS protection
- Additional caching

---

## 📞 Support Resources

### Hostinger Support

- **24/7 Live Chat**: Available in hPanel
- **Knowledge Base**: https://support.hostinger.com
- **Ticket System**: hPanel → Help → Submit Request

### Database Issues

- Use **phpMyAdmin** (hPanel → Databases) to inspect tables
- Check table structure matches Prisma schema
- Verify data was seeded correctly

### Application Logs

- hPanel → Node.js → Your App → **Logs** tab
- Shows server startup errors and runtime errors

---

## ✨ Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] HTTPS is working (padlock icon)
- [ ] All pages accessible (Home, About, Products, Blogs, Contact)
- [ ] Admin panel login works
- [ ] Can add/edit/delete products
- [ ] Image uploads work (Cloudinary)
- [ ] Hero images display correctly
- [ ] Forms submit successfully (Contact form)
- [ ] Mobile responsive design works
- [ ] Database has initial data (categories, finishes)
- [ ] API endpoints respond correctly
- [ ] No console errors in browser

---

## 🎉 Congratulations!

Your Hindonix application is now live on Hostinger!

**Next Steps:**

- Set up regular backups (hPanel → Backups)
- Monitor application logs
- Test all features thoroughly
- Share your site with stakeholders

**Need Help?**

- Check logs: hPanel → Node.js → Logs
- Review this guide thoroughly
- Contact Hostinger support if infrastructure issues persist

---

**Last Updated**: April 11, 2026
**Version**: 1.0.0
