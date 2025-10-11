# ?? QUICK START - CORRECT PORTS ?

## ? FIXED with Correct Port Numbers!

Your login issue was caused by **wrong API URL**. 

**The Fix:**
- Changed from: `http://localhost:5242/api`
- Changed to: `https://localhost:7129/api` ?

## ?? Start Your Application

### Option 1: Use Start Script
```powershell
.\start-servers.ps1
```

### Option 2: Manual Start (2 terminals)

**Terminal 1 - Backend:**
```powershell
cd ATSRecruitSys.Server
dotnet run
```
? Wait for: `Now listening on: https://localhost:7129`

**Terminal 2 - Frontend:**
```powershell
cd atsrecruitsys.client
npm run dev
```
? Wait for: `Local: http://localhost:5173`

## ?? Access the Application

**Frontend App:** http://localhost:5173

**Backend Services:**
- HTTPS API: https://localhost:7129
- Swagger UI: https://localhost:7129/swagger
- Health Check: https://localhost:7129/health

## ?? Test Login

```
Email:    admin@atsrecruit.com
Password: Admin@123
```

## ? Expected Results

1. ? Login page loads without errors
2. ? No "Network Error" messages
3. ? No "ERR_CONNECTION_REFUSED" errors
4. ? Can login successfully
5. ? Redirected to Dashboard

## ?? Quick Troubleshooting

### Restart Frontend (if needed)
```powershell
# In frontend terminal:
# Press Ctrl+C, then:
cd atsrecruitsys.client
npm run dev
```

### Verify Configuration
```powershell
Get-Content atsrecruitsys.client\.env.development
```
Should show: `VITE_API_URL=https://localhost:7129/api`

### Hard Refresh Browser
Press: **Ctrl + Shift + R**

## ?? SSL Certificate Warning

When accessing https://localhost:7129 directly, you may see:
- "Your connection is not private" warning
- This is **NORMAL** for development
- Click **Advanced** ? **Proceed to localhost (unsafe)**

The frontend at http://localhost:5173 should work fine!

## ?? Port Summary

| Service | URL | Description |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | React app (USE THIS) |
| Backend HTTPS | https://localhost:7129 | API server |
| Backend HTTP | http://localhost:5242 | Alternative (not used) |
| Swagger | https://localhost:7129/swagger | API docs |

## ?? You're All Set!

Your ATS Recruitment System should now work perfectly!

---

**Having issues?** See LOGIN-FIX-COMPLETE.md for detailed troubleshooting.
