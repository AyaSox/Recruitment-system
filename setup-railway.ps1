# Quick Railway Deployment Script
# Run this in your project directory

Write-Host "?? Railway Deployment Setup" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Check if git is initialized
if (!(Test-Path ".git")) {
    Write-Host "Initializing git repository..." -ForegroundColor Yellow
    git init
}

# Add all files
Write-Host "Adding files to git..." -ForegroundColor Yellow
git add .

# Commit changes
$commitMessage = "Railway deployment configuration - $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git commit -m $commitMessage

Write-Host "? Git setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "?? Next Steps:" -ForegroundColor Cyan
Write-Host "1. Create a GitHub repository at: https://github.com/new" -ForegroundColor White
Write-Host "2. Run these commands with your repository URL:" -ForegroundColor White
Write-Host ""
Write-Host "   git remote add origin https://github.com/yourusername/your-repo-name.git" -ForegroundColor Yellow
Write-Host "   git branch -M main" -ForegroundColor Yellow
Write-Host "   git push -u origin main" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Then go to railway.app and deploy from your GitHub repo!" -ForegroundColor White
Write-Host ""
Write-Host "?? Full instructions in: RAILWAY-DEPLOYMENT-GUIDE.md" -ForegroundColor Cyan