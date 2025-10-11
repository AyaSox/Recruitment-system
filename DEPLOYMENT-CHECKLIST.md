# ? FRONTEND-BACKEND CONNECTION CHECKLIST

## ?? **Current Status**

### **Backend (Railway)**
- ? Deployed and running
- ? URL: `https://recruitment-system-production-7f72.up.railway.app`
- ? Database connected
- ? API endpoints working
- ? CORS configured (development only)

### **Frontend (Local)**
- ? Environment configured
- ? API URL set to Railway
- ? Build working locally
- ? **Needs deployment to Vercel**

---

## ?? **Deployment Checklist**

### **Pre-Deployment**

- [ ] Backend is running on Railway
- [ ] Test backend health: `https://recruitment-system-production-7f72.up.railway.app/swagger`
- [ ] Frontend builds successfully: `cd atsrecruitsys.client && npm run build`
- [ ] No TypeScript errors
- [ ] Environment variables ready
- [ ] Git repository is up to date

### **Vercel Deployment**

- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Login to Vercel: `vercel login`
- [ ] Navigate to frontend: `cd atsrecruitsys.client`
- [ ] Deploy: `vercel --prod`
- [ ] Note your Vercel URL

**OR use our script:**
- [ ] Run `deploy-to-vercel.bat` (Windows)
- [ ] Follow the prompts

### **Backend CORS Configuration**

After getting your Vercel URL:

- [ ] Go to Railway Dashboard: [railway.app/dashboard](https://railway.app/dashboard)
- [ ] Select project: **Recruitment-system**
- [ ] Go to **Variables** tab
- [ ] Click **+ New Variable**
- [ ] Add:
  ```
  Variable: FRONTEND_URL
  Value: https://your-vercel-url.vercel.app
  ```
- [ ] Click **Add**
- [ ] Wait 1-2 minutes for redeploy

### **Testing**

- [ ] Visit your Vercel URL
- [ ] Check browser console (F12) - no errors
- [ ] Try to login:
  - Email: `admin@atsrecruitsys.com`
  - Password: `Admin123!`
- [ ] Test navigation
- [ ] Check API calls work
- [ ] Test job creation
- [ ] Test application submission
- [ ] Test file uploads
- [ ] Check on mobile device

---

## ?? **Environment Variables**

### **Vercel (Frontend)**

Set these in Vercel Dashboard or during deployment:

```env
VITE_API_URL=https://recruitment-system-production-7f72.up.railway.app
VITE_APP_NAME=ATS Recruitment System
VITE_APP_VERSION=2.0.0
VITE_ENABLE_ANALYTICS=false
VITE_LOG_LEVEL=error
```

### **Railway (Backend)**

Add this after Vercel deployment:

```env
FRONTEND_URL=https://your-vercel-url.vercel.app
```

---

## ?? **Common Issues & Solutions**

### **Issue 1: CORS Error**

**Symptom:**
```
Access to XMLHttpRequest at 'https://recruitment-system...' from origin 'https://your-vercel...' has been blocked by CORS policy
```

**Solution:**
1. Verify `FRONTEND_URL` is set in Railway
2. Value should be your exact Vercel URL (no trailing slash)
3. Wait 2 minutes for Railway to redeploy
4. Clear browser cache: Ctrl+Shift+Delete
5. Hard refresh: Ctrl+Shift+R

### **Issue 2: Build Fails on Vercel**

**Symptom:**
```
Error: Cannot find module 'xyz'
```

**Solution:**
1. Check `package.json` has all dependencies
2. Run locally: `npm install && npm run build`
3. Fix any TypeScript errors
4. Commit and push changes
5. Redeploy to Vercel

### **Issue 3: 404 on Page Refresh**

**Symptom:**
- Navigation works
- Refresh gives 404

**Solution:**
? Already fixed! Your `vercel.json` has proper routing.

### **Issue 4: Environment Variables Not Working**

**Symptom:**
- API calls go to wrong URL
- Features not working

**Solution:**
1. In Vercel Dashboard: Project ? Settings ? Environment Variables
2. Verify all `VITE_*` variables exist
3. Click **Redeploy** after changes
4. Check in browser console: `import.meta.env`

### **Issue 5: SSL Certificate Error**

**Symptom:**
```
NET::ERR_CERT_AUTHORITY_INVALID
```

**Solution:**
- Railway and Vercel provide SSL automatically
- If error persists, check Railway deployment logs
- Contact Railway support if needed

---

## ?? **Verification Steps**

### **Step 1: Backend Health**

Open: `https://recruitment-system-production-7f72.up.railway.app/swagger`

? Should show Swagger API documentation

### **Step 2: Frontend Build**

```bash
cd atsrecruitsys.client
npm run build
```

? Should complete without errors  
? Creates `dist` folder

### **Step 3: Test Connection**

Run our test script:
```bash
.\test-connection.ps1
```

? All tests should pass

### **Step 4: Deploy to Vercel**

```bash
vercel --prod
```

? Should deploy successfully  
? Provides production URL

### **Step 5: Update CORS**

Add `FRONTEND_URL` to Railway

? Railway redeploys automatically

### **Step 6: Test Live App**

Visit your Vercel URL

? App loads  
? Login works  
? API calls successful  
? No console errors

---

## ?? **Success Criteria**

Your deployment is successful when:

- ? Frontend accessible via HTTPS
- ? No CORS errors in console
- ? Login/logout works
- ? Dashboard loads with data
- ? Job creation works
- ? Application submission works
- ? File uploads work
- ? All pages navigate correctly
- ? Mobile responsive
- ? SSL certificate valid

---

## ?? **Quick Commands**

```bash
# Test backend connection
.\test-connection.ps1

# Deploy to Vercel
.\deploy-to-vercel.bat

# Or manually
cd atsrecruitsys.client
vercel --prod

# View deployments
vercel ls

# View logs
vercel logs

# Railway CLI (optional)
npm install -g @railway/cli
railway login
railway logs
```

---

## ?? **After Deployment**

### **Continuous Deployment**

Every git push to main:
1. Vercel auto-builds
2. Auto-deploys
3. Updates live site
4. Sends notification

### **Monitoring**

**Vercel:**
- Dashboard ? Your Project ? Analytics
- View traffic, performance, errors

**Railway:**
- Dashboard ? Your Project ? Metrics
- View API usage, database stats

### **Updates**

To update your app:
```bash
# 1. Make changes
# 2. Test locally
npm run dev

# 3. Build and test
npm run build

# 4. Commit
git add .
git commit -m "Your changes"
git push origin main

# 5. Vercel auto-deploys!
```

---

## ?? **Cost Tracking**

### **Free Tier Limits**

**Vercel:**
- 100 GB bandwidth/month
- 100 deployments/day
- Unlimited preview deployments

**Railway:**
- $5 free credit/month
- ~500 hours usage
- Pay-as-you-go after credit

**Typical Monthly Cost:**
- Small usage: **$0** (within free tiers)
- Medium usage: **$5-10**
- Heavy usage: **$15-25**

---

## ?? **Need Help?**

### **Documentation**
- See: `VERCEL-DEPLOYMENT-COMPLETE-GUIDE.md`
- See: `VERCEL-QUICK-START.md`

### **Test Connection**
```bash
.\test-connection.ps1
```

### **Deployment Script**
```bash
.\deploy-to-vercel.bat
```

### **Support Links**
- Vercel: [vercel.com/support](https://vercel.com/support)
- Railway: [docs.railway.app](https://docs.railway.app)

---

## ?? **Ready to Deploy?**

### **Quick Start:**

1. **Test backend:**
   ```bash
   .\test-connection.ps1
   ```

2. **Deploy frontend:**
   ```bash
   .\deploy-to-vercel.bat
   ```

3. **Update CORS on Railway**
   - Add `FRONTEND_URL` variable

4. **Test your app!**
   - Visit Vercel URL
   - Login and explore

---

## ? **Final Architecture**

```
???????????????????
?   User Browser  ?
???????????????????
         ?
         ? HTTPS
???????????????????
?  Vercel (CDN)   ?  ? React App
?  Global Edges   ?
???????????????????
         ?
         ? API Calls
???????????????????
? Railway Backend ?  ? .NET API
?  Auto-scaling   ?
???????????????????
         ?
         ?
???????????????????
?   PostgreSQL    ?  ? Database
?    Railway      ?
???????????????????
```

**Your app is globally distributed, auto-scaling, and production-ready!** ??
