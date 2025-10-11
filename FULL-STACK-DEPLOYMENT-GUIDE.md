# Full Stack Deployment Guide - ATS Recruitment System

## ?? **Recommended Approach: Split Deployment**

Deploy Backend and Frontend separately for best performance and scalability.

### **Architecture:**
```
Frontend (Vercel)  ?  Backend API (Railway)  ?  Database (Railway PostgreSQL)
     React              .NET 8 Web API           PostgreSQL
```

---

## ?? **Step-by-Step Deployment**

### **Part 1: Backend (Already Done ?)**

Your backend is deployed on Railway at:
- **URL**: `https://recruitment-system-production-xxxx.up.railway.app`
- **Database**: PostgreSQL on Railway
- **Status**: ? Running

---

### **Part 2: Frontend Deployment to Vercel**

#### **Step 1: Get Your Railway Backend URL**
1. Go to Railway dashboard
2. Click on your **Recruitment-system** service
3. Go to **Settings** ? **Networking**
4. Copy the generated domain URL
5. Example: `https://recruitment-system-production-a1b2.up.railway.app`

#### **Step 2: Update Frontend Configuration**
Update the API URL in your frontend:

```bash
cd atsrecruitsys.client
```

Edit `.env.production`:
```env
VITE_API_URL=https://your-railway-url-here.up.railway.app
VITE_APP_NAME=ATS Recruitment System
VITE_APP_VERSION=2.0.0
VITE_ENABLE_ANALYTICS=false
VITE_LOG_LEVEL=error
```

#### **Step 3: Deploy to Vercel**

**Option A: Using Vercel Website (Easiest)**
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click **"Add New Project"**
4. Select your **Recruitment-system** repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `atsrecruitsys.client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add Environment Variables:
   ```
   VITE_API_URL = https://your-railway-url.up.railway.app
   ```
7. Click **"Deploy"**

**Option B: Using Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd atsrecruitsys.client

# Deploy
vercel --prod
```

#### **Step 4: Update Backend CORS**
Your backend needs to allow requests from Vercel.

In Railway, update the CORS environment variable or update your code to allow Vercel domain.

---

## ?? **Alternative: All-in-One Railway Deployment**

If you want everything on Railway:

### **Option 2: Railway with Static File Serving**

Modify your .NET app to serve React files:

1. **Build React app**:
```bash
cd atsrecruitsys.client
npm run build
```

2. **Copy dist folder** to `ATSRecruitSys.Server/wwwroot`

3. **Update Program.cs** to serve static files:

```csharp
// Add this before app.Run()
app.UseDefaultFiles();
app.UseStaticFiles();
app.MapFallbackToFile("index.html");
```

4. **Update Dockerfile** to include frontend:

```dockerfile
# Frontend build stage
FROM node:18 AS frontend-build
WORKDIR /app
COPY atsrecruitsys.client/package*.json ./
RUN npm install
COPY atsrecruitsys.client/ ./
RUN npm run build

# Backend build stage  
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS backend-build
WORKDIR /src
COPY ATSRecruitSys.Server/ ./
RUN dotnet publish -c Release -o /app/publish

# Final stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=backend-build /app/publish .
COPY --from=frontend-build /app/dist ./wwwroot

ENTRYPOINT ["dotnet", "ATSRecruitSys.Server.dll"]
```

---

## ?? **My Recommendation**

### **Use Split Deployment (Vercel + Railway)**

**Why?**
- ? Free frontend hosting (Vercel)
- ? Better performance (CDN for frontend)
- ? Easier to scale
- ? Independent deployments
- ? No credit card needed for Vercel free tier

**Setup Time**: ~10 minutes

**Monthly Cost**: 
- Frontend: $0 (Vercel free tier)
- Backend: $5 Railway credit (free tier)
- **Total: FREE** ?

---

## ?? **Quick Setup Checklist**

### **For Split Deployment:**
- [ ] Get Railway backend URL
- [ ] Update `.env.production` with Railway URL
- [ ] Create Vercel account
- [ ] Deploy React app to Vercel
- [ ] Update backend CORS to allow Vercel domain
- [ ] Test login and functionality

### **For All-in-One Railway:**
- [ ] Modify Dockerfile to include frontend
- [ ] Build React app
- [ ] Update Program.cs for static files
- [ ] Commit and push changes
- [ ] Railway redeploys automatically

---

## ?? **Which Should You Choose?**

**Choose Split Deployment (Vercel + Railway) if:**
- You want the easiest setup
- You want free hosting
- You want best performance
- You're okay with managing two services

**Choose All-in-One Railway if:**
- You want everything in one place
- You don't mind slightly more complex setup
- You want a single domain for everything

---

## ?? **Next Steps**

Let me know which approach you prefer:
1. **"Split deployment"** - I'll help you deploy to Vercel
2. **"All-in-one"** - I'll update your Dockerfile and code

I recommend **Split Deployment** for simplicity and cost!