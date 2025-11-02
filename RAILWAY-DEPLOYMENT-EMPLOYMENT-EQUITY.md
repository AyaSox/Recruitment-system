# ?? Railway Deployment - Employment Equity Migration Guide

## ? What Was Pushed to GitHub

**Code Changes Only** (No .md files):
- ? Backend: Employment Equity fields added to Job model
- ? Backend: Database migration created 
- ? Backend: Enhanced error messages for job permissions
- ? Frontend: Employment Equity section in JobForm
- ? Frontend: Auto-publish jobs on creation
- ? Frontend: Better 403 error handling

## ??? Database Migration Required

### Migration Details
**File**: `ATSRecruitSys.Server/Migrations/20251013060811_AddEmploymentEquityFields.cs`

**What it does**:
```sql
-- Adds two new columns to Jobs table
ALTER TABLE Jobs 
ADD IsEmploymentEquityPosition bit NOT NULL DEFAULT 0;

ALTER TABLE Jobs 
ADD EmploymentEquityNotes nvarchar(max) NULL;
```

## ?? Railway Deployment Steps

### Step 1: Automatic Deployment
Railway will automatically deploy the changes from GitHub. **No manual action needed.**

### Step 2: Database Migration
The migration will run automatically when Railway starts the new deployment.

**How it works**:
1. Railway pulls latest code from GitHub ?
2. Railway builds the .NET application
3. Railway starts the application 
4. Entity Framework runs pending migrations automatically
5. New columns are added to PostgreSQL database ?

### Step 3: Verify Deployment
1. Check Railway logs for successful migration
2. Test job creation with Employment Equity fields
3. Verify jobs auto-publish

## ?? What to Expect

### Railway Logs Should Show:
```
info: Microsoft.EntityFrameworkCore.Migrations[20402]
      Applying migration '20251013060811_AddEmploymentEquityFields'.
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (15ms) [Parameters=[], CommandType='Text']
      ALTER TABLE "Jobs" ADD "EmploymentEquityNotes" text;
info: Microsoft.EntityFrameworkCore.Database.Command[20101]
      Executed DbCommand (10ms) [Parameters=[], CommandType='Text']
      ALTER TABLE "Jobs" ADD "IsEmploymentEquityPosition" boolean NOT NULL DEFAULT FALSE;
```

### New Features Available:
- ? **Employment Equity**: Toggle switch in job creation/edit forms
- ? **Auto-Publish**: Jobs are published immediately when created
- ? **Better Errors**: Clear messages when trying to edit others' jobs

## ?? Testing After Deployment

### Test 1: Create Job with Employment Equity
```
1. Login as Admin/Recruiter
2. Go to "Create Job"
3. Fill in job details
4. Scroll to "Employment Equity" section
5. Toggle "This is an Employment Equity Position" ON
6. Add notes: "Preference given to designated groups"
7. Click "Create Job"

Expected: ? Job created and published with EE designation
```

### Test 2: View Job with Employment Equity
```
1. Go to job details page
2. Look for blue info alert at top

Expected: ? Shows "Employment Equity Position" alert with notes
```

### Test 3: Edit Permission Errors
```
1. Login as different recruiter
2. Try to edit another recruiter's job

Expected: ? Clear error message showing who created the job
```

## ?? If Migration Fails

### Railway Logs Show Error
If you see migration errors in Railway logs:

1. **Check PostgreSQL connection**
2. **Restart Railway service**
3. **Manual migration** (if needed):

```bash
# SSH into Railway container (if available)
dotnet ef database update --project ATSRecruitSys.Server
```

### Rollback Plan
If critical issues occur:

1. Revert to previous GitHub commit
2. Railway will auto-deploy the rollback
3. Database changes are backwards compatible

## ?? Database Schema Changes

### Before
```sql
CREATE TABLE Jobs (
    Id INTEGER PRIMARY KEY,
    Title TEXT NOT NULL,
    Description TEXT NOT NULL,
    -- ... other columns
    -- No Employment Equity fields
);
```

### After
```sql
CREATE TABLE Jobs (
    Id INTEGER PRIMARY KEY,
    Title TEXT NOT NULL,
    Description TEXT NOT NULL,
    -- ... other columns
    IsEmploymentEquityPosition BOOLEAN NOT NULL DEFAULT FALSE,
    EmploymentEquityNotes TEXT NULL
);
```

## ? Success Checklist

After Railway deployment completes:

- [ ] Railway build successful (check logs)
- [ ] Database migration applied (check logs)
- [ ] App starts without errors
- [ ] Login works
- [ ] Create job shows EE section
- [ ] Jobs auto-publish when created
- [ ] Permission errors show creator names

## ?? Monitoring

### Railway Dashboard
- ? Check deployment status
- ? Monitor resource usage  
- ? Review application logs

### Database Health
- ? Verify new columns exist
- ? Check existing data intact
- ? Test all CRUD operations

---

## ?? Summary

**What's Deployed**:
- Employment Equity fields for SA compliance
- Auto-publish jobs (better UX)
- Enhanced permission error messages
- Database migration for new columns

**Next Steps**:
1. ? Wait for Railway auto-deployment
2. ? Check logs for successful migration
3. ?? Test new features
4. ?? Enjoy improved job creation flow!

**Status**: ?? **Deployed to GitHub - Railway Auto-Deploying**

---

**Need Help?** Check Railway logs first, then test the features listed above.