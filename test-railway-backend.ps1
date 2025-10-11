#!/usr/bin/env pwsh
# Test Railway backend API directly

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Railway Backend API Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$backendUrl = "https://recruitment-system-production-7f72.up.railway.app"

# Test 1: Health check
Write-Host "Test 1: Backend Health Check..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/swagger" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "? Backend is reachable (Status: $($response.StatusCode))" -ForegroundColor Green
}
catch {
    Write-Host "? Backend not reachable!" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""

# Test 2: Login API endpoint
Write-Host "Test 2: Testing Login API..." -ForegroundColor Yellow
try {
    $loginData = @{
        email = "admin@atsrecruitsys.com"
        password = "Admin123!"
    } | ConvertTo-Json

    $headers = @{
        "Content-Type" = "application/json"
        "Origin" = "https://recruitment-system-six.vercel.app"
    }

    Write-Host "Sending login request to: $backendUrl/api/auth/login" -ForegroundColor Gray
    
    $response = Invoke-WebRequest `
        -Uri "$backendUrl/api/auth/login" `
        -Method Post `
        -Body $loginData `
        -Headers $headers `
        -UseBasicParsing `
        -TimeoutSec 10

    Write-Host "? Login API works! (Status: $($response.StatusCode))" -ForegroundColor Green
    Write-Host "Response: $($response.Content.Substring(0, [Math]::Min(200, $response.Content.Length)))..." -ForegroundColor Gray
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "? Login API failed! (Status: $statusCode)" -ForegroundColor Red
    
    if ($statusCode -eq 500) {
        Write-Host "??  Internal Server Error - Backend issue!" -ForegroundColor Yellow
        Write-Host "This could be:" -ForegroundColor Yellow
        Write-Host "  - Database connection problem" -ForegroundColor White
        Write-Host "  - Missing environment variables" -ForegroundColor White
        Write-Host "  - Backend code error" -ForegroundColor White
    }
    elseif ($statusCode -eq 404) {
        Write-Host "??  Endpoint not found - Path issue!" -ForegroundColor Yellow
    }
    elseif ($statusCode -eq 401) {
        Write-Host "? API endpoint exists (returned 401 Unauthorized)" -ForegroundColor Green
    }
    
    try {
        $errorResponse = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($errorResponse)
        $errorBody = $reader.ReadToEnd()
        Write-Host "Error details: $errorBody" -ForegroundColor Red
    }
    catch {
        Write-Host "Could not read error details" -ForegroundColor Yellow
    }
}

Write-Host ""

# Test 3: Database connectivity
Write-Host "Test 3: Testing Database API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$backendUrl/api/jobs?page=0&pageSize=5" -Method Get -UseBasicParsing -TimeoutSec 10
    Write-Host "? Database API works! (Status: $($response.StatusCode))" -ForegroundColor Green
}
catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "? Database API failed! (Status: $statusCode)" -ForegroundColor Red
    
    if ($statusCode -eq 500) {
        Write-Host "??  Possible database connection issue!" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Test Complete" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "If you see 500 errors, check Railway logs:" -ForegroundColor Yellow
Write-Host "1. Go to railway.app/dashboard" -ForegroundColor White
Write-Host "2. Select your project" -ForegroundColor White
Write-Host "3. Click Deployments ? View Logs" -ForegroundColor White
Write-Host ""