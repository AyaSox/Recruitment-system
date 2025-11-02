# ?? RENDER DEPLOYMENT - COMPLETE STEP-BY-STEP GUIDE

## ?? Overview

You're deploying a full-stack ATS system to Render's FREE tier:
- **Backend**: .NET 8 API (Docker)
- **Frontend**: React/Vite (Static Site)
- **Database**: In-memory (no external DB needed)
- **Cost**: $0/month
- **Data**: Resets on app restart (perfect for demo)

---

## ? PRE-DEPLOYMENT CHECKLIST

Before starting, ensure:
- [ ] GitHub repository updated (code pushed)
- [ ] Render account created at https://render.com
- [ ] GitHub connected to Render (authorized)
- [ ] You have the test account credentials ready

---

## ?? STEP 1: Create Render Account

### 1.1 Go to Render
- Visit: https://render.com
- Click **"Sign Up"**

### 1.2 Choose GitHub Sign-Up
- Click **"Continue with GitHub"**
- Authorize Render to access your repositories
- This will auto-create your account

### 1.3 Verify Email
- Check your email inbox
- Click verification link
- Done! ?

---

## ?? STEP 2: Connect GitHub Repository

### 2.1 Go to Dashboard
- After login, you'll see: https://dashboard.render.com

### 2.2 Connect Repository
1. Click **"New +"** (top right)
2. Select **"Web Service"**
3. Click **"Connect a repository"** button
4. Search for: `AyaSox/Recruitment-system`
5. Click **"Connect"**

### 2.3 Authorize GitHub Access
- Render will ask for GitHub permission
- Click **"Authorize"**
- Select your account if prompted

---

## ??? STEP 3: Deploy Backend Service (Docker)

### 3.1 Create Backend Service

**Service Settings:**

| Setting | Value |
|---------|-------|
| **Name** | `ats-recruitment-backend` |
| **Repository** | `AyaSox/Recruitment-system` |
| **Branch** | `main` |
| **Runtime** | `Docker` |
| **Region** | `oregon` (or closest to you) |
| **Plan** | `Free` |

### 3.2 Configure Build

- **Build Command**: Leave empty (Render auto-detects Dockerfile)
- **Start Command**: Leave empty (uses Dockerfile CMD)

### 3.3 Add Environment Variables

Click **"Advanced"** then **"Add Environment Variable"**

Add these variables:

```
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:10000
JwtSettings__SecretKey = YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
JwtSettings__Issuer = ATSRecruitSys
JwtSettings__Audience = ATSRecruitSys
```

**Why these variables?**
- `ASPNETCORE_ENVIRONMENT=Production` ? Uses production settings
- `ASPNETCORE_URLS=http://+:10000` ? Backend listens on port 10000
- `JwtSettings__*` ? JWT authentication configuration
- All use in-memory database (no external DB needed)

### 3.4 Create Service

- Click **"Create Web Service"**
- ? Wait 3-5 minutes for build
- ? When complete, you'll see **"Your service is live"**

### 3.5 Copy Backend URL

- Look for blue link like: `https://ats-recruitment-backend.onrender.com`
- **Copy this URL** - you'll need it for frontend config

**Example:**
```
https://ats-recruitment-backend.onrender.com
```

---

## ?? STEP 4: Deploy Frontend Service (Static Site)

### 4.1 Create Frontend Service

1. Click **"New +"**
2. Select **"Static Site"**
3. Choose your repository: `AyaSox/Recruitment-system`

**Service Settings:**

| Setting | Value |
|---------|-------|
| **Name** | `ats-recruitment-frontend` |
| **Build Command** | `cd atsrecruitsys.client && npm install && npm run build` |
| **Publish Directory** | `atsrecruitsys.client/dist` |
| **Region** | `oregon` (same as backend) |
| **Plan** | `Free` |

### 4.2 Add Environment Variable

Click **"Advanced"** ? **"Add Environment Variable"**

Add:
```
VITE_API_URL = https://ats-recruitment-backend.onrender.com/api
```

**Replace** `ats-recruitment-backend` with your actual backend service name if different!

### 4.3 Create Static Site

- Click **"Create Static Site"**
- ? Wait 3-5 minutes for build and deployment
- ? You'll see **"Your site is live"**

### 4.4 Copy Frontend URL

- Look for blue link like: `https://ats-recruitment-frontend.onrender.com`
- **This is your app URL!**

---

## ?? STEP 5: Test Your Deployment

### 5.1 Access the App

1. Go to: `https://ats-recruitment-frontend.onrender.com`
2. You should see the **ATS Login Page** ?

### 5.2 Login with Test Account

```
Email:    admin@atsrecruitsys.com
Password: Admin123!
```

### 5.3 Verify Features

- [ ] Dashboard loads
- [ ] Can view jobs
- [ ] Can create/edit jobs
- [ ] Can view applications
- [ ] Can access reports

### 5.4 Test Other Accounts

**Recruiter:**
```
Email:    recruiter@test.com
Password: Test123!
```

**HiringManager:**
```
Email:    hiringmanager@test.com
Password: Test123!
```

---

## ?? STEP 6: Verify Everything is Working

### 6.1 Check Backend Logs

1. Go to: https://dashboard.render.com
2. Click **"ats-recruitment-backend"** service
3. Click **"Logs"** tab
4. You should see:
   ```
   ? Using in-memory database
   ? Database seeding completed
   ?? Demo data loaded and ready to use
   ```

### 6.2 Test API Directly

Open in browser:
```
https://ats-recruitment-backend.onrender.com/swagger
```

You should see the **Swagger API documentation** ?

### 6.3 Login Flow

1. Go to frontend: `https://ats-recruitment-frontend.onrender.com`
2. Login with admin account
3. Verify JWT token in browser console:
   - Open DevTools (`F12`)
   - Go to **Console** tab
   - Type: `localStorage.getItem('authToken')`
   - You should see a long token string ?

---

## ?? TROUBLESHOOTING

### Problem: 502 Bad Gateway

**Cause**: Backend is still building or crashed

**Solution:**
1. Go to backend service ? Logs
2. Wait if still building
3. Check for errors in logs
4. Verify environment variables are set

### Problem: CORS Error (Frontend can't reach backend)

**Cause**: VITE_API_URL is incorrect or backend not running

**Solution:**
1. Check VITE_API_URL matches your backend URL
2. Update if needed:
   - Go to frontend service ? Environment
   - Edit `VITE_API_URL`
   - Trigger redeploy (make a commit and push)

### Problem: 404 Not Found on Routes

**Cause**: Static site routing misconfiguration

**Solution:**
1. Create `public/_redirects` file locally:
   ```
   /* /index.html 200
   ```
2. Commit and push
3. Frontend will redeploy automatically

### Problem: Login not working (401 Unauthorized)

**Cause**: JWT secret mismatch

**Solution:**
1. Backend environment variables must match exactly
2. Check `JwtSettings__SecretKey` is set
3. Verify `JwtSettings__Issuer` = `ATSRecruitSys`
4. Verify `JwtSettings__Audience` = `ATSRecruitSys`

### Problem: Data disappears after page refresh

**Expected Behavior** ?
- Data is in-memory database
- Resets when service restarts
- Perfect for demo purposes
- **This is normal!**

---

## ?? STEP 7: Auto-Deployment Setup (Optional)

### 7.1 Enable Auto-Deploy on Push

1. Go to backend service ? Settings
2. Look for **"Deploy on Push"** section
3. Should already be enabled (auto-connected from GitHub)
4. Any push to `main` branch triggers automatic redeploy

### 7.2 Verify Auto-Deploy

1. Make a small change locally
2. Commit and push to GitHub
3. Go to Render dashboard
4. You should see a new deployment starting automatically ?

---

## ?? FINAL URLS & CREDENTIALS

### Production URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://ats-recruitment-frontend.onrender.com |
| **Backend** | https://ats-recruitment-backend.onrender.com |
| **API Docs** | https://ats-recruitment-backend.onrender.com/swagger |

### Test Accounts

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@atsrecruitsys.com` | `Admin123!` |
| **Recruiter** | `recruiter@test.com` | `Test123!` |
| **HiringManager** | `hiringmanager@test.com` | `Test123!` |
| **Applicant** | `applicant@test.com` | `Test123!` |

### Sample Data Included

? 7 job postings across departments  
? Multiple applications in different statuses  
? Full employment equity data  
? Department analytics  
? 20+ applicants with profiles  

---

## ?? ENVIRONMENT VARIABLES REFERENCE

### Backend (Render)

```
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:10000
JwtSettings__SecretKey = YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
JwtSettings__Issuer = ATSRecruitSys
JwtSettings__Audience = ATSRecruitSys
```

### Frontend (Render)

```
VITE_API_URL = https://ats-recruitment-backend.onrender.com/api
```

---

## ?? DEPLOYMENT TIMELINE

| Step | Time | Status |
|------|------|--------|
| Backend Docker build | 3-5 min | ? In Progress |
| Frontend build | 3-5 min | ? In Progress |
| Database seeding | 30 sec | ? In Progress |
| **Total** | **~10 minutes** | ? Complete |

---

## ? POST-DEPLOYMENT CHECKLIST

- [ ] Frontend loads at correct URL
- [ ] Can login with admin account
- [ ] Dashboard displays correctly
- [ ] Can view jobs
- [ ] Can create/edit jobs
- [ ] Can view applications
- [ ] Can access reports
- [ ] API docs accessible via Swagger
- [ ] JWT authentication working
- [ ] All test accounts login successfully

---

## ?? NEED HELP?

### Common Issues & Solutions

**Q: How long does deployment take?**  
A: First time = 10-15 minutes. Subsequent deploys = 3-5 minutes.

**Q: Will data persist?**  
A: No, in-memory database resets on app restart. Perfect for demo!

**Q: Can I upgrade to paid tier?**  
A: Yes! Free tier spins down after 15 min inactivity. Paid tier = always running.

**Q: How do I make changes?**  
A: Push to GitHub ? Render auto-deploys ? Live in 5 minutes!

**Q: What's the backend port?**  
A: 10000 (configured via ASPNETCORE_URLS)

**Q: Can I use a custom domain?**  
A: Yes! Go to Service Settings ? Custom Domain

---

## ?? SUPPORT

If deployment fails:

1. **Check backend logs**
   - Service ? Logs tab
   - Look for error messages

2. **Check frontend build log**
   - Service ? Logs tab
   - Look for build errors

3. **Verify environment variables**
   - All variables set correctly?
   - No typos?
   - Special characters escaped?

4. **Test locally first**
   - Run `npm run dev` locally
   - Run backend locally
   - Verify everything works before pushing

---

## ?? SUCCESS!

Your ATS system is now live on Render!

**You can now:**
- ? Share URLs with stakeholders
- ? Demo the system in real-time
- ? Test all features
- ? Get feedback
- ? Scale to production tier when ready

**Next steps:**
- Test all user roles
- Verify all features work
- Get stakeholder feedback
- Plan production deployment

---

**Status**: Ready for Render deployment ?  
**Backend**: Docker-based, in-memory DB, seeded with demo data  
**Frontend**: Static site with Vite  
**Cost**: FREE tier  
**Maintenance**: Auto-redeploy on GitHub push  

?? **Happy deploying!**
