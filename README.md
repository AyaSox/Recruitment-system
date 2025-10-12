# ATS Recruitment System

A full-stack Applicant Tracking System built with .NET 8 (Web API) and React (TypeScript).

## Live URLs

- Frontend: https://recruitment-system-six.vercel.app/
- Backend API: https://recruitment-system-production-7f72.up.railway.app/

## Features

- JWT authentication with role-based access (Admin, Recruiter, Hiring Manager, Applicant)
- Job management (create, edit, approve, publish)
- Application management with hiring funnel (Applied, Screening, Interview, Offer, Hired/Rejected)
- Dashboard with basic analytics and charts
- South African context (major city locations, departments, ZAR currency)
- Audit logging and basic exports
- Built-in AI Chatbot widget for quick help and navigation

## Project Structure

```
ATSRecruitSys/
- ATSRecruitSys.Server/            .NET 8 Web API
  - Controllers/                   API endpoints
  - Services/                      Business logic
  - Models/                        Data models
  - DTOs/                          Data transfer objects
  - Data/                          EF Core DbContext
  - Migrations/                    Database migrations

- atsrecruitsys.client/            React TypeScript frontend
  - src/
    - components/
    - pages/
    - services/
    - context/
    - types/
  - public/

- screenshots/                     Documentation screenshots
```

## Getting Started

Prerequisites:
- .NET 8 SDK
- Node.js 18+
- PostgreSQL (production) or SQL Server (dev)

Backend:
```
cd ATSRecruitSys.Server
# Configure connection string in appsettings.json
# Run migrations
 dotnet ef database update
# Start API
 dotnet run
```
API: https://localhost:7249

Frontend:
```
cd atsrecruitsys.client
npm install
npm run dev
```
App: http://localhost:5173

## Chatbot Widget

The frontend includes a lightweight in-app Chatbot to guide users with quick tips and links to common actions.

- Component: `atsrecruitsys.client/src/components/ChatWidget.tsx`
- Mounted via the shared `Layout` component so it is available across pages
- Client-only, no backend dependency
- Easy to customize canned responses

To disable or customize, edit `ChatWidget.tsx` or remove it from `Layout`.

## Screenshots

Below images are loaded directly from the `screenshots` folder. If any image does not render, add the matching file into the folder or update the name here.

### Admin Dashboard
![Admin Dashboard](screenshots/Dashboard.PNG)

### Jobs (Public View)
![Jobs Page - Public](screenshots/Homepage.PNG)

### Applications Management
![Applications Management](screenshots/Applications%20Management.PNG)

### User Management
![User Management](screenshots/User%20Management%20Overview.PNG)

### Reports
![Reports Page](screenshots/Reports%20Overview.PNG)

## Sample Accounts

- Admin: admin@atsrecruitsys.com / Admin123!
- Recruiter: recruiter@test.com / Test123!
- Hiring Manager: hiringmanager@test.com / Test123!
- Applicant: applicant@test.com / Test123!

## Environment

Backend (appsettings or environment variables):
- DATABASE_URL (PostgreSQL) or DefaultConnection
- JwtSettings__SecretKey

Frontend (.env.*):
- VITE_API_URL (backend base URL)

## License

MIT