using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.Models;
using ATSRecruitSys.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Data.Common;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Resolve connection string robustly for Railway/containers
var (connectionString, source) = ResolveConnectionString(builder.Configuration);

// Enhanced logging for database connection debugging
var startupLogger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");

// Log all relevant environment variables for debugging
startupLogger.LogInformation("=== DATABASE CONNECTION DEBUGGING ===");
startupLogger.LogInformation("Environment: {Environment}", builder.Environment.EnvironmentName);
startupLogger.LogInformation("DATABASE_URL: {Value}", 
    string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_URL")) ? "NOT SET" : "SET");
startupLogger.LogInformation("DATABASE_PUBLIC_URL: {Value}", 
    string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_PUBLIC_URL")) ? "NOT SET" : "SET");
startupLogger.LogInformation("DATABASE_PRIVATE_URL: {Value}", 
    string.IsNullOrEmpty(Environment.GetEnvironmentVariable("DATABASE_PRIVATE_URL")) ? "NOT SET" : "SET");
startupLogger.LogInformation("PGHOST: {Value}", Environment.GetEnvironmentVariable("PGHOST") ?? "NOT SET");
startupLogger.LogInformation("PGDATABASE: {Value}", Environment.GetEnvironmentVariable("PGDATABASE") ?? "NOT SET");
startupLogger.LogInformation("PGUSER: {Value}", Environment.GetEnvironmentVariable("PGUSER") ?? "NOT SET");
startupLogger.LogInformation("Connection resolved from: {Source}", source);
startupLogger.LogInformation("======================================");

// Handle empty or missing connection string
if (string.IsNullOrWhiteSpace(connectionString))
{
    startupLogger.LogWarning("No database connection string found. Using in-memory database for development.");
    startupLogger.LogWarning("To fix this on Railway:");
    startupLogger.LogWarning("1. Set DATABASE_URL to the same value as DATABASE_PUBLIC_URL");
    startupLogger.LogWarning("2. Or ensure PG* variables are properly set");
    
    // Use in-memory database as fallback
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        options.UseInMemoryDatabase("ATSRecruitSys");
    });
}
else
{
    // Parse Railway/Heroku PostgreSQL URL format (postgres:// or postgresql://) if needed
    connectionString = ConvertPostgresUrlToNpgsql(connectionString);

    // Log safe DB target details (no secrets)
    try
    {
        var diag = GetSafeDbInfo(connectionString);
        var logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");
        logger.LogInformation("Database source: {Source}", source);
        logger.LogInformation("Database config -> Provider: {Provider}, Host: {Host}, Port: {Port}, SSL Mode: {Ssl}, Internal: {Internal}",
            diag.Provider, diag.Host, diag.Port, diag.SslMode, diag.Internal);
    }
    catch { /* best-effort diagnostics only */ }

    // Configure database provider based on connection string
    builder.Services.AddDbContext<ApplicationDbContext>(options =>
    {
        if (connectionString.Contains("postgres") || connectionString.Contains("PostgreSQL") || connectionString.Contains("Host="))
        {
            options.UseNpgsql(connectionString);
        }
        else
        {
            options.UseSqlServer(connectionString);
        }
    });
}

// Add Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
{
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
.AddEntityFrameworkStores<ApplicationDbContext>()
.AddDefaultTokenProviders();

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = jwtSettings["SecretKey"] ?? "YourSuperSecretKeyThatIsAtLeast32CharactersLongForSecurity!";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"] ?? "ATSRecruitSys",
        ValidAudience = jwtSettings["Audience"] ?? "ATSRecruitSys",
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero
    };
});

// Add HttpContextAccessor for audit logging
builder.Services.AddHttpContextAccessor();

// Register application services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<JobService>();
builder.Services.AddScoped<ApplicationService>();
builder.Services.AddScoped<DashboardService>();
builder.Services.AddScoped<EmailService>();
builder.Services.AddScoped<FileStorageService>();
builder.Services.AddScoped<IAuditService, AuditService>();

// Add controllers
builder.Services.AddControllers();

// Add API documentation
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "ATS Recruitment System API", 
        Version = "v1",
        Description = "API for ATS Recruitment System"
    });
    
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header,
            },
            new List<string>()
        }
    });

    // Include XML comments if available
    var xmlFile = $"{System.Reflection.Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        c.IncludeXmlComments(xmlPath);
    }
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        if (builder.Environment.IsDevelopment())
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        }
        else
        {
            // Production CORS - Update with your actual domains
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "ATS Recruitment System API V1");
    c.RoutePrefix = app.Environment.IsDevelopment() ? "swagger" : "";
});

// Global exception handler
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseCors("AllowReactApp");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Initialize database and create default users
using (var scope = app.Services.CreateScope())
{
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var logger = loggerFactory.CreateLogger<DatabaseSeeder>();
    
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        logger.LogInformation("Starting database initialization...");
        
        // Wait/retry for database to be reachable (helps when DB starts slower than app)
        var canConnect = await WaitForDatabaseAsync(context, logger, maxAttempts: 12, delaySeconds: 5);
        if (!canConnect)
        {
            logger.LogWarning("Cannot connect to database. Skipping migrations and seeding.");
            if (context.Database.IsInMemory())
            {
                logger.LogInformation("Using in-memory database. Ensuring created...");
                await context.Database.EnsureCreatedAsync();
            }
        }
        else
        {
            // Apply database migrations (Railway PostgreSQL aggressive fix)
            if (!context.Database.IsInMemory())
            {
                logger.LogInformation("Initializing Railway PostgreSQL database...");
                
                // Use Railway-specific database initializer for aggressive fix
                var railwayInitialized = await RailwayDatabaseInitializer.InitializeRailwayDatabaseAsync(context, logger);
                
                if (!railwayInitialized)
                {
                    logger.LogWarning("Railway database initialization failed. Trying standard approach...");
                    
                    try
                    {
                        // Fallback to standard migration approach
                        var migrated = await TryMigrateWithRetryAsync(context, logger, maxAttempts: 3, delaySeconds: 5);
                        
                        if (!migrated)
                        {
                            logger.LogWarning("Standard migrations failed. Using EnsureCreated...");
                            await context.Database.EnsureCreatedAsync();
                            logger.LogInformation("Database schema created using EnsureCreated fallback");
                        }
                    }
                    catch (Exception fallbackEx)
                    {
                        logger.LogError(fallbackEx, "All database initialization attempts failed");
                        throw;
                    }
                }
            }
            else
            {
                logger.LogInformation("In-memory database detected. Ensuring created...");
                await context.Database.EnsureCreatedAsync();
            }
        }
        
        // Fix Employment Equity migration if needed
        await EnsureEmploymentEquityMigrationAsync(context, logger);
        
        // Seed database
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var seeder = new DatabaseSeeder(context, userManager, roleManager, logger);
        await seeder.SeedDatabaseAsync();
        
        logger.LogInformation("Database initialization completed successfully");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "An error occurred while initializing the database. Application will start but database may not be available.");
        logger.LogError("Connection string status: {Status}", 
            string.IsNullOrEmpty(connectionString) ? "MISSING" : "Present (check format)");
        // Don't throw - let the app start anyway
    }
}

app.Run();

// Helper: Convert postgres:// or postgresql:// URL to an Npgsql connection string
static string ConvertPostgresUrlToNpgsql(string raw)
{
    if (string.IsNullOrWhiteSpace(raw))
        return raw;

    var trimmed = raw.Trim().Trim('"');

    // Detect URL schemes used by Railway/Heroku
    if (!(trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
          trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase)))
    {
        return trimmed; // Already a regular connection string
    }

    if (!Uri.TryCreate(trimmed, UriKind.Absolute, out var uri))
        return trimmed; // Fallback to original if parsing fails

    // Extract credentials safely (may be URL-encoded)
    var userInfoParts = uri.UserInfo.Split(':', 2);
    var username = userInfoParts.Length > 0 ? Uri.UnescapeDataString(userInfoParts[0]) : string.Empty;
    var password = userInfoParts.Length > 1 ? Uri.UnescapeDataString(userInfoParts[1]) : string.Empty;

    var host = uri.Host;
    var port = uri.Port > 0 ? uri.Port : 5432; // default
    var database = uri.AbsolutePath.TrimStart('/');

    // Defaults for cloud providers
    // Railway internal host does NOT use SSL; public proxy does.
    var isInternalHost = host.Equals("localhost", StringComparison.OrdinalIgnoreCase)
                         || host.Equals("127.0.0.1")
                         || host.EndsWith(".internal", StringComparison.OrdinalIgnoreCase)
                         || host.EndsWith(".railway.internal", StringComparison.OrdinalIgnoreCase)
                         || host.StartsWith("10.")
                         || host.StartsWith("192.168.")
                         || host.StartsWith("172.");

    var sslMode = isInternalHost ? "Disable" : "Require"; // secure by default unless internal
    var trustServerCert = isInternalHost ? "false" : "true";

    // Parse query string for overrides (e.g., ?sslmode=verify-full)
    var query = uri.Query.TrimStart('?');
    if (!string.IsNullOrEmpty(query))
    {
        foreach (var part in query.Split('&', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2);
            var key = Uri.UnescapeDataString(kv[0]).Trim();
            var value = kv.Length > 1 ? Uri.UnescapeDataString(kv[1]).Trim() : string.Empty;

            if (key.Equals("sslmode", StringComparison.OrdinalIgnoreCase))
            {
                sslMode = value; // pass-through supported values: disable, allow, prefer, require, verify-ca, verify-full
            }
            else if (key.Equals("trust_server_certificate", StringComparison.OrdinalIgnoreCase) ||
                     key.Equals("Trust Server Certificate", StringComparison.OrdinalIgnoreCase))
            {
                trustServerCert = value;
            }
        }
    }

    var sb = new StringBuilder();
    sb.Append($"Host={host};Port={port};Database={database};Username={username};Password={password};");
    sb.Append($"SSL Mode={sslMode};Trust Server Certificate={trustServerCert}");
    return sb.ToString();
}

// Resolve connection string from multiple sources with sane fallbacks
static (string Value, string Source) ResolveConnectionString(IConfiguration config)
{
    // 1) Railway/Heroku standard env vars - prioritize non-empty values
    var raw = Environment.GetEnvironmentVariable("DATABASE_URL");
    if (!string.IsNullOrWhiteSpace(raw) && !raw.Equals("<empty string>", StringComparison.OrdinalIgnoreCase))
        return (raw, "env:DATABASE_URL");

    // 2) Public proxy (Railway) - this is often the working one
    raw = Environment.GetEnvironmentVariable("DATABASE_PUBLIC_URL");
    if (!string.IsNullOrWhiteSpace(raw) && !raw.Equals("<empty string>", StringComparison.OrdinalIgnoreCase))
        return (raw, "env:DATABASE_PUBLIC_URL");

    // 3) Railway internal database URL (often the most reliable)
    raw = Environment.GetEnvironmentVariable("DATABASE_PRIVATE_URL");
    if (!string.IsNullOrWhiteSpace(raw) && !raw.Equals("<empty string>", StringComparison.OrdinalIgnoreCase))
        return (raw, "env:DATABASE_PRIVATE_URL");

    // 4) PG* env vars (Railway provides these too)
    var pgHost = Environment.GetEnvironmentVariable("PGHOST");
    var pgPort = Environment.GetEnvironmentVariable("PGPORT") ?? "5432";
    var pgDb   = Environment.GetEnvironmentVariable("PGDATABASE");
    var pgUser = Environment.GetEnvironmentVariable("PGUSER");
    var pgPwd  = Environment.GetEnvironmentVariable("PGPASSWORD");
    if (!string.IsNullOrWhiteSpace(pgHost) && !string.IsNullOrWhiteSpace(pgDb) && !string.IsNullOrWhiteSpace(pgUser))
    {
        // Determine SSL mode based on host
        var sslMode = pgHost.Contains("railway.internal") || pgHost.Contains("localhost") || pgHost.StartsWith("10.") 
            ? "Disable" : "Require";
        var npg = $"Host={pgHost};Port={pgPort};Database={pgDb};Username={pgUser};Password={pgPwd};SSL Mode={sslMode};Trust Server Certificate=true";
        return (npg, "env:PG* variables");
    }

    // 5) Direct Railway variables (fallback)
    var pgData = Environment.GetEnvironmentVariable("PGDATA");
    var pgDatabase = Environment.GetEnvironmentVariable("PGDATABASE");
    if (!string.IsNullOrWhiteSpace(pgDatabase))
    {
        // Try to construct from individual Railway variables
        var host = Environment.GetEnvironmentVariable("RAILWAY_TCP_PROXY_DOMAIN") ?? "localhost";
        var port = Environment.GetEnvironmentVariable("RAILWAY_TCP_PROXY_PORT") ?? "5432";
        var user = Environment.GetEnvironmentVariable("PGUSER") ?? "postgres";
        var password = Environment.GetEnvironmentVariable("PGPASSWORD") ?? "";
        
        if (!string.IsNullOrWhiteSpace(password))
        {
            var connectionString = $"Host={host};Port={port};Database={pgDatabase};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true";
            return (connectionString, "env:Railway constructed");
        }
    }

    // 6) appsettings ConnectionStrings:DefaultConnection (ignore placeholder tokens)
    var cfg = config.GetConnectionString("DefaultConnection");
    if (!string.IsNullOrWhiteSpace(cfg) && !LooksLikePlaceholder(cfg))
        return (cfg, "config:ConnectionStrings:DefaultConnection");

    // 7) nothing found -> empty triggers in-memory fallback
    return (string.Empty, "none");

    static bool LooksLikePlaceholder(string s)
    {
        s = s.Trim();
        return s.StartsWith("#{") || s.Contains("YOUR_CONNECTION_STRING", StringComparison.OrdinalIgnoreCase) || s.Equals("<empty string>", StringComparison.OrdinalIgnoreCase);
    }
}

// Helper: best-effort safe diagnostics for connection string (no secrets)
static (string Provider, string Host, string Port, string SslMode, bool Internal) GetSafeDbInfo(string cs)
{
    string provider = cs.Contains("Host=") || cs.Contains("Username=") ? "PostgreSQL" : cs.Contains("Server=") ? "SQLServer" : "Unknown";
    string host = FindVal(cs, "Host") ?? FindVal(cs, "Server") ?? "?";
    string port = FindVal(cs, "Port") ?? (provider == "SQLServer" ? (FindVal(cs, "PortNumber") ?? "1433") : "5432");
    string ssl = FindVal(cs, "SSL Mode") ?? FindVal(cs, "SslMode") ?? "?";
    bool internalHost = host.EndsWith(".internal", StringComparison.OrdinalIgnoreCase) || host.EndsWith(".railway.internal", StringComparison.OrdinalIgnoreCase) || host == "localhost";
    return (provider, host, port, ssl, internalHost);

    static string? FindVal(string cs, string key)
    {
        foreach (var part in cs.Split(';', StringSplitOptions.RemoveEmptyEntries))
        {
            var kv = part.Split('=', 2);
            if (kv.Length == 2 && kv[0].Trim().Equals(key, StringComparison.OrdinalIgnoreCase))
                return kv[1].Trim();
        }
        return null;
    }
}

// Helper: retry database connectivity
static async Task<bool> WaitForDatabaseAsync(DbContext context, ILogger logger, int maxAttempts = 10, int delaySeconds = 3)
{
    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            if (await context.Database.CanConnectAsync())
            {
                if (attempt > 1)
                    logger.LogInformation("Database became available after {Attempts} attempts", attempt);
                return true;
            }
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Database connection attempt {Attempt}/{Max} failed", attempt, maxAttempts);
        }
        await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
    }
    return false;
}

// Helper: retry migrations (handles transient connection failures)
static async Task<bool> TryMigrateWithRetryAsync(DbContext context, ILogger logger, int maxAttempts = 5, int delaySeconds = 5)
{
    for (var attempt = 1; attempt <= maxAttempts; attempt++)
    {
        try
        {
            await context.Database.MigrateAsync();
            return true;
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Migration attempt {Attempt}/{Max} failed: {Error}", attempt, maxAttempts, ex.Message);
            if (attempt < maxAttempts)
            {
                await Task.Delay(TimeSpan.FromSeconds(delaySeconds));
            }
        }
    }
    return false;
}

// Helper: test if database can be queried (exists and has tables)
static async Task<bool> CanQueryDatabaseAsync(DbContext context, ILogger logger)
{
    try
    {
        // Try to count records from a system table that should exist
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();
        
        using var command = connection.CreateCommand();
        command.CommandText = "SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'AspNetRoles'";
        
        var result = await command.ExecuteScalarAsync();
        var tableCount = Convert.ToInt32(result);
        
        logger.LogInformation("AspNetRoles table check result: {Count}", tableCount);
        return tableCount > 0;
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database query test failed: {Error}", ex.Message);
        return false;
    }
}

// Helper: Ensure Employment Equity migration is applied
static async Task EnsureEmploymentEquityMigrationAsync(ApplicationDbContext context, ILogger logger)
{
    try
    {
        if (context.Database.IsInMemory())
        {
            logger.LogInformation("In-memory database detected. Skipping Employment Equity migration check.");
            return;
        }

        logger.LogInformation("Checking Employment Equity migration status...");
        
        var connection = context.Database.GetDbConnection();
        await connection.OpenAsync();

        // Check if the Employment Equity columns exist
        using var checkCommand = connection.CreateCommand();
        checkCommand.CommandText = @"
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name = 'Jobs' 
            AND column_name IN ('IsEmploymentEquityPosition', 'EmploymentEquityNotes')";

        var columnCount = Convert.ToInt32(await checkCommand.ExecuteScalarAsync());
        
        if (columnCount >= 2)
        {
            logger.LogInformation("Employment Equity columns already exist. No migration needed.");
            return;
        }

        logger.LogWarning("Employment Equity columns missing. Applying manual migration...");

        // Apply the Employment Equity migration manually
        using var migrationCommand = connection.CreateCommand();
        migrationCommand.CommandText = @"
            -- Add Employment Equity columns
            ALTER TABLE ""Jobs"" 
            ADD COLUMN ""IsEmploymentEquityPosition"" boolean NOT NULL DEFAULT false;
            
            ALTER TABLE ""Jobs"" 
            ADD COLUMN ""EmploymentEquityNotes"" text;
            
            -- Mark migration as applied
            INSERT INTO ""__EFMigrationsHistory"" (""MigrationId"", ""ProductVersion"") 
            VALUES ('20251013060811_AddEmploymentEquityFields', '8.0.11')
            ON CONFLICT (""MigrationId"") DO NOTHING;";

        await migrationCommand.ExecuteNonQueryAsync();
        logger.LogInformation("Employment Equity migration applied successfully!");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to apply Employment Equity migration. Manual intervention may be required.");
        // Don't throw - let the app continue
    }
}
