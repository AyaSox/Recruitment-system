# Azure Deployment Script for ATS Recruitment System
# Run this script in PowerShell with Administrator privileges

param(
    [Parameter(Mandatory=$true)]
    [string]$AppName,
    
    [Parameter(Mandatory=$false)]
    [string]$ResourceGroup = "rg-ats-recruitment",
    
    [Parameter(Mandatory=$false)]
    [string]$Location = "South Africa North",
    
    [Parameter(Mandatory=$false)]
    [string]$AppServicePlan = "asp-ats-recruitment"
)

Write-Host "Starting Azure deployment for ATS Recruitment System..." -ForegroundColor Green

# Check if Azure CLI is installed
try {
    az --version | Out-Null
    Write-Host "? Azure CLI is installed" -ForegroundColor Green
} catch {
    Write-Host "? Azure CLI is not installed. Please install from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli" -ForegroundColor Red
    exit 1
}

# Login to Azure
Write-Host "Logging into Azure..." -ForegroundColor Yellow
az login

# Create Resource Group
Write-Host "Creating resource group: $ResourceGroup" -ForegroundColor Yellow
az group create --name $ResourceGroup --location $Location

# Create App Service Plan
Write-Host "Creating App Service Plan: $AppServicePlan" -ForegroundColor Yellow
az appservice plan create --name $AppServicePlan --resource-group $ResourceGroup --sku B1

# Create Web App
Write-Host "Creating Web App: $AppName" -ForegroundColor Yellow
az webapp create --name $AppName --resource-group $ResourceGroup --plan $AppServicePlan --runtime "DOTNET|8.0"

# Build and Publish the application
Write-Host "Building and publishing the application..." -ForegroundColor Yellow
dotnet publish ATSRecruitSys.Server/ATSRecruitSys.Server.csproj -c Release -o ./publish

# Create deployment package
Write-Host "Creating deployment package..." -ForegroundColor Yellow
if (Test-Path "./publish.zip") {
    Remove-Item "./publish.zip"
}
Compress-Archive -Path "./publish/*" -DestinationPath "./publish.zip"

# Deploy to Azure
Write-Host "Deploying to Azure..." -ForegroundColor Yellow
az webapp deployment source config-zip --resource-group $ResourceGroup --name $AppName --src "./publish.zip"

# Configure App Settings
Write-Host "Configuring application settings..." -ForegroundColor Yellow
az webapp config appsettings set --resource-group $ResourceGroup --name $AppName --settings `
    "ASPNETCORE_ENVIRONMENT=Production" `
    "WEBSITES_ENABLE_APP_SERVICE_STORAGE=false"

Write-Host "?? Deployment completed successfully!" -ForegroundColor Green
Write-Host "Your app is available at: https://$AppName.azurewebsites.net" -ForegroundColor Cyan
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Configure your database connection string in Azure Portal" -ForegroundColor White
Write-Host "2. Set up your JWT and email settings" -ForegroundColor White
Write-Host "3. Run database migrations" -ForegroundColor White
Write-Host "4. Test your application" -ForegroundColor White

# Clean up
Remove-Item "./publish" -Recurse -Force
Remove-Item "./publish.zip" -Force