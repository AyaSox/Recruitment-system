@echo off
echo Starting ATS Recruitment System...
echo.

echo [1/2] Starting Backend Server...
cd ATSRecruitSys.Server
start "Backend Server" dotnet run
timeout /t 5 /nobreak > nul

echo [2/2] Starting Frontend Development Server...
cd ..\atsrecruitsys.client
start "Frontend Server" npm run dev

echo.
echo =====================================
echo  ATS Recruitment System Started!
echo =====================================
echo.
echo Backend:  http://localhost:7129
echo Frontend: http://localhost:5173
echo.
echo Press any key to close this window...
pause > nul