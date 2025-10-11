@echo off
echo ========================================
echo ATS Recruitment System - Quick Start
echo ========================================
echo.
echo Starting servers with CORRECT PORTS...
echo.

REM Start backend in new window
echo Starting Backend Server (HTTPS Port 7129)...
start "ATS Backend Server" cmd /k "cd ATSRecruitSys.Server && dotnet run"

REM Wait for backend to start
timeout /t 5 /nobreak > nul

REM Start frontend in new window
echo Starting Frontend Client (Port 5173)...
start "ATS Frontend Client" cmd /k "cd atsrecruitsys.client && npm run dev"

echo.
echo ========================================
echo Both servers are starting!
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  https://localhost:7129 (HTTPS)
echo Swagger:  https://localhost:7129/swagger
echo.
echo Test Account:
echo   Email:    admin@atsrecruit.com
echo   Password: Admin@123
echo.
echo NOTE: Backend uses HTTPS on port 7129
echo       You may see SSL warnings (normal for dev)
echo.
echo Press any key to close this window...
pause > nul
