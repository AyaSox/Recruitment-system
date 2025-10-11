# Container Deployment Fix - Database Connection Issue

## Problem
Your application was failing to start in the container with:
```
System.ArgumentException: Format of the initialization string does not conform to specification starting at index 0.
```

## Root Cause
The connection string was empty or invalid because:
1. `appsettings.Production.json` had template placeholders `#{ConnectionString}#`
2. No environment variable `DATABASE_URL` was set
3. The app crashed instead of starting with graceful degradation

## Solution Applied

### 1. Updated Program.cs
- Added support for `DATABASE_URL` environment variable (Railway/Heroku format)
- Converts `postgres://user:pass@host:port/db` to proper connection string format
- Falls back to in-memory database if no connection string is available
- Added better error logging and graceful degradation

### 2. Added InMemory Database Support
- Added `Microsoft.EntityFrameworkCore.InMemory` package
- Allows app to start even without database connection
- Useful for testing and development

### 3. Improved Error Handling
- Check if database connection is possible before running migrations
- Log clear messages about connection status
- Application starts even if database is unavailable

## How to Deploy

### Option 1: Railway (Recommended)
Railway automatically provides a `DATABASE_URL` environment variable when you add a PostgreSQL database.

**Steps:**
1. Create a new Railway project
2. Add PostgreSQL database from marketplace
3. Deploy your application
4. Railway will automatically inject `DATABASE_URL`

**No additional configuration needed!**

### Option 2: Docker with Environment Variables

**Using Railway DATABASE_URL format:**
```bash
docker run -d \
  -p 8080:8080 \
  -e DATABASE_URL="postgres://user:password@host:5432/database" \
  -e JwtSettings__SecretKey="YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!" \
  -e JwtSettings__Issuer="ATSRecruitSys" \
  -e JwtSettings__Audience="ATSRecruitSys" \
  your-image-name
```

**Using standard PostgreSQL connection string:**
```bash
docker run -d \
  -p 8080:8080 \
  -e ConnectionStrings__DefaultConnection="Host=your-host;Port=5432;Database=atsdb;Username=user;Password=pass;SSL Mode=Require;Trust Server Certificate=true" \
  -e JwtSettings__SecretKey="YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!" \
  -e JwtSettings__Issuer="ATSRecruitSys" \
  -e JwtSettings__Audience="ATSRecruitSys" \
  your-image-name
```

### Option 3: Azure Container Apps

**Set these environment variables in Azure Portal:**
```
DATABASE_URL: Your PostgreSQL connection string
JwtSettings__SecretKey: Your secret key (min 32 chars)
JwtSettings__Issuer: ATSRecruitSys
JwtSettings__Audience: ATSRecruitSys
ASPNETCORE_ENVIRONMENT: Production
```

### Option 4: Kubernetes

**Create a ConfigMap and Secret:**
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: ats-secrets
type: Opaque
stringData:
  database-url: "postgres://user:password@postgres-service:5432/atsdb"
  jwt-secret: "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!"
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: ats-config
data:
  JwtSettings__Issuer: "ATSRecruitSys"
  JwtSettings__Audience: "ATSRecruitSys"
  ASPNETCORE_ENVIRONMENT: "Production"
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ats-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: ats-server
  template:
    metadata:
      labels:
        app: ats-server
    spec:
      containers:
      - name: ats-server
        image: your-registry/ats-server:latest
        ports:
        - containerPort: 8080
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: ats-secrets
              key: database-url
        - name: JwtSettings__SecretKey
          valueFrom:
            secretKeyRef:
              name: ats-secrets
              key: jwt-secret
        envFrom:
        - configMapRef:
            name: ats-config
```

## Environment Variables Reference

### Required
| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` or `ConnectionStrings__DefaultConnection` | PostgreSQL connection string | `postgres://user:pass@host:5432/db` |
| `JwtSettings__SecretKey` | JWT signing key (min 32 chars) | `YourSuperSecretKey...` |

### Optional (with defaults)
| Variable | Description | Default |
|----------|-------------|---------|
| `JwtSettings__Issuer` | JWT issuer | `ATSRecruitSys` |
| `JwtSettings__Audience` | JWT audience | `ATSRecruitSys` |
| `ASPNETCORE_ENVIRONMENT` | Environment name | `Production` |
| `EmailSettings__SmtpServer` | SMTP server | (optional) |
| `EmailSettings__SmtpPort` | SMTP port | (optional) |
| `EmailSettings__SmtpUsername` | SMTP username | (optional) |
| `EmailSettings__SmtpPassword` | SMTP password | (optional) |
| `EmailSettings__FromEmail` | From email address | (optional) |

## Testing Locally with Docker

### 1. Build the image:
```bash
docker build -t ats-server -f Dockerfile .
```

### 2. Run with in-memory database (for testing):
```bash
docker run -d -p 8080:8080 \
  -e JwtSettings__SecretKey="YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!" \
  ats-server
```

### 3. Test the API:
```bash
# Check if it's running
curl http://localhost:8080/swagger

# Should show Swagger UI
```

## Logs to Check

After deployment, check logs for:

### ? Success Messages:
```
Starting database initialization...
Database migrations applied successfully
Database initialization completed successfully
Now listening on: http://[::]:8080
Application started.
```

### ?? Warning (using in-memory DB):
```
No database connection string found. Using in-memory database for development.
Cannot connect to database. Skipping migrations and seeding.
Using in-memory database. Ensuring created...
```

### ? Connection Issues:
```
An error occurred while initializing the database. Application will start but database may not be available.
Connection string status: MISSING
```

## Quick Deploy to Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --plugin postgresql

# Deploy
railway up

# View logs
railway logs
```

## Verify Deployment

After deployment, verify these endpoints work:

1. **Health Check**: `https://your-app.railway.app/swagger`
2. **Auth**: POST to `/api/auth/login`
3. **Jobs**: GET `/api/jobs`

## Troubleshooting

### App starts but "cannot connect to database"
- Check if `DATABASE_URL` environment variable is set
- Verify PostgreSQL database is running and accessible
- Check connection string format

### JWT token errors
- Ensure `JwtSettings__SecretKey` is at least 32 characters
- All services must use the same secret key

### "No such table" errors
- Database migrations didn't run
- Check if database is accessible from container
- Verify SSL/TLS settings in connection string

## Next Steps

1. **Deploy to Railway**:
   - Push code to GitHub
   - Connect Railway to your repository
   - Add PostgreSQL database
   - Deploy automatically

2. **Update Frontend**:
   - Set `VITE_API_URL` to your Railway backend URL
   - Deploy frontend to Vercel or Netlify

3. **Configure Domain** (optional):
   - Add custom domain in Railway
   - Update CORS settings if needed

## Support

The application now gracefully handles:
- ? Missing database connection (uses in-memory)
- ? Invalid connection strings (logs error, continues)
- ? Railway/Heroku `DATABASE_URL` format
- ? Standard PostgreSQL connection strings
- ? SQL Server connection strings

You can now deploy to any container platform!
