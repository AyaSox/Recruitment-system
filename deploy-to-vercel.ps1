#!/usr/bin/env pwsh
# Vercel Deployment Script for ATS Recruitment System

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  ATS Recruitment System" -ForegroundColor Cyan
Write-Host "  Vercel Deployment Tool" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "Checking Vercel CLI..." -ForegroundColor Yellow
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "? Vercel CLI not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Installing Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "? Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please install manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "? Vercel CLI installed successfully!" -ForegroundColor Green
}
else {
    Write-Host "? Vercel CLI found!" -ForegroundColor Green
}

Write-Host ""

# Navigate to client directory
Write-Host "Navigating to frontend directory..." -ForegroundColor Yellow
$clientPath = Join-Path $PSScriptRoot "atsrecruitsys.client"

if (-not (Test-Path $clientPath)) {
    Write-Host "? Frontend directory not found: $clientPath" -ForegroundColor Red
    exit 1
}

Set-Location $clientPath
Write-Host "? In frontend directory: $clientPath" -ForegroundColor Green
Write-Host ""

# Check for package.json
if (-not (Test-Path "package.json")) {
    Write-Host "? package.json not found!" -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "? Failed to install dependencies" -ForegroundColor Red
    exit 1
}

Write-Host "? Dependencies installed!" -ForegroundColor Green
Write-Host ""

# Run build to check for errors
Write-Host "Running production build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "? Build failed! Please fix errors before deploying." -ForegroundColor Red
    exit 1
}

Write-Host "? Build successful!" -ForegroundColor Green
Write-Host ""

# Display deployment options
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deployment Options" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Deploy to Vercel (Production)" -ForegroundColor White
Write-Host "2. Deploy to Vercel (Preview)" -ForegroundColor White
Write-Host "3. Login to Vercel" -ForegroundColor White
Write-Host "4. View Deployments" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "?? Deploying to production..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check if .vercel directory exists
        if (-not (Test-Path ".vercel")) {
            Write-Host "First time deployment detected!" -ForegroundColor Yellow
            Write-Host ""
            Write-Host "You will be asked a few questions:" -ForegroundColor Yellow
            Write-Host "  - Set up and deploy? ? Yes" -ForegroundColor White
            Write-Host "  - Which scope? ? Select your account" -ForegroundColor White
            Write-Host "  - Link to existing project? ? No (first time)" -ForegroundColor White
            Write-Host "  - Project name? ? ats-recruitment-system" -ForegroundColor White
            Write-Host "  - In which directory? ? ./" -ForegroundColor White
            Write-Host ""
            Write-Host "Press Enter to continue..." -ForegroundColor Yellow
            Read-Host
        }
        
        vercel --prod
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "========================================" -ForegroundColor Green
            Write-Host "  ? Deployment Successful!" -ForegroundColor Green
            Write-Host "========================================" -ForegroundColor Green
            Write-Host ""
            Write-Host "Next steps:" -ForegroundColor Yellow
            Write-Host "1. Copy your Vercel URL" -ForegroundColor White
            Write-Host "2. Update Railway backend CORS:" -ForegroundColor White
            Write-Host "   - Go to Railway Dashboard" -ForegroundColor White
            Write-Host "   - Add variable: FRONTEND_URL=<your-vercel-url>" -ForegroundColor White
            Write-Host "3. Test your application!" -ForegroundColor White
            Write-Host ""
        }
        else {
            Write-Host ""
            Write-Host "? Deployment failed!" -ForegroundColor Red
            Write-Host "Check the error messages above." -ForegroundColor Yellow
        }
    }
    
    "2" {
        Write-Host ""
        Write-Host "?? Deploying preview..." -ForegroundColor Cyan
        Write-Host ""
        vercel
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "? Preview deployment successful!" -ForegroundColor Green
            Write-Host "This is a preview URL for testing." -ForegroundColor Yellow
        }
    }
    
    "3" {
        Write-Host ""
        Write-Host "?? Logging in to Vercel..." -ForegroundColor Cyan
        Write-Host ""
        vercel login
    }
    
    "4" {
        Write-Host ""
        Write-Host "?? Your deployments:" -ForegroundColor Cyan
        Write-Host ""
        vercel ls
    }
    
    "5" {
        Write-Host ""
        Write-Host "?? Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    
    default {
        Write-Host ""
        Write-Host "? Invalid choice!" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Script completed!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Return to original directory
Set-Location $PSScriptRoot
