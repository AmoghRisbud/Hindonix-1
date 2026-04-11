# GitHub Deployment Guide for Hostinger

## 🚀 Deploy from GitHub to Hostinger

This guide shows you how to deploy directly from your GitHub repository to Hostinger using their Git integration.

---

## ✅ Prerequisites

- ✅ GitHub repository with your code
- ✅ Hostinger account with Node.js hosting
- ✅ MySQL database created in Hostinger
- ✅ Cloudinary account credentials
- ✅ Clerk production keys

---

## Step 1: Push Your Code to GitHub

### 1.1 Remove Build Artifacts (Already Done)

The `.gitignore` has been updated to exclude:
- `dist/` (frontend build)
- `server/dist/` (backend build)
- `server/public/` (deployed frontend)
- `.env` files

### 1.2 Commit and Push

```bash
# Add all changes
git add .

# Commit with a message
git commit -m "feat: prepare for Hostinger GitHub deployment"

# Push to your branch
git push origin backend/express-prisma-mysql

# Or create/push to main branch
git checkout -b main
git push origin main
```

---

## Step 2: Configure Hostinger Node.js Application

### 2.1 Create Node.js Application

1. Log in to **Hostinger hPanel**
2. Go to **Advanced** → **Node.js**
3. Click **Create Application**
4. Select your domain

### 2.2 Configuration Settings

Fill in:

- **Application Root**: `/` (repository root)
- **Application Startup File**: `server/dist/index.js`
- **Node.js Version**: `20.x` or `18.x`

**Application Mode**: `production`

Click **Create** (don't start yet)

---

## Step 3: Connect to GitHub

### 3.1 Link GitHub Repository

1. In your Node.js application settings, find **GitHub Integration** section
2. Click **Connect to GitHub**
3. Authorize Hostinger to access your GitHub account
4. Select your repository: `Hindonix`
5. Select branch: `main` or `backend/express-prisma-mysql`
6. Click **Connect**

### 3.2 Configure Build Settings

In the Node.js application settings:

**Build Command** (This runs on every deployment):
```bash
npm run deploy:build
```

**OR if that doesn't work, use individual commands**:
```bash
npm install && npm run build && mkdir -p server/public && cp -r dist/* server/public/ && cd server && npm install --production && npm run build && npx prisma generate
```

**Start Command**:
```bash
npm start
```

---

## Step 4: Set Environment Variables

In hPanel → Node.js → Your App → **Environment Variables**, add:

```env
NODE_ENV=production

# Database (from Hostinger MySQL panel)
DATABASE_URL=mysql://u123456_dbuser:password@localhost:3306/u123456_hindonix

# Cloudinary
CLOUDINARY_CLOUD_NAME=dlt9vf8qk
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_secret_here

# Clerk (production keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxx
```

**Note**: Frontend env vars (VITE_*) should be in `public/env-config.js` which you commit to Git:

```javascript
// public/env-config.js
window.__ENV__ = {
  VITE_CLOUDINARY_CLOUD_NAME: 'dlt9vf8qk',
  VITE_CLOUDINARY_UPLOAD_PRESET: 'hindonix_unsigned',
  VITE_CLOUDINARY_HERO_UPLOAD_PRESET: 'hindonix_hero',
  VITE_CLERK_PUBLISHABLE_KEY: 'pk_live_xxxxxxxxxxxxxxxx',
};
```

Update this file and commit it to GitHub.

---

## Step 5: Setup Database (First Time Only)

### 5.1 Access Terminal

**Via hPanel Terminal or SSH**:

```bash
cd ~/domains/yourdomain.com/public_html
# Or wherever your app is deployed

# Setup database
npm run deploy:setup
```

This runs:
- `npx prisma db push` - Creates tables
- `npx prisma db seed` - Seeds initial data

### 5.2 Manual Alternative (if npm script doesn't work)

```bash
cd server
npx prisma db push
npx prisma db seed
```

---

## Step 6: Deploy!

### 6.1 Initial Deployment

1. In hPanel → Node.js → Your Application
2. Click **Deploy** or **Start**
3. Hostinger will:
   - Clone your GitHub repo
   - Run `npm install`
   - Run your build command
   - Start the application

4. Monitor the **Build Logs** tab to see progress

### 6.2 Check Deployment Status

- Status should show **Running** (green)
- If errors, check **Logs** tab

---

## Step 7: Auto-Deploy on Git Push

Once GitHub is connected, **every time you push to your branch**, Hostinger will automatically:

1. Pull latest code
2. Run build command
3. Restart application

### Deploying Updates

```bash
# Make your changes locally
git add .
git commit -m "feat: add new feature"
git push origin main

# Wait 1-2 minutes
# Hostinger automatically rebuilds and redeploys!
```

---

## Step 8: Verify Deployment

Visit your site:

- ✅ `https://yourdomain.com` - Homepage loads
- ✅ `https://yourdomain.com/api/health` - Returns `{"status":"ok"}`
- ✅ `/admin` - Clerk login works
- ✅ Test image uploads

---

## 📋 Workflow Summary

```
Local Development
    ↓
git push origin main
    ↓
GitHub Repository
    ↓
Hostinger Auto-Deploy
    ↓
  1. npm install
  2. npm run build
  3. Copy dist → server/public
  4. cd server
  5. npm install --production
  6. npm run build
  7. npx prisma generate
    ↓
npm start (server/dist/index.js)
    ↓
🎉 Live Site!
```

---

## 🔧 Troubleshooting

### Build Fails

**Check Build Logs**:
- hPanel → Node.js → Your App → **Logs** tab
- Look for errors in npm install or build commands

**Common Issues**:
- Node version mismatch → Set `.node-version` file to `20`
- Missing dependencies → Check package.json
- Build command syntax → Use `&&` to chain commands

### Database Connection Fails

- Verify `DATABASE_URL` in environment variables
- Ensure MySQL database is created
- Check credentials match Hostinger MySQL panel

### Environment Variables Not Loading

- Set them in hPanel Node.js panel (server-side vars)
- For frontend vars, use `public/env-config.js` (committed to Git)

### App Won't Start

- Check `server/dist/index.js` was created during build
- Verify startup file path is correct
- Look at application logs for errors

---

## 🎯 Important Notes

### What to Commit to GitHub:

✅ Commit:
- All source code (`src/`, `server/src/`)
- `package.json` and lock files
- Prisma schema (`server/prisma/schema.prisma`)
- `public/env-config.js` (with production values)
- `.gitignore`, `.node-version`

❌ Don't Commit:
- `node_modules/`
- `dist/` or `server/dist/` (build artifacts)
- `server/public/` (generated during deployment)
- `.env` or `.env.production` (sensitive secrets)

### Environment Variables Strategy:

**Backend (Server-side)**:
- Set in Hostinger hPanel → Node.js → Environment Variables
- Never commit to GitHub

**Frontend (Client-side)**:
- Use `public/env-config.js`
- Safe to commit (no secrets, just public keys)
- Loaded at runtime in browser

---

## 🔄 Updating Your Site

### For Code Changes:

```bash
git add .
git commit -m "your message"
git push origin main
```

Hostinger auto-deploys in ~2 minutes!

### For Database Schema Changes:

```bash
# Locally
cd server
npx prisma migrate dev --name your_change_name

# Commit migration files
git add prisma/migrations/
git commit -m "db: add new migration"
git push origin main

# After deployment, SSH into Hostinger and run:
cd ~/domains/yourdomain.com/public_html/server
npx prisma migrate deploy
```

### For Environment Variable Changes:

1. Update in hPanel → Node.js → Environment Variables
2. Restart application (no git push needed)

---

## ✨ Benefits of GitHub Deployment

✅ **Automatic** - Push code, deployment happens automatically
✅ **Version Control** - Full Git history
✅ **Rollback** - Easy to revert to previous commit
✅ **CI/CD** - Continuous deployment on every push
✅ **No Manual Uploads** - No FTP or file manager needed

---

## 🎉 You're All Set!

Now your workflow is:

1. **Develop locally** → Test with `npm run dev`
2. **Commit changes** → `git commit -m "feat: xyz"`
3. **Push to GitHub** → `git push origin main`
4. **Relax** → Hostinger deploys automatically ☕

---

## Need Help?

- **Build logs**: hPanel → Node.js → Build Logs
- **Application logs**: hPanel → Node.js → Logs
- **Hostinger Support**: 24/7 live chat in hPanel

Happy deploying! 🚀
