# Quick Testing Guide - Hero Images Feature

## Test Case 1: Upload Single Image

**Steps:**

1. Go to http://localhost:5173/admin (login required)
2. Scroll to "Manage Hero Images"
3. Click "Choose Files" → Select 1 image
4. Wait for upload → Green checkmark appears
5. Click "Update Hero Images"
6. Go to homepage (http://localhost:5173)

**Expected:**

- Admin preview shows single image
- Homepage displays single hero image (no carousel)
- Image is the one you uploaded

---

## Test Case 2: Upload Multiple Images

**Steps:**

1. Go to /admin → "Manage Hero Images"
2. Click "Choose Files" → Select 3+ images
3. Wait for all uploads to complete
4. Preview shows horizontal scroll with all images
5. Click "Update Hero Images"
6. Go to homepage

**Expected:**

- Admin preview shows all thumbnails side-by-side
- Homepage shows carousel with navigation arrows
- Images auto-slide every 4 seconds
- Can manually click arrows to navigate
- After last image, loops back to first

---

## Test Case 3: Remove Image Before Saving

**Steps:**

1. Upload 3 images
2. Hover over middle thumbnail in preview
3. Click the "×" button
4. Click "Update Hero Images"
5. Go to homepage

**Expected:**

- Middle image disappears from preview
- Homepage carousel shows only 2 images
- Removed image is not in rotation

---

## Test Case 4: Add More Images to Existing Set

**Steps:**

1. Already have 2 images saved
2. Upload 1 more image (don't clear previous)
3. Preview shows all 3
4. Click "Update Hero Images"
5. Homepage refreshes

**Expected:**

- New image added to existing set
- Homepage now shows 3 images in carousel
- Order: old images first, new image last

---

## Test Case 5: Replace All Images

**Steps:**

1. Upload new set of images
2. Remove all old images using "×" button
3. Only new images remain
4. Click "Update Hero Images"

**Expected:**

- Admin shows only new images
- Homepage carousel updates to show new set
- Old images no longer appear

---

## Test Case 6: Edge Case - No Images

**Steps:**

1. Remove all images from selection
2. Try clicking "Update Hero Images"

**Expected:**

- Button is disabled
- OR error toast: "Please upload at least one image"

---

## Test Case 7: Carousel Autoplay

**Steps:**

1. Ensure 3+ images are saved
2. Go to homepage
3. Watch carousel for 12 seconds (3 transitions)

**Expected:**

- Image 1 shows for 4 seconds
- Slides to Image 2, shows for 4 seconds
- Slides to Image 3, shows for 4 seconds
- Loops back to Image 1
- Smooth transitions

---

## Test Case 8: Manual Navigation Override

**Steps:**

1. Homepage with carousel
2. Click right arrow 2 times quickly
3. Wait (autoplay should reset)

**Expected:**

- Manual clicks work immediately
- After manual click, autoplay continues from new position
- No conflicts between manual and auto navigation

---

## Quick Smoke Test Commands

```bash
# Start dev server
npm run dev

# Open in browser
# http://localhost:5173 (homepage)
# http://localhost:5173/admin (admin panel)
```

---

## Common Issues & Fixes

**Issue:** Upload button does nothing

- **Fix:** Check browser console for Cloudinary errors
- Verify `.env.local` has VITE*CLOUDINARY*\* variables

**Issue:** Carousel doesn't slide

- **Fix:** Check if >1 image exists
- Open DevTools → Console for errors

**Issue:** Images not saving

- **Fix:** Check Redis connection (Upstash)
- Verify `VITE_UPSTASH_REDIS_REST_*` env vars

**Issue:** Preview shows "No images"

- **Fix:** Upload images first
- Check if Cloudinary upload succeeded

---

## Performance Checks

✅ Single image: No carousel overhead, fast load
✅ Multiple images: Smooth transitions, no lag
✅ Large images: Cloudinary auto-optimizes
✅ Mobile: Should be responsive (test on phone)

---

## Browser Compatibility

- Chrome ✅
- Firefox ✅
- Safari ✅
- Edge ✅
- Mobile Safari ✅
- Chrome Mobile ✅

---

**Note:** Ensure you're logged in to Clerk before accessing /admin
**Tip:** Use Ctrl+Shift+R to hard refresh if changes don't appear
