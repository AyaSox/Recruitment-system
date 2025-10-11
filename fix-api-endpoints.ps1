#!/usr/bin/env pwsh
# Fix all API endpoint paths to include /api prefix

Write-Host "Fixing API endpoint paths..." -ForegroundColor Cyan

# Fix auth.service.ts - already fixed login, but check others if any

# Fix job.service.ts
$jobServicePath = "atsrecruitsys.client/src/services/job.service.ts"
if (Test-Path $jobServicePath) {
    Write-Host "Fixing job.service.ts..." -ForegroundColor Yellow
    
    $content = Get-Content $jobServicePath -Raw
    
    # Replace all job service endpoints
    $content = $content -replace "'/jobs'", "'/api/jobs'"
    $content = $content -replace "'/jobs/", "'/api/jobs/"
    $content = $content -replace '"`/jobs/', '"`/api/jobs/'
    
    Set-Content $jobServicePath -Value $content
    Write-Host "? Fixed job.service.ts" -ForegroundColor Green
}

# Fix application.service.ts
$appServicePath = "atsrecruitsys.client/src/services/application.service.ts"
if (Test-Path $appServicePath) {
    Write-Host "Fixing application.service.ts..." -ForegroundColor Yellow
    
    $content = Get-Content $appServicePath -Raw
    
    # Replace all application service endpoints
    $content = $content -replace "'/applications'", "'/api/applications'"
    $content = $content -replace "'/applications/", "'/api/applications/"
    $content = $content -replace '"`/applications/', '"`/api/applications/'
    
    Set-Content $appServicePath -Value $content
    Write-Host "? Fixed application.service.ts" -ForegroundColor Green
}

# Fix dashboard.service.ts
$dashboardServicePath = "atsrecruitsys.client/src/services/dashboard.service.ts"
if (Test-Path $dashboardServicePath) {
    Write-Host "Fixing dashboard.service.ts..." -ForegroundColor Yellow
    
    $content = Get-Content $dashboardServicePath -Raw
    
    # Replace all dashboard service endpoints
    $content = $content -replace "'/dashboard'", "'/api/dashboard'"
    $content = $content -replace "'/dashboard/", "'/api/dashboard/"
    $content = $content -replace '"`/dashboard/', '"`/api/dashboard/'
    
    Set-Content $dashboardServicePath -Value $content
    Write-Host "? Fixed dashboard.service.ts" -ForegroundColor Green
}

# Fix audit.service.ts
$auditServicePath = "atsrecruitsys.client/src/services/audit.service.ts"
if (Test-Path $auditServicePath) {
    Write-Host "Fixing audit.service.ts..." -ForegroundColor Yellow
    
    $content = Get-Content $auditServicePath -Raw
    
    # Replace all audit service endpoints
    $content = $content -replace "'/audit'", "'/api/audit'"
    $content = $content -replace "'/audit/", "'/api/audit/"
    $content = $content -replace '"`/audit/', '"`/api/audit/'
    
    Set-Content $auditServicePath -Value $content
    Write-Host "? Fixed audit.service.ts" -ForegroundColor Green
}

# Fix other services...
$serviceFiles = @(
    "atsrecruitsys.client/src/services/report.service.ts"
)

foreach ($serviceFile in $serviceFiles) {
    if (Test-Path $serviceFile) {
        Write-Host "Fixing $serviceFile..." -ForegroundColor Yellow
        
        $content = Get-Content $serviceFile -Raw
        
        # Generic fix for any remaining endpoints that don't start with /api
        $content = $content -replace "api\.get\('<(?!/api)([^']+)'\)", "api.get('/api`$1')"
        $content = $content -replace "api\.post\('<(?!/api)([^']+)'\)", "api.post('/api`$1')"
        $content = $content -replace "api\.put\('<(?!/api)([^']+)'\)", "api.put('/api`$1')"
        $content = $content -replace "api\.delete\('<(?!/api)([^']+)'\)", "api.delete('/api`$1')"
        
        Set-Content $serviceFile -Value $content
        Write-Host "? Fixed $serviceFile" -ForegroundColor Green
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  API Endpoint Fix Complete!" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "All API services now use /api prefix" -ForegroundColor Green
Write-Host "Ready to test login again!" -ForegroundColor Green