using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.DTOs;
using ATSRecruitSys.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ATSRecruitSys.Server.Services
{
    public class JobService
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly ILogger<JobService> _logger;
        private readonly IAuditService _auditService;

        public JobService(
            ApplicationDbContext context,
            UserManager<ApplicationUser> userManager,
            ILogger<JobService> logger,
            IAuditService auditService)
        {
            _context = context;
            _userManager = userManager;
            _logger = logger;
            _auditService = auditService;
        }

        public async Task<PaginatedJobResponseDto> GetJobsAsync(
            int page = 0,
            int pageSize = 10,
            string? searchTerm = null,
            string? location = null,
            string? department = null,
            string? employmentType = null,
            string? experienceLevel = null,
            bool publicView = false)
        {
            var query = _context.Jobs
                .Include(j => j.CreatedBy)
                .Include(j => j.JobApplications) // Include JobApplications to get accurate count
                .AsQueryable();

            // Public view should only show published jobs
            if (publicView)
            {
                query = query.Where(j => j.IsPublished && j.ClosingDate > DateTime.UtcNow);
            }

            // Apply filters
            if (!string.IsNullOrEmpty(searchTerm))
            {
                searchTerm = searchTerm.ToLower();
                query = query.Where(j =>
                    j.Title.ToLower().Contains(searchTerm) ||
                    j.Description.ToLower().Contains(searchTerm));
            }

            if (!string.IsNullOrEmpty(location))
            {
                query = query.Where(j => j.Location == location);
            }

            if (!string.IsNullOrEmpty(department))
            {
                query = query.Where(j => j.Department == department);
            }

            if (!string.IsNullOrEmpty(employmentType))
            {
                query = query.Where(j => j.EmploymentType == employmentType);
            }

            if (!string.IsNullOrEmpty(experienceLevel))
            {
                query = query.Where(j => j.ExperienceLevel == experienceLevel);
            }

            var totalCount = await query.CountAsync();

            var jobs = await query
                .OrderByDescending(j => j.PostedDate)
                .Skip(page * pageSize)
                .Take(pageSize)
                .Select(j => new JobSummaryDto
                {
                    Id = j.Id,
                    Title = j.Title,
                    Department = j.Department,
                    Location = j.Location,
                    EmploymentType = j.EmploymentType,
                    ExperienceLevel = j.ExperienceLevel,
                    PostedDate = j.PostedDate,
                    ClosingDate = j.ClosingDate,
                    IsPublished = j.IsPublished,
                    IsApproved = j.IsApproved, // Include approval status
                    SalaryRangeMin = j.SalaryRangeMin,
                    SalaryRangeMax = j.SalaryRangeMax,
                    Currency = j.Currency,
                    ApplicationCount = j.JobApplications.Count,
                    TimelineNote = j.TimelineNote // Include the 1-month timeline note
                })
                .ToListAsync();

            return new PaginatedJobResponseDto
            {
                Items = jobs,
                TotalCount = totalCount,
                PageIndex = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
            };
        }

        public async Task<JobDto?> GetJobByIdAsync(int id)
        {
            var job = await _context.Jobs
                .Include(j => j.CreatedBy)
                .Include(j => j.JobApplications) // Include JobApplications to get accurate count
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return null;

            return new JobDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Location = job.Location,
                Department = job.Department,
                PostedDate = job.PostedDate,
                ClosingDate = job.ClosingDate,
                IsPublished = job.IsPublished,
                IsApproved = job.IsApproved, // Include approval status
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRangeMin = job.SalaryRangeMin,
                SalaryRangeMax = job.SalaryRangeMax,
                Currency = job.Currency,
                CreatedByName = job.CreatedBy != null ? $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}" : "Unknown",
                ApplicationCount = job.JobApplications.Count,
                TimelineNote = job.TimelineNote, // Include the 1-month timeline note
                IsEmploymentEquityPosition = job.IsEmploymentEquityPosition,
                EmploymentEquityNotes = job.EmploymentEquityNotes
            };
        }

        public async Task<JobDto> CreateJobAsync(CreateJobDto dto, string userId)
        {
            var job = new Job
            {
                Title = dto.Title.Trim(),
                Description = dto.Description.Trim(),
                Location = dto.Location.Trim(),
                Department = dto.Department.Trim(),
                EmploymentType = dto.EmploymentType.Trim(),
                ExperienceLevel = dto.ExperienceLevel.Trim(),
                SalaryRangeMin = dto.SalaryRangeMin,
                SalaryRangeMax = dto.SalaryRangeMax,
                Currency = dto.Currency?.Trim() ?? "ZAR",
                ClosingDate = dto.ClosingDate,
                IsPublished = true,  // Jobs are auto-published when created
                IsApproved = true,   // No approval needed - jobs are auto-approved
                IsEmploymentEquityPosition = dto.IsEmploymentEquityPosition,
                EmploymentEquityNotes = dto.EmploymentEquityNotes?.Trim(),
                CreatedById = userId,
                PostedDate = DateTime.UtcNow
            };

            _context.Jobs.Add(job);
            await _context.SaveChangesAsync();

            // Load the created job with creator info
            var createdJob = await _context.Jobs
                .Include(j => j.CreatedBy)
                .FirstAsync(j => j.Id == job.Id);

            // Audit log
            await _auditService.LogAsync("Create", "Job", job.Id.ToString(), null, new
            {
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                CreatedBy = userId
            }, $"Job '{job.Title}' created");

            return await GetJobByIdAsync(job.Id) 
                ?? throw new InvalidOperationException("Failed to retrieve created job");
        }

        public async Task<JobDto?> UpdateJobAsync(UpdateJobDto dto, string userId)
        {
            var job = await _context.Jobs.FirstOrDefaultAsync(j => j.Id == dto.Id);

            if (job == null)
                return null;

            // Capture old values for audit
            var oldValues = new
            {
                Title = job.Title,
                Description = job.Description,
                Location = job.Location,
                Department = job.Department,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRangeMin = job.SalaryRangeMin,
                SalaryRangeMax = job.SalaryRangeMax,
                ClosingDate = job.ClosingDate
            };

            // Update job properties
            job.Title = dto.Title.Trim();
            job.Description = dto.Description.Trim();
            job.Location = dto.Location.Trim();
            job.Department = dto.Department.Trim();
            job.EmploymentType = dto.EmploymentType.Trim();
            job.ExperienceLevel = dto.ExperienceLevel.Trim();
            job.SalaryRangeMin = dto.SalaryRangeMin;
            job.SalaryRangeMax = dto.SalaryRangeMax;
            job.Currency = dto.Currency?.Trim() ?? "ZAR";
            job.ClosingDate = dto.ClosingDate;
            job.IsEmploymentEquityPosition = dto.IsEmploymentEquityPosition;
            job.EmploymentEquityNotes = dto.EmploymentEquityNotes?.Trim();

            await _context.SaveChangesAsync();

            // Capture new values for audit
            var newValues = new
            {
                Title = job.Title,
                Description = job.Description,
                Location = job.Location,
                Department = job.Department,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRangeMin = job.SalaryRangeMin,
                SalaryRangeMax = job.SalaryRangeMax,
                ClosingDate = job.ClosingDate
            };

            // Audit log
            await _auditService.LogAsync("Update", "Job", job.Id.ToString(), oldValues, newValues, $"Job '{job.Title}' updated");

            return await GetJobByIdAsync(job.Id);
        }

        public async Task<bool> DeleteJobAsync(int id, string userId)
        {
            var job = await _context.Jobs
                .Include(j => j.JobApplications)
                .FirstOrDefaultAsync(j => j.Id == id);

            if (job == null)
                return false;

            // Check if job has applications
            if (job.JobApplications.Any())
            {
                throw new InvalidOperationException("Cannot delete job with existing applications");
            }

            // Capture job details for audit before deletion
            var jobDetails = new
            {
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                IsPublished = job.IsPublished,
                CreatedBy = job.CreatedById
            };

            // Remove the job
            _context.Jobs.Remove(job);
            await _context.SaveChangesAsync();

            // Audit log
            await _auditService.LogAsync("Delete", "Job", job.Id.ToString(), jobDetails, null, $"Job '{job.Title}' deleted");

            return true;
        }

        public async Task<JobDto?> PublishJobAsync(int id, string userId)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return null;

            var oldStatus = new { IsPublished = job.IsPublished, IsApproved = job.IsApproved };

            job.IsPublished = true;
            job.IsApproved = true; // Auto-approve when publishing
            await _context.SaveChangesAsync();

            var newStatus = new { IsPublished = job.IsPublished, IsApproved = job.IsApproved };

            // Audit log
            await _auditService.LogAsync("Publish", "Job", job.Id.ToString(), oldStatus, newStatus, $"Job '{job.Title}' published and approved");

            // Return the updated job with all details
            return await GetJobByIdAsync(id);
        }

        public async Task<JobDto?> UnpublishJobAsync(int id, string userId)
        {
            var job = await _context.Jobs.FindAsync(id);
            if (job == null) return null;

            var oldStatus = new { IsPublished = job.IsPublished };

            job.IsPublished = false;
            await _context.SaveChangesAsync();

            var newStatus = new { IsPublished = job.IsPublished };

            // Audit log
            await _auditService.LogAsync("Archive", "Job", job.Id.ToString(), oldStatus, newStatus, $"Job '{job.Title}' unpublished");

            // Return the updated job with all details
            return await GetJobByIdAsync(id);
        }

        public async Task<List<string>> GetDepartmentsAsync()
        {
            return await _context.Jobs
                .Select(j => j.Department)
                .Distinct()
                .OrderBy(d => d)
                .ToListAsync();
        }

        /// <summary>
        /// Check if user can edit/delete a job
        /// Admin can edit/delete all jobs
        /// Recruiters/HiringManagers can only edit/delete their own jobs
        /// </summary>
        public async Task<bool> CanUserEditJobAsync(int jobId, string userId, bool isAdmin)
        {
            // Admin has full access
            if (isAdmin)
                return true;

            // Others can only edit their own jobs
            var job = await _context.Jobs.FindAsync(jobId);
            if (job == null)
                return false;

            return job.CreatedById == userId;
        }

        /// <summary>
        /// Get the name of the user who created a job
        /// </summary>
        public async Task<string> GetJobCreatorNameAsync(int jobId)
        {
            var job = await _context.Jobs
                .Include(j => j.CreatedBy)
                .FirstOrDefaultAsync(j => j.Id == jobId);

            if (job?.CreatedBy == null)
                return "Unknown User";

            return $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}";
        }

        // Helper methods
        private JobListDto MapToJobListDto(Job job)
        {
            return new JobListDto
            {
                Id = job.Id,
                Title = job.Title,
                Department = job.Department,
                Location = job.Location,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                PostedDate = job.PostedDate,
                ClosingDate = job.ClosingDate,
                IsPublished = job.IsPublished,
                IsApproved = job.IsApproved,
                CreatedByName = job.CreatedBy != null ? $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}" : "Unknown"
            };
        }

        private JobDetailDto MapToJobDetailDto(Job job)
        {
            return new JobDetailDto
            {
                Id = job.Id,
                Title = job.Title,
                Description = job.Description,
                Location = job.Location,
                Department = job.Department,
                EmploymentType = job.EmploymentType,
                ExperienceLevel = job.ExperienceLevel,
                SalaryRangeMin = job.SalaryRangeMin,
                SalaryRangeMax = job.SalaryRangeMax,
                Currency = job.Currency,
                PostedDate = job.PostedDate,
                ClosingDate = job.ClosingDate,
                IsPublished = job.IsPublished,
                IsApproved = job.IsApproved,
                CreatedById = job.CreatedById,
                CreatedByName = job.CreatedBy != null ? $"{job.CreatedBy.FirstName} {job.CreatedBy.LastName}" : "Unknown",
                TimelineNote = job.TimelineNote
            };
        }
    }
}