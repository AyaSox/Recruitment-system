# ?? ATS Recruitment System

A modern, full-stack **Applicant Tracking System** built with **.NET 8** and **React**, designed for South African recruitment needs.

[![.NET Version](https://img.shields.io/badge/.NET-8.0-512BD4)](https://dotnet.microsoft.com/)
[![React](https://img.shields.io/badge/React-18.x-61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

## ? Features

### ?? Authentication & Authorization
- JWT-based secure authentication
- Role-based access control (Admin, Recruiter, Hiring Manager, Applicant)
- User management with role assignment

### ?? Job Management
- Create, edit, and publish job postings
- Job approval workflow
- Department and location-specific jobs
- Employment type and experience level filtering

### ?? Application Processing
- External candidate application submission
- Resume upload (.pdf, .doc, .docx)
- Application status tracking through recruitment funnel:
  - Applied ? Screening ? Interview ? Offer ? Hired/Rejected
- Drag-and-drop application funnel interface
- Applicant notes and recruiter feedback

### ?? Dashboard & Analytics
- Real-time recruitment statistics
- Application status distribution charts
- Department-wise analytics
- Employment type and experience level breakdowns
- Job performance metrics

### ?? South African Context
- Local locations (Johannesburg, Cape Town, Durban, etc.)
- Department-specific hiring
- South African Rand (ZAR) currency
- Employment equity reporting ready

### ?? Additional Features
- Application search and filtering
- Audit logging for compliance
- Email notifications
- Excel report exports
- Mobile-responsive design
- Dark/Light theme toggle

## ??? Technology Stack

### Backend
- **.NET 8** - Web API
- **Entity Framework Core** - ORM
- **PostgreSQL** - Production database
- **SQL Server** - Development database
- **ASP.NET Core Identity** - Authentication
- **JWT** - Token-based authentication

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **React Router** - Navigation
- **Recharts** - Data visualization

### Deployment
- **Railway** - Backend & Database hosting
- **Docker** - Containerization support
- **Vercel-ready** - Frontend deployment

## ?? Getting Started

### Prerequisites
- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/) or SQL Server

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/AyaSox/Recruitment-system.git
   cd Recruitment-system
   ```

2. **Backend Setup**
   ```bash
   cd ATSRecruitSys.Server
   
   # Update appsettings.json with your database connection
   # For PostgreSQL:
   # "DefaultConnection": "Host=localhost;Database=ATSRecruitDB;Username=postgres;Password=yourpassword"
   
   # Run migrations
   dotnet ef database update
   
   # Start the API
   dotnet run
   ```
   Backend will run on `https://localhost:7249`

3. **Frontend Setup**
   ```bash
   cd atsrecruitsys.client
   
   # Install dependencies
   npm install
   
   # Start development server
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Default Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@atsrecruitsys.com | Admin123! |
| Recruiter | recruiter@test.com | Test123! |
| Hiring Manager | hiringmanager@test.com | Test123! |
| Applicant | applicant@test.com | Test123! |

## ?? Project Structure

```
ATSRecruitSys/
??? ATSRecruitSys.Server/          # .NET 8 Web API
?   ??? Controllers/               # API endpoints
?   ??? Services/                  # Business logic
?   ??? Models/                    # Data models
?   ??? DTOs/                      # Data transfer objects
?   ??? Data/                      # EF Core DbContext
?   ??? Migrations/                # Database migrations
?
??? atsrecruitsys.client/          # React TypeScript Frontend
?   ??? src/
?   ?   ??? components/            # Reusable components
?   ?   ??? pages/                 # Page components
?   ?   ??? services/              # API services
?   ?   ??? context/               # React context
?   ?   ??? types/                 # TypeScript types
?   ??? public/                    # Static assets
?
??? screenshots/                   # Application screenshots
```

## ?? Deployment

### Railway (Backend + PostgreSQL)
1. Create a Railway project
2. Add PostgreSQL database service
3. Set environment variable: `DATABASE_URL` (automatically set by Railway)
4. Deploy from GitHub repository
5. Railway will auto-detect .NET 8 and build

### Vercel (Frontend - Optional)
1. Create Vercel project
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=<your-railway-backend-url>`
5. Deploy

## ?? Screenshots

See the [screenshots](./screenshots) folder for application previews.

## ?? Configuration

### Environment Variables

**Backend (`appsettings.json` or Railway env vars):**
- `DATABASE_URL` - PostgreSQL connection string (Railway provides this)
- `JwtSettings__SecretKey` - JWT secret key
- `EmailSettings__*` - Email configuration (optional)

**Frontend (`.env.production`):**
- `VITE_API_URL` - Backend API URL

## ?? API Documentation

When running in development, Swagger UI is available at:
```
https://localhost:7249/swagger
```

## ?? Testing

### Backend Tests
```bash
cd ATSRecruitSys.Server
dotnet test
```

### Frontend Tests
```bash
cd atsrecruitsys.client
npm test
```

## ?? Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## ?? License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ?? Authors

- **AyaSox** - [GitHub Profile](https://github.com/AyaSox)

## ?? Acknowledgments

- Built with [.NET 8](https://dotnet.microsoft.com/)
- UI powered by [Material-UI](https://mui.com/)
- Hosted on [Railway](https://railway.app/)
- Icons from [Material Design Icons](https://materialdesignicons.com/)

## ?? Support

For support, email your-email@example.com or open an issue in the GitHub repository.

## ??? Roadmap

- [ ] Resume parsing with AI
- [ ] Interview scheduling integration
- [ ] Advanced analytics and reporting
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Integration with LinkedIn
- [ ] Video interview capabilities

---

**Built with ?? for South African Recruiters**