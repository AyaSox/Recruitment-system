# Deploy ATS Recruitment System to Render

## Overview
- **Backend**: .NET 8 API (Render Web Service)
- **Frontend**: React/Vite (Render Static Site)
- **Database**: PostgreSQL (Render Managed Database)
- **Data Model**: Seeds on startup + resets on service spin-down
- **Demo Ready**: Full seeded data + test user accounts

---

## Prerequisites

1. **GitHub Account** - Already have it ?
2. **Render Account** - Sign up at https://render.com
3. **Git Configured** - For pushing code

---

## Step 1: Prepare Backend for Render

### 1.1 Update `Program.cs` for Render PostgreSQL

The current `Program.cs` already handles Railway/container PostgreSQL well. For Render, ensure it picks up:

```csharp
// Render provides DATABASE_URL in this format:
// postgresql://user:password@host:port/dbname
```

Your current connection string resolution should work fine, but verify Render's environment variable format.

### 1.2 Create `render.yaml` Configuration File

```yaml
services:
  - type: web
    name: ats-recruitment-backend
    env: dotnet
    buildCommand: cd ATSRecruitSys.Server && dotnet publish -c Release -o out
    startCommand: cd ATSRecruitSys.Server/out && ./ATSRecruitSys.Server
    envVars:
      - key: ASPNETCORE_ENVIRONMENT
        value: Production
      - key: ASPNETCORE_URLS
        value: http://+:10000
      - key: ConnectionStrings__DefaultConnection
        fromDatabase:
          name: ats-db
          property: connectionString

  - type: web
    name: ats-recruitment-frontend
    buildCommand: cd atsrecruitsys.client && npm install && npm run build
    startCommand: npm run preview -- --host 0.0.0.0
    staticPublishPath: atsrecruitsys.client/dist
    envVars:
      - key: VITE_API_URL
        value: https://ats-recruitment-backend.onrender.com/api

  - type: pgsql
    name: ats-db
    plan: free
    region: oregon
```

### 1.3 Update Frontend `.env.production`

```env
VITE_API_URL=https://ats-recruitment-backend.onrender.com/api
```

---

## Step 2: Update CORS Configuration

Edit `ATSRecruitSys.Server/Program.cs` to allow Render frontend:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Render deployment URLs
            policy.WithOrigins(
                "https://ats-recruitment-frontend.onrender.com",
                "https://ats-recruitment-backend.onrender.com"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
        }
    });
});
```

---

## Step 3: Ensure Robust Database Seeding

Your `Program.cs` already has excellent seeding logic. Verify it includes:

? **Default Admin User**
- Email: `admin@atsrecruitsys.com`
- Password: `Admin123!`

? **Test Users**
- Recruiter: `recruiter@test.com` / `Test123!`
- HiringManager: `hiringmanager@test.com` / `Test123!`
- Applicant: `applicant@test.com` / `Test123!`

? **Sample Data**
- 7 Job Postings across departments
- Multiple applications in different statuses
- Full employment equity data

---

## Step 4: Deployment Steps

### 4.1 Push Code to GitHub

```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

### 4.2 Create Render Services

#### Backend Service:

1. Go to https://dashboard.render.com
2. Click **"New +"** ? **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name**: `ats-recruitment-backend`
   - **Runtime**: `Docker` (or .NET if available)
   - **Build Command**: `cd ATSRecruitSys.Server && dotnet publish -c Release -o out`
   - **Start Command**: `cd ATSRecruitSys.Server/out && ./ATSRecruitSys.Server`
   - **Plan**: Free
   - **Region**: Choose closest to you

5. Add Environment Variables:
   - `ASPNETCORE_ENVIRONMENT`: `Production`
   - `ASPNETCORE_URLS`: `http://+:10000`

#### Database Service:

1. Click **"New +"** ? **"PostgreSQL"**
2. Configure:
   - **Name**: `ats-recruitment-db`
   - **Plan**: Free
   - **Region**: Same as backend
3. Render will provide `DATABASE_URL` automatically

#### Frontend Service:

1. Click **"New +"** ? **"Static Site"**
2. Connect GitHub repository
3. Configure:
   - **Name**: `ats-recruitment-frontend`
   - **Build Command**: `cd atsrecruitsys.client && npm install && npm run build`
   - **Publish Directory**: `atsrecruitsys.client/dist`
   - **Plan**: Free

4. Add Environment Variables:
   - `VITE_API_URL`: (get backend URL after it deploys)

### 4.3 Link Database to Backend

1. Go to Backend Service settings
2. **Environment** tab
3. Add Environment Variables:
   - Copy `DATABASE_URL` from PostgreSQL service
   - Paste as `DATABASE_URL` in backend

---

## Step 5: Test Demo Access

### Test Accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@atsrecruitsys.com` | `Admin123!` |
| Recruiter | `recruiter@test.com` | `Test123!` |
| Hiring Manager | `hiringmanager@test.com` | `Test123!` |
| Applicant | `applicant@test.com` | `Test123!` |

### Demo Flow:

1. **Login as Admin** ? See dashboard + all features
2. **Create/Edit Jobs** ? Test job management
3. **View Reports** ? Check analytics
4. **Manage Applications** ? Test workflow
5. **Login as HiringManager** ? Verify role access ?

---

## Step 6: Handle Service Spin-Down

Since Render's free tier spins down after inactivity:

### What Happens:
- Service goes to sleep after 15 min inactivity
- First request wakes it up (takes ~30 sec)
- Database also spins down
- **Data is NOT deleted** (PostgreSQL persists on managed DB)

### If You Want True Reset:

To delete data on spin-down, add to `Program.cs`:

```csharp
// Optional: Delete old data on startup (demonstration only)
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    
    // Fresh database on every startup
    await context.Database.EnsureDeletedAsync();
    await context.Database.EnsureCreatedAsync();
    
    // Reseed everything
    var seeder = new DatabaseSeeder(...);
    await seeder.SeedDatabaseAsync();
}
```

**Note**: This resets data every time service starts. For demo, you might want data persistence instead.

---

## Step 7: Custom Domain (Optional)

1. In Render dashboard, go to your services
2. **Settings** ? **Custom Domain**
3. Add your domain + update DNS records

Example:
- Frontend: `ats.yourdomain.com`
- Backend: `api.ats.yourdomain.com`

---

## Step 8: Monitoring & Logs

### View Logs:
1. Service dashboard ? **Logs** tab
2. Filter by date/time
3. Check for seeding success messages

### Common Issues:

| Issue | Solution |
|-------|----------|
| 502 Bad Gateway | Database not connected - check `DATABASE_URL` |
| 401 Unauthorized | JWT secret not set - verify in backend |
| CORS errors | Update CORS policy with frontend URL |
| Slow startup | First request wakes service - normal |

---

## Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] `render.yaml` created
- [ ] Backend environment variables set
- [ ] Database service created
- [ ] Frontend environment variables set
- [ ] CORS policy updated
- [ ] Database seeding verified
- [ ] Test accounts working
- [ ] Demo users can login
- [ ] All features tested

---

## Quick URLs After Deployment

```
Backend: https://ats-recruitment-backend.onrender.com
Frontend: https://ats-recruitment-frontend.onrender.com
API Docs: https://ats-recruitment-backend.onrender.com/swagger
```

---

## Troubleshooting

### Backend won't start?
```bash
# Check logs in Render dashboard
# Verify DATABASE_URL format
# Ensure ASPNETCORE_URLS is http://+:10000
```

### Frontend blank page?
```bash
# Check VITE_API_URL in environment variables
# Verify backend URL in Network tab
# Clear browser cache
```

### Data not persisting?
```bash
# Render PostgreSQL keeps data between spin-downs
# Only deletes if you explicitly run delete command
```

---

## Next Steps

1. ? Update code locally
2. ? Push to GitHub
3. ? Create Render account
4. ? Deploy services
5. ? Test demo
6. ? Share links with stakeholders

**Your demo will be live and accessible to anyone!** ??
