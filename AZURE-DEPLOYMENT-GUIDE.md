# ATS Recruitment System - Azure Deployment Guide

## Prerequisites
1. Azure Account (? You have this)
2. Visual Studio or Visual Studio Code with Azure extensions
3. Azure CLI installed

## Option 1: Deploy via Visual Studio (Recommended for beginners)

### Step 1: Install Azure Tools
1. Open Visual Studio
2. Go to Tools ? Get Tools and Features
3. Install "Azure development" workload

### Step 2: Publish from Visual Studio
1. Right-click on `ATSRecruitSys.Server` project
2. Select "Publish..."
3. Choose "Azure" as target
4. Select "Azure App Service (Windows)" or "Azure App Service (Linux)"
5. Click "Create new Azure App Service"

### Step 3: Configure App Service
- **Subscription**: Choose your Azure subscription
- **Resource Group**: Create new (e.g., "rg-ats-recruitment")
- **App Service Plan**: Create new or use existing
- **Name**: Choose unique name (e.g., "ats-recruitment-yourname")
- **Region**: Choose closest to South Africa (e.g., "South Africa North")

### Step 4: Database Setup
1. In Azure Portal, create Azure SQL Database:
   - Resource Group: Same as app service
   - Server: Create new SQL server
   - Database name: "ats-recruitment-db"
   - Pricing: Basic or Standard tier

## Option 2: Deploy via Azure CLI

### Step 1: Install Azure CLI
Download from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

### Step 2: Login to Azure
```bash
az login
```

### Step 3: Create Resource Group
```bash
az group create --name rg-ats-recruitment --location "South Africa North"
```

### Step 4: Create App Service Plan
```bash
az appservice plan create --name asp-ats-recruitment --resource-group rg-ats-recruitment --sku B1
```

### Step 5: Create Web App
```bash
az webapp create --name ats-recruitment-yourname --resource-group rg-ats-recruitment --plan asp-ats-recruitment --runtime "DOTNET|8.0"
```

### Step 6: Deploy Code
```bash
# Build and publish
dotnet publish ATSRecruitSys.Server/ATSRecruitSys.Server.csproj -c Release -o ./publish

# Deploy
az webapp deployment source config-zip --resource-group rg-ats-recruitment --name ats-recruitment-yourname --src ./publish.zip
```

## Configuration Settings

### App Settings in Azure Portal
After deployment, configure these in Azure Portal ? App Service ? Configuration:

1. **Connection Strings**:
   - Name: `DefaultConnection`
   - Value: Your Azure SQL Database connection string
   - Type: SQLServer

2. **Application Settings**:
   - `ASPNETCORE_ENVIRONMENT` = `Production`
   - `JwtSecret` = Your secure JWT secret (32+ characters)
   - `JwtIssuer` = `ATSRecruitSys`
   - `JwtAudience` = `ATSRecruitSysUsers`
   - `SmtpServer` = Your email server
   - `SmtpPort` = Email port (587 for Gmail)
   - `SmtpUsername` = Your email username
   - `SmtpPassword` = Your email password
   - `FromEmail` = Your system email

### Database Migration
After deployment, run database migrations:
```bash
# Connect to your deployed app's console or use Azure Cloud Shell
dotnet ef database update --project ATSRecruitSys.Server
```

## Frontend Deployment (React App)

### Option 1: Azure Static Web Apps (Recommended)
1. Go to Azure Portal ? Create Resource ? Static Web Apps
2. Connect to your GitHub repository
3. Set build configuration:
   - App location: `/atsrecruitsys.client`
   - Build location: `/dist`
   - API location: (leave empty)

### Option 2: Azure Storage Account (Static Website)
1. Create Storage Account in Azure
2. Enable Static Website hosting
3. Build and upload React app:
```bash
cd atsrecruitsys.client
npm run build
# Upload dist folder to $web container
```

## Post-Deployment Steps

1. **Test the Application**: Visit your Azure app URL
2. **Configure Custom Domain** (optional): Add custom domain in App Service
3. **Enable SSL**: Azure provides free SSL certificates
4. **Set up Monitoring**: Enable Application Insights
5. **Configure Scaling**: Set up auto-scaling if needed

## Costs Estimation (South Africa region)
- **App Service (Basic B1)**: ~R400-600/month
- **SQL Database (Basic)**: ~R150-300/month
- **Storage Account**: ~R20-50/month
- **Total**: ~R570-950/month

## Security Considerations
1. Use Azure Key Vault for secrets
2. Enable HTTPS only
3. Configure CORS properly
4. Set up Azure AD authentication (optional)
5. Use managed identity for database connections

## Troubleshooting
1. Check Application Logs in Azure Portal
2. Use Azure Cloud Shell for debugging
3. Verify connection strings are correct
4. Ensure all NuGet packages are compatible with Azure

## Next Steps
Would you like me to help you with:
1. Setting up Azure CLI and deploying via command line?
2. Configuring the database connection string?
3. Setting up the frontend deployment?
4. Configuring email settings for production?

Choose which approach you'd prefer and I'll guide you through the specific steps!