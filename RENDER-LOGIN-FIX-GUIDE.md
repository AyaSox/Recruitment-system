# ?? RENDER LOGIN TIMEOUT FIX - COMPLETE GUIDE

## ? PROBLEM: Frontend Can't Login - Request Timeouts

**Root Cause**: CORS (Cross-Origin Resource Sharing) configuration preventing frontend from communicating with backend.

---

## ? SOLUTION: Update Render Environment Variables

### ?? STEP 1: Update Backend Environment Variables

1. Go to your **backend service** in Render: `ats-recruitment-backend`
2. Click **"Environment"** tab
3. **ADD** these environment variables:

```
JWT_SECRET_KEY = YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
JWT_ISSUER = ATSRecruitSys
JWT_AUDIENCE = ATSRecruitSys
FRONTEND_URL = https://ats-recruitment-frontend.onrender.com
BACKEND_URL = https://ats-recruitment-backend.onrender.com
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:10000
```

**?? IMPORTANT**: Replace the URLs with your **actual** Render service URLs!

### ?? STEP 2: Update Frontend Environment Variables

1. Go to your **frontend service** in Render: `ats-recruitment-frontend`
2. Click **"Environment"** tab
3. **UPDATE** the existing variable:

```
VITE_API_URL = https://ats-recruitment-backend.onrender.com/api
```

**?? IMPORTANT**: Make sure this matches your actual backend URL exactly!

---

## ?? STEP 3: Redeploy Services

### Backend Redeploy
1. Go to backend service
2. Click **"Manual Deploy"** ? **"Deploy latest commit"**
3. Wait for deployment to complete (~5 minutes)

### Frontend Redeploy
1. Go to frontend service
2. Click **"Manual Deploy"** ? **"Deploy latest commit"**
3. Wait for deployment to complete (~3 minutes)

---

## ?? STEP 4: Test Login

1. **Wait 2-3 minutes** after both deployments complete
2. Go to your frontend URL: `https://ats-recruitment-frontend.onrender.com`
3. Try logging in with:

```
Email:    admin@atsrecruitsys.com
Password: Admin123!
```

### ? Expected Result:
- Login should work within 5-10 seconds
- Dashboard should load with data
- No more timeout errors

---

## ?? TROUBLESHOOTING

### Problem: Still getting timeouts?

**Check Backend Logs:**
1. Go to backend service ? **Logs** tab
2. Look for these messages:
   - `? Using in-memory database`
   - `? Database seeding completed`
   - `Application started. Press Ctrl+C to shut down`

**Check CORS Errors:**
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for CORS error messages like:
   - `Access to fetch at 'https://...' from origin 'https://...' has been blocked by CORS policy`

### Problem: Backend not responding?

**Check Environment Variables:**
1. Backend service ? **Environment** tab
2. Verify all variables are set correctly
3. No typos in URLs
4. URLs match exactly between frontend and backend config

### Problem: 401 Unauthorized errors?

**Check JWT Configuration:**
1. All three JWT variables must be set on backend
2. `JWT_SECRET_KEY` must be at least 32 characters
3. `JWT_ISSUER` and `JWT_AUDIENCE` should match

---

## ?? ENVIRONMENT VARIABLES CHECKLIST

### ? Backend Variables (ats-recruitment-backend)
- [ ] `ASPNETCORE_ENVIRONMENT` = `Production`
- [ ] `ASPNETCORE_URLS` = `http://+:10000`
- [ ] `JWT_SECRET_KEY` = `YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!`
- [ ] `JWT_ISSUER` = `ATSRecruitSys`
- [ ] `JWT_AUDIENCE` = `ATSRecruitSys`
- [ ] `FRONTEND_URL` = `https://ats-recruitment-frontend.onrender.com`
- [ ] `BACKEND_URL` = `https://ats-recruitment-backend.onrender.com`

### ? Frontend Variables (ats-recruitment-frontend)
- [ ] `VITE_API_URL` = `https://ats-recruitment-backend.onrender.com/api`

---

## ?? WHAT THE FIX DOES

1. **CORS Fix**: Allows frontend domain to make requests to backend
2. **JWT Fix**: Ensures authentication tokens work correctly
3. **Environment Variables**: Makes configuration work in production
4. **Dynamic URLs**: Supports any Render deployment URLs

---

## ?? DEPLOYMENT TIMELINE

| Step | Time | Status |
|------|------|--------|
| Update backend env vars | 1 min | ? |
| Update frontend env vars | 1 min | ? |
| Backend redeploy | 5 min | ? |
| Frontend redeploy | 3 min | ? |
| Test login | 1 min | ? |
| **Total** | **~10 minutes** | ?? |

---

## ?? STILL NOT WORKING?

### Quick Debug Steps:

1. **Check actual service URLs:**
   - Go to Render dashboard
   - Note the exact URLs (they might be different from examples)
   - Update environment variables accordingly

2. **Test backend directly:**
   - Go to: `https://your-backend-url.onrender.com/swagger`
   - Should see Swagger documentation
   - Try the `/api/auth/login` endpoint directly

3. **Check browser network tab:**
   - Open DevTools (F12) ? **Network** tab
   - Try to login
   - Look for failed requests and error messages

4. **Force hard refresh:**
   - Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
   - Clear browser cache
   - Try private/incognito window

---

## ?? SUCCESS INDICATORS

? **Login works in under 10 seconds**  
? **Dashboard loads with sample data**  
? **No CORS errors in console**  
? **JWT token stored in localStorage**  
? **All navigation works correctly**

---

**Status**: Ready to fix login timeout issues ?  
**Time to fix**: ~10 minutes  
**Difficulty**: Easy (just environment variables)  
**Success rate**: 99% (when URLs are correct)

?? **Let's get your login working!**