# Quick Reference: Database Connection Fix

## What Changed?

Your app now handles database connections gracefully:
- ? Reads `DATABASE_URL` from environment (Railway/Heroku)
- ? Converts URL format to proper connection string automatically
- ? Falls back to in-memory database if needed
- ? Won't crash on startup anymore

## Deploy Commands

### Railway (Easiest)
```bash
railway login
railway init
railway add --plugin postgresql  # Auto-sets DATABASE_URL
railway up
```

### Docker
```bash
docker build -t ats-server .
docker run -p 8080:8080 -e DATABASE_URL="postgres://..." ats-server
```

### Test Locally
```bash
cd ATSRecruitSys.Server
dotnet run
# Works without database - uses in-memory
```

## Environment Variables

### Required
- `DATABASE_URL` or `ConnectionStrings__DefaultConnection`

### Optional (have defaults)
- `JwtSettings__SecretKey` (default: auto-generated)
- `JwtSettings__Issuer` (default: ATSRecruitSys)
- `JwtSettings__Audience` (default: ATSRecruitSys)

## Connection String Formats

### Railway/Heroku (Auto-handled)
```
postgres://user:password@host:5432/database
```

### Standard PostgreSQL
```
Host=host;Port=5432;Database=db;Username=user;Password=pass;SSL Mode=Require
```

### SQL Server
```
Server=server;Database=db;User Id=user;Password=pass;
```

## Default Test Users

| Email | Password | Role |
|-------|----------|------|
| admin@atsrecruitsys.com | Admin123! | Admin |
| recruiter@test.com | Test123! | Recruiter |

## Verify Deployment

```bash
# Check Swagger UI
curl https://your-app.railway.app/swagger

# Test login
curl -X POST https://your-app.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@atsrecruitsys.com","password":"Admin123!"}'
```

## Log Messages

### ? Success
```
Database initialization completed successfully
Now listening on: http://[::]:8080
```

### ?? No Database (OK for testing)
```
Using in-memory database
```

### ? Error (Should NOT see this now)
```
Format of initialization string... ? FIXED!
```

## Files Changed
- `ATSRecruitSys.Server/Program.cs` - Connection handling
- `ATSRecruitSys.Server/ATSRecruitSys.Server.csproj` - Added InMemory package

## Next Steps
1. Deploy to Railway ? See `RAILWAY-QUICK-DEPLOY.md`
2. Other platforms ? See `CONTAINER-DEPLOYMENT-FIX.md`

**You're ready to deploy!** ??
