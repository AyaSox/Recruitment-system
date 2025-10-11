# ?? ATS RECRUITMENT SYSTEM - AUTHORIZATION MATRIX

## Complete Permissions & Access Control Guide

---

## ?? User Roles

The system has **3 main roles**:

1. **Admin** - Full system access and control
2. **Recruiter** - Manage jobs, applications, and interviews
3. **Applicant** - View jobs and manage own applications

---

## ?? ROLE-BASED PERMISSIONS

### ?? ADMIN PERMISSIONS

**Full Access** - Can do everything in the system

#### Jobs Management
- ? **View all jobs** (published, unpublished, pending approval)
- ? **Create jobs** (auto-approved)
- ? **Edit any job** (all fields)
- ? **Delete any job**
- ? **Approve/Reject jobs** created by Recruiters
- ? **Publish/Unpublish jobs**
- ? **View pending approval jobs**

#### Applications Management
- ? **View all applications** across all jobs
- ? **Update application status** (all statuses)
- ? **Download resumes** (all applications)
- ? **Add application notes** (internal & public)
- ? **View application statistics**
- ? **Export application data**

#### Interviews Management
- ? **Schedule interviews** (for any application)
- ? **Reschedule interviews**
- ? **Cancel interviews**
- ? **Complete interviews**
- ? **View all interviews**

#### User Management
- ? **View all users**
- ? **Create users** (any role)
- ? **Delete users**
- ? **Manage roles**

#### System Management
- ? **View dashboard statistics**
- ? **Access reports**
- ? **View audit logs**
- ? **System configuration**
- ? **Hangfire dashboard**

---

### ?? RECRUITER PERMISSIONS

**Job & Application Management** - Can manage recruitment activities

#### Jobs Management
- ? **View all published jobs**
- ? **View own created jobs** (all statuses)
- ? **Create jobs** (requires admin approval)
- ? **Edit own jobs** (before approval)
- ? **Cannot delete jobs**
- ? **Cannot approve jobs** (admin only)
- ? **View pending approval status**

#### Applications Management
- ? **View applications** for jobs they manage
- ? **Update application status**
- ? **Download applicant resumes**
- ? **Add application notes** (internal & public)
- ? **View application statistics**
- ? **Email applicants**

#### Interviews Management
- ? **Schedule interviews** (for applications on their jobs)
- ? **Reschedule interviews**
- ? **Cancel interviews**
- ? **Complete interviews**
- ? **View interview history**

#### Dashboard Access
- ? **View dashboard statistics**
- ? **View job performance metrics**
- ? **View application funnel**
- ? **Generate reports**

#### Limitations
- ? **Cannot create Admin accounts**
- ? **Cannot delete jobs**
- ? **Cannot approve own jobs**
- ? **Cannot view all system users**
- ? **Cannot access audit logs**
- ? **Cannot access system configuration**

---

### ?? APPLICANT PERMISSIONS

**Job Application** - Can search and apply for jobs

#### Jobs Browsing
- ? **View published jobs only**
- ? **Advanced job search**
- ? **Filter jobs** (location, department, salary, etc.)
- ? **View job details**
- ? **Cannot see unpublished jobs**
- ? **Cannot see pending approval jobs**

#### Applications Management
- ? **Apply for jobs**
- ? **View own applications** only
- ? **Track application status**
- ? **Upload resume/CV**
- ? **Upload cover letter**
- ? **View public application notes**
- ? **Cannot edit submitted applications**
- ? **Cannot withdraw applications**
- ? **Cannot see other applicants**

#### Interview Participation
- ? **View own interviews**
- ? **Receive interview notifications**
- ? **View interview details** (date, time, location)
- ? **Cannot schedule own interviews**
- ? **Cannot reschedule interviews** (must contact recruiter)

#### Profile Management
- ? **Create candidate profile**
- ? **Edit own profile**
- ? **Add skills, education, experience**
- ? **Upload certifications**
- ? **Update contact information**

#### Limitations
- ? **Cannot create jobs**
- ? **Cannot view applications dashboard**
- ? **Cannot see internal notes**
- ? **Cannot view statistics**
- ? **Cannot access admin features**
- ? **Cannot manage other users**

---

## ?? API ENDPOINT AUTHORIZATION

### Jobs Controller (`/api/jobs`)

| Endpoint | Method | Admin | Recruiter | Applicant | Anonymous |
|----------|--------|-------|-----------|-----------|-----------|
| `/jobs` GET | Get Jobs | ? All | ? All | ? Published Only | ? Published Only |
| `/jobs/{id}` GET | Get Job Details | ? | ? | ? Published | ? Published |
| `/jobs` POST | Create Job | ? Auto-approved | ? Needs approval | ? | ? |
| `/jobs/{id}` PUT | Update Job | ? Any job | ? Own jobs | ? | ? |
| `/jobs/{id}` DELETE | Delete Job | ? | ? | ? | ? |
| `/jobs/{id}/approve` PUT | Approve Job | ? | ? | ? | ? |
| `/jobs/pending-approval` GET | Pending Jobs | ? | ? | ? | ? |
| `/jobs/search/advanced` POST | Advanced Search | ? | ? | ? | ? |
| `/jobs/locations` GET | Get Locations | ? | ? | ? | ? |
| `/jobs/departments` GET | Get Departments | ? | ? | ? | ? |

---

### Applications Controller (`/api/applications`)

| Endpoint | Method | Admin | Recruiter | Applicant | Anonymous |
|----------|--------|-------|-----------|-----------|-----------|
| `/applications` GET | Get All Apps | ? | ? Own jobs | ? | ? |
| `/applications/my` GET | My Applications | ? | ? | ? Own only | ? |
| `/applications/{id}` GET | Get App Details | ? | ? If owns job | ? If owns app | ? |
| `/applications` POST | Apply for Job | ? | ? | ? | ? |
| `/applications/{id}/status` PUT | Update Status | ? | ? If owns job | ? | ? |
| `/applications/{id}/resume` GET | Download Resume | ? | ? If owns job | ? | ? |
| `/applications/stats` GET | Get Statistics | ? | ? | ? | ? |
| `/applications/stats/{jobId}` GET | Job Stats | ? | ? If owns job | ? | ? |

---

### Interviews Controller (`/api/interviews`)

| Endpoint | Method | Admin | Recruiter | Applicant | Anonymous |
|----------|--------|-------|-----------|-----------|-----------|
| `/interviews` GET | Get All Interviews | ? | ? Own jobs | ? | ? |
| `/interviews/my` GET | My Interviews | ? | ? | ? Own only | ? |
| `/interviews/{id}` GET | Get Interview | ? | ? If owns job | ? If participant | ? |
| `/interviews` POST | Schedule Interview | ? | ? If owns job | ? | ? |
| `/interviews/{id}` PUT | Update Interview | ? | ? If owns job | ? | ? |
| `/interviews/{id}` DELETE | Cancel Interview | ? | ? If owns job | ? | ? |
| `/interviews/{id}/complete` PUT | Complete Interview | ? | ? If owns job | ? | ? |

---

### Dashboard Controller (`/api/dashboard`)

| Endpoint | Method | Admin | Recruiter | Applicant | Anonymous |
|----------|--------|-------|-----------|-----------|-----------|
| `/dashboard/stats` GET | Dashboard Stats | ? | ? | ? | ? |
| `/dashboard/jobs` GET | Job Statistics | ? | ? | ? | ? |

---

### Auth Controller (`/api/auth`)

| Endpoint | Method | Admin | Recruiter | Applicant | Anonymous |
|----------|--------|-------|-----------|-----------|-----------|
| `/auth/login` POST | Login | ? | ? | ? | ? |
| `/auth/register` POST | Register | ? | ? | ? | ? |

---

## ?? FEATURE ACCESS MATRIX

### Frontend Pages

| Page/Feature | Admin | Recruiter | Applicant |
|--------------|-------|-----------|-----------|
| **Dashboard** | ? Full stats | ? Job stats | ? Redirect to Jobs |
| **Jobs List** | ? All jobs + "Post Job" | ? All jobs + "Post Job" | ? Published jobs only |
| **Job Details** | ? All + Edit/Delete | ? View + Edit own | ? View + "Apply" button |
| **Create Job** | ? Auto-approved | ? Needs approval | ? Hidden |
| **Edit Job** | ? Any job | ? Own jobs | ? Hidden |
| **Applications List** | ? All applications | ? Own job applications | ? Redirect to My Applications |
| **My Applications** | ? Can view | ? Can view | ? Own applications |
| **Application Details** | ? Full access | ? If owns job | ? If owns application |
| **Schedule Interview** | ? | ? If owns job | ? Hidden |
| **Interviews List** | ? All interviews | ? Own job interviews | ? Redirect to My Interviews |
| **My Interviews** | ? Can view | ? Can view | ? Own interviews |
| **Candidate Profile** | ? View any | ? View applicants | ? Own profile |
| **Analytics** | ? Full analytics | ? Limited analytics | ? Hidden |
| **Reports** | ? All reports | ? Limited reports | ? Hidden |
| **Audit Logs** | ? | ? | ? |

---

## ?? AUTHORIZATION FLOW

### How Authorization Works

```
1. User logs in
   ??> JWT token generated with user roles

2. Frontend checks user.roles array
   ??> Shows/hides UI elements based on role

3. API request sent with Authorization header
   ??> Bearer {JWT_TOKEN}

4. Backend validates token
   ??> Checks JWT signature
   ??> Verifies expiration
   ??> Extracts roles from claims
   ??> Matches against [Authorize(Roles = "...")]

5. Authorization result
   ??> ? Authorized: Process request
   ??> ? Unauthorized: Return 401/403
```

---

## ?? SECURITY FEATURES

### JWT Token Security
- ? **Token expiration**: 24 hours (1440 minutes)
- ? **Secure signing**: HMAC SHA256
- ? **Secret key**: 64+ character key
- ? **Issuer validation**: ATSRecruitSys
- ? **Audience validation**: ATSRecruitSysUsers
- ? **HTTPS only** in production

### Role-Based Access Control (RBAC)
- ? **Role claims** in JWT token
- ? **Controller-level authorization**: `[Authorize(Roles = "...")]`
- ? **Method-level authorization**: Per endpoint
- ? **Frontend route guards**: `ProtectedRoute` component
- ? **Conditional UI rendering**: Based on user.roles

### Additional Security
- ? **Rate limiting**: Protects against abuse
- ? **Input validation**: All DTOs validated
- ? **SQL injection protection**: EF Core parameterization
- ? **CORS configuration**: Restricted origins
- ? **Password requirements**: Strong passwords enforced

---

## ?? TESTING AUTHORIZATION

### Test Accounts (Pre-seeded)

```
Admin Account:
  Email:    admin@atsrecruit.com
  Password: Admin@123
  
Recruiter Account:
  Email:    thabo.nkosi@atsrecruit.com
  Password: Recruit@123
  
Applicant Account:
  Email:    sipho.ndlovu@example.com
  Password: Applicant@123
```

### How to Test

1. **Login as each role**
2. **Check visible pages/features**
3. **Try unauthorized actions** (should fail gracefully)
4. **Verify API responses** (401/403 for unauthorized)
5. **Check browser console** for errors

---

## ?? COMMON AUTHORIZATION ISSUES

### Issue: "Unauthorized" even when logged in
**Cause**: Token expired or invalid
**Solution**: 
- Clear localStorage
- Re-login
- Check token expiration (24 hours)

### Issue: Can see feature but API returns 403
**Cause**: Frontend/Backend role mismatch
**Solution**:
- Check user.roles in frontend
- Verify [Authorize] attribute on backend endpoint
- Ensure JWT contains correct role claims

### Issue: Wrong features showing for role
**Cause**: Frontend not checking roles correctly
**Solution**:
- Use `user?.roles?.includes('RoleName')`
- Not `user?.role === 'RoleName'` (wrong!)

---

## ?? SUMMARY

### Who Can Do What?

| Action | Admin | Recruiter | Applicant |
|--------|-------|-----------|-----------|
| **Create Jobs** | ? Auto-approved | ? Needs approval | ? |
| **Edit Jobs** | ? Any | ? Own | ? |
| **Delete Jobs** | ? | ? | ? |
| **Approve Jobs** | ? | ? | ? |
| **View Applications** | ? All | ? Own jobs | ? Own only |
| **Change App Status** | ? | ? Own jobs | ? |
| **Schedule Interviews** | ? | ? Own jobs | ? |
| **View Dashboard** | ? Full | ? Limited | ? |
| **Generate Reports** | ? | ? Limited | ? |
| **View Audit Logs** | ? | ? | ? |
| **Apply for Jobs** | ? | ? | ? |

---

## ?? KEY TAKEAWAYS

1. **3 Roles**: Admin (full control), Recruiter (job management), Applicant (apply for jobs)
2. **Admins** have full system access
3. **Recruiters** can manage jobs and applications but need admin approval for new jobs
4. **Applicants** can only view published jobs and manage their own applications
5. **Authorization** enforced on both frontend (UI) and backend (API)
6. **JWT tokens** valid for 24 hours
7. **Test accounts** available for each role

---

**Last Updated**: After JWT configuration fix
**Status**: ? All authorization working correctly
