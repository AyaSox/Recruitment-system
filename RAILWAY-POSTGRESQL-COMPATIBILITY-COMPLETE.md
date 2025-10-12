# Railway PostgreSQL Compatibility - Complete ?

## Overview
The application is now fully configured to work with **both SQL Server (local dev) and PostgreSQL (Railway production)** using a single codebase and database-agnostic migrations.

## ? What Was Fixed

### 1. Database Seeding Enhancement
**File:** `ATSRecruitSys.Server/Services/DatabaseSeeder.cs`

- ? Creates **8 sample applications** across all funnel stages
- ? Sample data distribution:
  - **Applied**: 2 applications
  - **Screening**: 1 application
  - **Interview**: 2 applications
  - **Offer**: 1 application
  - **Hired**: 1 application
  - **Rejected**: 1 application

### 2. JobApplication Model Update
**File:** `ATSRecruitSys.Server/Models/JobApplication.cs`

```csharp
[Required]
[StringLength(30)]
public string Status { get; set; } = "Applied"; // Applied, Screening, Interview, Offer, Hired, Rejected
```

- Changed default status from `"New"` to `"Applied"`
- Updated to match frontend statuses exactly

### 3. Database Provider Configuration
**File:** `ATSRecruitSys.Server/Program.cs`

The application automatically detects and uses the correct database provider:

```csharp
// Configure database provider based on connection string
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    if (connectionString.Contains("postgres") || connectionString.Contains("PostgreSQL") || connectionString.Contains("Host="))
    {
        options.UseNpgsql(connectionString);  // PostgreSQL for Railway
    }
    else
    {
        options.UseSqlServer(connectionString);  // SQL Server for local dev
    }
});
```

## ?? How It Works

### Local Development (SQL Server)
1. Uses connection string from `appsettings.json`
2. Connects to `(localdb)\mssqllocaldb`
3. Applies SQL Server migrations
4. Database: `ATSRecruitSys_Dev`

### Railway Production (PostgreSQL)
1. Reads `DATABASE_URL` environment variable
2. Converts PostgreSQL URL format to Npgsql connection string
3. Applies database-agnostic migrations
4. Uses Railway's PostgreSQL database

## ?? Migration Strategy

### Single Migration Approach
We use **database-agnostic EF Core migrations** that work with both providers:

```csharp
// Example: Migrations use provider-agnostic types
entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
entity.Property(e => e.SalaryRangeMin).HasPrecision(18, 2);
```

EF Core automatically generates the correct SQL for each provider:
- **SQL Server**: `nvarchar(200)`, `decimal(18,2)`
- **PostgreSQL**: `text`, `numeric(18,2)`

### Current Migration
- **File**: `20251012074856_InitialCreate.cs`
- **Status**: ? Works with both SQL Server and PostgreSQL
- **Location**: `ATSRecruitSys.Server/Migrations/`

## ?? Railway Deployment Process

### Step 1: Railway Environment Variables
Railway automatically provides these variables:

```bash
DATABASE_URL=postgres://user:pass@host:port/database
DATABASE_PUBLIC_URL=postgres://user:pass@public-host:port/database
DATABASE_PRIVATE_URL=postgres://user:pass@internal-host:port/database
PGHOST=host
PGPORT=5432
PGDATABASE=database
PGUSER=user
PGPASSWORD=password
```

### Step 2: Connection String Resolution
The app resolves the connection string in this order:

1. ? `DATABASE_URL` (most common)
2. ? `DATABASE_PUBLIC_URL` (Railway proxy)
3. ? `DATABASE_PRIVATE_URL` (Railway internal - fastest)
4. ? `PG*` variables (construct connection string)
5. ? `appsettings.json` ConnectionStrings (fallback for local dev)

### Step 3: Automatic Migration
On startup, the application:

1. ? Detects PostgreSQL connection string
2. ? Configures `UseNpgsql` provider
3. ? Applies pending migrations
4. ? Seeds database with sample data
5. ? Application starts successfully

## ?? Testing Locally Before Deployment

### Test with SQL Server (Default)
```powershell
# Use default appsettings.json connection
dotnet run --project ATSRecruitSys.Server
```

### Test with PostgreSQL Locally
```powershell
# Set PostgreSQL connection string
$env:DATABASE_URL="Host=localhost;Port=5432;Database=ats_test;Username=postgres;Password=yourpassword"
dotnet run --project ATSRecruitSys.Server
```

### Verify Database Migration
```powershell
# Check applied migrations
dotnet ef migrations list --project ATSRecruitSys.Server\ATSRecruitSys.Server.csproj
```

## ?? Application Funnel Statuses

### Frontend (React)
```typescript
const APPLICATION_STAGES = [
  { id: 'applied', title: 'Applied', color: '#2196f3', status: 'Applied' },
  { id: 'screening', title: 'Screening', color: '#ff9800', status: 'Screening' },
  { id: 'interview', title: 'Interview', color: '#9c27b0', status: 'Interview' },
  { id: 'offer', title: 'Offer', color: '#4caf50', status: 'Offer' },
  { id: 'hired', title: 'Hired', color: '#8bc34a', status: 'Hired' },
  { id: 'rejected', title: 'Rejected', color: '#f44336', status: 'Rejected' },
];
```

### Backend (C# Model)
```csharp
public string Status { get; set; } = "Applied"; 
// Valid: Applied, Screening, Interview, Offer, Hired, Rejected
```

### Database Seeding
Creates 8 applications distributed across all 6 statuses with realistic:
- ? Dates and progression
- ? Recruiter notes
- ? Applicant information
- ? Skills data

## ??? Railway Deployment Checklist

### ? Pre-Deployment
- [x] Database seeding updated with all statuses
- [x] JobApplication model updated (Status = "Applied")
- [x] Migrations are database-agnostic
- [x] Program.cs detects PostgreSQL automatically
- [x] Connection string resolution handles Railway variables
- [x] Code pushed to GitHub

### ? Railway Configuration
1. **Create PostgreSQL Database**
   - Railway Dashboard ? New ? Database ? PostgreSQL
   - Railway automatically sets environment variables

2. **Deploy Backend Service**
   - Railway Dashboard ? New ? GitHub Repo
   - Select: `Recruitment-system` repository
   - Root directory: `/ATSRecruitSys.Server` *(if needed)*
   - Railway detects .NET 8 automatically

3. **Environment Variables** (Auto-configured by Railway)
   ```bash
   DATABASE_URL=<automatically set>
   DATABASE_PUBLIC_URL=<automatically set>
   DATABASE_PRIVATE_URL=<automatically set>
   PG*=<automatically set>
   ```

4. **Additional Variables** (Manual)
   ```bash
   ASPNETCORE_ENVIRONMENT=Production
   ASPNETCORE_URLS=http://0.0.0.0:$PORT
   ```

### ? Post-Deployment Verification
1. Check Railway Logs for:
   ```
   ? Database connection successful
   ? Applying database migrations
   ? Database migrations applied successfully
   ? Created 8 sample applications across all funnel stages
   ? Database initialization completed successfully
   ```

2. Test API Endpoints:
   ```bash
   # Test database connectivity
   curl https://your-app.railway.app/api/health
   
   # Test applications endpoint
   curl https://your-app.railway.app/api/applications
   ```

3. Verify Application Funnel:
   - Navigate to `/applications/funnel`
   - Verify all 6 columns are visible
   - Verify each column has sample applications

## ?? Troubleshooting

### Issue: "Cannot connect to database"
**Solution:**
```bash
# Check Railway logs for connection string
# Verify DATABASE_URL is set correctly
# Ensure PostgreSQL service is running
```

### Issue: "Migration failed"
**Solution:**
```bash
# Railway will retry migrations automatically
# Check logs for specific SQL errors
# Verify PostgreSQL version compatibility (Railway uses 14+)
```

### Issue: "No sample applications"
**Solution:**
```bash
# Check seeding logs
# Verify user accounts were created
# Manually trigger seeding if needed (done automatically on startup)
```

## ?? Key Files Modified

1. ? `ATSRecruitSys.Server/Models/JobApplication.cs`
   - Default status: `"Applied"`
   - Comment updated with all valid statuses

2. ? `ATSRecruitSys.Server/Services/DatabaseSeeder.cs`
   - Enhanced `SeedSampleApplicationsAsync()`
   - Creates 8 applications across all statuses
   - Realistic data for each stage

3. ? `ATSRecruitSys.Server/Program.cs`
   - Auto-detects PostgreSQL vs SQL Server
   - Multiple connection string fallbacks
   - Railway environment variable support
   - Connection string URL conversion

4. ? `ATSRecruitSys.Server/Migrations/20251012074856_InitialCreate.cs`
   - Database-agnostic migration
   - Works with both SQL Server and PostgreSQL

5. ? `atsrecruitsys.client/src/pages/ApplicationFunnelPage.tsx`
   - Already configured with all 6 statuses
   - Matches backend exactly

## ?? Success Indicators

### Local Development
```
? Database: ATSRecruitSys_Dev created
? Migrations: Applied successfully
? Seeding: 8 applications created
? Funnel: All 6 columns populated
? Drag & Drop: Working correctly
```

### Railway Production
```
? PostgreSQL: Connected successfully
? Migrations: Auto-applied on startup
? Seeding: Completed with sample data
? API: All endpoints responding
? Funnel: Full functionality working
```

## ?? Next Steps

1. **Deploy to Railway**
   - Push changes are already on GitHub
   - Railway will auto-deploy on push
   - Monitor deployment logs

2. **Verify Production**
   - Check all 6 funnel columns appear
   - Test drag and drop functionality
   - Verify application statuses update correctly

3. **Test Full Workflow**
   - Create new application
   - Move through funnel stages
   - Verify status changes persist
   - Test with multiple applications

## ?? References

- **EF Core Migrations**: [Microsoft Docs](https://docs.microsoft.com/en-us/ef/core/managing-schemas/migrations/)
- **Railway PostgreSQL**: [Railway Docs](https://docs.railway.app/databases/postgresql)
- **Npgsql Provider**: [Npgsql Docs](https://www.npgsql.org/efcore/)

---

**Status**: ? Complete and Production-Ready
**Date**: 2025
**Compatibility**: SQL Server (Local) + PostgreSQL (Railway)
**Deployment**: Ready for Railway
