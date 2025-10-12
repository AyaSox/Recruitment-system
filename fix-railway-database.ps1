#!/usr/bin/env pwsh
# Fix Railway Database Connection Script

Write-Host "?? Railway Database Connection Fix" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

Write-Host "Based on your Railway dashboard, you have:" -ForegroundColor Yellow
Write-Host "- DATABASE_URL: <empty string>" -ForegroundColor Red
Write-Host "- DATABASE_PUBLIC_URL: postgresql://postgres:..." -ForegroundColor Green
Write-Host ""

Write-Host "SOLUTION: Set DATABASE_URL to use DATABASE_PUBLIC_URL value" -ForegroundColor Cyan
Write-Host ""

Write-Host "Railway CLI Commands to run:" -ForegroundColor White
Write-Host "============================" -ForegroundColor White
Write-Host ""

Write-Host "1. Login to Railway (if not already):" -ForegroundColor Yellow
Write-Host "   railway login" -ForegroundColor White
Write-Host ""

Write-Host "2. Link to your project:" -ForegroundColor Yellow
Write-Host "   railway link" -ForegroundColor White
Write-Host ""

Write-Host "3. Get your DATABASE_PUBLIC_URL:" -ForegroundColor Yellow
Write-Host "   railway variables get DATABASE_PUBLIC_URL" -ForegroundColor White
Write-Host ""

Write-Host "4. Set DATABASE_URL to the same value:" -ForegroundColor Yellow
Write-Host "   railway variables set DATABASE_URL=`$DATABASE_PUBLIC_URL" -ForegroundColor White
Write-Host ""

Write-Host "5. Redeploy your service:" -ForegroundColor Yellow
Write-Host "   railway up --detach" -ForegroundColor White
Write-Host ""

Write-Host "ALTERNATIVE: Use Railway Dashboard" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host "1. Go to your Railway project dashboard" -ForegroundColor White
Write-Host "2. Click on Variables tab" -ForegroundColor White
Write-Host "3. Edit DATABASE_URL variable" -ForegroundColor White
Write-Host "4. Copy the value from DATABASE_PUBLIC_URL" -ForegroundColor White
Write-Host "5. Paste it into DATABASE_URL" -ForegroundColor White
Write-Host "6. Save and redeploy" -ForegroundColor White
Write-Host ""

Write-Host "Expected Result:" -ForegroundColor Green
Write-Host "===============" -ForegroundColor Green
Write-Host "? Database connection established" -ForegroundColor Green
Write-Host "? Migrations will run automatically" -ForegroundColor Green
Write-Host "? Sample data will be seeded" -ForegroundColor Green
Write-Host "? No more in-memory database warnings" -ForegroundColor Green
Write-Host ""

Write-Host "Your app will log something like:" -ForegroundColor Magenta
Write-Host "Database source: env:DATABASE_URL" -ForegroundColor White
Write-Host "Database config -> Provider: PostgreSQL, Host: postgres.railway.internal" -ForegroundColor White
Write-Host ""

# Check if Railway CLI is installed
$railwayInstalled = Get-Command railway -ErrorAction SilentlyContinue
if ($railwayInstalled) {
    Write-Host "? Railway CLI detected. You can run the commands above." -ForegroundColor Green
    
    # Try to get current variables if possible
    try {
        Write-Host ""
        Write-Host "Current Railway Variables:" -ForegroundColor Cyan
        Write-Host "=========================" -ForegroundColor Cyan
        $variables = railway variables 2>$null
        if ($variables) {
            Write-Host $variables -ForegroundColor White
        } else {
            Write-Host "Run 'railway link' first to connect to your project" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Run 'railway link' to connect to your project first" -ForegroundColor Yellow
    }
} else {
    Write-Host "??  Railway CLI not found. Install it with:" -ForegroundColor Yellow
    Write-Host "   npm install -g @railway/cli" -ForegroundColor White
    Write-Host "   OR use the Railway Dashboard method above" -ForegroundColor White
}

Write-Host ""
Write-Host "?? Code changes have been made to Program.cs to better handle Railway variables." -ForegroundColor Green
Write-Host "   Your app will now check multiple Railway environment variables in order." -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to continue..."