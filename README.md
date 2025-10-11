# ATS Recruitment System

A comprehensive Applicant Tracking System built with .NET 8 and React, designed specifically for South African recruitment needs.

## Features

### Core Functionality
- Job posting and management
- Application tracking and processing
- User management with role-based access
- Dashboard with analytics and reporting
- Audit logging for compliance
- File upload and document management

### South African Compliance Features
- Employment Equity reporting
- South African provinces and locations
- Local qualification levels
- Multi-language support
- Currency handling (ZAR)

### Advanced Features
- Real-time notifications
- Application funnel visualization
- Department-wise analytics
- Export capabilities (Excel)
- Mobile-responsive design
- Dark/Light theme toggle
- AI chat widget for assistance

## Technology Stack

### Backend (.NET 8)
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL/SQL Server
- JWT Authentication
- ASP.NET Core Identity
- Swagger/OpenAPI

### Frontend (React)
- React 18 with TypeScript
- Material-UI (MUI)
- Vite build tool
- Chart.js for analytics
- Axios for API calls
- React Router for navigation

## Screenshots

![Homepage](screenshots/Homepage.PNG)
*Homepage with job listings*

![Dashboard](screenshots/Dashboard.PNG)
*Admin dashboard with analytics*

![Job Management](screenshots/Jobs%20Management.PNG)
*Job creation and management interface*

![Application Management](screenshots/Applications%20Management.PNG)
*Application tracking and processing*

![Reports](screenshots/Reports%20Overview.PNG)
*Comprehensive reporting system*

![User Management](screenshots/User%20Management%20Overview.PNG)
*User and role management*

## Quick Start

### Prerequisites
- .NET 8 SDK
- Node.js 18+ and npm
- PostgreSQL or SQL Server

### Local Development

1. Clone the repository
```bash
git clone https://github.com/AyaSox/Recruitment-system.git
cd Recruitment-system
```

2. Backend Setup
```bash
cd ATSRecruitSys.Server
dotnet restore
dotnet ef database update
dotnet run
```

3. Frontend Setup
```bash
cd atsrecruitsys.client
npm install
npm run dev
```

4. Access the application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Swagger UI: http://localhost:5000/swagger

### Default Login
- Email: admin@atsrecruitsys.com
- Password: Admin123!

## Deployment to Railway

This project is configured for easy deployment to Railway.

### Quick Deploy (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/AyaSox/Recruitment-system)

Click the button above to deploy directly to Railway!

### Manual Deployment

#### Prerequisites
- GitHub account
- Railway account (free tier available)

#### If Repository Not Found in Railway:

**Option A: Make Repository Public**
1. Go to your GitHub repository: https://github.com/AyaSox/Recruitment-system
2. Click "Settings" (repository settings, not your profile)
3. Scroll to "Danger Zone" at the bottom
4. Click "Change visibility" ? "Make public"
5. Return to Railway and try again

**Option B: Grant Railway Access**
1. In Railway, click your profile picture
2. Go to "Account Settings" ? "Integrations"
3. Click "Configure" next to GitHub
4. Grant Railway access to your repositories
5. Make sure "AyaSox/Recruitment-system" is selected

**Option C: Deploy via Empty Project**
1. In Railway, click "New Project"
2. Select "Empty Project"
3. Click "Deploy from GitHub repo"
4. If still not showing, type the full URL: https://github.com/AyaSox/Recruitment-system

#### Deploy Steps

1. Add a PostgreSQL database:
   - Click "New" in your Railway project
   - Select "Database" then "PostgreSQL"

2. Configure environment variables in Railway:
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=${{Postgres.DATABASE_URL}}
JwtSettings__SecretKey=your-32-character-secret-key
JwtSettings__Issuer=ATSRecruitSys
JwtSettings__Audience=ATSRecruitSysUsers
```

3. Railway will automatically build and deploy your application

4. Generate domain: Go to Settings ? Networking ? Generate Domain

For detailed deployment instructions, see [RAILWAY-DEPLOYMENT-GUIDE.md](RAILWAY-DEPLOYMENT-GUIDE.md)

## Project Structure

```
ATSRecruitSys/
??? ATSRecruitSys.Server/          # .NET 8 Web API
?   ??? Controllers/               # API Controllers
?   ??? Models/                    # Data models
?   ??? Services/                  # Business logic
?   ??? Data/                      # Database context
?   ??? DTOs/                      # Data transfer objects
??? atsrecruitsys.client/          # React frontend
?   ??? src/
?       ??? components/            # React components
?       ??? pages/                 # Page components
?       ??? services/              # API services
?       ??? types/                 # TypeScript definitions
??? screenshots/                   # Application screenshots
??? railway.json                   # Railway deployment config
??? nixpacks.toml                  # Build configuration
```

## Key Features in Detail

### User Roles
- Admin: Full system access
- Recruiter: Job and application management  
- Hiring Manager: Department-specific access
- Applicant: Job browsing and application submission

### Application Workflow
1. Job creation and approval
2. Application submission with file upload
3. Application screening and status updates
4. Interview scheduling and management
5. Hiring decision and reporting

### Reporting and Analytics
- Application funnel visualization
- Department-wise statistics
- Employment equity reporting
- Export capabilities for compliance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue on GitHub or contact the development team.