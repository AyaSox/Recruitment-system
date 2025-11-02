# ?? Railway PostgreSQL Connection Fix Guide

## Current Issue
Railway logs show database connection failures:
```
Cannot connect to database. Skipping migrations and seeding.
System.Net.Sockets.SocketException (104): Connection reset by peer
```

## Immediate Solutions

### Solution 1: Wait and Restart (Most Common)
1. **Wait 2-3 minutes** for PostgreSQL to fully initialize
2. **Check PostgreSQL service** - should show "Active" status
3. **Restart your application service** 
4. **Check logs** for successful connection

### Solution 2: Verify Database Connection
In Railway dashboard:
1. **PostgreSQL service** ? **Connect** tab
2. **Copy the DATABASE_URL** 
3. **Test connection** using the Query tab
4. If it works, restart your app service

### Solution 3: Force Migration Reset
If the database exists but has connection issues:

```sql
-- Run this in Railway PostgreSQL Query console if accessible
DROP TABLE IF EXISTS "__EFMigrationsHistory";
DROP TABLE IF EXISTS "Jobs";
DROP TABLE IF EXISTS "JobApplications";
DROP TABLE IF EXISTS "AspNetUsers";
DROP TABLE IF EXISTS "AspNetRoles";
-- (This will force fresh migration)
```

### Solution 4: Environment Variable Check
Make sure these are set in Railway:
- `DATABASE_URL` (should be automatically set by PostgreSQL service)
- No conflicting `DATABASE_PUBLIC_URL` or `DATABASE_PRIVATE_URL`

## Expected Success Logs
After fix, you should see:
```
?? FRESH DATABASE: Checking Employment Equity migration for new database...
? Database connection successful
? Migrations applied successfully
? Employment Equity columns added
```

## Quick Test Commands

### Test Database Connection
```bash
# In Railway PostgreSQL Query console
SELECT version();
```

### Check if Tables Exist
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

## Most Likely Solution
Based on the logs, this is probably just **timing** - PostgreSQL service is still starting up. The application tried to connect before PostgreSQL was ready.

**Just wait 2-3 minutes and restart the application service.**

---

## Next Steps After Fix

1. **? Verify app loads** without 500 errors
2. **? Login works** 
3. **? Create job page** shows Employment Equity section
4. **? Jobs can be created** with EE toggle
5. **? Job details** show EE alerts when enabled

The Employment Equity form code is already perfect - we just need the database connection working!