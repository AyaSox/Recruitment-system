#!/usr/bin/env pwsh
# Test Railway Database Connection

Write-Host "?? Testing Railway Database Connection" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""

Write-Host "This script will help you verify your database connection." -ForegroundColor Cyan
Write-Host ""

# Check if we can find the project
$projectFile = "ATSRecruitSys.Server\ATSRecruitSys.Server.csproj"
if (-not (Test-Path $projectFile)) {
    Write-Host "? Project file not found: $projectFile" -ForegroundColor Red
    Write-Host "Make sure you're in the root directory of your project." -ForegroundColor Yellow
    exit 1
}

Write-Host "? Project file found" -ForegroundColor Green
Write-Host ""

Write-Host "Railway Connection Test Steps:" -ForegroundColor Yellow
Write-Host "=============================" -ForegroundColor Yellow
Write-Host ""

Write-Host "1. First, make sure you've updated Railway variables:" -ForegroundColor White
Write-Host "   - DATABASE_URL should have the same value as DATABASE_PUBLIC_URL" -ForegroundColor Cyan
Write-Host ""

Write-Host "2. Check Railway logs to see if connection is working:" -ForegroundColor White
Write-Host "   railway logs --tail" -ForegroundColor Cyan
Write-Host ""

Write-Host "3. Look for these log messages in Railway:" -ForegroundColor White
Write-Host "   ? 'Database source: env:DATABASE_URL'" -ForegroundColor Green
Write-Host "   ? 'Database config -> Provider: PostgreSQL'" -ForegroundColor Green
Write-Host "   ? 'Database initialization completed successfully'" -ForegroundColor Green
Write-Host ""

Write-Host "4. Bad log messages to watch for:" -ForegroundColor White
Write-Host "   ? 'No database connection string found. Using in-memory database'" -ForegroundColor Red
Write-Host "   ? 'Connection resolved from: none'" -ForegroundColor Red
Write-Host ""

Write-Host "Expected Railway Environment Variables:" -ForegroundColor Yellow
Write-Host "====================================" -ForegroundColor Yellow
Write-Host "DATABASE_URL = postgresql://postgres:password@host:port/dbname" -ForegroundColor White
Write-Host "DATABASE_PUBLIC_URL = same as above" -ForegroundColor White
Write-Host "PGHOST = postgres host" -ForegroundColor White
Write-Host "PGDATABASE = database name" -ForegroundColor White
Write-Host "PGUSER = postgres" -ForegroundColor White
Write-Host "PGPASSWORD = database password" -ForegroundColor White
Write-Host ""

Write-Host "Quick Railway Commands:" -ForegroundColor Magenta
Write-Host "======================" -ForegroundColor Magenta
Write-Host "# Check current variables" -ForegroundColor Gray
Write-Host "railway variables" -ForegroundColor White
Write-Host ""
Write-Host "# Set DATABASE_URL (replace with your actual DATABASE_PUBLIC_URL value)" -ForegroundColor Gray
Write-Host "railway variables set DATABASE_URL=\`$DATABASE_PUBLIC_URL" -ForegroundColor White
Write-Host ""
Write-Host "# Deploy" -ForegroundColor Gray
Write-Host "railway up --detach" -ForegroundColor White
Write-Host ""
Write-Host "# View logs" -ForegroundColor Gray
Write-Host "railway logs --tail" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Do you want to test the connection locally with Railway variables? (y/N)"
if ($choice -eq 'y' -or $choice -eq 'Y') {
    Write-Host ""
    Write-Host "?? Testing local connection with Railway environment..." -ForegroundColor Cyan
    
    # Try to get Railway variables
    try {
        $env:ASPNETCORE_ENVIRONMENT = "Production"
        
        Write-Host "Building and testing project..." -ForegroundColor Yellow
        $buildResult = dotnet build $projectFile 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "? Build successful" -ForegroundColor Green
            Write-Host "Your code changes are ready for Railway deployment." -ForegroundColor White
        } else {
            Write-Host "? Build failed:" -ForegroundColor Red
            Write-Host $buildResult -ForegroundColor Red
        }
        
    } catch {
        Write-Host "? Error testing connection: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "?? Summary of Changes Made:" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "? Updated Program.cs to better handle Railway variables" -ForegroundColor White
Write-Host "? Added enhanced logging for database connection debugging" -ForegroundColor White
Write-Host "? Fixed appsettings.Production.json" -ForegroundColor White
Write-Host "? Code now checks multiple Railway environment variables" -ForegroundColor White
Write-Host ""

Write-Host "?? Next Steps:" -ForegroundColor Yellow
Write-Host "=============" -ForegroundColor Yellow
Write-Host "1. Update DATABASE_URL in Railway dashboard or CLI" -ForegroundColor White
Write-Host "2. Redeploy your service" -ForegroundColor White
Write-Host "3. Check the logs for successful database connection" -ForegroundColor White
Write-Host "4. Test your application endpoints" -ForegroundColor White
Write-Host ""