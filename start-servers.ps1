# ATS Recruitment System - Start Both Servers
# This script starts both the backend API server and frontend client server

Write-Host "Starting ATS Recruitment System..." -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Function to test if port is available
function Test-Port {
    param([int]$Port)
    try {
        $tcpClient = New-Object System.Net.Sockets.TcpClient
        $tcpClient.Connect("localhost", $Port)
        $tcpClient.Close()
        return $true
    } catch {
        return $false
    }
}

# Check if ports are available
Write-Host "Checking ports..." -ForegroundColor Yellow
if (Test-Port 7129) {
    Write-Host "Port 7129 is already in use. Please stop the existing process." -ForegroundColor Red
    exit 1
}

if (Test-Port 5173) {
    Write-Host "Port 5173 is already in use. Please stop the existing process." -ForegroundColor Red
    exit 1
}

Write-Host "Ports are available. Starting servers..." -ForegroundColor Green

# Start backend server in a new PowerShell window
Write-Host "Starting Backend API Server (https://localhost:7129)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ATSRecruitSys.Server'; dotnet run"

# Wait a moment for the backend to start
Start-Sleep -Seconds 3

# Start frontend server in a new PowerShell window
Write-Host "Starting Frontend Client Server (http://localhost:5173)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\atsrecruitsys.client'; npm run dev"

Write-Host ""
Write-Host "Both servers are starting..." -ForegroundColor Green
Write-Host "Backend API: https://localhost:7129" -ForegroundColor Yellow
Write-Host "Frontend Client: http://localhost:5173" -ForegroundColor Yellow
Write-Host "Swagger UI: https://localhost:7129/swagger" -ForegroundColor Yellow
Write-Host ""
Write-Host "Test Accounts:" -ForegroundColor Magenta
Write-Host "Admin: admin@atsrecruit.com / Admin@123" -ForegroundColor White
Write-Host "Recruiter: thabo.nkosi@atsrecruit.com / Recruit@123" -ForegroundColor White
Write-Host "Applicant: sipho.ndlovu@example.com / Applicant@123" -ForegroundColor White
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")