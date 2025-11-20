# ATS Recruitment System

A modern, full-stack Applicant Tracking System (ATS) built with .NET 8 and React, designed for South African recruitment needs with Employment Equity compliance.

## Features

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

## Tech Stack

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

## Default Accounts

The system comes pre-seeded with test accounts:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@atsrecruitsys.com` | `Admin123!` |
| **Recruiter** | `recruiter@test.com` | `Test123!` |
| **HiringManager** | `hiringmanager@test.com` | `Test123!` |
| **Applicant** | `applicant@test.com` | `Test123!` |

## Security

- **JWT Authentication**: Tokens expire after 7 days
- **Password Hashing**: ASP.NET Core Identity with secure hashing
- **CORS Protection**: Configured for production domains
- **Role-Based Authorization**: Endpoint protection by user role
- **Audit Logging**: All CRUD operations logged

## Database
The system uses an **in-memory database** for demo purposes.

### Sample Data Included
- 5 Job postings across departments
- 8 Applications in various stages
- 4 User accounts (all roles)
- Audit log entries

## Acknowledgments

- Built for South African recruitment needs
- Compliant with Employment Equity Act
- Designed for ease of use and accessibility
