# Fix JSX Apostrophe Errors Script
# This script automatically fixes JSX apostrophe and quote errors

Write-Host "Fixing JSX apostrophe errors in remaining files..." -ForegroundColor Cyan

# Define files and their replacements
$fixes = @(
    @{
        File = "atsrecruitsys.client\src\pages\CandidateProfilePage.tsx"
        Find = "You haven't"
        Replace = "You haven&apos;t"
    },
    @{
        File = "atsrecruitsys.client\src\pages\InterviewDetailsPage.tsx"
        Find = "You don't"
        Replace = "You don&apos;t"
    },
    @{
        File = "atsrecruitsys.client\src\pages\InterviewsPage.tsx"
        Find = "There aren't"
        Replace = "There aren&apos;t"
    },
    @{
        File = "atsrecruitsys.client\src\pages\LoginPage.tsx"
        Find = "Don't"
        Replace = "Don&apos;t"
    },
    @{
        File = "atsrecruitsys.client\src\pages\WelcomePage.tsx"
        Find = "you're"
        Replace = "you&apos;re"
    }
)

$fixedCount = 0
$errorCount = 0

foreach ($fix in $fixes) {
    try {
        $filePath = Join-Path $PSScriptRoot $fix.File
        
        if (Test-Path $filePath) {
            Write-Host "Processing: $($fix.File)" -ForegroundColor Yellow
            
            $content = Get-Content $filePath -Raw
            $newContent = $content -replace [regex]::Escape($fix.Find), $fix.Replace
            
            if ($content -ne $newContent) {
                Set-Content -Path $filePath -Value $newContent -NoNewline
                Write-Host "  ? Fixed: '$($fix.Find)' -> '$($fix.Replace)'" -ForegroundColor Green
                $fixedCount++
            } else {
                Write-Host "  - No changes needed (already fixed or not found)" -ForegroundColor Gray
            }
        } else {
            Write-Host "  ? File not found: $filePath" -ForegroundColor Red
            $errorCount++
        }
    }
    catch {
        Write-Host "  ? Error processing file: $_" -ForegroundColor Red
        $errorCount++
    }
}

Write-Host "`nSummary:" -ForegroundColor Cyan
Write-Host "  Fixed: $fixedCount files" -ForegroundColor Green
if ($errorCount -gt 0) {
    Write-Host "  Errors: $errorCount" -ForegroundColor Red
}

Write-Host "`nRunning lint to verify fixes..." -ForegroundColor Cyan
npm run lint

Write-Host "`nDone! Check the lint output above for any remaining issues." -ForegroundColor Green
