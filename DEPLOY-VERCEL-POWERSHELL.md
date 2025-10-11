# ?? VERCEL DEPLOYMENT - POWERSHELL ONLY

## ? **Deploy in 2 Steps**

### **Step 1: Run Deployment Script**

```bash
.\deploy-to-vercel.ps1
```

This script will:
- ? Check for Vercel CLI (install if needed)
- ? Navigate to frontend directory
- ? Install dependencies
- ? Run production build
- ? Guide you through deployment
- ? Show next steps

### **Step 2: Update Railway CORS**

After getting your Vercel URL:

1. Go to: [railway.app/dashboard](https://railway.app/dashboard)
2. Select your project
3. Click **Variables** tab
4. Add:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```

---

## ?? **Manual Deployment (Alternative)**

If you prefer manual commands:

```bash
cd atsrecruitsys.client
npm install -g vercel
vercel login
vercel --prod
```

---

## ?? **Your Setup**

**Backend (Railway):** https://recruitment-system-production-7f72.up.railway.app  
**Frontend:** Will be deployed to Vercel  
**Cost:** $0 (Free tiers)  

---

## ?? **Test Connection First**

```bash
.\test-connection.ps1
```

This verifies your backend is reachable.

---

## ?? **Need Help?**

- **Quick Start:** `VERCEL-QUICK-START.md`
- **Complete Guide:** `VERCEL-DEPLOYMENT-COMPLETE-GUIDE.md`
- **Checklist:** `DEPLOYMENT-CHECKLIST.md`

---

## ?? **Ready to Deploy?**

Run this command now:

```bash
.\deploy-to-vercel.ps1
```

**Your app will be live in 2-3 minutes!** ??

---

## ? **After Deployment**

Visit your Vercel URL and login:
- **Email:** `admin@atsrecruitsys.com`
- **Password:** `Admin123!`

**That's it!** Your ATS system is live globally. ??