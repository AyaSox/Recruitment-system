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

// ? SIMPLE: Use in-memory database for free Render deployment
// Data resets on app restart (perfect for demo)
var startupLogger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");
startupLogger.LogInformation("? Configuring in-memory database for demo...");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseInMemoryDatabase("ATSRecruitSys");
});

startupLogger.LogInformation("? Using in-memory database");
startupLogger.LogInformation("?? Data will reset on application restart");
startupLogger.LogInformation("? All demo accounts and sample data available on startup");

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
            // Production CORS - Allow Render deployment URLs
            policy.WithOrigins(
                "https://ats-recruitment-frontend.onrender.com",
                "https://ats-recruitment-backend.onrender.com",
                "http://localhost:5173" // Allow local development
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
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

// Initialize in-memory database and seed with demo data
using (var scope = app.Services.CreateScope())
{
    var loggerFactory = scope.ServiceProvider.GetRequiredService<ILoggerFactory>();
    var seedLogger = loggerFactory.CreateLogger<DatabaseSeeder>();
    
    try
    {
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        
        seedLogger.LogInformation("?? Starting database initialization...");
        
        // Ensure in-memory database is created
        await context.Database.EnsureCreatedAsync();
        seedLogger.LogInformation("? In-memory database created");
        
        // Seed database with demo data
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
        var seeder = new DatabaseSeeder(context, userManager, roleManager, seedLogger);
        await seeder.SeedDatabaseAsync();
        
        seedLogger.LogInformation("? Database seeding completed");
        seedLogger.LogInformation("?? Demo data loaded and ready to use");
        seedLogger.LogInformation("?? Test Accounts:");
        seedLogger.LogInformation("   - Admin: admin@atsrecruitsys.com / Admin123!");
        seedLogger.LogInformation("   - Recruiter: recruiter@test.com / Test123!");
        seedLogger.LogInformation("   - HiringManager: hiringmanager@test.com / Test123!");
    }
    catch (Exception ex)
    {
        var errorLogger = LoggerFactory.Create(b => b.AddConsole()).CreateLogger("Startup");
        errorLogger.LogError(ex, "? Error during database initialization");
        throw;
    }
}

app.Run();
