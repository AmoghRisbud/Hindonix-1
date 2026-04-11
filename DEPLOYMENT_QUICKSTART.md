# 🚀 Deployment Quick Start Checklist

## ✅ Pre-Deployment Setup (Do Once)

### 1. Cloudinary Setup
- [ ] Go to [cloudinary.com/console/settings/upload](https://cloudinary.com/console/settings/upload)
- [ ] Create unsigned preset: `hindonix_unsigned`
- [ ] Create hero preset: `hindonix_hero` with **overwrite** enabled
- [ ] Note your cloud name: `dlt9vf8qk`

### 2. Update Frontend ENV Config
Edit `public/env-config.js` with production values:

```javascript
window.__ENV__ = {
  VITE_CLOUDINARY_CLOUD_NAME: 'dlt9vf8qk',
  VITE_CLOUDINARY_UPLOAD_PRESET: 'hindonix_unsigned',
  VITE_CLOUDINARY_HERO_UPLOAD_PRESET: 'hindonix_hero',
  VITE_CLERK_PUBLISHABLE_KEY: 'pk_live_xxxxxxxxxxxxxxxx', // Get from Clerk dashboard
};
```

- [ ] Update Clerk publishable key (from [dashboard.clerk.com](https://dashboard.clerk.com))
- [ ] Commit this file to Git

### 3. Prepare GitHub Repository
```bash
# Commit all changes
git add .
git commit -m "feat: prepare for Hostinger deployment"

# Push to GitHub (create main branch if needed)
git push origin backend/express-prisma-mysql
# or
git checkout -b main
git push origin main
```

---

## 🏗️ Hostinger Setup

### 4. Create MySQL Database
- [ ] Login to hPanel → **MySQL Databases**
- [ ] Click **Create Database**
- [ ] Database name: `u123456_hindonix` (note the full name)
- [ ] Create user with password
- [ ] Save credentials somewhere safe

### 5. Create Node.js Application
- [ ] hPanel → **Advanced** → **Node.js**
- [ ] Click **Create Application**
- [ ] Select your domain
- [ ] Set:
  - Application Root: `/`
  - Startup File: `server/dist/index.js`
  - Node.js Version: `20.x`
  - Mode: `production`
- [ ] Click **Create** (don't start yet)

### 6. Connect GitHub
- [ ] In Node.js app settings → **GitHub Integration**
- [ ] Click **Connect to GitHub**
- [ ] Authorize Hostinger
- [ ] Select repository: `Hindonix`
- [ ] Select branch: `main` (or your branch name)
- [ ] Build command: `npm run deploy:build`
- [ ] Start command: `npm start`
- [ ] Save settings

### 7. Set Environment Variables
In Node.js app → **Environment Variables**, add:

```env
NODE_ENV=production
DATABASE_URL=mysql://u123456_user:password@localhost:3306/u123456_hindonix
CLOUDINARY_CLOUD_NAME=dlt9vf8qk
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

- [ ] Replace database credentials
- [ ] Get Cloudinary API key/secret from [cloudinary.com/console/settings/security](https://cloudinary.com/console/settings/security)
- [ ] Save

### 8. Initial Deployment
- [ ] Click **Deploy** or **Start** button
- [ ] Wait 2-3 minutes (watch **Build Logs**)
- [ ] Status should turn green (Running)

### 9. Setup Database (First Time)
Access via SSH or hPanel Terminal:

```bash
cd ~/domains/yourdomain.com/public_html
npm run deploy:setup
```

This creates tables and seeds data.

- [ ] Run database setup
- [ ] Check for errors in terminal

### 10. Verify Deployment
- [ ] Visit `https://yourdomain.com` → Homepage loads
- [ ] Visit `https://yourdomain.com/api/health` → Shows `{"status":"ok"}`
- [ ] Test `/admin` → Clerk login works
- [ ] Test image upload in admin panel

---

## 🔄 Daily Workflow (After Setup)

From now on, deployment is automatic:

```bash
# 1. Make changes locally
# 2. Test with: npm run dev

# 3. Commit and push
git add .
git commit -m "feat: your feature"
git push origin main

# 4. Wait ~2 minutes
# 5. Site automatically updates!
```

---

## 🐛 If Something Goes Wrong

### Build Fails
- [ ] Check hPanel → Node.js → **Logs** tab
- [ ] Look for error messages
- [ ] Common fix: Delete `node_modules` in Hostinger and redeploy

### Database Connection Error
- [ ] Verify `DATABASE_URL` in environment variables
- [ ] Check MySQL database exists
- [ ] Test credentials match hPanel → MySQL

### Images Not Uploading
- [ ] Verify Cloudinary presets exist
- [ ] Check `CLOUDINARY_API_KEY` and `API_SECRET` set
- [ ] Check browser console for errors

### 404 on Routes
- [ ] Ensure frontend is built: `server/public/` should exist
- [ ] Check build logs for "npm run build" success
- [ ] Restart application in hPanel

---

## 📝 Important Commands Reference

### Local Development
```bash
npm run dev                  # Start dev server (Vite + Express)
cd server && npm run dev     # Start backend only
```

### Local Build (Test Before Deploy)
```bash
npm run build               # Build frontend
npm run deploy:build        # Full deployment build (includes backend)
```

### Hostinger (via SSH/Terminal)
```bash
npm run deploy:setup        # Setup database (first time)
npm start                   # Start server
```

---

## 🎯 Checklist Summary

**Before First Deploy:**
- ✅ Cloudinary presets created
- ✅ `public/env-config.js` updated with production keys
- ✅ Code pushed to GitHub
- ✅ MySQL database created in Hostinger
- ✅ Node.js app created and linked to GitHub
- ✅ Environment variables set
- ✅ Database tables created

**For Every Update:**
- ✅ Test locally
- ✅ Commit to Git
- ✅ Push to GitHub
- ✅ Wait for auto-deploy
- ✅ Verify on live site

---

## ✨ You're Done!

Your site auto-deploys on every `git push`. No manual uploads ever again! 🎉
