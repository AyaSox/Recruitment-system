#!/usr/bin/env pwsh
# Test connection between Vercel frontend and Railway backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Frontend-Backend Connection Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Backend URL
$backendUrl = "https://recruitment-system-production-7f72.up.railway.app"
Write-Host "Backend URL: $backendUrl" -ForegroundColor Yellow
Write-Host ""

# Test 1: Health Check
Write-Host "Test 1: Backend Health Check..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/swagger/index.html" -Method Get -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "? Backend is reachable!" -ForegroundColor Green
    }
}
catch {
    Write-Host "? Backend not reachable!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: API Endpoint
Write-Host "Test 2: Testing API Endpoint..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/jobs" -Method Get -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "? API endpoint is working!" -ForegroundColor Green
        Write-Host "Jobs found: $($response.Content.Length) bytes" -ForegroundColor Gray
    }
}
catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "? API endpoint exists (requires authentication)" -ForegroundColor Green
    }
    else {
        Write-Host "? API endpoint error!" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 3: CORS Headers
Write-Host "Test 3: Checking CORS Configuration..." -ForegroundColor Cyan
try {
    $headers = @{
        "Origin" = "https://localhost:5173"
    }
    $response = Invoke-WebRequest -Uri "$backendUrl/api/jobs" -Method Options -Headers $headers -UseBasicParsing -TimeoutSec 10
    
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    if ($corsHeader) {
        Write-Host "? CORS is configured!" -ForegroundColor Green
        Write-Host "Allowed Origin: $corsHeader" -ForegroundColor Gray
    }
    else {
        Write-Host "??  CORS headers not found (might still work)" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "??  Could not check CORS (might still work)" -ForegroundColor Yellow
}

Write-Host ""

# Test 4: SSL Certificate
Write-Host "Test 4: Checking SSL Certificate..." -ForegroundColor Cyan
try {
    $response = Invoke-WebRequest -Uri $backendUrl -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "? SSL certificate is valid!" -ForegroundColor Green
}
catch {
    Write-Host "? SSL certificate issue!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Backend URL: $backendUrl" -ForegroundColor White
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Deploy frontend to Vercel" -ForegroundColor White
Write-Host "2. Update Railway with FRONTEND_URL variable" -ForegroundColor White
Write-Host "3. Test from your Vercel URL" -ForegroundColor White
Write-Host ""
Write-Host "Need help? See VERCEL-QUICK-START.md" -ForegroundColor Cyan
Write-Host ""
