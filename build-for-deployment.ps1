# 🚀 Deployment Build Script
# Run this script before uploading to Hostinger

# This script:
# 1. Builds the frontend (React app)
# 2. Copies built files to server/public/
# 3. Builds the backend (TypeScript → JavaScript)
# 4. Prepares everything for deployment

Write-Host "🔨 Starting Hostinger deployment build..." -ForegroundColor Cyan

# Step 1: Build Frontend
Write-Host "`n📦 Building frontend..." -ForegroundColor Yellow
Set-Location -Path $PSScriptRoot
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Frontend built successfully" -ForegroundColor Green

# Step 2: Copy dist to server/public
Write-Host "`n📁 Copying frontend to server/public..." -ForegroundColor Yellow

# Remove old public folder if exists
if (Test-Path "server\public") {
    Remove-Item -Path "server\public" -Recurse -Force
}

# Create public folder
New-Item -ItemType Directory -Path "server\public" -Force | Out-Null

# Copy dist contents to server/public
Copy-Item -Path "dist\*" -Destination "server\public\" -Recurse -Force

Write-Host "✅ Frontend copied to server/public" -ForegroundColor Green

# Step 3: Build Backend
Write-Host "`n⚙️  Building backend..." -ForegroundColor Yellow
Set-Location -Path "server"
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Backend build failed!" -ForegroundColor Red
    Set-Location -Path $PSScriptRoot
    exit 1
}

Write-Host "✅ Backend built successfully" -ForegroundColor Green

# Step 4: Summary
Set-Location -Path $PSScriptRoot
Write-Host "`n" -NoNewline
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "✨ Build Complete! Ready for Deployment" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════" -ForegroundColor Cyan

Write-Host "`nYour deployment files are ready in:" -ForegroundColor White
Write-Host "  📂 server/dist/   " -NoNewline -ForegroundColor Yellow
Write-Host "→ Compiled backend code" -ForegroundColor Gray
Write-Host "  📂 server/public/ " -NoNewline -ForegroundColor Yellow
Write-Host "→ Built frontend app" -ForegroundColor Gray
Write-Host "  📂 server/prisma/ " -NoNewline -ForegroundColor Yellow
Write-Host "→ Database schema" -ForegroundColor Gray

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "  1. Update server/public/env-config.js with production values"
Write-Host "  2. Create server/.env.production (use .env.production.template)"
Write-Host "  3. Upload server/ folder to Hostinger"
Write-Host "  4. Follow HOSTINGER_DEPLOYMENT_GUIDE.md"

Write-Host "`n💡 Quick Upload:" -ForegroundColor Cyan
Write-Host "  Option 1: ZIP server/ folder and upload via File Manager"
Write-Host "  Option 2: Use FTP to upload server/ contents to /public_html"

Write-Host "`n📖 Full Guide: " -NoNewline -ForegroundColor White
Write-Host "HOSTINGER_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow

Write-Host "`n" -NoNewline
