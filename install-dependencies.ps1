# Check if Node.js and npm are installed
Write-Host "Checking Node.js and npm installation..."
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion"
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH"
}

try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion"
} catch {
    Write-Host "Error: npm is not installed or not in PATH"
}

# Set the client directory
$clientDir = Join-Path $PSScriptRoot "atsrecruitsys.client"
Write-Host "Client directory: $clientDir"

# Check if directory exists
if (Test-Path $clientDir) {
    Write-Host "Client directory exists"
} else {
    Write-Host "Error: Client directory does not exist"
    exit 1
}

# Change to client directory
Set-Location $clientDir
Write-Host "Current directory: $(Get-Location)"

# Clean up old installation
Write-Host "Cleaning up old installation..."
if (Test-Path "node_modules") {
    Remove-Item -Path "node_modules" -Recurse -Force
    Write-Host "Removed node_modules folder"
}

if (Test-Path "package-lock.json") {
    Remove-Item -Path "package-lock.json" -Force
    Write-Host "Removed package-lock.json"
}

# Try npm install
Write-Host "Installing dependencies..."
try {
    npm install --legacy-peer-deps
    Write-Host "npm install completed successfully"
} catch {
    Write-Host "Error during npm install: $_"
}

# Try installing specific packages one by one
Write-Host "Installing specific packages one by one..."
$packages = @(
    "react",
    "react-dom",
    "@mui/material",
    "@emotion/react",
    "@emotion/styled",
    "@mui/icons-material",
    "react-router-dom",
    "formik",
    "yup",
    "axios",
    "chart.js",
    "react-chartjs-2",
    "date-fns",
    "@mui/x-date-pickers"
)

foreach ($package in $packages) {
    Write-Host "Installing $package..."
    try {
        npm install $package --legacy-peer-deps
        Write-Host "$package installed successfully"
    } catch {
        Write-Host "Error installing $package: $_"
    }
}

Write-Host "Installation process completed."