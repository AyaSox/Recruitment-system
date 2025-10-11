# Running the ATS Recruitment System

This document provides instructions for running and developing the ATS Recruitment System application.

## Prerequisites

- .NET 8.0 SDK
- SQL Server (or SQL Server Express)
- Node.js and npm

## Development Setup

### Backend Setup

1. Make sure you have the .NET 8 SDK installed
2. Navigate to the server project directory:
   ```
   cd ATSRecruitSys.Server
   ```
3. Restore the packages:
   ```
   dotnet restore
   ```
4. Run the API:
   ```
   dotnet run
   ```
5. The API will be available at https://localhost:7219 (or your configured port)
6. Swagger documentation will be available at https://localhost:7219/swagger

### Frontend Setup

1. Make sure you have Node.js and npm installed
2. Navigate to the client project directory:
   ```
   cd atsrecruitsys.client
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Run the development server:
   ```
   npm run dev
   ```
5. The React application will be available at https://localhost:52889 (or your configured port)

## Running the Full Application

You can run both the backend and frontend together using Visual Studio:

1. Open the solution file (`ATSRecruitSys.sln`) in Visual Studio
2. Make sure the startup project is set to `ATSRecruitSys.Server`
3. Press F5 or click the "Start" button
4. Visual Studio will launch both the backend API and the frontend SPA

## Database Setup

By default, the application uses a LocalDB instance for development. If you need to use a different database:

1. Update the connection string in `appsettings.json` or `appsettings.Development.json`
2. The application will create the database schema automatically on first run

## Initial Login

When you first run the application, a default admin user is created:

- **Email**: admin@example.com (development) or admin@atsrecruitsys.com (production)
- **Password**: Admin123!

Make sure to change this password after the first login.

## Hangfire Dashboard

The application uses Hangfire for background processing. You can access the Hangfire dashboard at:

https://localhost:7219/hangfire

In development mode, the dashboard is accessible without authentication. In production, you need to be authenticated as an Admin or Recruiter user.

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Check that your SQL Server instance is running
   - Verify the connection string in appsettings.json
   - Make sure you have appropriate permissions for the database

2. **Frontend Package Issues**
   - If you get errors about missing modules, try:
     ```
     npm clean-install
     ```

3. **TypeScript Errors**
   - If you encounter TypeScript errors during development, you can temporarily relax the type checking by modifying tsconfig.app.json as described in the dependencies.md file

4. **CORS Issues**
   - If you're running the frontend and backend separately and encounter CORS issues, make sure the frontend origin is included in the AllowedOrigins configuration in appsettings.json

### Getting Help

If you encounter any issues not covered here, please check the project documentation or open an issue in the project repository.