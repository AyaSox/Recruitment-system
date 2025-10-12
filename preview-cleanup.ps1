# Quick preview of what will be deleted
Write-Host "=== Documentation Files Preview ===" -ForegroundColor Cyan
Write-Host ""

$keepFiles = @("README.md", "README-CLEAN.md", ".gitignore", "LICENSE")
$allMdFiles = Get-ChildItem -Path . -Filter "*.md" -File
$filesToDelete = $allMdFiles | Where-Object { $keepFiles -notcontains $_.Name }

Write-Host "WILL DELETE ($($filesToDelete.Count) files):" -ForegroundColor Red
$filesToDelete | Sort-Object Name | ForEach-Object { Write-Host "  $($_.Name)" }

Write-Host ""
Write-Host "WILL KEEP:" -ForegroundColor Green
$allMdFiles | Where-Object { $keepFiles -contains $_.Name } | ForEach-Object { 
    Write-Host "  $($_.Name)" 
}

Write-Host ""
Write-Host "Run cleanup-docs.ps1 to proceed with deletion" -ForegroundColor Yellow
