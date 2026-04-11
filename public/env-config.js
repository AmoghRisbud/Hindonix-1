// Runtime environment configuration for production
// In development, Vite handles env vars (.env files)
// In production (Hostinger), these values are used directly
window.__ENV__ = {
  VITE_CLOUDINARY_CLOUD_NAME: 'dlt9vf8qk',
  VITE_CLOUDINARY_UPLOAD_PRESET: 'hindonix_unsigned',
  VITE_CLOUDINARY_HERO_UPLOAD_PRESET: 'hindonix_hero',
  // TODO: Replace with your production Clerk key from https://dashboard.clerk.com
  VITE_CLERK_PUBLISHABLE_KEY: 'pk_test_your_production_key_here',
};
