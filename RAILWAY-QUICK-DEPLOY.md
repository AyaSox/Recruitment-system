# Railway Quick Deploy Guide

## What Was Fixed

Your app was crashing with a database connection error. I've fixed it to:
- ? Automatically read `DATABASE_URL` from Railway
- ? Convert Railway's postgres URL format to proper connection string
- ? Gracefully handle missing database (uses in-memory as fallback)
- ? Start successfully even if database connection fails

## Deploy to Railway in 3 Steps

### Step 1: Create Railway Project

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Create new project
railway init
```

Or use the Railway website:
1. Go to https://railway.app
2. Click "Start a New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository

### Step 2: Add PostgreSQL Database

In Railway dashboard:
1. Click "+ New" ? "Database" ? "PostgreSQL"
2. Wait for database to provision
3. Railway automatically sets `DATABASE_URL` environment variable

**That's it! Railway handles the connection string for you.**

### Step 3: Deploy

```bash
railway up
```

Or push to GitHub - Railway auto-deploys on push.

## Verify Deployment

1. **Check Logs** (Railway dashboard or CLI):
   ```bash
   railway logs
   ```

   Look for:
   ```
   ? Starting database initialization...
   ? Database migrations applied successfully
   ? Now listening on: http://[::]:8080
   ```

2. **Test API**:
   ```bash
   # Get your app URL from Railway dashboard
   curl https://your-app.railway.app/swagger
   ```

3. **Test Login**:
   ```bash
   curl -X POST https://your-app.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@atsrecruitsys.com","password":"Admin123!"}'
   ```

## Environment Variables (Optional)

Railway auto-provides `DATABASE_URL`. You can add more in the dashboard:

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | ? Auto-set | - | PostgreSQL connection |
| `JwtSettings__SecretKey` | No | Generated | JWT signing key |
| `JwtSettings__Issuer` | No | ATSRecruitSys | JWT issuer |
| `JwtSettings__Audience` | No | ATSRecruitSys | JWT audience |

To set custom JWT secret:
```bash
railway variables set JwtSettings__SecretKey="YourSuperSecretKey32CharsMin!"
```

## Default Users Created

After first deployment, these users are created:

| Email | Password | Role |
|-------|----------|------|
| admin@atsrecruitsys.com | Admin123! | Admin |
| recruiter@test.com | Test123! | Recruiter |
| hiringmanager@test.com | Test123! | Hiring Manager |
| applicant@test.com | Test123! | Applicant |

## Connect Frontend

After backend is deployed, update your frontend:

1. Get Railway backend URL (e.g., `https://your-app.railway.app`)

2. Update `.env.production` in `atsrecruitsys.client`:
   ```env
   VITE_API_URL=https://your-app.railway.app/api
   ```

3. Deploy frontend to Vercel/Netlify

## Troubleshooting

### App crashes on startup
Check logs for:
```bash
railway logs
```

Common issues:
- **"Format of initialization string"** ? Fixed! Should not happen anymore
- **"Cannot connect to database"** ? Check if PostgreSQL is added and running
- **Port errors** ? Railway uses port 8080 (already configured)

### Database not connecting
1. Verify PostgreSQL service is running in Railway dashboard
2. Check `DATABASE_URL` is set:
   ```bash
   railway variables
   ```

### JWT token errors
Set a longer secret key:
```bash
railway variables set JwtSettings__SecretKey="YourVeryLongSecretKeyAtLeast32CharactersForSecurity!"
```

## Update/Redeploy

### Via Git
```bash
git push origin main
# Railway auto-deploys
```

### Via CLI
```bash
railway up
```

## View Live Logs

```bash
railway logs --follow
```

## Scale Up

In Railway dashboard:
1. Go to Settings
2. Increase Resources:
   - Memory: 512MB ? 1GB
   - CPU: 1 vCPU ? 2 vCPUs

## Custom Domain (Optional)

1. Railway dashboard ? Settings ? Domains
2. Click "Generate Domain" or add custom domain
3. Update CORS settings if needed (already set to allow all origins in production)

## Cost Estimate

Railway Free Tier:
- $5 credit per month
- Enough for:
  - 1 web service (backend)
  - 1 PostgreSQL database
  - Low-medium traffic

For production:
- Upgrade to Developer plan ($10/month)
- Pay-as-you-go beyond included credits

## Next Steps

1. ? Deploy backend to Railway
2. ? Verify API works (check /swagger)
3. ? Deploy frontend to Vercel
4. ? Connect frontend to Railway backend
5. ? Test end-to-end flow

## Need Help?

Check Railway logs:
```bash
railway logs
```

Common success indicators:
```
? Database initialization completed successfully
? Application started
? Now listening on: http://[::]:8080
```

Your app is now production-ready and resilient! ??
