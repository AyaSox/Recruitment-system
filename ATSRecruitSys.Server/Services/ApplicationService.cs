using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ATSRecruitSys.Server.Services
{
    public class ApplicationService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly EmailService _emailService;
        private readonly IWebHostEnvironment _environment;
        private readonly string _uploadsFolder;
        private readonly IAuditService _auditService; // Use interface
        private readonly ILogger<ApplicationService> _logger;
        
        public ApplicationService(
            ApplicationDbContext context, 
            UserManager<ApplicationUser> userManager,
            EmailService emailService,
            IWebHostEnvironment environment,
            IAuditService auditService, // Use interface
            ILogger<ApplicationService> logger)
        {
            _context = context;
            _userManager = userManager;
            _emailService = emailService;
            _environment = environment;
            _auditService = auditService;
            _logger = logger;
            
            // Create uploads folder if it doesn't exist
            _uploadsFolder = Path.Combine(_environment.ContentRootPath, "Uploads", "Resumes");
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
        }

        public async Task<ApplicationDto?> GetApplicationByIdAsync(int id)
        {
            var application = await _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (application == null)
                return null;

            return MapToApplicationDto(application);
        }

        public async Task<PaginatedResponse<ApplicationDto>> GetApplicationsAsync(
            int pageIndex = 0, 
            int pageSize = 10, 
            int? jobId = null,
            string? status = null,
            string? searchTerm = null)
        {
            var query = _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .AsQueryable();

            // Apply filters
            if (jobId.HasValue)
            {
                query = query.Where(a => a.JobId == jobId.Value);
            }

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(a => a.Status == status);
            }

            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(a => 
                    a.Applicant!.FirstName.ToLower().Contains(searchTerm) || 
                    a.Applicant!.LastName.ToLower().Contains(searchTerm) || 
                    a.Applicant!.Email!.ToLower().Contains(searchTerm) ||
                    a.Job!.Title.ToLower().Contains(searchTerm));
            }

            var totalCount = await query.CountAsync();

            var applications = await query
                .OrderByDescending(a => a.AppliedDate)
                .Skip(pageIndex * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var applicationDtos = applications.Select(MapToApplicationDto).ToList();

            return new PaginatedResponse<ApplicationDto>
            {
                Items = applicationDtos,
                TotalCount = totalCount,
                PageIndex = pageIndex,
                PageSize = pageSize
            };
        }

        public async Task<List<MyApplicationDto>> GetUserApplicationsAsync(string userId)
        {
            var applications = await _context.JobApplications
                .Include(a => a.Job)
                .Where(a => a.ApplicantId == userId)
                .OrderByDescending(a => a.AppliedDate)
                .ToListAsync();

            return applications.Select(MapToMyApplicationDto).ToList();
        }

        public async Task CreateSimpleApplicationAsync(SimpleApplicationDto dto, IFormFile resume)
        {
            // Verify the job exists and is published
            var job = await _context.Jobs.FirstOrDefaultAsync(j => 
                j.Id == dto.JobId && 
                j.IsPublished && 
                j.ClosingDate > DateTime.UtcNow);
                
            if (job == null)
                throw new ArgumentException("Invalid or closed job posting");

            // Check if this email has already applied to this job
            var existingApplication = await _context.JobApplications
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.JobId == dto.JobId && 
                    a.Applicant != null && 
                    a.Applicant.Email == dto.Email);

            if (existingApplication != null)
                throw new ArgumentException("An application with this email address has already been submitted for this position");

            // Create or find external candidate user
            var externalUserId = await GetOrCreateExternalCandidateAsync(dto);

            // Process and save the resume file
            var resumePath = await SaveResumeFileAsync(resume, externalUserId, job.Id);

            // Create application
            var application = new JobApplication
            {
                JobId = dto.JobId,
                ApplicantId = externalUserId,
                Status = "Applied", // Fixed: Use "Applied" to show in funnel
                StatusUpdatedDate = DateTime.UtcNow,
                ResumeFilePath = resumePath,
                CoverLetter = dto.Message, // Use message as cover letter
                ApplicantNotes = $"Phone: {dto.PhoneNumber}",
                Skills = null // No skills for simple applications
            };

            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();

            // Send confirmation email
            try
            {
                await _emailService.SendSimpleApplicationConfirmationAsync(
                    dto.Email,
                    $"{dto.FirstName} {dto.LastName}",
                    job.Title,
                    job.ClosingDate);
            }
            catch (Exception ex)
            {
                // Log error but don't fail the application
                Console.WriteLine($"Failed to send confirmation email: {ex.Message}");
            }
        }

        private async Task<string> GetOrCreateExternalCandidateAsync(SimpleApplicationDto dto)
        {
            // Check if user already exists with this email
            var existingUser = await _userManager.FindByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                return existingUser.Id;
            }

            // Create a new external candidate user
            var externalUser = new ApplicationUser
            {
                UserName = dto.Email,
                Email = dto.Email,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                EmailConfirmed = false, // Don't confirm email for external candidates
                PhoneNumber = dto.PhoneNumber
            };

            var result = await _userManager.CreateAsync(externalUser, GenerateRandomPassword());
            if (!result.Succeeded)
            {
                throw new InvalidOperationException($"Failed to create external candidate: {string.Join(", ", result.Errors.Select(e => e.Description))}");
            }

            // Assign Applicant role
            await _userManager.AddToRoleAsync(externalUser, "Applicant");

            return externalUser.Id;
        }

        private string GenerateRandomPassword()
        {
            // Generate a secure random password for external candidates
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 12)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

        public async Task<ApplicationDto> CreateApplicationAsync(
            CreateApplicationDto dto,
            IFormFile resume,
            string userId)
        {
            // Verify the job exists and is published
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == dto.JobId && j.IsPublished && j.ClosingDate > DateTime.UtcNow);
            if (job == null)
                throw new ArgumentException("Invalid or closed job posting");

            // Verify user
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                throw new ArgumentException("Invalid user");

            // Check if user has already applied to this job
            var existingApplication = await _context.JobApplications
                .FirstOrDefaultAsync(a => a.JobId == dto.JobId && a.ApplicantId == userId);
            if (existingApplication != null)
                throw new ArgumentException("You have already applied to this job");

            // Process and save the resume file
            var resumePath = await SaveResumeFileAsync(resume, userId, job.Id);

            // Create application
            var application = new JobApplication
            {
                JobId = dto.JobId,
                ApplicantId = userId,
                Status = "Applied", // Fixed: Use "Applied" to show in funnel
                StatusUpdatedDate = DateTime.UtcNow,
                ResumeFilePath = resumePath,
                CoverLetter = dto.CoverLetter,
                ApplicantNotes = dto.ApplicantNotes,
                Skills = dto.Skills // Store as JSON string
            };

            _context.JobApplications.Add(application);
            await _context.SaveChangesAsync();

            // Send confirmation email with 1-month timeline note
            try
            {
                await _emailService.SendApplicationReceivedAsync(
                    user.Email!, 
                    $"{user.FirstName} {user.LastName}", 
                    job.Title,
                    job.ClosingDate);
            }
            catch (Exception ex)
            {
                // Log error but don't fail the application
                Console.WriteLine($"Failed to send confirmation email: {ex.Message}");
            }

            // Reload with relationships
            return await GetApplicationByIdAsync(application.Id) 
                ?? throw new InvalidOperationException("Failed to retrieve created application");
        }

        public async Task<ApplicationDto?> UpdateApplicationStatusAsync(UpdateApplicationDto dto, string updatedByUserId)
        {
            var application = await _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .FirstOrDefaultAsync(a => a.Id == dto.Id);

            if (application == null)
                return null;

            // Capture old status for audit
            var oldStatus = new { Status = application.Status, RecruiterNotes = application.RecruiterNotes };

            // Update status and notes
            application.Status = dto.Status;
            application.StatusUpdatedDate = DateTime.UtcNow;
            application.RecruiterNotes = dto.RecruiterNotes;

            await _context.SaveChangesAsync();

            // Capture new status for audit
            var newStatus = new { Status = application.Status, RecruiterNotes = application.RecruiterNotes };

            // Audit log
            await _auditService.LogAsync("StatusChange", "Application", application.Id.ToString(), oldStatus, newStatus, 
                $"Application status changed from '{oldStatus.Status}' to '{dto.Status}' for {application.Applicant?.FirstName} {application.Applicant?.LastName} - {application.Job?.Title}");

            // Send status update email
            try
            {
                if (application.Applicant != null && application.Job != null)
                {
                    await _emailService.SendApplicationStatusUpdateAsync(
                        application.Applicant.Email!,
                        $"{application.Applicant.FirstName} {application.Applicant.LastName}",
                        application.Job.Title,
                        dto.Status
                    );
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to send status update email for application {ApplicationId}", application.Id);
            }

            return MapToApplicationDto(application);
        }

        public async Task<string> SaveResumeFileAsync(IFormFile file, string userId, int jobId)
        {
            // Validate file
            if (file == null || file.Length == 0)
                throw new ArgumentException("No file uploaded");

            if (file.Length > 10485760) // 10MB limit
                throw new ArgumentException("File size exceeds the limit (10MB)");

            // Check file extension
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (fileExtension != ".pdf" && fileExtension != ".docx" && fileExtension != ".doc")
                throw new ArgumentException("Only PDF and Word documents are allowed");

            // Generate a unique filename
            var uniqueFileName = $"{userId}_{jobId}_{DateTime.UtcNow:yyyyMMddHHmmss}{fileExtension}";
            var filePath = Path.Combine(_uploadsFolder, uniqueFileName);

            // Save the file
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }

            // Return the relative path for storage in the database
            return Path.Combine("Uploads", "Resumes", uniqueFileName);
        }

        public async Task<FileStream?> GetResumeFileAsync(int applicationId, string userId)
        {
            var application = await _context.JobApplications
                .Include(a => a.Applicant)
                .Include(a => a.Job)
                .FirstOrDefaultAsync(a => a.Id == applicationId);
                
            if (application == null)
                return null;

            // Check if user has access to this resume
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return null;

            var userRoles = await _userManager.GetRolesAsync(user);
            
            // Only allow access if user is the applicant, a recruiter, or an admin
            if (application.ApplicantId != userId && 
                !userRoles.Contains("Recruiter") && 
                !userRoles.Contains("Admin"))
            {
                return null;
            }

            // Get full file path
            var fullPath = Path.Combine(_environment.ContentRootPath, application.ResumeFilePath);
            if (!File.Exists(fullPath))
                return null;

            return File.OpenRead(fullPath);
        }

        public async Task<List<ApplicationStatDto>> GetApplicationStatsByJobAsync(int jobId)
        {
            var statusCounts = await _context.JobApplications
                .Where(a => a.JobId == jobId)
                .GroupBy(a => a.Status)
                .Select(g => new ApplicationStatDto 
                { 
                    Status = g.Key, 
                    Count = g.Count() 
                })
                .ToListAsync();

            return statusCounts;
        }

        public async Task<List<ApplicationStatDto>> GetOverallApplicationStatsAsync()
        {
            var statusCounts = await _context.JobApplications
                .GroupBy(a => a.Status)
                .Select(g => new ApplicationStatDto 
                { 
                    Status = g.Key, 
                    Count = g.Count() 
                })
                .ToListAsync();

            return statusCounts;
        }

        public async Task<int> UpdateNewStatusToAppliedAsync()
        {
            var applicationsWithNewStatus = await _context.JobApplications
                .Where(a => a.Status == "New")
                .ToListAsync();

            foreach (var application in applicationsWithNewStatus)
            {
                application.Status = "Applied";
                application.StatusUpdatedDate = DateTime.UtcNow;
            }

            await _context.SaveChangesAsync();
            
            return applicationsWithNewStatus.Count;
        }

        // Helper methods to map entities to DTOs
        private ApplicationDto MapToApplicationDto(JobApplication application)
        {
            return new ApplicationDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? "Unknown Job",
                JobDepartment = application.Job?.Department ?? "Unknown Department",
                ApplicantId = application.ApplicantId,
                ApplicantName = application.Applicant != null 
                    ? $"{application.Applicant.FirstName} {application.Applicant.LastName}" 
                    : "Unknown Applicant",
                ApplicantEmail = application.Applicant?.Email ?? "Unknown Email",
                AppliedDate = application.AppliedDate,
                Status = application.Status,
                StatusUpdatedDate = application.StatusUpdatedDate,
                CoverLetter = application.CoverLetter,
                ApplicantNotes = application.ApplicantNotes,
                RecruiterNotes = application.RecruiterNotes,
                Skills = application.Skills, // JSON string of skills
                PhoneNumber = application.Applicant?.PhoneNumber // Include phone for simple applications
            };
        }

        private MyApplicationDto MapToMyApplicationDto(JobApplication application)
        {
            return new MyApplicationDto
            {
                Id = application.Id,
                JobId = application.JobId,
                JobTitle = application.Job?.Title ?? "Unknown Job",
                CompanyDepartment = application.Job?.Department ?? "Unknown Department",
                AppliedDate = application.AppliedDate,
                Status = application.Status,
                StatusUpdatedDate = application.StatusUpdatedDate
            };
        }
    }
}