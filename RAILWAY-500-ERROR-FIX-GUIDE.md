# Railway Backend Troubleshooting Guide

## ?? **Current Issue: 500 Internal Server Error on Login**

Your Vercel frontend is now correctly calling `/api/auth/login`, but the Railway backend is returning a 500 error.

## ?? **Diagnosis Steps**

### **1. Check Railway Logs**

Go to: https://railway.app/dashboard
1. Select: **Recruitment-system** project
2. Click: Your service
3. Go to: **Deployments** tab
4. Click: Latest deployment ? **View Logs**

**Look for:**
- `? Database connection failed`
- `? Migration failed`
- `? Seed data failed`
- `? Error occurred during database seeding`

### **2. Verify Environment Variables**

In Railway, go to **Variables** tab and verify:
- ? `ConnectionStrings__DefaultConnection` - PostgreSQL connection string
- ? `ASPNETCORE_ENVIRONMENT` - Should be "Production"
- ? `JwtSettings__SecretKey` - JWT secret key
- ? `JwtSettings__Issuer` - JWT issuer
- ? `JwtSettings__Audience` - JWT audience
- ? `FRONTEND_URL` - Your Vercel URL

### **3. Check Database**

In Railway:
1. Click on your **PostgreSQL** database
2. Go to **Data** tab
3. Check if tables exist:
   - `AspNetUsers`
   - `AspNetRoles`
   - `Jobs`
   - `JobApplications`

## ?? **Common Fixes**

### **Fix 1: Database Not Initialized**

If tables don't exist or admin user is missing:

**Railway CLI Method:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Link to your project
railway link

# Run migrations manually
railway run dotnet ef database update
```

### **Fix 2: Redeploy Backend**

Sometimes Railway needs a fresh deployment:

1. Go to Railway Dashboard
2. Select your project
3. Click on your service
4. Go to **Settings** tab
5. Scroll down to **Danger Zone**
6. Click **Redeploy** or **Restart**

### **Fix 3: Check Connection String**

Your connection string should look like:
```
Host=postgres-xxxxx.railway.app;Database=railway;Username=postgres;Password=xxxxx;Port=5432;SSL Mode=Require;Trust Server Certificate=true;
```

Make sure:
- ? Host is correct
- ? Port is 5432
- ? SSL Mode=Require
- ? Password is correct

### **Fix 4: Manual Database Seed**

If seeding failed, you can manually create the admin user:

1. Go to Railway PostgreSQL ? **Data** tab
2. Run this SQL:
```sql
-- Check if admin exists
SELECT * FROM "AspNetUsers" WHERE "Email" = 'admin@atsrecruitsys.com';

-- If not found, you need to run the seeder
```

## ?? **Quick Actions**

### **Action 1: Trigger Redeploy**

1. Go to Railway Dashboard
2. Click **Deployments**
3. Click **Redeploy** on latest deployment

### **Action 2: Check Vercel Deployment**

Your Vercel app should auto-deploy the API fixes:
- Go to: https://vercel.com/dashboard
- Check if latest deployment includes the API path fixes

### **Action 3: Clear Vercel Cache**

Sometimes Vercel needs cache clearing:
1. Go to Vercel Dashboard
2. Your project ? **Settings**
3. Scroll to **Build & Development Settings**
4. Click **Clear Cache**
5. Click **Redeploy**

## ?? **Test Commands**

### **Test Backend Directly:**
```bash
# Test health
curl https://recruitment-system-production-7f72.up.railway.app/swagger

# Test login (should return 500 or 200)
curl -X POST https://recruitment-system-production-7f72.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@atsrecruitsys.com","password":"Admin123!"}'
```

### **Test from Vercel:**
```bash
# Open browser console (F12)
fetch('https://recruitment-system-production-7f72.up.railway.app/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@atsrecruitsys.com',
    password: 'Admin123!'
  })
})
.then(r => r.json())
.then(console.log)
.catch(console.error)
```

## ?? **Expected Behavior**

### **Successful Login Response (200):**
```json
{
  "isSuccess": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "userId": "xxx",
    "email": "admin@atsrecruitsys.com",
    "firstName": "System",
    "lastName": "Administrator",
    "roles": ["Admin"]
  }
}
```

### **Failed Login Response (401):**
```json
{
  "isSuccess": false,
  "message": "Invalid email or password"
}
```

### **Server Error (500):**
```json
{
  "isSuccess": false,
  "message": "An error occurred during login."
}
```

## ?? **Most Likely Solution**

Based on the 500 error, the most likely cause is:

1. **Database seeding failed** during Railway deployment
2. **Admin user doesn't exist** in the database
3. **Database connection issue** preventing authentication

**Recommended Action:**
1. Check Railway logs first
2. Verify database has tables and data
3. Redeploy if needed
4. Test login again

## ?? **Next Steps**

1. **Check Railway logs** and share any errors you see
2. **Verify database tables** exist
3. **Try redeploying** the Railway backend
4. **Test login** again after redeploy

Once we see the Railway logs, we can identify the exact issue and fix it immediately!
