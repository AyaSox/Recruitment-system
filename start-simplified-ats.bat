@echo off
echo ========================================
echo Starting Simplified ATS Recruitment System
echo ========================================
echo.

echo Starting Backend Server (.NET)...
cd ATSRecruitSys.Server
start cmd /k "dotnet run"

echo.
echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo.
echo Starting Frontend Server (Vite/React)...
cd ..\atsrecruitsys.client
start cmd /k "npm run dev"

echo.
echo ========================================
echo Both servers starting in separate windows
echo ========================================
echo.
echo Backend: https://localhost:7129
echo Frontend: http://localhost:5173
echo Swagger: https://localhost:7129/swagger
echo.
echo Press any key to exit this window...
pause > nul
