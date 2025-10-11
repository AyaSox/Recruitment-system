# Quick Setup Guide for Azure Database

## Step 1: Create Azure SQL Database

### Using Azure Portal:
1. Go to Azure Portal (portal.azure.com)
2. Click "Create a resource"
3. Search for "SQL Database"
4. Click "Create"

### Configuration:
- **Subscription**: Your Azure subscription
- **Resource Group**: rg-ats-recruitment (same as your app service)
- **Database name**: ats-recruitment-db
- **Server**: Create new server
  - Server name: ats-sql-server-[yourname]
  - Location: South Africa North
  - Authentication: SQL authentication
  - Server admin login: atsadmin
  - Password: [Create strong password - save this!]
- **Compute + Storage**: Basic (5 DTU, 2GB) - Good for testing
- **Backup storage redundancy**: Locally redundant

## Step 2: Configure Firewall
1. Go to your SQL Server resource
2. Click "Networking" in left menu
3. Under "Firewall rules":
   - Check "Allow Azure services to access this server"
   - Add your current IP address
   - Click "Save"

## Step 3: Get Connection String
1. Go to your SQL Database resource
2. Click "Connection strings" in left menu
3. Copy the "ADO.NET" connection string
4. Replace {your_password} with your actual password

Example connection string:
```
Server=tcp:ats-sql-server-yourname.database.windows.net,1433;Initial Catalog=ats-recruitment-db;Persist Security Info=False;User ID=atsadmin;Password={your_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

## Step 4: Configure App Service
1. Go to your App Service in Azure Portal
2. Click "Configuration" in left menu
3. Under "Connection strings", click "New connection string":
   - Name: DefaultConnection
   - Value: [Your connection string from Step 3]
   - Type: SQLServer
4. Click "OK" and then "Save"

## Step 5: Run Database Migration
1. In Azure Portal, go to your App Service
2. Click "Advanced Tools" ? "Go"
3. This opens Kudu console
4. Click "Debug console" ? "PowerShell"
5. Navigate to site/wwwroot
6. Run: `dotnet ef database update`

Or use Azure Cloud Shell:
1. Open Azure Cloud Shell
2. Run: `az webapp ssh --resource-group rg-ats-recruitment --name [your-app-name]`
3. Run: `dotnet ef database update`

## Step 6: Verify Database
Your database should now have all the tables created by Entity Framework migrations.

## Troubleshooting
- If migration fails, check your connection string
- Ensure firewall allows Azure services
- Check application logs in App Service for detailed errors

## Next: Configure Email Settings
After database is working, you'll need to configure email settings for the system to send notifications.