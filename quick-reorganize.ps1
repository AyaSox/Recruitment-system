# Quick Reorganization Script
$ErrorActionPreference = "Continue"
$root = "ATSRecruitSys.Blazor\ATSRecruitSys.Blazor"

Write-Host "Creating folders..." -ForegroundColor Cyan

# Create folders
New-Item -Path "$root\Components\Shared\Cards" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Components\Shared\Forms" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Components\Shared\Display" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Components\Shared\Dialogs" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Components\Shared\Features" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Services\Auth" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Services\Core" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Services\Profile" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "$root\Services\Features" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null
New-Item -Path "docs\implementation" -ItemType Directory -Force -ErrorAction SilentlyContinue | Out-Null

Write-Host "Folders created!" -ForegroundColor Green

# Move Card Components
Write-Host "Moving Card components..." -ForegroundColor Yellow
Move-Item -Path "$root\Components\Shared\JobCard.razor" -Destination "$root\Components\Shared\Cards\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\ApplicationCard.razor" -Destination "$root\Components\Shared\Cards\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\InterviewCard.razor" -Destination "$root\Components\Shared\Cards\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\RecommendationCard.razor" -Destination "$root\Components\Shared\Cards\" -Force -ErrorAction SilentlyContinue

# Move Form Components
Write-Host "Moving Form components..." -ForegroundColor Yellow
Move-Item -Path "$root\Components\Shared\JobForm.razor" -Destination "$root\Components\Shared\Forms\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\FileUploadComponent.razor" -Destination "$root\Components\Shared\Forms\" -Force -ErrorAction SilentlyContinue

# Move Display Components
Write-Host "Moving Display components..." -ForegroundColor Yellow
Move-Item -Path "$root\Components\Shared\DashboardStatsDisplay.razor" -Destination "$root\Components\Shared\Display\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\MobileDashboard.razor" -Destination "$root\Components\Shared\Display\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\MobileJobList.razor" -Destination "$root\Components\Shared\Display\" -Force -ErrorAction SilentlyContinue

# Move Dialog Components
Write-Host "Moving Dialog components..." -ForegroundColor Yellow
Move-Item -Path "$root\Components\Shared\QuickScheduleInterview.razor" -Destination "$root\Components\Shared\Dialogs\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\EmailComposer.razor" -Destination "$root\Components\Shared\Dialogs\" -Force -ErrorAction SilentlyContinue

# Move Feature Components
Write-Host "Moving Feature components..." -ForegroundColor Yellow
Move-Item -Path "$root\Components\Shared\ApplicationNotes.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\ApplicationFunnelCard.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\BulkActionsBar.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\NotificationCenter.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\ChatbotWidget.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\LanguageSelector.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\CalendarExport.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\PrintableView.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Components\Shared\AuditLogViewer.razor" -Destination "$root\Components\Shared\Features\" -Force -ErrorAction SilentlyContinue

# Move Services
Write-Host "Moving Services..." -ForegroundColor Yellow
Move-Item -Path "$root\Services\AuthService.cs" -Destination "$root\Services\Auth\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\JobService.cs" -Destination "$root\Services\Core\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\ApplicationService.cs" -Destination "$root\Services\Core\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\InterviewService.cs" -Destination "$root\Services\Core\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\DashboardService.cs" -Destination "$root\Services\Core\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\CandidateProfileService.cs" -Destination "$root\Services\Profile\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\SkillService.cs" -Destination "$root\Services\Profile\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\ApplicationNoteService.cs" -Destination "$root\Services\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\ResumeParsingService.cs" -Destination "$root\Services\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\AnalyticsService.cs" -Destination "$root\Services\Features\" -Force -ErrorAction SilentlyContinue
Move-Item -Path "$root\Services\ExportService.cs" -Destination "$root\Services\Features\" -Force -ErrorAction SilentlyContinue

# Move documentation
Write-Host "Moving documentation..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*.md" -File | Where-Object { $_.Name -ne "README.md" } | ForEach-Object {
    Move-Item -Path $_.FullName -Destination "docs\implementation\" -Force -ErrorAction SilentlyContinue
}

Write-Host "" 
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "? REORGANIZATION COMPLETE!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "NEXT STEPS:" -ForegroundColor Yellow
Write-Host "1. Close Visual Studio" -ForegroundColor White
Write-Host "2. Reopen the solution" -ForegroundColor White
Write-Host "3. Rebuild (Ctrl+Shift+B)" -ForegroundColor White
