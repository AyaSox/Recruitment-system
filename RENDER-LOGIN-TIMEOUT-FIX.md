# ?? IMMEDIATE ACTION - FIX LOGIN TIMEOUT NOW

## Your Render Services:
- **Frontend**: https://ats-recruitment-frontend.onrender.com
- **Backend**: https://ats-recruitment-backend.onrender.com

## ? QUICK FIX STEPS (5 minutes)

### 1?? Add Backend Environment Variables

Go to: https://dashboard.render.com ? **ats-recruitment-backend** ? **Environment**

**ADD these 7 variables:**

```
ASPNETCORE_ENVIRONMENT = Production
ASPNETCORE_URLS = http://+:10000
JWT_SECRET_KEY = YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
JWT_ISSUER = ATSRecruitSys
JWT_AUDIENCE = ATSRecruitSys
FRONTEND_URL = https://ats-recruitment-frontend.onrender.com
BACKEND_URL = https://ats-recruitment-backend.onrender.com
```

### 2?? Verify Frontend Environment

Go to: **ats-recruitment-frontend** ? **Environment**

**Confirm this variable exists:**
```
VITE_API_URL = https://ats-recruitment-backend.onrender.com/api
```

### 3?? Redeploy Backend

1. Go to **ats-recruitment-backend**
2. Click **"Manual Deploy"**
3. Select **"Deploy latest commit"**
4. Wait 5 minutes

### 4?? Test Login

After backend redeploy:
1. Go to: https://ats-recruitment-frontend.onrender.com
2. Login with: `admin@atsrecruitsys.com` / `Admin123!`
3. **Should work immediately!** ?

## ?? Why This Fixes It

- **Missing JWT_SECRET_KEY**: Backend couldn't create authentication tokens
- **Missing CORS config**: Frontend couldn't reach backend
- **Environment variables**: Production configuration now matches your URLs

## ?? Expected Timeline

| Step | Time |
|------|------|
| Add environment variables | 2 minutes |
| Redeploy backend | 5 minutes |
| Test login | 30 seconds |
| **SUCCESS!** | ?? |

---

**Your login timeout will be fixed as soon as you add the JWT environment variables and redeploy!**