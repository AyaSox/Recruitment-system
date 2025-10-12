using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.Models;
using ATSRecruitSys.Server.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Try to get connection string from environment variable first (for Railway, Heroku, etc.)
var connectionString = Environment.GetEnvironmentVariable("DATABASE_URL") 
    ?? builder.Configuration.GetConnectionString("DefaultConnection");

// Handle empty or missing connection string
if (string.IsNullOrWhiteSpace(connectionString))
{
    var logger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");
    logger.LogWarning("No database connection string found. Using in-memory database for development.");
    
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
        
        // Check if we can connect to the database
        var canConnect = await context.Database.CanConnectAsync();
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
            // Apply pending migrations (only for real databases, not in-memory)
            if (!context.Database.IsInMemory())
            {
                logger.LogInformation("Applying database migrations...");
                await context.Database.MigrateAsync();
                logger.LogInformation("Database migrations applied successfully");
            }
            else
            {
                logger.LogInformation("In-memory database detected. Ensuring created...");
                await context.Database.EnsureCreatedAsync();
            }
        }
        
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
