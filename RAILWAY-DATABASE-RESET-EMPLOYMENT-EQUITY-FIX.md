# ?? RAILWAY DATABASE RESET - Employment Equity Fix

## Problem
The Employment Equity migration is failing on Railway PostgreSQL, causing 500 errors:
```
42703: column j.EmploymentEquityNotes does not exist
```

## Solution: Reset Railway Database

### Step 1: Reset Database on Railway
1. Go to **Railway Dashboard**: https://railway.app/dashboard
2. Select your **ATS project**
3. Click on **PostgreSQL service**
4. Go to **Settings** tab
5. Scroll down to **Danger Zone**
6. Click **"Delete Service"** ?? **This will delete all data**
7. Confirm deletion

### Step 2: Create New PostgreSQL Service
1. In your Railway project dashboard
2. Click **"+ New"**
3. Select **"Database"**
4. Choose **"PostgreSQL"**
5. Wait for deployment to complete

### Step 3: Redeploy Application
Railway will automatically redeploy your application with the new database.

The fresh database will:
? **Run all migrations** from scratch  
? **Include Employment Equity columns**  
? **Seed default users** (admin@example.com/Admin123!)  
? **Work with all features**  

---

## Alternative: Manual Database Fix (If you want to keep existing data)

If you have important data to preserve, run these SQL commands in Railway's database console:

### 1. Access Railway Database Console
```
Railway Dashboard ? PostgreSQL ? Connect ? Query
```

### 2. Run Migration SQL
```sql
-- Add Employment Equity columns
ALTER TABLE "Jobs" 
ADD COLUMN "IsEmploymentEquityPosition" boolean NOT NULL DEFAULT false;

ALTER TABLE "Jobs" 
ADD COLUMN "EmploymentEquityNotes" text;

-- Mark migration as applied
INSERT INTO "__EFMigrationsHistory" ("MigrationId", "ProductVersion") 
VALUES ('20251013060811_AddEmploymentEquityFields', '8.0.11')
ON CONFLICT ("MigrationId") DO NOTHING;
```

### 3. Restart Railway Service
Go to Railway Dashboard ? Your App Service ? Settings ? Restart

---

## Recommendation

**I recommend Option 1 (Database Reset)** because:
- ? **Clean slate** - no migration conflicts
- ? **Faster** - no manual SQL commands
- ? **Guaranteed to work** - fresh migrations
- ? **Test data** - DatabaseSeeder will create sample jobs/applications

Since this appears to be a development/testing environment, resetting is the quickest path to success.

## What You'll Get After Reset

1. **Clean database** with all tables and columns
2. **Employment Equity fields** working properly
3. **Sample data** for testing
4. **All features working** without errors

## Test After Reset

1. Wait for Railway deployment to complete
2. Go to your app URL
3. Login with: `admin@example.com` / `Admin123!`
4. Create a job ? Should see Employment Equity section
5. Toggle EE on ? Should save successfully
6. View job ? Should show EE alert

---

**Choose your approach:**
- ?? **Reset Database** (recommended, fast, clean slate)
- ??? **Manual Fix** (if you need to preserve data)

Let me know which option you prefer!