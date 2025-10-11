# PowerShell script to install client dependencies for ATSRecruitSys

Write-Host "Installing client dependencies for ATSRecruitSys..." -ForegroundColor Green

# Navigate to client directory
Set-Location "atsrecruitsys.client"

# Check if node_modules exists and remove if corrupted
if (Test-Path "node_modules") {
    Write-Host "Removing existing node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules"
}

# Remove package-lock.json if it exists
if (Test-Path "package-lock.json") {
    Write-Host "Removing existing package-lock.json..." -ForegroundColor Yellow
    Remove-Item -Force "package-lock.json"
}

# Clear npm cache
Write-Host "Clearing npm cache..." -ForegroundColor Yellow
npm cache clean --force

# Install all dependencies
Write-Host "Installing dependencies..." -ForegroundColor Green
npm install

Write-Host "Client dependencies installation completed!" -ForegroundColor Green

# Return to root directory
Set-Location ".."

Write-Host "All dependencies have been installed successfully!" -ForegroundColor Green
Write-Host "You can now run 'npm run dev' from the atsrecruitsys.client directory to start the development server." -ForegroundColor Cyan