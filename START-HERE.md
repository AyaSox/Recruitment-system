# ?? QUICK START - React + .NET Core

## Blazor Removed ? - React Only Architecture

---

## Start the Application (3 Methods)

### Method 1: Automated Script (Easiest)
```powershell
.\start-servers.ps1
```

### Method 2: Manual (2 Terminals)

**Terminal 1 - Backend:**
```powershell
cd ATSRecruitSys.Server
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd atsrecruitsys.client
npm run dev
```

### Method 3: VSCode Launch
Press `F5` or use the Run/Debug panel

---

## Access URLs

| Service | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:5041 |
| **Swagger Docs** | http://localhost:5041/swagger |
| **Hangfire** | http://localhost:5041/hangfire |

---

## Default Login

```
Email: admin@atsrecruitsys.com
Password: Admin123!
```

---

## Project Structure

```
ATSRecruitSys/
??? ATSRecruitSys.Server/     # .NET Core 8 Backend
?   ??? dotnet run            # Start on port 5041
?
??? atsrecruitsys.client/     # React Frontend
    ??? npm run dev           # Start on port 5173
```

---

## Common Commands

### Backend
```powershell
# Restore packages
dotnet restore

# Build
dotnet build

# Run
dotnet run

# Run tests
dotnet test

# Database migrations
dotnet ef database update

# Create migration
dotnet ef migrations add MigrationName
```

### Frontend
```powershell
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm run test

# Lint code
npm run lint

# Type check
npm run type-check
```

---

## Tech Stack

**Frontend:**
- React 18 + TypeScript
- Material-UI
- Vite
- Axios
- React Router

**Backend:**
- .NET Core 8
- EF Core + SQL Server
- JWT Authentication
- SignalR
- Hangfire

---

## Features Available

? Authentication (JWT)  
? Job Management  
? Application Tracking  
? Interview Scheduling  
? Candidate Profiles  
? Dashboard & Analytics  
? Resume Parsing  
? Real-time Notifications  
? Email System  
? Audit Logging  
? Multi-language  
? Theme Toggle  
? Mobile Responsive  

---

## Verification

? Blazor removed  
? React frontend working  
? Backend API running  
? Build successful  
? No errors  

---

## Need Help?

1. Check `README.md`
2. Review `REACT-ONLY-ARCHITECTURE-COMPLETE.md`
3. See `troubleshooting-guide.md`
4. Check console logs

---

**Status**: Ready to Use ?  
**Last Updated**: January 2025
