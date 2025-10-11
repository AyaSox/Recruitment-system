# ?? VERCEL DEPLOYMENT - QUICK START

## ? **Deploy in 3 Commands**

```bash
# 1. Navigate to frontend
cd atsrecruitsys.client

# 2. Install Vercel CLI (one-time)
npm install -g vercel

# 3. Deploy!
vercel --prod
```

---

## ?? **Or Use Our Script**

**PowerShell:**
```bash
.\deploy-to-vercel.ps1
```

---

## ?? **First Time Setup Questions**

When you run `vercel --prod` for the first time:

**Q: Set up and deploy?**  
? **Yes**

**Q: Which scope?**  
? Select your account

**Q: Link to existing project?**  
? **No** (first time)

**Q: Project name?**  
? `ats-recruitment-system` (or any name)

**Q: In which directory is your code located?**  
? `./` (press Enter)

**Q: Override settings?**  
? **No** (we have vercel.json)

---

## ?? **After Deployment**

### **1. Get Your URL**
Vercel will show: `https://ats-recruitment-system-xxx.vercel.app`

### **2. Update Railway Backend**

Go to: [railway.app/dashboard](https://railway.app/dashboard)

1. Select your project
2. Click Variables tab
3. Add new variable:
   ```
   FRONTEND_URL=https://your-vercel-url.vercel.app
   ```
4. Railway will auto-redeploy (wait 1-2 minutes)

### **3. Test Your App!**

Visit your Vercel URL and login:
- Email: `admin@atsrecruitsys.com`
- Password: `Admin123!`

---

## ?? **Quick Troubleshooting**

### **CORS Errors?**
? Make sure you added `FRONTEND_URL` to Railway  
? Wait 2 minutes for Railway to redeploy  
? Clear browser cache (Ctrl+Shift+Del)

### **Build Failed?**
? Run `npm run build` locally first  
? Fix any TypeScript errors  
? Try again

### **Wrong API URL?**
? Check Vercel environment variables  
? Should be: `VITE_API_URL=https://recruitment-system-production-7f72.up.railway.app`

---

## ?? **Useful Commands**

```bash
# View your deployments
vercel ls

# View deployment logs
vercel logs

# Login to Vercel
vercel login

# Deploy preview (testing)
vercel

# Deploy production
vercel --prod

# Remove deployment
vercel remove [deployment-url]
```

---

## ?? **Automatic Deployments**

Every time you push to GitHub:
1. Vercel automatically builds
2. Deploys new version
3. Updates live site
4. Sends notification

**No manual work needed!** ??

---

## ?? **Pro Tips**

1. **Preview Deployments:**
   - Every git push creates a preview
   - Test before promoting to production

2. **Environment Variables:**
   - Set different values per environment
   - Production vs Preview

3. **Custom Domain:**
   - Add your domain in Vercel settings
   - Update Railway `FRONTEND_URL`

---

## ?? **Need Help?**

**Vercel Dashboard:** [vercel.com/dashboard](https://vercel.com/dashboard)  
**Railway Dashboard:** [railway.app/dashboard](https://railway.app/dashboard)  
**Full Guide:** See `VERCEL-DEPLOYMENT-COMPLETE-GUIDE.md`

---

## ? **Deployment Checklist**

Before deploying:
- [ ] Backend running on Railway
- [ ] All tests passing locally
- [ ] No TypeScript errors
- [ ] Environment variables ready
- [ ] Git committed and pushed

After deploying:
- [ ] Vercel URL received
- [ ] Railway CORS updated
- [ ] Login works
- [ ] API calls successful
- [ ] No console errors

---

## ?? **That's It!**

Your app will be live at:
```
https://your-project-name.vercel.app
```

**Deploy time:** ~2-3 minutes  
**Cost:** $0 (Free tier)  
**Uptime:** 99.99%  
**Global CDN:** Included  

**Ready? Run `vercel --prod` now!** ??
