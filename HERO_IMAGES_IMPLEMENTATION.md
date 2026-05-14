# Hero Images Implementation Guide

## Overview
Successfully implemented **multiple hero image upload and auto-sliding carousel** functionality for the Hindonix project.

## Changes Made

### 1. Backend/Data Layer (`src/lib/redis.ts`)
**Added:**
- `HERO_IMAGES_KEY` constant for storing array of images
- `getHeroImagesFromRedis()` - Returns array of hero image URLs
  - Falls back to single `HERO_IMAGE_KEY` for backward compatibility
  - Returns default image if none found
- `setHeroImagesInRedis()` - Stores array of image URLs as JSON

**Backward Compatibility:**
- If no array exists, falls back to reading single hero image key
- Ensures existing deployments continue working

### 2. Data Access Layer (`src/lib/data.ts`)
**Updated:**
- Replaced `getHeroImage()` → `getHeroImages()` (returns `string[]`)
- Replaced `setHeroImage()` → `setHeroImages()` (accepts `string[]`)
- Updated imports from redis module

### 3. Admin Panel (`src/pages/Admin.tsx`)
**Features Added:**
- **Multiple file upload**: `<input type="file" multiple>` allows selecting multiple images
- **Batch Cloudinary upload**: Loops through selected files and uploads to Cloudinary
- **State management**: 
  - `heroImages` - Current saved images (from Redis)
  - `selectedHeroImages` - Images selected/uploaded but not yet saved
- **Preview section**: 
  - Shows horizontal scrollable thumbnail list when >1 image
  - Hover over image shows "×" button to remove from selection
  - Falls back to single image display if only 1 selected
- **Save button**: Disabled until at least 1 image is selected

**UI Changes:**
- Title: "Manage Hero Image" → "Manage Hero Images"
- Label: "Hero Image" → "Hero Images"
- Button: "Update Hero Image" → "Update Hero Images"
- Status messages show count: "3 image(s) selected"

### 4. Homepage Hero Section (`src/components/home/HeroSection.tsx`)
**Features Added:**
- **Carousel integration**: Uses shadcn/ui `Carousel` component (Embla-based)
- **Auto-play**: Images slide every 4 seconds when multiple images exist
- **Manual controls**: Previous/Next buttons for user control
- **Conditional rendering**:
  - Single image: Standard `<ImageDisplay>` (no carousel overhead)
  - Multiple images: Full carousel with autoplay and navigation
- **Event listener**: Listens for `heroImageUpdated` event to refresh images

**Carousel Configuration:**
- Interval: 4000ms (4 seconds)
- Loop: Yes (goes back to first after last)
- Navigation: Arrow buttons positioned outside carousel
- Keyboard support: Arrow keys work (built into Embla)

## How to Use

### For Admins:
1. Navigate to `/admin` (requires authentication)
2. Scroll to "Manage Hero Images" section
3. Click "Choose Files" and select **one or more images**
4. Wait for Cloudinary upload to complete
5. Preview thumbnails appear on the right
6. Remove unwanted images by hovering and clicking "×"
7. Click "Update Hero Images" to save
8. Homepage automatically refreshes to show new images

### For End Users:
- Visit homepage
- If 1 image: Standard static hero image
- If 2+ images: Auto-sliding carousel
  - Slides change every 4 seconds
  - Use arrow buttons to manually navigate
  - Images loop infinitely

## Technical Details

### Dependencies Used:
- `embla-carousel-react` (already in project)
- `@/components/ui/carousel` (shadcn/ui component)
- Cloudinary for image hosting
- Redis (Upstash) for data persistence

### Data Flow:
```
Admin uploads → Cloudinary CDN → setHeroImages() → Redis
Homepage loads → getHeroImages() → Carousel/ImageDisplay
```

### Storage Format (Redis):
```json
Key: "hindonix:hero_images"
Value: ["https://cloudinary.com/img1.jpg", "https://cloudinary.com/img2.jpg"]
```

### Fallback Logic:
```typescript
1. Check HERO_IMAGES_KEY (new)
2. If empty, check HERO_IMAGE_KEY (old single image)
3. If empty, use default: "/images/home/hero-knobs.jpg"
```

## Testing Checklist

✅ **Admin Panel:**
- [ ] Upload single image → Preview shows correctly
- [ ] Upload multiple images → All previews appear
- [ ] Remove image from preview → Image disappears
- [ ] Save images → Success toast appears
- [ ] Refresh page → Selected images persist

✅ **Homepage:**
- [ ] 1 image → Standard display (no carousel)
- [ ] 2+ images → Carousel with autoplay
- [ ] Autoplay works → Images slide every 4 seconds
- [ ] Manual navigation → Arrow buttons work
- [ ] Loop works → After last image, goes to first
- [ ] Admin update → Homepage reflects changes immediately

✅ **Edge Cases:**
- [ ] No images uploaded → Shows default image
- [ ] Image upload fails → Error toast appears
- [ ] Slow network → Loading state shows
- [ ] Multiple admin tabs → State syncs correctly

## Files Modified

1. **src/lib/redis.ts** - Added `getHeroImagesFromRedis()`, `setHeroImagesInRedis()`
2. **src/lib/data.ts** - Exported `getHeroImages()`, `setHeroImages()`
3. **src/pages/Admin.tsx** - Multi-upload UI, preview, remove functionality
4. **src/components/home/HeroSection.tsx** - Carousel with autoplay

## Future Enhancements (Optional)

- Add drag-and-drop reordering for image sequence
- Allow setting transition duration per-image
- Add image crop/resize tool before upload
- Implement lazy loading for carousel images
- Add transition effects (fade, slide, zoom)
- Store image captions/alt text
- Add analytics to track which images get most views

## Troubleshooting

**Issue: Images not sliding**
- Check browser console for errors
- Verify `heroImages.length > 1`
- Check Embla carousel API initialized

**Issue: Admin can't upload**
- Verify Cloudinary env vars set
- Check network tab for failed uploads
- Ensure file types are valid images

**Issue: Homepage shows old image**
- Hard refresh (Ctrl+Shift+R)
- Check Redis has new data
- Verify event listener fires

## Performance Notes

- Carousel only loads when >1 image (no overhead for single image)
- Cloudinary handles image optimization
- Redis stores only URLs (not image data)
- Autoplay interval can be adjusted in `HeroSection.tsx` line 35

---

**Implementation Date:** January 9, 2026  
**Status:** ✅ Complete and ready for testing
