# Set the client directory
$clientDir = "C:\Users\cash\source\repos\ATSRecruitSys\atsrecruitsys.client"
Write-Host "Navigating to client directory: $clientDir"

# Change to client directory
Set-Location $clientDir
Write-Host "Current directory: $(Get-Location)"

# Clean up old installation
Write-Host "Cleaning up old installation..."
if (Test-Path "node_modules") {
    Write-Host "Removing node_modules folder..."
    Remove-Item -Path "node_modules" -Recurse -Force
}

if (Test-Path "package-lock.json") {
    Write-Host "Removing package-lock.json..."
    Remove-Item -Path "package-lock.json" -Force
}

# Clean npm cache
Write-Host "Cleaning npm cache..."
npm cache clean --force

# Install dependencies
Write-Host "Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

Write-Host "Installation process completed."
Write-Host "You can now try running 'npm run dev' in the 'atsrecruitsys.client' directory."