# User Management Access Guide ?

## Issue
User couldn't find the option to add new users with Recruiter or Hiring Manager roles from the Settings page.

## Solution
The **User Management** feature is on a **separate page** accessible only to **Admins**.

## How to Access User Management

### For Admin Users:

1. **Log in** as an Admin user
2. Look at the **left sidebar navigation menu**
3. Click on **"User Management"** (has a Person icon ??)
4. This will take you to `/users` page

### Alternative Access:
- You can also directly navigate to: `http://localhost:5173/users`
- The navigation link will only appear if you're logged in as an Admin

## User Management Features

### On the User Management Page, you can:

1. **View All Internal Staff Users**
   - Displays: Name, Email, Roles, Created Date
   - Only shows Admin, Recruiter, and Hiring Manager users
   - External applicants are excluded from this list

2. **Add New Users**
   - Click the **"Add New User"** button (top right, blue button with + icon)
   - Fill in the form:
     - First Name
     - Last Name
     - Email
     - Password (min 6 chars, must include uppercase, lowercase, number, special char)
     - Role (dropdown with 3 options)

3. **Available Roles**
   - **Admin** - Full system access, can manage users, approve jobs, publish jobs
   - **Recruiter** - Can create/edit jobs, manage applications, view reports
   - **Hiring Manager** - Can view jobs and applications, access settings

## Important Notes

### Settings Page vs User Management Page

**Settings Page** (`/settings`):
- Personal profile settings
- Change password
- Accessible by: Admin, Recruiter, Hiring Manager

**User Management Page** (`/users`):
- Create new internal staff users
- View all system users
- Assign roles
- **Accessible ONLY by: Admin**

### Navigation Structure

```
Sidebar Menu (for Admins):
??? Dashboard
??? Jobs
??? Applications
??? Application Funnel
??? Reports
??? User Management  ? HERE! (Admin only)
??? Audit Logs
??? Settings
```

### Why User Management is Not in Settings

This is a **security design decision**:
- Settings = Personal account settings (all staff can access)
- User Management = System administration (Admin only)
- Keeps user creation/role assignment restricted to Admins

## Testing Access

### As Admin:
? You SHOULD see "User Management" in the sidebar
? You CAN access `/users` page
? You CAN create new users with any role

### As Recruiter or Hiring Manager:
? You will NOT see "User Management" in the sidebar
? Trying to access `/users` will show "Unauthorized" page
? You cannot create new users

## Quick Test Steps

1. **Login as Admin** (use your admin credentials)
2. **Check the left sidebar** - you should see:
   ```
   [?? User Management]
   ```
3. **Click on "User Management"**
4. **Click "Add New User" button** (top right, blue)
5. **Fill in the form:**
   - First Name: John
   - Last Name: Doe
   - Email: john.doe@company.com
   - Password: Test@123
   - Role: Recruiter (or HiringManager)
6. **Click "Create User"**
7. ? User should be created and appear in the table

## Default Admin Accounts

If you need to test but don't have admin access, check these seeded accounts:

**Admin Account:**
- Email: `admin@atsrecruit.com`
- Password: `Admin@123`

**Recruiter Account:**
- Email: `recruiter@atsrecruit.com`
- Password: `Recruiter@123`

## Backend API Endpoints Used

The User Management page uses these backend endpoints:

1. **GET /api/auth/users** - Fetch all users
2. **POST /api/auth/register** - Create new user
3. **POST /api/auth/assign-role** - Assign role to user

## File Locations

### Frontend Files:
- Page: `atsrecruitsys.client/src/pages/UserManagementPage.tsx`
- Navigation: `atsrecruitsys.client/src/components/Navbar.tsx`
- Route: `atsrecruitsys.client/src/App.tsx` (line 133-137)

### Backend Files:
- Controller: `ATSRecruitSys.Server/Controllers/AuthController.cs`
- Service: `ATSRecruitSys.Server/Services/AuthService.cs`

## Troubleshooting

### "I don't see User Management in the sidebar"

**Check:**
1. Are you logged in as Admin?
2. Run: `console.log(user?.roles)` in browser console
3. Should show: `["Admin"]`

**Solution:**
- Log out and log back in as admin@atsrecruit.com
- Or check your database to confirm your user has Admin role

### "I get Unauthorized when clicking User Management"

**Cause:** Your account doesn't have Admin role

**Solution:**
- Use a different admin account
- Or ask an existing admin to promote your account

### "The navigation link appears but page is blank"

**Check:**
1. Open browser console (F12)
2. Look for errors
3. Check network tab for API call failures

**Solution:**
- Backend might not be running
- Start backend: `dotnet run` in ATSRecruitSys.Server folder

## Summary

? **User Management** is a separate page at `/users`
? **Admin only** - not available to Recruiters/Hiring Managers
? Located in **left sidebar navigation** (when logged in as Admin)
? **Not in Settings page** - Settings is for personal account settings
? Can create users with roles: **Admin**, **Recruiter**, **Hiring Manager**

## Recent Fix Applied

**Fixed Issue:** Audit Logs path was incorrect (`/audit-logs` ? `/audit-log`)
- This was causing a mismatch with the route definition
- User Management path was already correct

## Status
?? **Navigation Fixed and Working**

User Management is now properly accessible from the sidebar menu for Admin users!
