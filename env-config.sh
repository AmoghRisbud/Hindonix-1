#!/bin/sh
# env-config.sh
# This script generates runtime environment variables for the React app
# It runs at container startup and creates a JavaScript file that exposes env vars

# Create the env-config.js file with runtime environment variables
cat <<EOF > /usr/share/nginx/html/env-config.js
// Runtime environment configuration
// Generated at container startup - DO NOT EDIT MANUALLY
window.__ENV__ = {
  VITE_CLOUDINARY_CLOUD_NAME: "${VITE_CLOUDINARY_CLOUD_NAME}",
  VITE_CLOUDINARY_UPLOAD_PRESET: "${VITE_CLOUDINARY_UPLOAD_PRESET}",
  VITE_CLERK_PUBLISHABLE_KEY: "${VITE_CLERK_PUBLISHABLE_KEY}",
  VITE_GOOGLE_SHEETS_WEB_APP_URL: "${VITE_GOOGLE_SHEETS_WEB_APP_URL}"
};
EOF

echo "Environment config generated successfully"

# Start nginx
exec nginx -g 'daemon off;'
