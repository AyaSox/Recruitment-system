# ATS Recruitment System

A comprehensive Applicant Tracking System built with ASP.NET Core 8 and React + TypeScript.

## Features

### Core Features
- **User Authentication**: Secure login and registration with JWT and role-based access control (Admin, Recruiter, Applicant)
- **Job Management**: Create, edit, publish, and manage job postings with approval workflow
- **Application Tracking**: Track job applications through various recruitment stages
- **Interview Management**: Schedule, reschedule, and track interviews with calendar integration
- **Candidate Profiles**: Comprehensive profile management with skills, work experience, education, and certifications
- **Dashboard and Analytics**: Visual analytics for recruitment metrics with real-time updates

### Advanced Features
- **Application Funnel**: Kanban-style board for visualizing application pipeline
- **Resume Parsing**: AI-powered resume parsing and data extraction
- **Job Recommendations**: Smart matching of candidates to jobs based on skills and experience
- **Talent Pool**: Curated pool of pre-screened candidates
- **Real-time Notifications**: SignalR-powered instant updates for application status changes
- **Audit Logging**: Comprehensive audit trail for compliance and security
- **Email System**: Automated notifications with customizable templates
- **Advanced Search**: Powerful filtering and search across jobs and applications
- **Multi-language Support**: Internationalization ready (English, Afrikaans, Zulu)
- **Theme Support**: Light and dark mode with Material Design
- **Mobile Responsive**: Optimized for desktop, tablet, and mobile devices
- **Export Capabilities**: Export reports to CSV and PDF

### South African Specific Features
- **Employment Equity**: Built-in support for SA Employment Equity Act compliance
- **ID Number Validation**: South African ID number format validation
- **Demographics**: Race, gender, and disability tracking for EE reporting
- **Provinces & Cities**: Pre-configured SA locations
- **Currency**: ZAR (South African Rand) support

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **Database**: Entity Framework Core with SQL Server
- **Authentication**: ASP.NET Core Identity with JWT tokens
- **Background Jobs**: Hangfire for scheduled tasks
- **Email**: MailKit for SMTP email services
- **Real-time**: SignalR for WebSocket connections
- **Architecture**: Repository pattern with Unit of Work
- **API Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios with interceptors
- **Routing**: React Router v6
- **State Management**: React Context + Hooks
- **Forms**: React Hook Form + Yup validation
- **Charts**: Chart.js with react-chartjs-2
- **Real-time**: @microsoft/signalr

## Getting Started

### Prerequisites
- **.NET 8.0 SDK** or later
- **SQL Server** (LocalDB, Express, or full version)
- **Node.js 18+** and npm/yarn
- **Git** for version control

### Quick Start

#### Option 1: Automated Script (Windows)
```powershell
.\start-servers.ps1
```

#### Option 2: Manual Setup

**Terminal 1 - Backend:**
```powershell
cd ATSRecruitSys.Server
dotnet restore
dotnet run
```

**Terminal 2 - Frontend:**
```powershell
cd atsrecruitsys.client
npm install
npm run dev
```

### Access Points
- **Frontend Application**: http://localhost:5173
- **Backend API**: http://localhost:5041
- **Swagger Documentation**: http://localhost:5041/swagger
- **Hangfire Dashboard**: http://localhost:5041/hangfire (Admin only)

### Database Setup

The application uses Code-First migrations. The database will be created automatically on first run.

To manually apply migrations:
```powershell
cd ATSRecruitSys.Server
dotnet ef database update
```

### Initial Login Credentials

Default admin user (created on first run):
- **Email**: admin@atsrecruitsys.com (Production) or admin@example.com (Development)
- **Password**: Admin123!

**?? Important**: Change the default password immediately after first login!

### Seeded Test Data

The application seeds test data in development mode:
- Jobs (10 sample job postings)
- Candidates (5 test candidates)
- Applications (Sample applications in various stages)
- Skills (30+ technical and soft skills)

## Project Structure

### Backend Structure
```
ATSRecruitSys.Server/
??? Controllers/           # REST API endpoints
??? Services/              # Business logic layer
?   ??? EmailService.cs
?   ??? JobService.cs
?   ??? ApplicationService.cs
?   ??? ...
??? Repositories/          # Data access layer
??? Models/                # Entity models
??? DTOs/                  # Data Transfer Objects
??? Data/                  # EF Core DbContext
??? Hubs/                  # SignalR hubs
??? Configuration/         # App settings classes
??? Exceptions/            # Custom exceptions
??? Migrations/            # EF Core migrations
??? Program.cs             # Application startup
```

### Frontend Structure
```
atsrecruitsys.client/
??? public/                # Static assets
??? src/
?   ??? components/        # Reusable UI components
?   ?   ??? Layout.tsx
?   ?   ??? Navbar.tsx
?   ?   ??? JobCard.tsx
?   ?   ??? ...
?   ??? pages/             # Route-based pages
?   ?   ??? LoginPage.tsx
?   ?   ??? DashboardPage.tsx
?   ?   ??? JobsPage.tsx
?   ?   ??? ...
?   ??? services/          # API service clients
?   ?   ??? api.ts         # Axios instance
?   ?   ??? auth.service.ts
?   ?   ??? job.service.ts
?   ?   ??? ...
?   ??? context/           # React Context providers
?   ?   ??? AuthContext.tsx
?   ?   ??? ThemeContext.tsx
?   ?   ??? ...
?   ??? hooks/             # Custom React hooks
?   ??? types/             # TypeScript interfaces
?   ??? App.tsx            # Main app component
?   ??? main.tsx           # Application entry
??? package.json           # Dependencies
??? tsconfig.json          # TypeScript config
??? vite.config.ts         # Vite config
```

## Configuration

### Backend Configuration

Edit `appsettings.json` or `appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ATSRecruitSys;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "JwtSettings": {
    "Secret": "your-secret-key-here-min-32-chars",
    "Issuer": "ATSRecruitSys",
    "Audience": "ATSRecruitSysUsers",
    "ExpirationMinutes": 60
  },
  "EmailSettings": {
    "SmtpServer": "smtp.gmail.com",
    "SmtpPort": 587,
    "SmtpUsername": "your-email@gmail.com",
    "SmtpPassword": "your-app-password",
    "FromEmail": "noreply@atsrecruitsys.com",
    "FromName": "ATS Recruitment System",
    "EnableEmailNotifications": true
  }
}
```

### Frontend Configuration

Create `.env.development` and `.env.production`:

```env
# .env.development
VITE_API_BASE_URL=http://localhost:5041

# .env.production
VITE_API_BASE_URL=https://api.yourcompany.com
```

## User Roles

1. **Admin**
   - Full system access
   - User management
   - System configuration
   - Job approval
   - Advanced analytics

2. **Recruiter**
   - Create and manage jobs
   - View and manage applications
   - Schedule interviews
   - Access candidate profiles
   - Generate reports

3. **Applicant (Job Seeker)**
   - Browse and apply for jobs
   - Manage profile
   - Track application status
   - Upload documents
   - Receive notifications

## API Documentation

The API is fully documented using Swagger/OpenAPI. Access the interactive documentation at:
- Development: http://localhost:5041/swagger
- Production: https://your-api-url/swagger

### Example API Endpoints

```
Authentication
  POST   /api/auth/register
  POST   /api/auth/login
  POST   /api/auth/refresh-token

Jobs
  GET    /api/jobs
  GET    /api/jobs/{id}
  POST   /api/jobs
  PUT    /api/jobs/{id}
  DELETE /api/jobs/{id}

Applications
  GET    /api/applications
  GET    /api/applications/{id}
  POST   /api/applications
  PUT    /api/applications/{id}/status

Interviews
  GET    /api/interviews
  POST   /api/interviews
  PUT    /api/interviews/{id}
```

## Development

### Running Tests

**Backend:**
```powershell
cd ATSRecruitSys.Server
dotnet test
```

**Frontend:**
```powershell
cd atsrecruitsys.client
npm run test
```

### Code Quality

**Frontend Linting:**
```powershell
npm run lint
npm run lint:fix
```

**Frontend Type Checking:**
```powershell
npm run type-check
```

### Database Migrations

**Create a new migration:**
```powershell
dotnet ef migrations add MigrationName
```

**Update database:**
```powershell
dotnet ef database update
```

**Rollback migration:**
```powershell
dotnet ef database update PreviousMigrationName
```

## Deployment

### Backend Deployment (Azure App Service)

1. Publish the application:
```powershell
cd ATSRecruitSys.Server
dotnet publish -c Release -o ./publish
```

2. Deploy the `publish` folder to Azure App Service

3. Set environment variables in Azure:
   - Connection strings
   - JWT settings
   - Email configuration

### Frontend Deployment (Netlify/Vercel)

1. Build the application:
```powershell
cd atsrecruitsys.client
npm run build
```

2. Deploy the `dist` folder to your hosting provider

3. Configure environment variables:
   - `VITE_API_BASE_URL` = Your production API URL

## Troubleshooting

### Common Issues

**Backend won't start:**
- Verify SQL Server is running
- Check connection string in appsettings.json
- Ensure .NET 8 SDK is installed

**Frontend won't start:**
- Delete `node_modules` and run `npm install`
- Clear npm cache: `npm cache clean --force`
- Check Node.js version: `node -v` (should be 18+)

**CORS errors:**
- Verify `AllowedOrigins` in appsettings.json includes your frontend URL
- Check that backend is running on correct port

**Database errors:**
- Apply latest migrations: `dotnet ef database update`
- Check SQL Server connection in Server Explorer

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write or update tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, questions, or suggestions:
- Create an issue on GitHub
- Contact the development team
- Check the documentation

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: Production Ready ?