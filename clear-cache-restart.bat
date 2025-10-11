@echo off
echo Clearing frontend caches and restarting...
echo.

cd atsrecruitsys.client

echo Stopping any running processes...
taskkill /F /IM node.exe 2>nul

echo.
echo Clearing caches...
rd /s /q node_modules\.vite 2>nul
rd /s /q node_modules\.cache 2>nul
rd /s /q dist 2>nul

echo.
echo Restarting development server...
npm run dev

pause
