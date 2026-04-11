#!/bin/bash
# Hostinger Build Script - Runs automatically on deployment

echo "🔨 Starting Hindonix build..."

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Build frontend
echo "🎨 Building frontend..."
npm run build

# Copy frontend build to server/public
echo "📁 Copying frontend to server/public..."
mkdir -p server/public
cp -r dist/* server/public/

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install --production

# Build server
echo "⚙️ Building server..."
npm run build

# Generate Prisma client
echo "🗄️ Generating Prisma client..."
npx prisma generate

echo "✅ Build complete!"
