# 🚀 Quick Deployment Checklist

Use this checklist to ensure you don't miss any steps when deploying to Hostinger.

## Pre-Deployment (Local)

- [ ] Run `npm run build` (frontend build creates `dist/` folder)
- [ ] Copy `dist/*` to `server/public/` folder
- [ ] Run `cd server && npm run build` (backend TypeScript compilation)
- [ ] Update `server/public/env-config.js` with production values:
  - [ ] Cloudinary cloud name
  - [ ] Cloudinary upload presets (2 presets needed)
  - [ ] Clerk production publishable key (pk_live_xxx)
- [ ] Verify `server/dist/index.js` exists
- [ ] Create ZIP of `server/` folder (optional, for upload)

## Hostinger Setup

### Database

- [ ] Create MySQL database in hPanel → Databases
- [ ] Note database credentials (host, user, password, database name)
- [ ] Test connection via phpMyAdmin (optional)

### Cloudinary

- [ ] Create unsigned upload preset: `hindonix_unsigned`
- [ ] Create unsigned upload preset with overwrite: `hindonix_hero`
- [ ] Note cloud name, API key, API secret

### Clerk

- [ ] Switch to Production environment in Clerk dashboard
- [ ] Copy production publishable key (starts with pk*live*)
- [ ] Update allowed origins to include your domain

## Upload to Hostinger

- [ ] Upload `server/` folder to `/public_html` (via File Manager or FTP)
- [ ] Verify folder structure:
  - [ ] `dist/` folder exists (compiled backend)
  - [ ] `public/` folder exists (built frontend)
  - [ ] `prisma/` folder exists (schema + seed)
  - [ ] `package.json` exists

## Node.js Configuration

- [ ] Create Node.js application in hPanel → Advanced → Node.js
- [ ] Set Application Startup File: `dist/index.js`
- [ ] Select Node.js version: 18.x or 20.x
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `DATABASE_URL=mysql://...`
  - [ ] `CLOUDINARY_CLOUD_NAME=...`
  - [ ] `CLOUDINARY_API_KEY=...`
  - [ ] `CLOUDINARY_API_SECRET=...`

## Terminal Commands (SSH or hPanel Terminal)

```bash
cd /public_html  # Or your app directory

# Install dependencies
npm install --production

# Generate Prisma client
npx prisma generate

# Create database tables
npx prisma db push

# Seed initial data
npx prisma db seed
```

- [ ] All commands completed successfully
- [ ] No errors in terminal output

## Start Application

- [ ] Start Node.js app in hPanel (toggle switch)
- [ ] Application status shows "Running" (green)
- [ ] Check logs for any startup errors

## Testing

### Basic Tests

- [ ] Visit `https://yourdomain.com` → Homepage loads
- [ ] Visit `https://yourdomain.com/api/health` → Returns `{"status":"ok"}`
- [ ] Navigate to `/about` → Page loads
- [ ] Navigate to `/products` → Products display
- [ ] Navigate to `/blogs` → Blogs display
- [ ] Navigate to `/contact` → Contact form appears

### Admin Tests

- [ ] Visit `/admin` → Clerk login appears
- [ ] Login successful with production account
- [ ] Products list loads
- [ ] Can upload product image (Cloudinary test)
- [ ] Can add new product
- [ ] Can edit existing product
- [ ] Can upload hero image

### Image Tests

- [ ] Hero image displays on homepage
- [ ] Product images display on products page
- [ ] Image uploads work in admin
- [ ] Images are optimized (check Network tab)

### Mobile Tests

- [ ] Site is responsive on mobile
- [ ] Navigation menu works
- [ ] Images load properly
- [ ] Forms are usable

## Security

- [ ] HTTPS/SSL enabled (green padlock in browser)
- [ ] Force HTTPS redirect configured (.htaccess)
- [ ] Environment variables are NOT exposed in frontend
- [ ] API secrets are server-side only

## Performance

- [ ] Page load time < 3 seconds
- [ ] Images are compressed/optimized
- [ ] No console errors in browser
- [ ] API responses are fast (< 1 second)

## Final Checks

- [ ] All forms submit correctly
- [ ] No broken links
- [ ] Favicon displays
- [ ] Meta tags correct (SEO)
- [ ] Social share images work (optional)
- [ ] Analytics setup (optional, if using)

## Post-Deployment

- [ ] Set up automatic backups in hPanel
- [ ] Monitor application logs daily (first week)
- [ ] Test all features again after 24 hours
- [ ] Share site with stakeholders
- [ ] Update DNS if needed (for custom domain)

---

## Common Issues Quick Reference

**Issue**: App won't start
→ Check logs in hPanel → Node.js → Logs
→ Verify DATABASE_URL is correct
→ Ensure `npm install` completed successfully

**Issue**: 404 on all pages
→ Verify `public/` folder has index.html
→ Check NODE_ENV=production is set
→ Restart Node.js application

**Issue**: Images won't upload
→ Check Cloudinary credentials in env-config.js
→ Verify upload presets exist and are unsigned
→ Check browser console for errors

**Issue**: Admin login fails
→ Ensure using Clerk production keys (pk_live_xxx)
→ Check allowed origins in Clerk dashboard
→ Clear browser cache and cookies

**Issue**: Database errors
→ Run `npx prisma generate`
→ Run `npx prisma db push`
→ Check DATABASE_URL format is correct

---

✅ **When all items are checked, your deployment is complete!**

Refer to [HOSTINGER_DEPLOYMENT_GUIDE.md](HOSTINGER_DEPLOYMENT_GUIDE.md) for detailed instructions on any step.
