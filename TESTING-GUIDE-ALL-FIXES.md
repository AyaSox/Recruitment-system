# ?? TESTING GUIDE - All Fixes

## Quick Test Scenarios

### ?? Scenario 1: Apply for a Job

**Steps:**
1. Open http://localhost:5173
2. Click "Jobs" in navigation
3. Click on any job to view details
4. Click "Apply" button
5. If not logged in, login as: `applicant@example.com` / `Applicant123!`
6. Fill out the form:
   - Upload a resume (PDF, DOC, or DOCX - max 5MB)
   - Write a cover letter (optional)
   - Rate your skills
   - Add notes (optional)
7. Click "Submit Application"

**Expected Result:**
- ? Form loads without errors
- ? Resume uploads successfully
- ? No console errors: "getPublicJob is not a function"
- ? Redirects to "My Applications" on success
- ? See success message

---

### ?? Scenario 2: View Profile

**Steps:**
1. Login as: `applicant@example.com` / `Applicant123!`
2. Click "Profile" in sidebar/navigation
3. View profile details

**Expected Result:**
- ? Profile page loads (or redirects to create if new user)
- ? No 404 error
- ? See profile completion percentage
- ? Tabs show: Overview, Skills, Work Experience, Education, Certifications

**If No Profile:**
- ? Redirects to `/profile/create`
- ? Can create new profile

---

### ?? Scenario 3: Publish Job (Admin)

**Steps:**
1. Login as: `admin@atsrecruitsys.com` / `Admin123!`
2. Go to "Jobs"
3. Create a new job OR click on existing job
4. Find "Publish" button/option
5. Click to publish

**Expected Result:**
- ? Job status changes to "Published"
- ? No console errors
- ? Job appears in public job list

---

### ?? Scenario 4: SignalR Connection

**Steps:**
1. Open browser console (F12)
2. Login as any user
3. Watch console logs

**Expected Result:**
```
Initializing SignalR connection to: https://localhost:7129/notificationHub
Starting SignalR connection...
? SignalR Connected successfully
```

**Should NOT See:**
```
? Failed to complete negotiation
? GET https://localhost:7138/... 404
? Error: Status code '405'
```

---

### ?? Scenario 5: Theme Toggle

**Steps:**
1. Open app (logged in or not)
2. Look in top-right of navbar
3. Click sun/moon icon

**Expected Result:**
- ? Icon visible in navbar
- ? Clicking toggles between light/dark mode
- ? Theme persists on page refresh
- ? Smooth transition between themes

---

## Console Verification

### ? Good Console Output

```javascript
// Job Apply Page
Job data received: {id: 5, title: "Full Stack Developer", ...}
Initializing skills from job requirements
Form ready for submission

// SignalR
Initializing SignalR connection to: https://localhost:7129/notificationHub
Starting SignalR connection...
? SignalR Connected successfully

// Profile Page
Profile loaded successfully
Profile completion: 75%
```

### ? Bad Console Output (Issues)

```javascript
// These should NOT appear:
JobService.getPublicJob is not a function
Failed to complete negotiation with the server
GET https://localhost:7138/notificationHub/negotiate 404
TypeError: Cannot read property 'requiredSkills' of undefined
```

---

## Network Tab Verification

### Check These Requests

#### Job Application
```
POST https://localhost:7129/api/applications
Status: 200 OK
Content-Type: multipart/form-data

Response:
{
  "id": 123,
  "jobId": 5,
  "status": "New",
  "appliedDate": "2025-01-..."
}
```

#### SignalR Negotiation
```
POST https://localhost:7129/notificationHub/negotiate
Status: 200 OK

Response:
{
  "connectionId": "xxx",
  "negotiateVersion": 1,
  "availableTransports": [...]
}
```

#### Profile
```
GET https://localhost:7129/api/candidateprofile/my
Status: 200 OK (or 404 if no profile)

Response:
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  ...
}
```

---

## Screenshots to Check

### 1. Job Apply Page
**Should Show:**
- ? Job details (title, department, location)
- ? File upload button
- ? Cover letter text area
- ? Skills rating section
- ? Submit button (not disabled)

### 2. Profile Page
**Should Show:**
- ? Profile header with avatar
- ? Name and job title
- ? Profile completion bar
- ? Tabs for different sections
- ? "Edit Profile" button

### 3. Navbar (After Login)
**Should Show:**
- ? Theme toggle icon (sun/moon)
- ? Language selector
- ? Notification bell
- ? User avatar
- ? Menu items based on role

---

## Role-Based Testing

### As Admin
```
Email: admin@atsrecruitsys.com
Password: Admin123!
```
**Can:**
- ? View dashboard
- ? Create jobs
- ? Publish/unpublish jobs
- ? View all applications
- ? Schedule interviews
- ? View audit logs
- ? Access reports

### As Recruiter
```
Email: recruiter@example.com
Password: Recruiter123!
```
**Can:**
- ? View dashboard
- ? Create jobs
- ? View applications
- ? Schedule interviews
- ? View reports
- ? Cannot publish jobs (needs approval)
- ? Cannot access audit logs

### As Applicant
```
Email: applicant@example.com
Password: Applicant123!
```
**Can:**
- ? Browse jobs
- ? Apply for jobs
- ? View my applications
- ? Manage profile
- ? View my interviews
- ? Cannot access admin features
- ? Cannot view all applications

---

## Common Test Failures & Solutions

### Issue: "getPublicJob is not a function"
**Cause:** Old cached JavaScript
**Solution:** 
```powershell
# Stop frontend
Ctrl+C

# Clear npm cache
npm run dev
```

### Issue: SignalR 404
**Cause:** Backend not running
**Solution:**
```powershell
# Check backend is running on port 7129
cd ATSRecruitSys.Server
dotnet run
```

### Issue: Profile 404
**Cause:** No profile created yet
**Expected:** Redirects to `/profile/create`
**Solution:** Create profile first

### Issue: Can't upload resume
**Cause:** File too large or wrong type
**Solution:** 
- Max size: 5MB
- Allowed: PDF, DOC, DOCX
- Check file before uploading

---

## Performance Checks

### Page Load Times
- ? Jobs page: < 2 seconds
- ? Job details: < 1 second
- ? Profile page: < 2 seconds
- ? Dashboard: < 3 seconds

### API Response Times
- ? GET /jobs: < 500ms
- ? GET /jobs/{id}: < 200ms
- ? POST /applications: < 1s (with file upload)
- ? GET /candidateprofile/my: < 300ms

---

## Mobile Testing

### Responsive Breakpoints
- ? Desktop: 1920x1080
- ? Tablet: 768x1024
- ? Mobile: 375x667

### Mobile-Specific Features
- ? Hamburger menu
- ? Mobile layout component
- ? Touch-friendly buttons
- ? Swipeable tabs

---

## Browser Compatibility

### Tested Browsers
- ? Chrome (latest)
- ? Edge (latest)
- ? Firefox (latest)
- ? Safari (latest)

### Required Features
- ? WebSockets (for SignalR)
- ? LocalStorage (for auth)
- ? File API (for uploads)
- ? Fetch API (for HTTP)

---

## Security Checks

### Authentication
- ? JWT token stored in localStorage
- ? Token sent in Authorization header
- ? 401 errors redirect to login
- ? Protected routes require auth

### File Upload
- ? File type validation (client)
- ? File size validation (client)
- ? Server-side validation (backend)
- ? Malware scanning (if configured)

### CORS
- ? Origin: http://localhost:5173
- ? Methods: GET, POST, PUT, DELETE
- ? Credentials: true (for SignalR)
- ? Headers: Authorization, Content-Type

---

## Test Checklist

### Before Testing
- [ ] Backend running on port 7129
- [ ] Frontend running on port 5173
- [ ] Database seeded with test data
- [ ] Browser console open (F12)
- [ ] Network tab open

### During Testing
- [ ] No console errors
- [ ] All API calls succeed (200/201)
- [ ] SignalR connects successfully
- [ ] Forms submit correctly
- [ ] Files upload successfully
- [ ] Navigation works
- [ ] Theme toggle works

### After Testing
- [ ] Logout works
- [ ] SignalR disconnects
- [ ] No memory leaks
- [ ] No hanging connections

---

## Reporting Issues

### If You Find a Bug

**Include:**
1. **What you did** (steps to reproduce)
2. **What happened** (actual result)
3. **What you expected** (expected result)
4. **Console errors** (screenshot or copy)
5. **Network errors** (failed requests)
6. **Browser and OS** (Chrome on Windows, etc.)

**Example Report:**
```
Bug: Can't upload resume

Steps:
1. Logged in as applicant
2. Applied for "Full Stack Developer" job
3. Selected resume.pdf (2MB)
4. Clicked Submit

Expected: Application submits successfully
Actual: Error "Failed to submit application"

Console Error:
POST https://localhost:7129/api/applications 500
Error: Unsupported file type

Browser: Chrome 120 on Windows 11
```

---

## Success Criteria

### ? All Tests Pass
- Job application works
- Profile loads correctly
- SignalR connects without errors
- Theme toggle visible and working
- Admin can publish jobs
- Files upload successfully

### ? No Console Errors
- No "is not a function" errors
- No SignalR negotiation failures
- No 404 errors on hub connection
- No CORS errors

### ? Good Performance
- Pages load quickly
- API responses fast
- No memory leaks
- Smooth animations

---

**Ready to Test!** ??

Start with Scenario 1 (Apply for Job) as it tests the most critical fixes.
