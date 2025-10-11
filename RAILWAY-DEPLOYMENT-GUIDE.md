# Railway Deployment Guide for ATS System

## ?? **Step 1: Create Railway Account**
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" 
3. Sign up with GitHub (recommended) or email
4. **No credit card required!** ??

## ?? **Step 2: Push Your Code to GitHub**

### Option A: Create New Repository
```bash
# Navigate to your project
cd "C:\Users\cash\source\repos\ATSRecruitSys"

# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit - ATS System ready for Railway"

# Create repository on GitHub.com and then:
git remote add origin https://github.com/yourusername/ats-recruit-system.git
git branch -M main
git push -u origin main
```

### Option B: Use Existing Repository
If you already have a GitHub repository, just push your latest changes:
```bash
git add .
git commit -m "Railway deployment configuration added"
git push origin main
```

## ?? **Step 3: Deploy to Railway**

1. **Login to Railway** (railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your ATS repository
5. Railway will automatically:
   - Detect it's a .NET 8 project
   - Build your application
   - Deploy it
   - Give you a URL

## ??? **Step 4: Add PostgreSQL Database**

1. In your Railway project dashboard, click **"+ New"**
2. Select **"Database"** 
3. Choose **"PostgreSQL"**
4. Railway automatically creates the database and connection string

## ?? **Step 5: Configure Environment Variables**

In Railway dashboard, go to your service ? **Variables** tab:

```
ASPNETCORE_ENVIRONMENT = Production
ConnectionStrings__DefaultConnection = ${{Postgres.DATABASE_URL}}
JwtSettings__SecretKey = your-super-secret-jwt-key-32-characters-long
JwtSettings__Issuer = ATSRecruitSys
JwtSettings__Audience = ATSRecruitSysUsers
```

**Note**: `${{Postgres.DATABASE_URL}}` is automatically provided by Railway!

## ?? **Step 6: Deploy and Test**

1. Railway will automatically redeploy after you add variables
2. Visit your Railway app URL (e.g., `https://your-app-name.up.railway.app`)
3. You should see your Swagger API documentation
4. Test the endpoints!

## ?? **Cost**: 
- **$5/month credit** (covers small apps completely)
- **No credit card** required until you exceed free usage
- Perfect for development and small production apps

## ?? **What's Next?**

Tell me when you've:
1. ? **"Created Railway account"** 
2. ? **"Code pushed to GitHub"**
3. ? **"Project deployed to Railway"**
4. ? **"Need help with [specific step]"**

I'll guide you through each step! Railway makes it super simple compared to other platforms.

## ?? **Troubleshooting**
- If build fails: Check that you pushed the updated `.csproj` file
- If app won't start: Verify environment variables are set
- Database connection issues: Make sure `${{Postgres.DATABASE_URL}}` is used

**Ready to start? Let me know which step you're on!** ??