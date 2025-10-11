using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ATSRecruitSys.Server.Services
{
    public class DatabaseSeeder
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILogger<DatabaseSeeder> _logger;

        public DatabaseSeeder(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            ILogger<DatabaseSeeder> logger)
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _logger = logger;
        }

        public async Task SeedDatabaseAsync()
        {
            try
            {
                _logger.LogInformation("Starting database seeding...");

                // Apply pending migrations
                await _context.Database.MigrateAsync();

                // Seed roles
                await SeedRolesAsync();

                // Seed admin user
                await SeedAdminUserAsync();

                // Seed test users
                await SeedTestUsersAsync();

                // Seed sample jobs
                await SeedSampleJobsAsync();

                // Seed sample applications with recruiter notes
                await SeedSampleApplicationsAsync();

                _logger.LogInformation("Database seeding completed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during database seeding");
                throw;
            }
        }

        private async Task SeedRolesAsync()
        {
            var roles = new[] { "Admin", "Recruiter", "HiringManager", "Applicant" };

            foreach (var role in roles)
            {
                if (!await _roleManager.RoleExistsAsync(role))
                {
                    await _roleManager.CreateAsync(new IdentityRole(role));
                    _logger.LogInformation($"Created role: {role}");
                }
            }
        }

        private async Task SeedAdminUserAsync()
        {
            const string adminEmail = "admin@atsrecruitsys.com";
            var adminUser = await _userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    FirstName = "System",
                    LastName = "Administrator",
                    EmailConfirmed = true,
                    CreatedAt = DateTime.UtcNow
                };

                var result = await _userManager.CreateAsync(adminUser, "Admin123!");
                if (result.Succeeded)
                {
                    await _userManager.AddToRoleAsync(adminUser, "Admin");
                    _logger.LogInformation($"Created admin user: {adminEmail}");
                }
                else
                {
                    _logger.LogError($"Failed to create admin user: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
        }

        private async Task SeedTestUsersAsync()
        {
            var testUsers = new[]
            {
                new { Email = "recruiter@test.com", FirstName = "John", LastName = "Recruiter", Role = "Recruiter", Phone = "+27 11 123 4567" },
                new { Email = "hiringmanager@test.com", FirstName = "Sarah", LastName = "Manager", Role = "HiringManager", Phone = "+27 21 987 6543" },
                new { Email = "applicant@test.com", FirstName = "Jane", LastName = "Applicant", Role = "Applicant", Phone = "+27 82 456 7890" }
            };

            foreach (var userData in testUsers)
            {
                var user = await _userManager.FindByEmailAsync(userData.Email);
                if (user == null)
                {
                    user = new ApplicationUser
                    {
                        UserName = userData.Email,
                        Email = userData.Email,
                        FirstName = userData.FirstName,
                        LastName = userData.LastName,
                        PhoneNumber = userData.Phone,
                        EmailConfirmed = true,
                        CreatedAt = DateTime.UtcNow
                    };

                    var result = await _userManager.CreateAsync(user, "Test123!");
                    if (result.Succeeded)
                    {
                        await _userManager.AddToRoleAsync(user, userData.Role);
                        _logger.LogInformation($"Created test user: {userData.Email} with role {userData.Role}");
                    }
                    else
                    {
                        _logger.LogError($"Failed to create test user {userData.Email}: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                    }
                }
            }
        }

        private async Task SeedSampleJobsAsync()
        {
            if (await _context.Jobs.AnyAsync())
            {
                _logger.LogInformation("Jobs already exist, skipping job seeding");
                return;
            }

            var adminUser = await _userManager.FindByEmailAsync("admin@atsrecruitsys.com");
            if (adminUser == null)
            {
                _logger.LogWarning("Admin user not found, cannot seed jobs");
                return;
            }

            var sampleJobs = new[]
            {
                new Job
                {
                    Title = "Senior Software Developer",
                    Description = "We are looking for an experienced software developer to join our team. The successful candidate will work on developing scalable web applications using .NET technologies.",
                    Location = "Cape Town",
                    Department = "Information Technology",
                    EmploymentType = "Full-time",
                    ExperienceLevel = "Senior",
                    SalaryRangeMin = 45000,
                    SalaryRangeMax = 65000,
                    Currency = "ZAR",
                    PostedDate = DateTime.UtcNow.AddDays(-10),
                    ClosingDate = DateTime.UtcNow.AddDays(20),
                    IsPublished = true,
                    CreatedById = adminUser.Id
                },
                new Job
                {
                    Title = "Human Resources Manager",
                    Description = "Seeking an experienced HR Manager to oversee our human resources operations, including recruitment, employee relations, and compliance with employment equity requirements.",
                    Location = "Johannesburg",
                    Department = "Human Resources",
                    EmploymentType = "Full-time",
                    ExperienceLevel = "Mid",
                    SalaryRangeMin = 35000,
                    SalaryRangeMax = 50000,
                    Currency = "ZAR",
                    PostedDate = DateTime.UtcNow.AddDays(-7),
                    ClosingDate = DateTime.UtcNow.AddDays(23),
                    IsPublished = true,
                    CreatedById = adminUser.Id
                },
                new Job
                {
                    Title = "Marketing Specialist",
                    Description = "Join our marketing team as a Marketing Specialist. You will be responsible for developing and implementing marketing campaigns across various channels.",
                    Location = "Durban",
                    Department = "Marketing",
                    EmploymentType = "Full-time",
                    ExperienceLevel = "Entry",
                    SalaryRangeMin = 25000,
                    SalaryRangeMax = 35000,
                    Currency = "ZAR",
                    PostedDate = DateTime.UtcNow.AddDays(-5),
                    ClosingDate = DateTime.UtcNow.AddDays(25),
                    IsPublished = true,
                    CreatedById = adminUser.Id
                },
                new Job
                {
                    Title = "Financial Analyst",
                    Description = "We are seeking a detail-oriented Financial Analyst to join our finance team. The role involves financial modeling, budgeting, and analysis of business performance.",
                    Location = "Pretoria",
                    Department = "Finance",
                    EmploymentType = "Full-time",
                    ExperienceLevel = "Mid",
                    SalaryRangeMin = 30000,
                    SalaryRangeMax = 45000,
                    Currency = "ZAR",
                    PostedDate = DateTime.UtcNow.AddDays(-3),
                    ClosingDate = DateTime.UtcNow.AddDays(27),
                    IsPublished = true,
                    CreatedById = adminUser.Id
                },
                new Job
                {
                    Title = "Customer Service Representative",
                    Description = "Looking for a friendly and professional Customer Service Representative to handle customer inquiries and provide excellent support.",
                    Location = "Cape Town",
                    Department = "Customer Service",
                    EmploymentType = "Full-time",
                    ExperienceLevel = "Entry",
                    SalaryRangeMin = 18000,
                    SalaryRangeMax = 25000,
                    Currency = "ZAR",
                    PostedDate = DateTime.UtcNow.AddDays(-1),
                    ClosingDate = DateTime.UtcNow.AddDays(29),
                    IsPublished = true,
                    CreatedById = adminUser.Id
                }
            };

            _context.Jobs.AddRange(sampleJobs);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created {sampleJobs.Length} sample jobs");
        }

        private async Task SeedSampleApplicationsAsync()
        {
            // Skip if applications already exist
            if (await _context.JobApplications.AnyAsync())
            {
                _logger.LogInformation("Applications already exist, skipping application seeding");
                return;
            }

            // Get test applicant user
            var applicant = await _userManager.FindByEmailAsync("applicant@test.com");
            if (applicant == null)
            {
                _logger.LogWarning("Applicant user not found, cannot seed applications");
                return;
            }

            // Get first two jobs to apply to
            var jobs = await _context.Jobs.Take(2).ToListAsync();
            if (!jobs.Any())
            {
                _logger.LogWarning("No jobs found, cannot seed applications");
                return;
            }

            var sampleApplications = new[]
            {
                new JobApplication
                {
                    JobId = jobs[0].Id,
                    ApplicantId = applicant.Id,
                    Status = "Screening",
                    AppliedDate = DateTime.UtcNow.AddDays(-5),
                    StatusUpdatedDate = DateTime.UtcNow.AddDays(-3),
                    ResumeFilePath = "Uploads/Resumes/sample_resume_1.pdf",
                    CoverLetter = "I am excited to apply for this position. I have extensive experience in software development and would love to join your team.",
                    ApplicantNotes = $"Phone: {applicant.PhoneNumber}\nNotice Period: 1 month\nAvailable immediately",
                    RecruiterNotes = "Strong technical background. Reviewed CV - excellent qualifications. Scheduled for technical interview next week.",
                    Skills = "[\"C#\", \".NET Core\", \"SQL Server\"]",
                    TimelineNoteSent = true
                },
                new JobApplication
                {
                    JobId = jobs[1].Id,
                    ApplicantId = applicant.Id,
                    Status = "New",
                    AppliedDate = DateTime.UtcNow.AddDays(-2),
                    StatusUpdatedDate = DateTime.UtcNow.AddDays(-2),
                    ResumeFilePath = "Uploads/Resumes/sample_resume_2.pdf",
                    CoverLetter = "I believe my skills align perfectly with this role and I would be a great addition to your team.",
                    ApplicantNotes = $"Phone: {applicant.PhoneNumber}\nNotice Period: 2 weeks\nEager to start",
                    RecruiterNotes = "Application received. CV looks promising. Will review in detail and contact for screening interview.",
                    Skills = "[\"HR Management\", \"Recruitment\"]",
                    TimelineNoteSent = true
                }
            };

            _context.JobApplications.AddRange(sampleApplications);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Created {sampleApplications.Length} sample applications with recruiter notes");
        }
    }
}