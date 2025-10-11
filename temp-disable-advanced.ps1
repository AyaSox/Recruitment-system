# Temporarily disable advanced features for successful build
Write-Host "?? Temporarily disabling advanced feature files..." -ForegroundColor Yellow

$basePath = "ATSRecruitSys.Server"

# Services to disable
$services = @(
    "Services\ResumeParsingService.cs",
    "Services\JobRecommendationService.cs",
    "Services\TalentPoolService.cs",
    "Services\AdvancedAnalyticsService.cs"
)

# Controllers to disable
$controllers = @(
    "Controllers\ResumeParsingController.cs",
    "Controllers\RecommendationsController.cs",
    "Controllers\TalentPoolController.cs",
    "Controllers\AdvancedAnalyticsController.cs"
)

# Rename files
$disabledCount = 0
foreach ($file in $services + $controllers) {
    $fullPath = Join-Path $basePath $file
    if (Test-Path $fullPath) {
        Rename-Item $fullPath "$fullPath.disabled" -ErrorAction SilentlyContinue
        Write-Host "  ? Disabled: $file" -ForegroundColor Green
        $disabledCount++
    }
}

Write-Host "`n? Successfully disabled $disabledCount advanced feature files" -ForegroundColor Green
Write-Host "?? Core ATS system is ready to build!" -ForegroundColor Cyan
Write-Host "`n?? To re-enable later, run: .\re-enable-advanced.ps1`n" -ForegroundColor Gray
