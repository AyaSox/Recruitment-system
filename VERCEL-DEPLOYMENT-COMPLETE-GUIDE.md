# ?? Complete Vercel Deployment Guide

## ?? **Pre-Deployment Checklist**

? Backend deployed on Railway: `https://recruitment-system-production-7f72.up.railway.app`  
? Frontend configured to connect to Railway backend  
? All environment variables ready  
? Build configuration verified  

---

## ?? **Quick Deployment Steps**

### **Step 1: Push Your Code to GitHub** (If not already done)

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### **Step 2: Deploy to Vercel**

#### **Option A: Using Vercel CLI (Recommended)**

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Navigate to frontend directory:**
```bash
cd atsrecruitsys.client
```

3. **Login to Vercel:**
```bash
vercel login
```

4. **Deploy:**
```bash
vercel --prod
```

5. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name: `ats-recruitment-system` (or your choice)
   - In which directory is your code located? `./`
   - Override settings? **Y**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Development Command: `npm run dev`

#### **Option B: Using Vercel Web Interface**

1. **Go to:** [vercel.com/new](https://vercel.com/new)

2. **Import Git Repository:**
   - Click "Import Project"
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project Settings:**

   **Framework Preset:** Vite
   
   **Root Directory:** `atsrecruitsys.client` ? **CRITICAL!**
   
   **Build Settings:**
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   Development Command: npm run dev
   ```

4. **Environment Variables:**
   Click "Environment Variables" and add these:

   ```env
   VITE_API_URL=https://recruitment-system-production-7f72.up.railway.app
   VITE_APP_NAME=ATS Recruitment System
   VITE_APP_VERSION=2.0.0
   VITE_ENABLE_ANALYTICS=false
   VITE_LOG_LEVEL=error
   ```

5. **Click "Deploy"**

---

## ?? **Post-Deployment Configuration**

### **1. Get Your Vercel URL**

After deployment completes, Vercel will provide your URL:
```
https://your-project-name.vercel.app
```

### **2. Update Railway Backend CORS**

**Important:** You must update your Railway backend to allow requests from your Vercel domain.

#### **Option A: Environment Variable (Recommended)**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project: `Recruitment-system`
3. Click on your service
4. Go to **Variables** tab
5. Add a new variable:
   ```
   FRONTEND_URL=https://your-project-name.vercel.app
   ```
6. Click **Deploy** (Railway will automatically redeploy)

#### **Option B: Update appsettings.json**

If you prefer to hardcode it, update your backend code (not recommended for production):

```json
{
  "AllowedOrigins": [
    "https://your-project-name.vercel.app"
  ]
}
```

---

## ?? **Testing Your Deployment**

### **1. Basic Connectivity Test**

Visit your Vercel URL:
```
https://your-project-name.vercel.app
```

You should see the welcome page!

### **2. API Connection Test**

1. Try to login with test credentials:
   - Email: `admin@atsrecruitsys.com`
   - Password: `Admin123!`

2. If login works, you're connected! ?

### **3. Check Browser Console**

Open Developer Tools (F12):
- **No CORS errors** = ? Backend configured correctly
- **CORS errors** = ? Need to update Railway CORS settings

---

## ?? **Troubleshooting**

### **Issue 1: Build Fails on Vercel**

**Error:** "Cannot find package.json"

**Solution:**
- Ensure **Root Directory** is set to `atsrecruitsys.client`
- Re-deploy with correct settings

**Error:** "TypeScript compilation failed"

**Solution:**
```bash
# Run locally first to check for errors
cd atsrecruitsys.client
npm run build
```

### **Issue 2: CORS Errors**

**Symptom:** API calls fail with CORS error in browser console

**Solution:**
1. Verify your Vercel URL is correct
2. Update Railway environment variable: `FRONTEND_URL`
3. Wait 1-2 minutes for Railway to redeploy
4. Clear browser cache and refresh

**Check Railway logs:**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and view logs
railway login
railway logs
```

### **Issue 3: Environment Variables Not Working**

**Symptom:** API calls go to wrong URL or fail

**Solution:**
1. In Vercel Dashboard, go to: Project ? Settings ? Environment Variables
2. Verify all `VITE_*` variables are set
3. Click "Redeploy" to apply changes

### **Issue 4: 404 on Page Refresh**

**Symptom:** Routes work initially but refresh gives 404

**Solution:**
This is already handled by your `vercel.json` configuration, but verify it exists:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

---

## ?? **Monitoring & Logs**

### **Vercel Logs**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Click on **Logs** tab
4. View runtime and build logs

### **Railway Logs**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Select your project
3. Click on your service
4. Click **Deployments** ? View logs

---

## ?? **Custom Domain (Optional)**

### **Add Your Own Domain to Vercel**

1. In Vercel Dashboard, go to: Project ? Settings ? Domains
2. Click "Add Domain"
3. Enter your domain (e.g., `ats.yourcompany.com`)
4. Follow DNS configuration instructions
5. Update Railway `FRONTEND_URL` with your custom domain

---

## ?? **Cost Overview**

| Service | Plan | Cost |
|---------|------|------|
| Vercel | Hobby (Free) | $0/month |
| Railway | Trial Credit | $5 credit (Free) |
| **Total** | | **$0/month** ?? |

### **Scaling Costs:**

**Vercel Pro** (if needed):
- $20/month per member
- Unlimited bandwidth
- Analytics included

**Railway** (after $5 credit):
- Pay-as-you-go
- ~$5-10/month for small apps
- Scales with usage

---

## ?? **Performance Optimization**

### **Already Implemented:**

? Vite build optimization  
? Tree shaking  
? Code splitting  
? Gzip compression  
? CDN delivery via Vercel  

### **Additional Optimization (Optional):**

1. **Enable Vercel Analytics:**
```bash
npm install @vercel/analytics
```

Add to your `main.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

<Analytics />
```

2. **Enable Vercel Speed Insights:**
```bash
npm install @vercel/speed-insights
```

---

## ?? **Security Checklist**

? HTTPS enabled (automatic with Vercel)  
? CORS properly configured  
? JWT authentication working  
? Environment variables secure  
? No secrets in code  
? API rate limiting (Railway)  

---

## ?? **Need Help?**

### **Common Commands:**

```bash
# View Vercel deployment
vercel ls

# View Vercel logs
vercel logs

# Roll back deployment
vercel rollback

# View domains
vercel domains ls

# Link local project to Vercel
vercel link
```

### **Useful Links:**

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Vite Documentation](https://vitejs.dev)

---

## ? **Deployment Checklist**

Before going live, ensure:

- [ ] Backend is running on Railway
- [ ] Frontend deployed to Vercel
- [ ] CORS configured with Vercel URL
- [ ] All environment variables set
- [ ] Login/logout works
- [ ] Job posting works
- [ ] Application submission works
- [ ] File uploads work
- [ ] Admin features accessible
- [ ] Mobile responsive
- [ ] No console errors
- [ ] SSL certificate active (HTTPS)

---

## ?? **Success!**

Once deployed, your ATS Recruitment System will be:

- **Globally available** via CDN
- **Auto-scaling** based on traffic
- **Automatically updated** on every git push
- **Monitored** with real-time logs
- **Secure** with HTTPS and CORS

**Your live URL:** `https://your-project-name.vercel.app`

---

## ?? **Continuous Deployment**

Every time you push to GitHub:
1. Vercel automatically detects the change
2. Runs the build process
3. Deploys the new version
4. Updates your live site
5. Sends you a deployment notification

**No manual deployment needed!** ??

---

## ?? **Support**

If you encounter any issues:
1. Check Vercel deployment logs
2. Check Railway backend logs
3. Verify all environment variables
4. Test API endpoints directly
5. Clear browser cache

**Ready to deploy? Let's go!** ??
