# ATS Recruitment System - Troubleshooting Guide

## Issues Fixed

### 1. Port Configuration Issues
- **Problem**: Backend was trying to connect to port 52889 instead of 5173
- **Solution**: Updated the following files:
  - `ATSRecruitSys.Server/ATSRecruitSys.Server.csproj` - Changed `SpaProxyServerUrl` from `https://localhost:52889` to `http://localhost:5173`
  - `atsrecruitsys.client/.vscode/launch.json` - Updated URLs to use `http://localhost:5173`

### 2. API Proxy Configuration
- **Problem**: 405 Method Not Allowed errors on login
- **Solution**: Fixed `atsrecruitsys.client/vite.config.ts` - Removed the path rewrite that was stripping the `/api` prefix

### 3. Development Code Cleanup
- **Problem**: Stray development code interfering with login
- **Solution**: Cleaned up `atsrecruitsys.client/src/App.tsx` - Removed test count button and HMR test elements

## Current Configuration

### Backend Server
- **URL**: https://localhost:7129
- **API Base**: https://localhost:7129/api
- **Swagger UI**: https://localhost:7129/swagger

### Frontend Client
- **URL**: http://localhost:5173
- **API Proxy**: Forwards `/api/*` requests to `https://localhost:7129`

## Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@atsrecruit.com | Admin@123 |
| Recruiter | thabo.nkosi@atsrecruit.com | Recruit@123 |
| Applicant | sipho.ndlovu@example.com | Applicant@123 |

## Starting the Application

### Option 1: Use the Provided Scripts
1. Run `start-servers.ps1` to start both servers automatically
2. Access the application at http://localhost:5173

### Option 2: Manual Start
1. **Start Backend**:
   ```powershell
   cd ATSRecruitSys.Server
   dotnet run
   ```

2. **Start Frontend** (in a new terminal):
   ```powershell
   cd atsrecruitsys.client
   npm run dev
   ```

## Stopping the Application

### Option 1: Use the Provided Script
- Run `stop-servers.ps1` to stop all servers

### Option 2: Manual Stop
- Press `Ctrl+C` in each terminal window running the servers

## Common Issues and Solutions

### 1. Login Getting Stuck
**Symptoms**: Login form doesn't respond or shows loading indefinitely
**Solutions**:
- Clear browser cache and local storage
- Check browser Developer Tools > Network tab for failed requests
- Ensure both servers are running on correct ports
- Verify API proxy is working by checking if requests go to `https://localhost:7129/api/auth/login`

### 2. Port Already in Use
**Symptoms**: Error messages about ports 5173 or 7129 being in use
**Solutions**:
- Use `stop-servers.ps1` to kill existing processes
- Manually kill processes using the ports:
  ```powershell
  # Find and kill process on port 5173
  netstat -ano | findstr :5173
  taskkill /PID [PID_NUMBER] /F
  
  # Find and kill process on port 7129
  netstat -ano | findstr :7129
  taskkill /PID [PID_NUMBER] /F
  ```

### 3. Database Connection Issues
**Symptoms**: Backend fails to start with database errors
**Solutions**:
- Ensure SQL Server LocalDB is installed
- The application will create databases automatically on first run
- Check connection string in `appsettings.json` if needed

### 4. CORS Errors
**Symptoms**: Browser console shows CORS policy errors
**Solutions**:
- Ensure backend is running with development CORS policy (allows any origin)
- Check that frontend is making requests to the correct backend URL
- Verify proxy configuration in `vite.config.ts`

### 5. API 404 Errors
**Symptoms**: API requests return 404 Not Found
**Solutions**:
- Verify the proxy configuration forwards `/api/*` requests correctly
- Check that backend controllers are properly decorated with `[Route("api/[controller]")]`
- Ensure both servers are running

## Debugging Tips

### Browser Developer Tools
1. Open F12 Developer Tools
2. Go to Network tab
3. Try to login and check for failed requests
4. Look for requests to `/api/auth/login` - they should be successful (200 OK)

### Backend Logs
- Check the console output of the backend server for error messages
- Look for any exceptions during login processing

### Frontend Console
- Check browser console for JavaScript errors
- Look for any React error messages

## Project Structure
```
ATSRecruitSys/
??? ATSRecruitSys.Server/          # .NET 8 Web API
?   ??? Controllers/               # API Controllers
?   ??? Services/                  # Business Logic
?   ??? Models/                    # Data Models
?   ??? appsettings.json          # Configuration
??? atsrecruitsys.client/         # React + TypeScript Frontend
?   ??? src/                      # Source Code
?   ??? vite.config.ts           # Vite Configuration
?   ??? package.json             # Dependencies
??? start-servers.ps1            # Start both servers
??? stop-servers.ps1             # Stop all servers
```

## Next Steps
1. Run `start-servers.ps1`
2. Navigate to http://localhost:5173
3. Try logging in with one of the test accounts
4. If issues persist, check the debugging tips above

## Support
If you continue to experience issues:
1. Check the browser console for errors
2. Verify both servers are running on the correct ports
3. Ensure the database has been seeded with test users
4. Try different browsers to rule out browser-specific issues