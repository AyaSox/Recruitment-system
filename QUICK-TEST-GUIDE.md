# ?? Quick Testing Guide - TL;DR

## ?? Fastest Way to Test

### Option 1: Double-Click Batch File (Easiest!)
1. Double-click `start-blazor-testing.bat`
2. Wait 10-15 seconds
3. Press any key when prompted
4. Browser opens automatically at https://localhost:5001

### Option 2: PowerShell Script
1. Run `.\test-blazor-app.ps1`
2. Follow prompts

### Option 3: Manual (Most Control)

**Terminal 1:**
```powershell
cd ATSRecruitSys.Server
dotnet run
```

**Terminal 2:**
```powershell
cd ATSRecruitSys.Blazor\ATSRecruitSys.Blazor
dotnet run
```

**Browser:**
Navigate to https://localhost:5001

---

## ? 5-Minute Quick Test

### 1. Register (30 seconds)
```
Navigate to: /register
Email: test@test.com
Password: Test123!
Role: Candidate
Click Register
```

### 2. View Dashboard (10 seconds)
```
Should see:
- 4 stat cards
- Recent jobs table
```

### 3. Browse Jobs (30 seconds)
```
Navigate to: /jobs
Search for a job
Click "View Details"
```

### 4. Apply for Job (60 seconds)
```
Click "Apply Now"
Fill form:
- Name, Email, Phone
- Cover Letter
- Upload resume (PDF)
Click Submit
```

### 5. Check Application (30 seconds)
```
Navigate to: My Applications
Should see your application
Click "View Details"
```

### 6. Test Recruiter Role (90 seconds)
```
Logout
Register new user:
Email: recruiter@test.com
Role: Recruiter

Navigate to: Jobs
Click "Create Job"
Fill form and submit

Navigate to: Applications
View all applications
Update status
```

**Total Time: ~5 minutes**

---

## ?? Troubleshooting

### Problem: API not connecting
**Fix:**
```powershell
cd ATSRecruitSys.Server
dotnet run
```
Wait for: "Now listening on: https://localhost:7214"

### Problem: Blazor not loading
**Fix:**
```powershell
cd ATSRecruitSys.Blazor\ATSRecruitSys.Blazor
dotnet build
dotnet run
```
Wait for: "Now listening on: https://localhost:5001"

### Problem: Database errors
**Fix:**
```powershell
cd ATSRecruitSys.Server
dotnet ef database update
```

### Problem: Build errors
**Fix:**
```powershell
dotnet clean
dotnet build
```

### Problem: Port in use
**Fix:**
```powershell
# Find process
netstat -ano | findstr "5001"
# Kill it
taskkill /PID <process_id> /F
```

---

## ?? What to Test

### Must Test ?
1. Registration (both roles)
2. Login
3. Dashboard
4. Browse jobs
5. Apply for job (Candidate)
6. Create job (Recruiter)
7. View applications (Recruiter)

### Should Test ?
8. Edit job
9. Update application status
10. Responsive design
11. Search/filter
12. Logout

### Nice to Test ?
13. Form validation
14. Error messages
15. Loading states
16. Navigation menu
17. Role-based access

---

## ?? Success Criteria

Your app is working if:
- ? You can register
- ? You can login
- ? Dashboard shows data
- ? You can view jobs
- ? You can apply for jobs
- ? Recruiter can create jobs
- ? No console errors

---

## ?? Need More Help?

**Full Testing Guide:** See `BLAZOR-TESTING-GUIDE.md`  
**Implementation Summary:** See `BLAZOR-COMPLETE-IMPLEMENTATION-SUMMARY.md`  
**Build Issues:** Run `dotnet build` and check errors

---

## ?? Ready to Test!

1. Run `start-blazor-testing.bat`
2. Wait for browser to open
3. Follow 5-minute test above
4. Report any issues

**That's it! You're ready to test your Blazor application!** ??
