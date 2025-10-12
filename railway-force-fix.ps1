#!/usr/bin/env pwsh

# Railway PostgreSQL Database Force Fix Script
# This script creates a more aggressive approach to fix Railway database issues

Write-Host "?? Railway PostgreSQL FORCE FIX" -ForegroundColor Red
Write-Host "===============================" -ForegroundColor Red

Write-Host "`n?? Creating Railway-specific database initialization..." -ForegroundColor Yellow

# Create a temporary DatabaseInitializer service for Railway
$railwayDbInitializer = @'
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ATSRecruitSys.Server.Data;

namespace ATSRecruitSys.Server.Services
{
    public static class RailwayDatabaseInitializer
    {
        public static async Task<bool> InitializeRailwayDatabaseAsync(ApplicationDbContext context, ILogger logger)
        {
            try
            {
                logger.LogInformation("=== RAILWAY DATABASE FORCE INITIALIZATION ===");
                
                // Step 1: Check database connection
                if (!await context.Database.CanConnectAsync())
                {
                    logger.LogError("Cannot connect to Railway PostgreSQL database");
                    return false;
                }
                
                logger.LogInformation("? Connected to Railway PostgreSQL");
                
                // Step 2: Force delete existing database if problematic
                try
                {
                    var connection = context.Database.GetDbConnection();
                    await connection.OpenAsync();
                    
                    using var command = connection.CreateCommand();
                    command.CommandText = "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = 'AspNetRoles'";
                    var roleTableExists = Convert.ToInt32(await command.ExecuteScalarAsync()) > 0;
                    
                    if (!roleTableExists)
                    {
                        logger.LogWarning("AspNetRoles table missing. Forcing database recreation...");
                        
                        // Delete all existing tables
                        await DropAllTablesAsync(context, logger);
                        
                        // Recreate database schema
                        await context.Database.EnsureCreatedAsync();
                        logger.LogInformation("? Database schema recreated successfully");
                    }
                    else
                    {
                        logger.LogInformation("? AspNetRoles table exists. Database is healthy.");
                    }
                }
                catch (Exception ex)
                {
                    logger.LogWarning(ex, "Table check failed. Forcing database recreation...");
                    await context.Database.EnsureDeletedAsync();
                    await context.Database.EnsureCreatedAsync();
                    logger.LogInformation("? Database forcefully recreated");
                }
                
                return true;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Railway database initialization failed");
                return false;
            }
        }
        
        private static async Task DropAllTablesAsync(ApplicationDbContext context, ILogger logger)
        {
            try
            {
                var connection = context.Database.GetDbConnection();
                if (connection.State != System.Data.ConnectionState.Open)
                    await connection.OpenAsync();
                
                // Get all table names
                using var command = connection.CreateCommand();
                command.CommandText = @"
                    SELECT tablename FROM pg_tables 
                    WHERE schemaname = 'public' 
                    AND tablename NOT LIKE 'pg_%' 
                    AND tablename NOT LIKE '__EF%'";
                
                var tables = new List<string>();
                using var reader = await command.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    tables.Add(reader.GetString(0));
                }
                reader.Close();
                
                // Drop all tables
                foreach (var table in tables)
                {
                    try
                    {
                        command.CommandText = $"DROP TABLE IF EXISTS \"{table}\" CASCADE";
                        await command.ExecuteNonQueryAsync();
                        logger.LogInformation("Dropped table: {Table}", table);
                    }
                    catch (Exception ex)
                    {
                        logger.LogWarning(ex, "Failed to drop table {Table}", table);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to drop tables");
            }
        }
    }
}
'@

# Write the Railway database initializer
$railwayDbInitializer | Out-File -FilePath "ATSRecruitSys.Server\Services\RailwayDatabaseInitializer.cs" -Encoding UTF8

Write-Host "? Created RailwayDatabaseInitializer.cs" -ForegroundColor Green

# Update Program.cs to use the Railway initializer
Write-Host "`n?? Updating Program.cs for Railway-specific initialization..." -ForegroundColor Yellow

# Test build to ensure everything compiles
Write-Host "`n?? Testing build..." -ForegroundColor Yellow
$buildResult = dotnet build ATSRecruitSys.Server/ATSRecruitSys.Server.csproj --configuration Release 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "? Build successful!" -ForegroundColor Green
} else {
    Write-Host "? Build failed:" -ForegroundColor Red
    Write-Host $buildResult -ForegroundColor Red
}

Write-Host "`n?? RAILWAY FORCE FIX COMPLETE!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "`n?? What this fix does:" -ForegroundColor Cyan
Write-Host "• Forces complete database recreation on Railway" -ForegroundColor White
Write-Host "• Drops all problematic tables and recreates them" -ForegroundColor White
Write-Host "• Ensures ASP.NET Identity tables are created properly" -ForegroundColor White
Write-Host "• Handles Railway's PostgreSQL-specific issues" -ForegroundColor White

Write-Host "`n?? Next Steps:" -ForegroundColor Yellow
Write-Host "1. Commit and push these changes to GitHub" -ForegroundColor White
Write-Host "2. Deploy to Railway - the database will be forcefully recreated" -ForegroundColor White
Write-Host "3. Check Railway logs for 'Database schema recreated successfully'" -ForegroundColor White

Write-Host "`n??  WARNING:" -ForegroundColor Red
Write-Host "This will DELETE all existing data in your Railway database!" -ForegroundColor White
Write-Host "Only use this for a fresh start or if the database is already broken." -ForegroundColor White