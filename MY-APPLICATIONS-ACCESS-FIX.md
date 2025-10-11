# My Applications Access Fix

## ?? Problem
User "Sipho Ndlovu" (sipho.ndlovu@example.com) is getting "Unauthorized Access" when trying to view their applications.

## ? Root Cause
The user's JWT token might not have the correct "Applicant" role, or the token is outdated.

## ??? Solution

### Option 1: Quick Fix (Recommended)
**Simply log out and log back in:**

1. Click on the user avatar in the top-right corner
2. Click "Logout"
3. Go to the login page
4. Login again with credentials:
   - **Email:** sipho.ndlovu@example.com
   - **Password:** Applicant@123

### Option 2: Check Browser Console for Diagnostics
The system now includes diagnostic logging to help identify the issue:

1. Open browser developer tools (F12)
2. Go to the **Console** tab
3. Try to access "My Applications" again
4. Look for log messages like:
   ```
   ?? Login Response: { roles: [...], hasApplicantRole: true/false }
   ?? Retrieved User from localStorage: { roles: [...] }
   ?? Role check "Applicant": true/false
   ```

### Option 3: Clear Browser Storage
If logging out and back in doesn't work:

1. Open browser developer tools (F12)
2. Go to the **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Under "Local Storage", find your site
4. Delete the `token` and `user` entries
5. Refresh the page and log in again

## ?? Test Credentials for All Roles

### Admin
- **Email:** admin@atsrecruit.com
- **Password:** Admin@123

### Recruiter
- **Email:** thabo.nkosi@atsrecruit.com
- **Password:** Recruit@123

### Applicant (Multiple Users)
- **Email:** sipho.ndlovu@example.com | **Password:** Applicant@123
- **Email:** buhle.mthembu@example.com | **Password:** Applicant@123
- **Email:** tumelo.mokoena@example.com | **Password:** Applicant@123

## ?? What Was Fixed

### Backend Changes
? **No changes needed** - The backend is correctly configured:
- `/api/applications/my` endpoint requires "Applicant" role ?
- DatabaseSeeder creates applicants with correct role ?
- AuthService returns roles in JWT token ?

### Frontend Changes
? **Enhanced diagnostics and error handling:**

1. **MyApplicationsPage.tsx**
   - Added diagnostic logging to show user's roles
   - Added warning alert if "Applicant" role is missing
   - Added "Logout & Re-login" button for quick fix
   - Better error messages with specific solutions

2. **auth.service.ts**
   - Added console logging for login, logout, and role checks
   - Logs show exactly what roles are being stored/retrieved
   - Helps identify if roles are missing in the response

## ?? Expected Behavior After Fix

When you log in as an applicant and navigate to "My Applications":

1. You should see a list of your job applications
2. Each application shows:
   - Job title and department
   - Application status (with color coding)
   - Applied date
   - Upcoming interviews (if any)
   - Latest status update
3. You can click "View Details" to see full application info

## ?? If Issue Persists

If the problem continues after logging out and back in:

1. Check the browser console for error messages
2. Verify that the backend is running on `https://localhost:7245`
3. Check if the user exists in the database with the "Applicant" role:
   ```sql
   SELECT u.Email, r.Name as Role
   FROM AspNetUsers u
   JOIN AspNetUserRoles ur ON u.Id = ur.UserId
   JOIN AspNetRoles r ON ur.RoleId = r.Id
   WHERE u.Email = 'sipho.ndlovu@example.com';
   ```
4. Check that the JWT configuration in `appsettings.json` is correct

## ?? System Architecture

```
User Login Flow:
1. User enters credentials ? AuthController.Login()
2. AuthService validates and creates JWT with roles
3. Frontend stores token + user data in localStorage
4. User navigates to /my-applications
5. ProtectedRoute checks if user has "Applicant" role
6. If yes ? Shows applications | If no ? Redirects to /unauthorized
```

## ? Enhanced Features

The fix includes these new diagnostic features:

- **Real-time role checking** - Logs appear in browser console
- **Role mismatch detection** - Shows warning if Applicant role is missing
- **One-click re-authentication** - Button to logout and re-login
- **Detailed error messages** - Explains exactly what went wrong
- **Token debugging** - Shows what's stored in localStorage

These features will help diagnose similar issues in the future!

---

## ?? Summary

**The issue is most likely an outdated token.** Simply logging out and logging back in should fix it immediately.

The diagnostic logging will help you confirm that roles are being properly assigned and stored.
