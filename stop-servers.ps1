# ATS Recruitment System - Stop All Servers
# This script stops all running instances of the ATS servers

Write-Host "Stopping ATS Recruitment System servers..." -ForegroundColor Red
Write-Host "==========================================" -ForegroundColor Red

# Stop .NET processes (backend)
Write-Host "Stopping Backend API Server..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "ATSRecruitSys.Server" -or $_.ProcessName -eq "dotnet" } | ForEach-Object {
    if ($_.MainWindowTitle -like "*ATSRecruitSys*" -or $_.CommandLine -like "*ATSRecruitSys.Server*") {
        Write-Host "Stopping process: $($_.ProcessName) (ID: $($_.Id))" -ForegroundColor Cyan
        Stop-Process -Id $_.Id -Force
    }
}

# Stop Node.js processes (frontend)
Write-Host "Stopping Frontend Client Server..." -ForegroundColor Yellow
Get-Process | Where-Object { $_.ProcessName -eq "node" } | ForEach-Object {
    if ($_.CommandLine -like "*vite*" -or $_.CommandLine -like "*atsrecruitsys.client*") {
        Write-Host "Stopping process: $($_.ProcessName) (ID: $($_.Id))" -ForegroundColor Cyan
        Stop-Process -Id $_.Id -Force
    }
}

# Kill processes using the specific ports
Write-Host "Checking and killing processes on ports 7129 and 5173..." -ForegroundColor Yellow

# Kill process on port 7129 (backend)
$processOnPort7129 = netstat -ano | findstr ":7129"
if ($processOnPort7129) {
    $pid = ($processOnPort7129 -split '\s+')[-1]
    if ($pid -and $pid -ne "0") {
        Write-Host "Killing process on port 7129 (PID: $pid)" -ForegroundColor Cyan
        taskkill /PID $pid /F 2>$null
    }
}

# Kill process on port 5173 (frontend)
$processOnPort5173 = netstat -ano | findstr ":5173"
if ($processOnPort5173) {
    $pid = ($processOnPort5173 -split '\s+')[-1]
    if ($pid -and $pid -ne "0") {
        Write-Host "Killing process on port 5173 (PID: $pid)" -ForegroundColor Cyan
        taskkill /PID $pid /F 2>$null
    }
}

Write-Host ""
Write-Host "All ATS servers have been stopped." -ForegroundColor Green
Write-Host "Press any key to close this window..." -ForegroundColor Green
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")