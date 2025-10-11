# ?? QUICK FIX REFERENCE

## What Was Fixed

| Issue | Status | File Changed |
|-------|--------|--------------|
| ? Can't apply for jobs | ? FIXED | `job.service.ts` |
| ? Profile shows 404 | ? ALREADY WORKING | - |
| ? SignalR errors | ? FIXED | `notification.service.ts` |
| ? Theme toggle missing | ? ALREADY WORKING | - |
| ? Can't publish jobs | ? FIXED | `job.service.ts` |
| ? File upload not working | ? ALREADY WORKING | - |

---

## Start the App

```powershell
# Quick start
.\start-servers.ps1

# OR Manual
# Terminal 1
cd ATSRecruitSys.Server
dotnet run

# Terminal 2
cd atsrecruitsys.client
npm run dev
```

**Access:** http://localhost:5173

---

## Test Accounts

```
Admin:
Email: admin@atsrecruitsys.com
Password: Admin123!

Applicant:
Email: applicant@example.com
Password: Applicant123!

Recruiter:
Email: recruiter@example.com
Password: Recruiter123!
```

---

## Quick Tests

### 1. Apply for Job
1. Go to Jobs
2. Click any job
3. Click "Apply"
4. Login if needed
5. Upload resume
6. Submit

**Expected:** Success, redirects to My Applications

### 2. Check SignalR
1. Open console (F12)
2. Login
3. Look for: `? SignalR Connected successfully`

**Expected:** No errors

### 3. View Profile
1. Login as Applicant
2. Click "Profile"

**Expected:** Profile loads or redirects to create

### 4. Publish Job (Admin)
1. Login as Admin
2. Create or edit job
3. Click "Publish"

**Expected:** Job published

---

## Console Checks

### ? Good
```
? SignalR Connected successfully
Job data received: {...}
Profile loaded successfully
```

### ? Bad
```
getPublicJob is not a function
Failed to complete negotiation
GET .../notificationHub 404
```

---

## Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 7129 | https://localhost:7129 |
| SignalR Hub | 7129 | https://localhost:7129/notificationHub |
| Swagger | 7129 | https://localhost:7129/swagger |

---

## Files Modified

1. **atsrecruitsys.client/src/services/job.service.ts**
   - Added `getPublicJob()` method
   - Added `publishJob()` method
   - Added `unpublishJob()` method

2. **atsrecruitsys.client/src/pages/JobApplyPage.tsx**
   - Fixed type imports (removed PublicJob)
   - Added error handling

3. **atsrecruitsys.client/src/services/notification.service.ts**
   - Fixed SignalR URL
   - Fixed connection logic
   - Better error handling

---

## If Issues Persist

### Clear Cache
```powershell
cd atsrecruitsys.client
Remove-Item -Recurse node_modules
npm install
npm run dev
```

### Check Backend
```powershell
cd ATSRecruitSys.Server
dotnet build
dotnet run
```

### Check Logs
- Browser console (F12)
- Network tab
- Backend terminal output

---

## Success Indicators

- ? No console errors
- ? SignalR connects
- ? Can apply for jobs
- ? Profile loads
- ? Theme toggle visible
- ? Admin can publish jobs

---

## Key URLs

- **App**: http://localhost:5173
- **Login**: http://localhost:5173/login
- **Jobs**: http://localhost:5173/jobs
- **Profile**: http://localhost:5173/profile
- **Dashboard**: http://localhost:5173/dashboard
- **API Docs**: https://localhost:7129/swagger

---

## Support Files

- `ALL-CRITICAL-ISSUES-FIXED.md` - Detailed fix documentation
- `TESTING-GUIDE-ALL-FIXES.md` - Complete testing guide
- `REACT-ONLY-ARCHITECTURE-COMPLETE.md` - Architecture overview
- `START-HERE.md` - Quick start guide

---

**Status:** ? **READY TO TEST**  
**Build:** ? **SUCCESS**  
**Date:** January 2025
