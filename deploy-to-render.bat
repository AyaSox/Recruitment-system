@echo off
REM Deploy ATS Recruitment System to Render
REM This script prepares your code for Render deployment

echo.
echo ============================================
echo ATS Recruitment System - Render Deployment
echo ============================================
echo.

REM Step 1: Check Git Status
echo [1/5] Checking Git status...
git status
echo.

REM Step 2: Stage all changes
echo [2/5] Staging changes...
git add .
echo.

REM Step 3: Commit
echo [3/5] Committing changes for Render deployment...
git commit -m "Prepare ATS system for Render deployment

- Updated CORS configuration for Render URLs
- Updated frontend .env.production with Render API URL
- Added render.yaml configuration
- Ensured database seeding for demo data"

echo.

REM Step 4: Push to GitHub
echo [4/5] Pushing to GitHub...
git push origin main
echo.

REM Step 5: Display next steps
echo [5/5] Deployment script complete!
echo.
echo ============================================
echo NEXT STEPS - Deploy to Render
echo ============================================
echo.
echo 1. Go to https://dashboard.render.com
echo 2. Click "New +" and select "Web Service"
echo 3. Connect your GitHub repository
echo 4. Render will auto-detect render.yaml
echo 5. Click "Create Web Service"
echo.
echo Services that will be created:
echo   - ats-recruitment-db (PostgreSQL)
echo   - ats-recruitment-backend (Docker/.NET 8)
echo   - ats-recruitment-frontend (React/Vite)
echo.
echo TEST ACCOUNTS:
echo   Admin: admin@atsrecruitsys.com / Admin123!
echo   Recruiter: recruiter@test.com / Test123!
echo   HiringManager: hiringmanager@test.com / Test123!
echo   Applicant: applicant@test.com / Test123!
echo.
echo Expected Deploy Time: 5-10 minutes
echo.
pause
