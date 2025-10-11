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

### Prerequisites
- GitHub account
- Railway account (free tier available)

### Deploy Steps

1. Fork or clone this repository to your GitHub account

2. Go to [Railway](https://railway.app) and sign up with GitHub

3. Create a new project and deploy from your GitHub repository

4. Add a PostgreSQL database:
   - Click "New" in your Railway project
   - Select "Database" ? "PostgreSQL"

5. Configure environment variables in Railway:
```
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=${{Postgres.DATABASE_URL}}
JwtSettings__SecretKey=your-32-character-secret-key
JwtSettings__Issuer=ATSRecruitSys
JwtSettings__Audience=ATSRecruitSysUsers
```

6. Railway will automatically build and deploy your application

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
?   ?   ??? components/            # React components
?   ?   ??? pages/                 # Page components
?   ?   ??? services/              # API services
?   ?   ??? types/                 # TypeScript definitions
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