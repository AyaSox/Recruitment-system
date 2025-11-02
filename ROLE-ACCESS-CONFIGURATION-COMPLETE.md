# ? Role Access Configuration - Complete Reference

## ?? Summary

Your ATS Recruitment System has **4 distinct roles** with well-defined permissions. Here's the complete breakdown of role access across all controllers and features.

---

## ?? Available Roles

### 1. **Admin** (Full System Access)
- **Test Account**: `admin@atsrecruitsys.com` / `Admin123!`
- **Access Level**: Complete system administration
- **Seeded by**: DatabaseSeeder (always created on first run)

### 2. **Recruiter** (Recruitment Management)
- **Test Account**: `recruiter@test.com` / `Test123!`
- **Access Level**: Job and application management
- **Seeded by**: DatabaseSeeder

### 3. **HiringManager** (Limited Recruitment Management)
- **Test Account**: `hiringmanager@test.com` / `Test123!`
- **Access Level**: Same as Recruiter (job and application management)
- **Seeded by**: DatabaseSeeder

### 4. **Applicant** (External Candidate)
- **Test Account**: `applicant@test.com` / `Test123!`
- **Access Level**: Apply for jobs, view own applications
- **Seeded by**: DatabaseSeeder

---

## ?? Controller-Level Access Matrix

| Controller | Endpoint | Admin | Recruiter | HiringManager | Applicant | Public |
|------------|----------|-------|-----------|---------------|-----------|--------|
| **AuthController** | | | | | | |
| POST /login | ? | ? | ? | ? | ? |
| POST /logout | ? | ? | ? | ? | ? |
| GET /profile | ? | ? | ? | ? | ? |
| PUT /profile | ? | ? | ? | ? | ? |
| POST /change-password | ? | ? | ? | ? | ? |
| GET /users | ? | ? | ? | ? | ? |
| POST /create-user | ? | ? | ? | ? | ? |
| DELETE /users/{id} | ? | ? | ? | ? | ? |
| POST /assign-role | ? | ? | ? | ? | ? |
| POST /remove-role | ? | ? | ? | ? | ? |
| **JobsController** | | | | | | |
| GET /jobs | ? | ? | ? | ? | ? |
| GET /jobs/{id} | ? | ? | ? | ? | ?* |
| POST /jobs | ? | ? | ? | ? | ? |
| PUT /jobs/{id} | ?** | ?*** | ?*** | ? | ? |
| PUT /jobs/{id}/publish | ?** | ?*** | ?*** | ? | ? |
| PUT /jobs/{id}/unpublish | ?** | ?*** | ?*** | ? | ? |
| DELETE /jobs/{id} | ?** | ?*** | ?*** | ? | ? |
| **ApplicationsController** | | | | | | |
| GET /applications | ? | ? | ? | ? | ? |
| GET /applications/{id} | ? | ? | ? | ?**** | ? |
| POST /applications/simple | ? | ? | ? | ? | ? |
| POST /applications | ? | ? | ? | ? | ? |
| PUT /applications/{id}/status | ? | ? | ? | ? | ? |
| GET /applications/{id}/resume | ? | ? | ? | ?**** | ? |
| GET /applications/stats/{jobId} | ? | ? | ? | ? | ? |
| GET /applications/stats | ? | ? | ? | ? | ? |
| POST /applications/fix-new-status | ? | ? | ? | ? | ? |
| **DashboardController** | | | | | | |
| GET /dashboard/stats | ? | ? | ? | ? | ? |
| GET /dashboard/top-jobs | ? | ? | ? | ? | ? |
| GET /dashboard/application-distribution | ? | ? | ? | ? | ? |
| GET /dashboard/recent-activity | ? | ? | ? | ? | ? |
| GET /dashboard/department-analytics | ? | ? | ? | ? | ? |
| GET /dashboard/employment-type-stats | ? | ? | ? | ? | ? |
| GET /dashboard/experience-level-stats | ? | ? | ? | ? | ? |
| **AuditController** | | | | | | |
| GET /audit | ? | ? | ? | ? | ? |
| GET /audit/stats | ? | ? | ? | ? | ? |

### Legend:
- ? = Full Access
- ?* = Only published jobs visible
- ?** = Can manage ALL jobs
- ?*** = Can only manage OWN jobs
- ?**** = Can only view OWN applications
- ? = No Access

---

## ?? Detailed Permission Breakdown

### 1. **Admin Role**

#### Full Access To:
```csharp
[Authorize(Roles = "Admin")]
```

**Exclusive Admin Features:**
- ? User Management (Create, Delete, View All Users)
- ? Role Assignment (Assign/Remove roles)
- ? Audit Log Access (View all system audit logs)
- ? Fix Application Status (Administrative data fixes)
- ? Edit/Delete ANY job (regardless of creator)
- ? Publish/Unpublish ANY job

**Shared Access:**
- All Dashboard endpoints
- All Job management (with elevated permissions)
- All Application management (view all, update statuses)

---

### 2. **Recruiter Role**

#### Access To:
```csharp
[Authorize(Roles = "Admin,Recruiter,HiringManager")]
```

**Job Management:**
- ? Create new jobs (auto-published)
- ? Edit **OWN** jobs only
- ? Publish/Unpublish **OWN** jobs only
- ? Delete **OWN** jobs only (if no applications)

**Application Management:**
- ? View all applications
- ? Update application statuses
- ? View application statistics
- ? Download resumes

**Dashboard:**
- ? Full dashboard access (stats, charts, analytics)

**Limitations:**
- ? Cannot edit jobs created by others
- ? Cannot manage users
- ? Cannot view audit logs

---

### 3. **HiringManager Role**

#### Access To:
```csharp
[Authorize(Roles = "Admin,Recruiter,HiringManager")]
```

**Same Permissions as Recruiter:**
- ? All Recruiter permissions apply
- ? Job management (own jobs only)
- ? Application management
- ? Dashboard access

**Implementation Note:**
```csharp
// Jobs Controller - Check authorization
var canEdit = await _jobService.CanUserEditJobAsync(id, userId, IsInRole("Admin"));
if (!canEdit) {
    var jobCreator = await _jobService.GetJobCreatorNameAsync(id);
    return StatusCode(403, new {
        message = IsInRole("Admin") 
            ? "You do not have permission to edit this job." 
            : $"You can only edit jobs that you created. This job was created by {jobCreator}."
    });
}
```

---

### 4. **Applicant Role**

#### Access To:
```csharp
[Authorize(Roles = "Applicant")]
```

**Application Features:**
- ? Submit applications (authenticated)
- ? View **OWN** applications only
- ? Download **OWN** resume

**Job Viewing:**
- ? View published jobs (public access)
- ? View job details (published only)

**Profile Management:**
- ? Update own profile
- ? Change password

**Limitations:**
- ? Cannot create/edit jobs
- ? Cannot view other applications
- ? Cannot access dashboard
- ? Cannot update application statuses

---

## ?? Special Access Patterns

### 1. **Public Access (No Authentication)**

```csharp
[AllowAnonymous]
```

**Available Endpoints:**
- `POST /api/auth/login` - Anyone can attempt login
- `POST /api/applications/simple` - External candidates can apply
- `GET /api/jobs` - Public can view published jobs
- `GET /api/jobs/{id}` - Public can view published job details

**Implementation:**
```csharp
var publicView = !IsInAnyRole("Admin", "Recruiter", "HiringManager");
var jobs = await _jobService.GetJobsAsync(
    page, pageSize, searchTerm, location, department, 
    employmentType, experienceLevel, publicView);
```

---

### 2. **Job Ownership Validation**

```csharp
// JobService.cs
public async Task<bool> CanUserEditJobAsync(int jobId, string userId, bool isAdmin)
{
    // Admin has full access
    if (isAdmin)
        return true;

    // Others can only edit their own jobs
    var job = await _context.Jobs.FindAsync(jobId);
    if (job == null)
        return false;

    return job.CreatedById == userId;
}
```

**Permission Logic:**
- **Admin**: Can edit ANY job ?
- **Recruiter/HiringManager**: Can only edit jobs where `CreatedById == userId` ?

---

### 3. **Application Ownership Validation**

```csharp
// ApplicationsController.cs - GetApplication
var isRecruiterOrAdminOrHiringManager = IsInAnyRole("Recruiter", "Admin", "HiringManager");
if (!isRecruiterOrAdminOrHiringManager && application.ApplicantId != userId)
    return Forbid();
```

**Permission Logic:**
- **Admin/Recruiter/HiringManager**: Can view ALL applications ?
- **Applicant**: Can only view applications where `ApplicantId == userId` ?

---

## ?? Frontend Role Checks

### AuthContext Helper Functions

```typescript
// atsrecruitsys.client/src/context/AuthContext.tsx
const isAdmin = () => user?.roles?.includes('Admin') ?? false;
const isRecruiter = () => user?.roles?.includes('Recruiter') ?? false;
const isHiringManager = () => user?.roles?.includes('HiringManager') ?? false;
const isApplicant = () => user?.roles?.includes('Applicant') ?? false;
```

### Usage in Components

```typescript
// JobsPage.tsx
const isRecruiterOrAdmin = user?.roles?.includes('Recruiter') || user?.roles?.includes('Admin');

{isRecruiterOrAdmin && (
  <Button variant="contained" onClick={handleCreateJob}>
    Post New Job
  </Button>
)}
```

---

## ?? Test Accounts Reference

| Role | Email | Password | Phone | Purpose |
|------|-------|----------|-------|---------|
| Admin | admin@atsrecruitsys.com | Admin123! | N/A | Full system access |
| Recruiter | recruiter@test.com | Test123! | +27 11 123 4567 | Job management |
| HiringManager | hiringmanager@test.com | Test123! | +27 21 987 6543 | Job management |
| Applicant | applicant@test.com | Test123! | +27 82 456 7890 | Apply for jobs |

---

## ?? Configuration Files

### 1. **DatabaseSeeder.cs**
```csharp
private async Task SeedRolesAsync()
{
    var roles = new[] { "Admin", "Recruiter", "HiringManager", "Applicant" };
    
    foreach (var role in roles)
    {
        if (!await _roleManager.RoleExistsAsync(role))
        {
            await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }
}
```

### 2. **Program.cs (Identity Configuration)**
```csharp
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();
```

---

## ? Role Access Summary

### Admin (System Administrator)
- ? User Management
- ? All Jobs (Create, Edit, Delete, Publish ANY)
- ? All Applications (View, Update Status)
- ? Dashboard & Reports
- ? Audit Logs

### Recruiter (Recruitment Manager)
- ? User Management
- ? Own Jobs (Create, Edit, Delete, Publish OWN)
- ? All Applications (View, Update Status)
- ? Dashboard & Reports
- ? Audit Logs

### HiringManager (Department Manager)
- ? User Management
- ? Own Jobs (Create, Edit, Delete, Publish OWN)
- ? All Applications (View, Update Status)
- ? Dashboard & Reports
- ? Audit Logs

### Applicant (External Candidate)
- ? User Management
- ? Job Management
- ? Apply for Jobs (Authenticated or Anonymous)
- ? View Own Applications
- ? Dashboard & Reports
- ? Audit Logs

---

## ?? Key Differences: Recruiter vs HiringManager

**Currently:**
- Both roles have **identical permissions**
- Both use the same authorization attribute: `[Authorize(Roles = "Admin,Recruiter,HiringManager")]`

**Why separate roles?**
- **Future extensibility**: Allows you to differentiate permissions later
- **Organizational hierarchy**: Reflects real-world job titles
- **Reporting**: Can track activities by role type

**Potential Future Differences:**
- HiringManager could be limited to specific departments
- HiringManager might only update statuses (not create jobs)
- Recruiter might have bulk action capabilities
- Different dashboard views per role

---

## ?? Security Best Practices Implemented

### 1. **Role-Based Authorization**
```csharp
[Authorize(Roles = "Admin,Recruiter,HiringManager")]
```

### 2. **Ownership Validation**
```csharp
var canEdit = await _jobService.CanUserEditJobAsync(id, userId, IsInRole("Admin"));
```

### 3. **JWT Token Authentication**
```csharp
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
```

### 4. **Public View Isolation**
```csharp
var publicView = !IsInAnyRole("Admin", "Recruiter", "HiringManager");
// Public users only see published jobs
```

---

## ?? Testing Role Access

### 1. **Test Admin Access**
```bash
# Login as Admin
POST /api/auth/login
{
  "email": "admin@atsrecruitsys.com",
  "password": "Admin123!"
}

# Should have access to:
GET /api/auth/users ?
GET /api/audit ?
PUT /api/jobs/{id} (any job) ?
```

### 2. **Test Recruiter Access**
```bash
# Login as Recruiter
POST /api/auth/login
{
  "email": "recruiter@test.com",
  "password": "Test123!"
}

# Should have access to:
POST /api/jobs ?
GET /api/dashboard/stats ?

# Should NOT have access to:
GET /api/auth/users ?
GET /api/audit ?
```

### 3. **Test Applicant Access**
```bash
# Login as Applicant
POST /api/auth/login
{
  "email": "applicant@test.com",
  "password": "Test123!"
}

# Should have access to:
GET /api/jobs ?
POST /api/applications ?

# Should NOT have access to:
GET /api/dashboard/stats ?
POST /api/jobs ?
```

---

## ?? Conclusion

Your role access configuration is **well-structured** with clear separation of concerns:

1. ? **Admin**: Full system control (user management, audit logs, all jobs)
2. ? **Recruiter/HiringManager**: Recruitment operations (own jobs, all applications, dashboard)
3. ? **Applicant**: Limited access (apply for jobs, view own applications)
4. ? **Public**: Anonymous job viewing and application submission

The system implements proper **ownership validation** for jobs and applications, ensuring users can only modify their own content (except Admin).

---

**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm")  
**Configuration Status**: ? Complete and Functional

---
