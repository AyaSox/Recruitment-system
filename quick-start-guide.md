# Quick Start Guide - ATS Recruitment System

## Prerequisites
- Node.js (v16 or higher)
- npm (comes with Node.js)
- .NET 8 SDK (for the backend server)

## Client Application Setup

### Option 1: Using the PowerShell Script (Recommended)
```powershell
# Run from the root directory
.\install-client-dependencies.ps1
```

### Option 2: Manual Installation
```bash
# Navigate to client directory
cd atsrecruitsys.client

# Remove existing node_modules and package-lock.json (if they exist)
rm -rf node_modules package-lock.json

# Clear npm cache
npm cache clean --force

# Install dependencies
npm install
```

## Running the Application

### Start the Client (React/Vite)
```bash
cd atsrecruitsys.client
npm run dev
```
The client will run on `http://localhost:5173` (or another port if 5173 is busy)

### Start the Server (.NET 8)
```bash
cd ATSRecruitSys.Server
dotnet run
```
The server will run on `https://localhost:7242` and `http://localhost:5000`

## Build Commands

### Development Build
```bash
cd atsrecruitsys.client
npm run dev
```

### Production Build
```bash
cd atsrecruitsys.client
npm run build
```

### Preview Production Build
```bash
cd atsrecruitsys.client
npm run preview
```

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - All TypeScript errors have been resolved
   - If you encounter new ones, check that all dependencies are installed

2. **Port Conflicts**
   - Client default port: 5173
   - Server default port: 7242 (HTTPS), 5000 (HTTP)
   - Vite will automatically use the next available port if 5173 is busy

3. **CORS Issues**
   - The server should be configured to allow requests from the client
   - Make sure both client and server are running

4. **Module Resolution Errors**
   - Run `npm install` again
   - Clear node_modules and reinstall if issues persist

### Security Vulnerabilities
After installation, you may see warnings about vulnerabilities:
```bash
npm audit fix
```

## Available Routes

### Public Routes
- `/` - Welcome/Home page
- `/login` - User login
- `/register` - User registration
- `/jobs` - Public job listings
- `/jobs/:id` - Job details

### Protected Routes (Admin/Recruiter)
- `/dashboard` - Admin/Recruiter dashboard
- `/applications` - Manage applications
- `/interviews` - Manage interviews
- `/jobs/create` - Create new job
- `/jobs/edit/:id` - Edit job

### Protected Routes (Applicant)
- `/my-applications` - View own applications
- `/jobs/apply/:id` - Apply for a job

## Test Accounts
As mentioned in the LoginPage, you can use these test accounts:
- **Admin**: admin@atsrecruit.com / Admin@123
- **Recruiter**: thabo.nkosi@atsrecruit.com / Recruit@123  
- **Applicant**: sipho.ndlovu@example.com / Applicant@123

## Additional Information
- The application uses Material-UI for the user interface
- React Router for navigation
- Axios for API communication
- Formik and Yup for form handling and validation
- Chart.js for data visualization