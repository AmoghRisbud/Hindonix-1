# ================================
# Stage 1: Build the application
# ================================
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
# Note: We build with empty env vars - they will be injected at runtime
RUN npm run build

# ================================
# Stage 2: Production image
# ================================
FROM nginx:alpine AS production

# Install bash for the entrypoint script
RUN apk add --no-cache bash

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the env config script
COPY env-config.sh /docker-entrypoint.d/env-config.sh

# Make the script executable
RUN chmod +x /docker-entrypoint.d/env-config.sh

# Create empty env-config.js file (will be populated at runtime)
RUN touch /usr/share/nginx/html/env-config.js

# Expose port 80
EXPOSE 80

# Use custom entrypoint to inject env vars at runtime
CMD ["/docker-entrypoint.d/env-config.sh"]
