# Render Pre-Deployment Checklist

## ? Step-by-Step Setup

### 1. Create Render Account
- [ ] Go to https://render.com
- [ ] Sign up with GitHub (recommended - allows auto-deployment)
- [ ] Verify email

### 2. Connect GitHub Repository
- [ ] Login to Render dashboard
- [ ] Click **"New +"** button
- [ ] Select **"Web Service"**
- [ ] Click **"Connect a repository"**
- [ ] Authorize Render to access your GitHub
- [ ] Select **AyaSox/Recruitment-system** repository
- [ ] Click **"Connect"**

### 3. Configure Backend Service (First)

**Name the Service:**
- Service Name: `ats-recruitment-backend`
- Region: `oregon` (or closest to you)
- Branch: `main`
- Runtime: `Docker` (Render will auto-detect from Dockerfile)

**Build & Deploy:**
- Leave build command empty (Render uses Dockerfile)
- Plan: **Free**
- Click **"Create Web Service"**

### 4. Wait for Backend Deployment
- [ ] Backend will build (takes 2-5 minutes)
- [ ] Wait for **"Your service is live"** message
- [ ] Copy the backend URL (looks like: `https://ats-recruitment-backend.onrender.com`)

### 5. Create PostgreSQL Database
- [ ] In Render dashboard, click **"New +"**
- [ ] Select **"PostgreSQL"**
- [ ] Configure:
  - Name: `ats-recruitment-db`
  - Database: `atsrecruitsys`
  - User: `postgres`
  - Region: `oregon` (same as backend)
  - Plan: **Free**
- [ ] Click **"Create Database"**

### 6. Wait for Database Creation
- [ ] Database will initialize (takes 1-2 minutes)
- [ ] Copy the **Internal Database URL** (looks like: `postgresql://user:password@localhost/atsrecruitsys`)
- [ ] Save it for later

### 7. Connect Database to Backend
- [ ] Go back to Backend Service
- [ ] Click **"Environment"** tab
- [ ] Click **"Add Environment Variable"**
- [ ] Add:
  - Key: `DATABASE_URL`
  - Value: (paste the database connection string)
- [ ] Click **"Save"**
- [ ] Backend will auto-redeploy (takes 1-2 minutes)

### 8. Update Backend Environment Variables
- [ ] Still in Backend Environment tab
- [ ] Add these variables:

```
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:10000
JwtSettings__SecretKey = YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
JwtSettings__Issuer = ATSRecruitSys
JwtSettings__Audience = ATSRecruitSys
```

- [ ] Click **"Save"**
- [ ] Wait for backend to redeploy

### 9. Deploy Frontend Service
- [ ] Click **"New +"** ? **"Static Site"**
- [ ] Select **AyaSox/Recruitment-system** repository
- [ ] Configure:
  - Name: `ats-recruitment-frontend`
  - Build Command: `cd atsrecruitsys.client && npm install && npm run build`
  - Publish Directory: `atsrecruitsys.client/dist`
  - Region: `oregon`
  - Plan: **Free**
- [ ] Click **"Create Static Site"**

### 10. Wait for Frontend Build
- [ ] Frontend will build (takes 3-5 minutes)
- [ ] Copy the frontend URL (looks like: `https://ats-recruitment-frontend.onrender.com`)

### 11. Update Frontend Environment Variable
- [ ] Go to Frontend service settings
- [ ] Click **"Environment"** tab
- [ ] Add:
  - Key: `VITE_API_URL`
  - Value: `https://ats-recruitment-backend.onrender.com/api` (use your backend URL)
- [ ] Click **"Save"**
- [ ] Frontend will auto-rebuild (takes 2-3 minutes)

---

## ?? Your Service URLs After Deployment

| Service | URL |
|---------|-----|
| **Frontend** | https://ats-recruitment-frontend.onrender.com |
| **Backend** | https://ats-recruitment-backend.onrender.com |
| **API Docs** | https://ats-recruitment-backend.onrender.com/swagger |
| **Database** | Managed by Render (internal only) |

---

## ?? Test Accounts (Seeded Automatically)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@atsrecruitsys.com` | `Admin123!` |
| Recruiter | `recruiter@test.com` | `Test123!` |
| Hiring Manager | `hiringmanager@test.com` | `Test123!` |
| Applicant | `applicant@test.com` | `Test123!` |

---

## ?? Important Notes

### Free Tier Limitations:
- Services spin down after 15 minutes of inactivity
- First request after spin-down takes ~30 seconds
- PostgreSQL data persists (not deleted on spin-down)
- No automatic backups

### Data Reset:
- Currently, data is **persistent** on PostgreSQL
- Each app restart seeds new sample data (in addition to existing data)
- To start fresh, you can manually delete the database and create a new one

### CORS:
- Backend is already configured to accept frontend URLs
- No additional configuration needed

---

## ?? Deployment Order (IMPORTANT!)

**DO NOT SKIP STEPS - DEPLOY IN THIS ORDER:**

1. ? Delete Railway & Vercel deployments
2. ? Commit & push code to GitHub
3. ? Create Render account & connect GitHub
4. ? **Deploy Backend service FIRST**
5. ? **Create PostgreSQL database SECOND**
6. ? **Connect database to backend THIRD**
7. ? **Deploy Frontend service LAST**
8. ? Update frontend VITE_API_URL environment variable

---

## ? Troubleshooting Pre-Deployment

### "Docker build failed"
- Make sure `Dockerfile` exists in root
- Verify `.dockerignore` is configured

### "Database connection error"
- Ensure DATABASE_URL is correct
- Check that database is in same region as backend
- Wait 2-3 minutes after database creation

### "Frontend shows blank page"
- Check VITE_API_URL points to correct backend
- Clear browser cache
- Check Network tab for 404/500 errors

---

## ? Ready to Deploy?

Once you've completed this checklist, **reply "READY"** and I'll:

1. Make final code commits
2. Push to GitHub
3. Provide deployment monitoring tips
4. Test the live system

**Let me know once you've completed the Render setup!** ??
