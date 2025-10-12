#!/usr/bin/env pwsh

# Fix Dashboard Status Chart - Update "New" applications to "Applied"
Write-Host "?? Fixing Dashboard Status Chart" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

Write-Host "`n?? Current Issue:" -ForegroundColor Yellow
Write-Host "• Dashboard shows applications with 'New' status" -ForegroundColor White
Write-Host "• These don't appear in the Application Funnel" -ForegroundColor White
Write-Host "• Chart should show 'Applied' instead of 'New'" -ForegroundColor White

Write-Host "`n?? Solution:" -ForegroundColor Cyan
Write-Host "1. Use admin endpoint to fix existing 'New' applications" -ForegroundColor White
Write-Host "2. Update dashboard chart to reflect correct statuses" -ForegroundColor White
Write-Host "3. Verify Application Funnel shows all applications" -ForegroundColor White

Write-Host "`n?? Steps to Fix:" -ForegroundColor Magenta
Write-Host "1. Login as admin: admin@atsrecruitsys.com / Admin123!" -ForegroundColor White
Write-Host "2. Call API endpoint: POST /api/applications/fix-new-status" -ForegroundColor White
Write-Host "3. Refresh dashboard to see updated chart" -ForegroundColor White
Write-Host "4. Check Application Funnel for all applications" -ForegroundColor White

Write-Host "`n?? API Call Options:" -ForegroundColor Yellow

Write-Host "`nOption 1 - Using curl:" -ForegroundColor Cyan
Write-Host "curl -X POST 'https://your-railway-app/api/applications/fix-new-status' \" -ForegroundColor Gray
Write-Host "     -H 'Authorization: Bearer YOUR_JWT_TOKEN'" -ForegroundColor Gray

Write-Host "`nOption 2 - Using Swagger UI:" -ForegroundColor Cyan
Write-Host "1. Go to: https://your-railway-app/swagger" -ForegroundColor Gray
Write-Host "2. Find: POST /api/applications/fix-new-status" -ForegroundColor Gray
Write-Host "3. Click 'Try it out' and 'Execute'" -ForegroundColor Gray

Write-Host "`nOption 3 - Using Browser Dev Tools:" -ForegroundColor Cyan
Write-Host "1. Login to admin dashboard" -ForegroundColor Gray
Write-Host "2. Open browser dev tools (F12)" -ForegroundColor Gray
Write-Host "3. Run in console:" -ForegroundColor Gray
Write-Host "   fetch('/api/applications/fix-new-status', {" -ForegroundColor Gray
Write-Host "     method: 'POST'," -ForegroundColor Gray
Write-Host "     headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }" -ForegroundColor Gray
Write-Host "   }).then(r => r.json()).then(console.log)" -ForegroundColor Gray

Write-Host "`n?? Expected Results After Fix:" -ForegroundColor Green
Write-Host "• Dashboard chart will show 'Applied' instead of 'New'" -ForegroundColor White
Write-Host "• Application Funnel will show all applications in first column" -ForegroundColor White
Write-Host "• Drag & drop will work between all funnel stages" -ForegroundColor White
Write-Host "• Status counts will be accurate" -ForegroundColor White

Write-Host "`n? Ready to Fix Dashboard Status Chart!" -ForegroundColor Green
Write-Host "Choose one of the API call options above to execute the fix." -ForegroundColor White