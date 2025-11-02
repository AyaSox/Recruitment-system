# ATS Recruitment System

A modern, full-stack Applicant Tracking System (ATS) built with .NET 8 and React, designed for South African recruitment needs with Employment Equity compliance.

## ?? Features

### Core Functionality
- **Job Management**: Create, edit, and publish job postings
- **Application Tracking**: Manage candidate applications through recruitment stages
- **Application Funnel**: Visual drag-and-drop interface for status updates
- **Dashboard Analytics**: Real-time recruitment metrics and reporting
- **User Management**: Role-based access control (Admin, Recruiter, HiringManager, Applicant)
- **Audit Logging**: Complete activity tracking for compliance

### South African Compliance
- **Employment Equity**: Built-in Employment Equity position tracking
- **South African Locations**: Pre-configured with SA provinces and cities
- **Currency**: ZAR (Rand) salary ranges
- **Compliance Reporting**: Employment Equity analytics and reports

### Technical Features
- **JWT Authentication**: Secure token-based authentication
- **Real-time Updates**: Application status changes tracked in real-time
- **Responsive Design**: Mobile-first, works on all devices
- **File Upload**: Resume/CV upload with validation
- **Export Functionality**: Export reports to Excel

## ??? Tech Stack

### Backend
- **.NET 8** (C# 12.0)
- **ASP.NET Core Web API**
- **Entity Framework Core** (In-Memory Database for demo)
- **ASP.NET Core Identity** (Authentication & Authorization)
- **JWT Bearer Authentication**
- **Swagger/OpenAPI** (API Documentation)

### Frontend
- **React 18** with TypeScript
- **Vite** (Build tool)
- **Material-UI (MUI)** (UI Components)
- **Axios** (HTTP Client)
- **React Router** (Routing)
- **Context API** (State Management)

## ?? Installation

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [Git](https://git-scm.com/)

### Clone Repository
```bash
git clone https://github.com/AyaSox/Recruitment-system.git
cd Recruitment-system
```

### Backend Setup
```bash
cd ATSRecruitSys.Server
dotnet restore
dotnet build
dotnet run
```

Backend will run on: `http://localhost:5274`

### Frontend Setup
```bash
cd atsrecruitsys.client
npm install
npm run dev
```

Frontend will run on: `http://localhost:5173`

## ?? Default Accounts

The system comes pre-seeded with test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@atsrecruitsys.com` | `Admin123!` |
| **Recruiter** | `recruiter@test.com` | `Test123!` |
| **HiringManager** | `hiringmanager@test.com` | `Test123!` |
| **Applicant** | `applicant@test.com` | `Test123!` |

## ?? Deployment

### Render (Free Tier)

1. **Backend Deployment:**
   - Create new **Web Service** on Render
   - Runtime: **Docker**
   - Connect your GitHub repository
   - Environment Variables:
     ```
     ASPNETCORE_ENVIRONMENT=Production
     ASPNETCORE_URLS=http://+:10000
     JWT_SECRET_KEY=YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!
     JWT_ISSUER=ATSRecruitSys
     JWT_AUDIENCE=ATSRecruitSys
     ```

2. **Frontend Deployment:**
   - Create new **Static Site** on Render
   - Build Command: `cd atsrecruitsys.client && npm install && npm run build`
   - Publish Directory: `atsrecruitsys.client/dist`
   - Environment Variables:
     ```
     VITE_API_URL=https://your-backend.onrender.com
     ```

### Railway

1. **Backend:**
   - Deploy from GitHub
   - Select `ATSRecruitSys.Server` directory
   - Set same environment variables as Render

2. **Frontend:**
   - Deploy from GitHub
   - Select `atsrecruitsys.client` directory
   - Set `VITE_API_URL` to your backend URL

## ?? API Documentation

Once the backend is running, access Swagger UI at:
```
http://localhost:5274/swagger
```

Or on production:
```
https://your-backend-url.onrender.com/swagger
```

## ?? Security

- **JWT Authentication**: Tokens expire after 7 days
- **Password Hashing**: ASP.NET Core Identity with secure hashing
- **CORS Protection**: Configured for production domains
- **Role-Based Authorization**: Endpoint protection by user role
- **Audit Logging**: All CRUD operations logged

## ?? Database

The system uses an **in-memory database** for demo purposes:
- ? **Pros**: No setup required, perfect for testing
- ?? **Note**: Data resets on application restart
- ?? **Production**: Replace with PostgreSQL/SQL Server for persistence

### Sample Data Included
- 5 Job postings across departments
- 8 Applications in various stages
- 4 User accounts (all roles)
- Audit log entries

## ?? Testing

### Frontend Tests
```bash
cd atsrecruitsys.client
npm run test
```

### Backend Tests
```bash
cd ATSRecruitSys.Server
dotnet test
```

## ?? Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ?? License

This project is licensed under the MIT License - see the LICENSE file for details.

## ?? Author

**Aya Sox**
- GitHub: [@AyaSox](https://github.com/AyaSox)
- Repository: [Recruitment-system](https://github.com/AyaSox/Recruitment-system)

## ?? Acknowledgments

- Built for South African recruitment needs
- Compliant with Employment Equity Act
- Designed for ease of use and accessibility

## ?? Support

For issues, questions, or suggestions:
- Open an [issue](https://github.com/AyaSox/Recruitment-system/issues)
- Check existing [documentation](https://github.com/AyaSox/Recruitment-system/wiki)

---

**Status**: ? Production Ready | **Version**: 2.0.0 | **Last Updated**: January 2025