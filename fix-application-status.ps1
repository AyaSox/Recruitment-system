#!/usr/bin/env pwsh

# Fix Application Status - Update "New" to "Applied"
Write-Host "?? Fixing Application Status Issue" -ForegroundColor Green
Write-Host "===================================" -ForegroundColor Green

Write-Host "`n?? Problem:" -ForegroundColor Yellow
Write-Host "• New applications created with status 'New' instead of 'Applied'" -ForegroundColor White
Write-Host "• Applications with 'New' status don't show in Application Funnel" -ForegroundColor White
Write-Host "• Funnel expects first stage to be 'Applied'" -ForegroundColor White

Write-Host "`n? Solution Applied:" -ForegroundColor Green
Write-Host "• Updated ApplicationService.cs to use 'Applied' status for new applications" -ForegroundColor White
Write-Host "• Both CreateApplicationAsync and CreateSimpleApplicationAsync methods fixed" -ForegroundColor White

Write-Host "`n?? Valid Application Statuses:" -ForegroundColor Cyan
Write-Host "1. Applied (First stage - shows in funnel)" -ForegroundColor White
Write-Host "2. Screening" -ForegroundColor White
Write-Host "3. Interview" -ForegroundColor White
Write-Host "4. Offer" -ForegroundColor White
Write-Host "5. Hired" -ForegroundColor White
Write-Host "6. Rejected" -ForegroundColor White

Write-Host "`n?? Testing the build..." -ForegroundColor Yellow
try {
    $buildResult = dotnet build ATSRecruitSys.Server/ATSRecruitSys.Server.csproj --configuration Release --no-restore 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "? Build successful!" -ForegroundColor Green
    } else {
        Write-Host "? Build failed:" -ForegroundColor Red
        Write-Host $buildResult -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "? Build error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "`n?? READY FOR DEPLOYMENT!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green

Write-Host "`n?? What happens next:" -ForegroundColor Cyan
Write-Host "1. Deploy this fix to Railway" -ForegroundColor White
Write-Host "2. New applications will automatically use 'Applied' status" -ForegroundColor White
Write-Host "3. Applications will appear in the first column of the funnel" -ForegroundColor White
Write-Host "4. Users can drag applications between funnel stages" -ForegroundColor White

Write-Host "`n??  For existing 'New' applications:" -ForegroundColor Yellow
Write-Host "• They can be manually updated to 'Applied' via the Applications page" -ForegroundColor White
Write-Host "• Or use the admin interface to bulk update statuses" -ForegroundColor White

Write-Host "`n?? Application Status Fix Complete!" -ForegroundColor Green