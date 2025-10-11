# ?? QUICK START: Deploy Your ATS System to Azure

## ? What we've prepared for you:
1. ? WeatherForecast files removed  
2. ? Production configuration files created
3. ? Azure deployment scripts ready
4. ? CORS configured for production
5. ? Swagger enabled for testing

## ?? Choose Your Deployment Method:

### Option A: Visual Studio (Easiest - Recommended for you)

#### Step 1: Open Visual Studio
1. Open your project in Visual Studio
2. Make sure you're logged into your Azure account in Visual Studio

#### Step 2: Right-click Deploy
1. Right-click on `ATSRecruitSys.Server` project
2. Select "Publish..."
3. Choose "Azure" ? "Azure App Service (Windows)"
4. Click "Create New"

#### Step 3: Configure Settings
- **App Name**: `ats-recruitment-[your-initials]` (must be globally unique)
- **Subscription**: Your Azure subscription
- **Resource Group**: Create new ? `rg-ats-recruitment`
- **App Service Plan**: Create new ? Basic B1 plan
- **Region**: South Africa North (closest to you)

#### Step 4: Click "Create" and Wait
Visual Studio will:
- Create all Azure resources
- Build your application  
- Deploy to Azure
- Give you the URL when done

---

### Option B: PowerShell Script (Advanced)

#### Prerequisites:
1. Install Azure CLI: https://aka.ms/installazurecliwindows
2. Open PowerShell as Administrator

#### Run Deployment:
```powershell
# Navigate to your project folder
cd "C:\Users\cash\source\repos\ATSRecruitSys"

# Run deployment script
.\deploy-to-azure.ps1 -AppName "ats-recruitment-yourname"
```

---

## ?? Post-Deployment Configuration (Required)

### Step 1: Set up Database
1. Go to Azure Portal (portal.azure.com)
2. Create SQL Database (follow AZURE-DATABASE-SETUP.md)
3. Add connection string to your App Service

### Step 2: Configure App Settings
In Azure Portal ? Your App Service ? Configuration ? Application Settings:

```
ASPNETCORE_ENVIRONMENT = Production
JwtSecret = YourSuperSecretKeyHere_MakeItLongAndComplex_AtLeast32Characters!
JwtIssuer = ATSRecruitSys  
JwtAudience = ATSRecruitSysUsers
```

### Step 3: Test Your Deployment
1. Visit: `https://your-app-name.azurewebsites.net/swagger`
2. You should see the API documentation
3. Test the endpoints

---

## ?? Expected Costs (Monthly in ZAR)
- **App Service (Basic B1)**: ~R500-700
- **SQL Database (Basic)**: ~R200-400  
- **Storage**: ~R50
- **Total**: ~R750-1150/month

---

## ?? Need Help?

**Which option do you want to try first?**
1. **Visual Studio publish** (recommended for beginners)
2. **PowerShell script** (more control)
3. **Manual Azure Portal setup** (step by step)

Just tell me which one and I'll guide you through it step by step!

## ?? What to do next:
1. Choose your deployment method above
2. Let me know if you need help with any step
3. I'll help you configure the database and email settings
4. We'll test everything together

**Ready to deploy? Which method would you like to use?** ??