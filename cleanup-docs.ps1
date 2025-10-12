# Cleanup unnecessary documentation files
# Keeps only essential files like README.md

Write-Host "=== ATS Recruitment System - Documentation Cleanup ===" -ForegroundColor Cyan
Write-Host ""

# List of essential files to KEEP
$keepFiles = @(
    "README.md",
    "README-CLEAN.md",
    ".gitignore",
    "LICENSE"
)

# Get all .md files in root directory
$allMdFiles = Get-ChildItem -Path . -Filter "*.md" -File

Write-Host "Found $($allMdFiles.Count) .md files in root directory" -ForegroundColor Yellow
Write-Host ""

# Files to delete (all .md except keepFiles)
$filesToDelete = $allMdFiles | Where-Object { $keepFiles -notcontains $_.Name }

if ($filesToDelete.Count -eq 0) {
    Write-Host "No unnecessary .md files to delete!" -ForegroundColor Green
    exit 0
}

Write-Host "Files to DELETE ($($filesToDelete.Count)):" -ForegroundColor Red
$filesToDelete | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Gray }
Write-Host ""

Write-Host "Files to KEEP:" -ForegroundColor Green
$allMdFiles | Where-Object { $keepFiles -contains $_.Name } | ForEach-Object { 
    Write-Host "  - $($_.Name)" -ForegroundColor Gray 
}
Write-Host ""

# Confirm deletion
$confirmation = Read-Host "Do you want to delete these $($filesToDelete.Count) files? (yes/no)"

if ($confirmation -ne 'yes') {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Deleting files..." -ForegroundColor Cyan

# Delete files
$deletedCount = 0
foreach ($file in $filesToDelete) {
    try {
        Remove-Item $file.FullName -Force
        Write-Host "  Deleted: $($file.Name)" -ForegroundColor Gray
        $deletedCount++
    }
    catch {
        Write-Host "  ERROR deleting $($file.Name): $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Deleted: $deletedCount files" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Review the changes: git status" -ForegroundColor Gray
Write-Host "2. Commit changes: git add -A && git commit -m 'docs: cleanup repository - remove unnecessary documentation files'" -ForegroundColor Gray
Write-Host "3. Push to GitHub: git push origin main" -ForegroundColor Gray
Write-Host ""
