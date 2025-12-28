# How to Add Your Images

## Quick Start

1. **Add your logo files** to: `public/images/logo/`

   - `hindonix-logo-full.svg` or `.png` (Full logo with company name)
   - `hindonix-logo-icon.svg` or `.png` (Icon only)
   - `hindonix-logo-white.svg` or `.png` (White version for dark backgrounds)

2. **Add product images** to respective folders:

   - Knobs: `public/images/products/knobs/`
   - Door Handles: `public/images/products/door-handles/`
   - Pull Handles: `public/images/products/pull-handles/`

3. **Add testimonial photos** to: `public/images/testimonials/`
   - Name them: `client-1.jpg`, `client-2.jpg`, `client-3.jpg`, `client-4.jpg`

## Current Image References

### Products Page

The following images are referenced in the Products page:

**Knobs:**

- `/images/products/knobs/brass-knob-1.jpg`
- `/images/products/knobs/wooden-knob-1.jpg`
- `/images/products/knobs/cotton-knob-1.jpg`
- `/images/products/knobs/metal-knob-1.jpg`

**Door Handles:**

- `/images/products/door-handles/door-handle-1.jpg`
- `/images/products/door-handles/door-handle-2.jpg`

**Pull Handles:**

- `/images/products/pull-handles/pull-handle-1.jpg`
- `/images/products/pull-handles/pull-handle-2.jpg`
- `/images/products/pull-handles/pull-handle-3.jpg`

### Testimonials Section

- `/images/testimonials/client-1.jpg`
- `/images/testimonials/client-2.jpg`
- `/images/testimonials/client-3.jpg`
- `/images/testimonials/client-4.jpg`

## Image Specifications

### Product Images

- **Recommended size**: 800x600px (4:3 ratio)
- **Format**: JPG or PNG
- **File size**: Under 500KB for optimal loading
- **Background**: White or neutral preferred
- **Quality**: High-resolution product photography

### Logo Files

- **Format**: SVG (preferred) or PNG with transparent background
- **Full logo**: Minimum 300px wide
- **Icon only**: 100x100px minimum
- **White logo**: For use on dark backgrounds

### Testimonial Photos

- **Size**: 120x120px (square)
- **Format**: JPG or PNG
- **Style**: Professional headshots
- **File size**: Under 100KB

## Adding More Products

To add more products, edit the file:
`src/pages/Products.tsx`

Add new product objects following this format:

```javascript
{
  id: 10,
  name: "Your Product Name",
  category: "Knobs", // or "Door Handles" or "Pull Handles"
  subcategory: "Brass Knob", // optional
  description: "Product description here",
  image: "/images/products/knobs/your-image-name.jpg",
  finishes: ["Brass", "PVD Satin Black", "etc"],
}
```

Then add your image to the appropriate folder in `public/images/products/`.

## Need Help?

If you need to change image paths or add new categories, edit:

- Products: `src/pages/Products.tsx`
- Testimonials: `src/components/home/TestimonialsSection.tsx`
- Logo (if needed): `src/components/layout/Navbar.tsx` and `src/components/layout/Footer.tsx`
