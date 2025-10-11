# Clean up unnecessary documentation files
Write-Host "?? Cleaning up repository - removing development documentation files..." -ForegroundColor Yellow

# List of essential files to KEEP
$keepFiles = @(
    "README.md",
    "RAILWAY-DEPLOYMENT-GUIDE.md",
    "AZURE-DEPLOYMENT-GUIDE.md",
    "DEPLOY-NOW-GUIDE.md"
)

# Get all .md files
$allMdFiles = Get-ChildItem -Path "." -Filter "*.md" -Recurse | Where-Object { $_.Directory.Name -ne "screenshots" }

$filesToDelete = @()
foreach ($file in $allMdFiles) {
    if ($keepFiles -notcontains $file.Name) {
        $filesToDelete += $file.FullName
    }
}

Write-Host "Found $($filesToDelete.Count) documentation files to remove..." -ForegroundColor Cyan

# Show what will be deleted
Write-Host "Files that will be deleted:" -ForegroundColor Red
foreach ($file in $filesToDelete) {
    $relativePath = $file.Replace((Get-Location).Path, "").TrimStart('\')
    Write-Host "  - $relativePath" -ForegroundColor Gray
}

Write-Host ""
$confirm = Read-Host "Do you want to delete these files? (y/N)"

if ($confirm -eq "y" -or $confirm -eq "Y") {
    foreach ($file in $filesToDelete) {
        Remove-Item $file -Force
        $relativePath = $file.Replace((Get-Location).Path, "").TrimStart('\')
        Write-Host "Deleted: $relativePath" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "? Cleanup complete!" -ForegroundColor Green
    Write-Host "Files kept:" -ForegroundColor Cyan
    foreach ($keep in $keepFiles) {
        if (Test-Path $keep) {
            Write-Host "  ? $keep" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'Clean up: Remove development documentation files'" -ForegroundColor White
    Write-Host "3. git push origin main" -ForegroundColor White
} else {
    Write-Host "Cleanup cancelled." -ForegroundColor Yellow
}