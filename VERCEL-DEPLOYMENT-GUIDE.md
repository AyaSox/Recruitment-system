# Vercel Deployment Guide for ATS Frontend

## ?? **Quick Deployment Steps**

### **Method 1: Vercel Website (Recommended)**

#### **Step 1: Prepare Repository**
Your frontend code is ready in the `atsrecruitsys.client` folder.

#### **Step 2: Deploy to Vercel**

1. **Go to [vercel.com](https://vercel.com)**
2. Click **"Sign Up"** or **"Login"** with GitHub
3. Click **"Add New Project"** or **"Import Project"**
4. **Select your repository**: `AyaSox/Recruitment-system`
5. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: Click **"Edit"** ? Select `atsrecruitsys.client`
   - **Build Command**: `npm run build` (should auto-detect)
   - **Output Directory**: `dist` (should auto-detect)
   - **Install Command**: `npm install` (should auto-detect)

6. **Add Environment Variables** (Click "Environment Variables"):
   ```
   VITE_API_URL = https://your-railway-backend-url.up.railway.app
   VITE_APP_NAME = ATS Recruitment System
   VITE_APP_VERSION = 2.0.0
   VITE_ENABLE_ANALYTICS = false
   VITE_LOG_LEVEL = error
   ```

7. Click **"Deploy"**

8. **Wait for deployment** (2-3 minutes)

9. **Get your URL**: Vercel will provide a URL like:
   - `https://recruitment-system-git-main-ayasox.vercel.app`
   - Or a custom domain if you set one up

---

### **Method 2: Vercel CLI**

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend folder
cd atsrecruitsys.client

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts:
- **Set up and deploy?** Y
- **Which scope?** Select your account
- **Link to existing project?** N
- **Project name?** recruitment-system-frontend
- **Directory?** ./ (current directory)
- **Override settings?** N

---

## ?? **Step 3: Update Backend CORS**

Once your Vercel app is deployed, you need to update your Railway backend to allow requests from Vercel.

### **Get Your Vercel URL**
After deployment, Vercel gives you a URL like:
```
https://recruitment-system-ayasox.vercel.app
```

### **Update Railway Backend**
In Railway, add this environment variable:

```
FRONTEND_URL = https://your-vercel-url.vercel.app
```

Or update your Program.cs CORS configuration to include the Vercel domain.

---

## ? **Verification Steps**

After deployment:

1. **Visit your Vercel URL**
2. **Check if the app loads**
3. **Try to login** with:
   - Email: `admin@atsrecruitsys.com`
   - Password: `Admin123!`
4. **Verify API calls work** (check browser console for errors)

---

## ?? **Automatic Deployments**

Vercel will automatically redeploy when you push to GitHub:
- **Every push to `main`** ? Production deployment
- **Pull requests** ? Preview deployments

---

## ?? **Summary**

**What you'll have after this:**
- ? Frontend on Vercel: `https://your-app.vercel.app`
- ? Backend on Railway: `https://your-api.up.railway.app`
- ? Database on Railway PostgreSQL
- ? Automatic deployments from GitHub
- ? FREE hosting! ??

**Total Cost**: $0 (both Vercel and Railway free tiers)

---

## ?? **Troubleshooting**

### **Issue: API calls fail (CORS errors)**
**Solution**: Update Railway backend CORS to allow Vercel domain

### **Issue: Environment variables not working**
**Solution**: Make sure variables start with `VITE_` prefix

### **Issue: Build fails on Vercel**
**Solution**: Check build logs, might need to update dependencies

---

## ?? **Need Help?**

If you encounter any issues:
1. Check Vercel deployment logs
2. Check Railway application logs
3. Verify environment variables are set correctly
4. Make sure both services are running

**Ready to deploy? Follow the steps above!** ??