# ?? URGENT: Employment Equity Database Migration Fix

## Problem
Railway deployment succeeded but the database migration for Employment Equity fields didn't apply. Getting error:
```
42703: column j0.EmploymentEquityNotes does not exist
```

## Solution: Manual Database Migration

### Option 1: Railway CLI Migration (Recommended)

1. **Install Railway CLI** (if not already installed):
```bash
npm install -g @railway/cli
```

2. **Login to Railway**:
```bash
railway login
```

3. **Connect to your project**:
```bash
railway link
```

4. **Run the migration**:
```bash
railway run dotnet ef database update --project ATSRecruitSys.Server
```

### Option 2: Direct SQL Commands

If Railway CLI doesn't work, run these SQL commands directly in Railway's PostgreSQL database:

```sql
-- Add Employment Equity columns to Jobs table
ALTER TABLE "Jobs" 
ADD COLUMN "IsEmploymentEquityPosition" boolean NOT NULL DEFAULT false;

ALTER TABLE "Jobs" 
ADD COLUMN "EmploymentEquityNotes" text;

-- Insert migration record (to mark migration as applied)
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") 
VALUES ('20251013060811_AddEmploymentEquityFields', '8.0.11');
```

### Option 3: Railway Database Console

1. Go to Railway Dashboard
2. Open your project
3. Click on PostgreSQL service
4. Go to "Connect" tab
5. Click "Query" to open database console
6. Run the SQL commands from Option 2

---

## Step-by-Step Railway Console Fix

### 1. Access Railway Database Console
```
1. Go to https://railway.app/dashboard
2. Select your ATS project
3. Click on "PostgreSQL" service  
4. Click "Connect" tab
5. Click "Query" button
```

### 2. Run SQL Commands
Copy and paste these commands one by one:

```sql
-- Check if columns exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'Jobs' 
AND column_name IN ('IsEmploymentEquityPosition', 'EmploymentEquityNotes');
```

If columns don't exist, run:
```sql
-- Add the missing columns
ALTER TABLE "Jobs" 
ADD COLUMN "IsEmploymentEquityPosition" boolean NOT NULL DEFAULT false;

ALTER TABLE "Jobs" 
ADD COLUMN "EmploymentEquityNotes" text;
```

Then mark the migration as applied:
```sql
-- Mark migration as complete
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") 
VALUES ('20251013060811_AddEmploymentEquityFields', '8.0.11');
```

### 3. Verify Fix
```sql
-- Verify columns were added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'Jobs' 
AND column_name IN ('IsEmploymentEquityPosition', 'EmploymentEquityNotes');
```

Should return:
```
column_name                   | data_type | is_nullable | column_default
IsEmploymentEquityPosition    | boolean   | NO          | false
EmploymentEquityNotes         | text      | YES         | NULL
```

---

## Alternative: Redeploy with Migration Fix

If the above doesn't work, we can force a migration on the next deployment:

### 1. Update Program.cs (Temporary Fix)
Add this to ensure migrations run on startup:

```csharp
// In Program.cs, before app.Run()
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    context.Database.Migrate(); // Force migration on startup
}
```

### 2. Commit and Push
```bash
git add .
git commit -m "fix: force database migration on startup"
git push origin main
```

---

## Expected Results After Fix

Once the migration is applied, you should see:

? **Employment Equity section** in job creation form  
? **No more PostgreSQL errors** in Railway logs  
? **Jobs can be created** with EE designation  
? **EE alerts display** on job details pages

---

## Test After Fix

1. **Create Job**: Go to create job page
2. **Check EE Section**: Should see "Employment Equity (Optional)" section
3. **Toggle EE**: Turn on EE designation and add notes
4. **Save Job**: Should save without errors
5. **View Job**: Should show blue EE alert with notes

---

## Prevention for Future

To prevent this issue in future deployments:

1. **Always test migrations locally first**
2. **Use Railway CLI for complex migrations** 
3. **Check Railway logs** for migration success/failure
4. **Add migration verification** to deployment process

---

## Need Help?

If you're stuck:
1. Share Railway logs from the deployment
2. Try Option 2 (Direct SQL) - it's the most reliable
3. Check Railway database console for existing tables and columns

**Status**: ?? **Needs Manual Fix** - Choose Option 1, 2, or 3 above