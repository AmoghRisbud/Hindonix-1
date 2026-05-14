// Environment configuration utility
// Supports both Vite build-time vars and Docker runtime vars

interface EnvConfig {
  VITE_CLOUDINARY_CLOUD_NAME: string;
  VITE_CLOUDINARY_UPLOAD_PRESET: string;
  VITE_CLERK_PUBLISHABLE_KEY: string;
  VITE_GOOGLE_SHEETS_WEB_APP_URL: string;
}

// Extend Window interface to include runtime env
declare global {
  interface Window {
    __ENV__?: Partial<EnvConfig>;
  }
}

/**
 * Get environment variable with runtime override support
 * Priority: window.__ENV__ (Docker runtime) > import.meta.env (Vite build-time)
 */
export function getEnvVar(key: keyof EnvConfig): string {
  // Check for runtime config first (Docker)
  if (typeof window !== 'undefined' && window.__ENV__ && window.__ENV__[key]) {
    return window.__ENV__[key] as string;
  }
  
  // Fall back to Vite build-time env
  return (import.meta.env[key] as string) || '';
}

// Export individual env vars for convenience
export const ENV = {
  get CLOUDINARY_CLOUD_NAME() {
    return getEnvVar('VITE_CLOUDINARY_CLOUD_NAME');
  },
  get CLOUDINARY_UPLOAD_PRESET() {
    return getEnvVar('VITE_CLOUDINARY_UPLOAD_PRESET');
  },
  get CLERK_PUBLISHABLE_KEY() {
    return getEnvVar('VITE_CLERK_PUBLISHABLE_KEY');
  },
  get GOOGLE_SHEETS_WEB_APP_URL() {
    return getEnvVar('VITE_GOOGLE_SHEETS_WEB_APP_URL');
  },
};
