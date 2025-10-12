using ATSRecruitSys.Server.Data;
using ATSRecruitSys.Server.DTOs;
using Microsoft.EntityFrameworkCore;

namespace ATSRecruitSys.Server.Services
{
    public class DashboardService
    {
        private readonly ApplicationDbContext _context;

        public DashboardService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<DashboardStatsDto> GetDashboardStatsAsync()
        {
            var totalJobs = await _context.Jobs.CountAsync();
            var activeJobs = await _context.Jobs
                .Where(j => j.IsPublished && j.ClosingDate > DateTime.UtcNow)
                .CountAsync();
            
            var pendingApprovalJobs = await _context.Jobs
                .Where(j => !j.IsApproved && !j.IsPublished)
                .CountAsync();
                
            var totalApplications = await _context.JobApplications.CountAsync();
            var appliedApplications = await _context.JobApplications
                .Where(a => a.Status == "Applied")
                .CountAsync();
            
            var screeningApplications = await _context.JobApplications
                .Where(a => a.Status == "Screening")
                .CountAsync();
                
            var interviewApplications = await _context.JobApplications
                .Where(a => a.Status == "Interview")
                .CountAsync();

            return new DashboardStatsDto
            {
                TotalJobs = totalJobs,
                ActiveJobs = activeJobs,
                TotalApplications = totalApplications,
                NewApplications = appliedApplications, // Fixed: Now tracks "Applied" status
                ScreeningApplications = screeningApplications,
                InterviewApplications = interviewApplications,
                PendingApprovalJobs = pendingApprovalJobs
            };
        }

        public async Task<List<JobPerformanceDto>> GetJobPerformanceAsync()
        {
            var jobPerformance = await _context.Jobs
                .Include(j => j.JobApplications)
                .Where(j => j.IsPublished)
                .Select(j => new JobPerformanceDto
                {
                    JobId = j.Id,
                    JobTitle = j.Title,
                    Department = j.Department,
                    ApplicationCount = j.JobApplications.Count,
                    PostedDate = j.PostedDate,
                    ClosingDate = j.ClosingDate
                })
                .OrderByDescending(jp => jp.ApplicationCount)
                .Take(10)
                .ToListAsync();

            return jobPerformance;
        }

        public async Task<List<JobPerformanceDto>> GetTopPerformingJobsAsync(int count = 5)
        {
            var jobPerformance = await _context.Jobs
                .Include(j => j.JobApplications)
                .Where(j => j.IsPublished)
                .Select(j => new JobPerformanceDto
                {
                    JobId = j.Id,
                    JobTitle = j.Title,
                    Department = j.Department,
                    ApplicationCount = j.JobApplications.Count,
                    PostedDate = j.PostedDate,
                    ClosingDate = j.ClosingDate
                })
                .OrderByDescending(jp => jp.ApplicationCount)
                .Take(count)
                .ToListAsync();

            return jobPerformance;
        }

        public async Task<ApplicationStatusDistributionDto> GetApplicationStatusDistributionAsync()
        {
            var statusCounts = await _context.JobApplications
                .GroupBy(a => a.Status)
                .Select(g => new StatusCountDto
                {
                    Status = g.Key,
                    Count = g.Count()
                })
                .ToListAsync();

            return new ApplicationStatusDistributionDto
            {
                StatusCounts = statusCounts
            };
        }

        public async Task<List<RecentActivityDto>> GetRecentActivityAsync(int count = 10)
        {
            var activities = new List<RecentActivityDto>();

            // Recent applications
            var recentApplications = await _context.JobApplications
                .Include(a => a.Job)
                .Include(a => a.Applicant)
                .OrderByDescending(a => a.AppliedDate)
                .Take(count)
                .Select(a => new RecentActivityDto
                {
                    Type = "Application",
                    Description = $"{a.Applicant!.FirstName} {a.Applicant.LastName} applied for {a.Job!.Title}",
                    Timestamp = a.AppliedDate,
                    RelatedId = a.Id
                })
                .ToListAsync();

            activities.AddRange(recentApplications);

            return activities.OrderByDescending(a => a.Timestamp).Take(count).ToList();
        }

        public async Task<DepartmentAnalyticsDto> GetDepartmentAnalyticsAsync()
        {
            // First, get the applications grouped by job department
            var applicationsByDepartment = await _context.JobApplications
                .Include(a => a.Job)
                .Where(a => a.Job != null && !string.IsNullOrEmpty(a.Job.Department))
                .GroupBy(a => a.Job!.Department)
                .Select(g => new
                {
                    Department = g.Key,
                    ApplicationCount = g.Count()
                })
                .ToListAsync();

            // Get job statistics by department
            var jobsByDepartment = await _context.Jobs
                .Where(j => !string.IsNullOrEmpty(j.Department))
                .GroupBy(j => j.Department)
                .Select(g => new
                {
                    Department = g.Key,
                    JobCount = g.Count(),
                    ActiveJobs = g.Count(j => j.IsPublished && j.ClosingDate > DateTime.UtcNow)
                })
                .ToListAsync();

            // Combine the results
            var allDepartments = jobsByDepartment.Select(j => j.Department)
                .Union(applicationsByDepartment.Select(a => a.Department))
                .Distinct()
                .ToList();

            var departmentStats = allDepartments.Select(dept =>
            {
                var jobStats = jobsByDepartment.FirstOrDefault(j => j.Department == dept);
                var appStats = applicationsByDepartment.FirstOrDefault(a => a.Department == dept);

                var jobCount = jobStats?.JobCount ?? 0;
                var applicationCount = appStats?.ApplicationCount ?? 0;

                return new DepartmentStatsDto
                {
                    Department = dept,
                    JobCount = jobCount,
                    ApplicationCount = applicationCount,
                    ActiveJobs = jobStats?.ActiveJobs ?? 0,
                    AverageApplicationsPerJob = jobCount > 0 ? (double)applicationCount / jobCount : 0
                };
            })
            .OrderByDescending(d => d.ApplicationCount)
            .ToList();

            return new DepartmentAnalyticsDto
            {
                Departments = departmentStats
            };
        }

        public async Task<List<EmploymentTypeStatsDto>> GetEmploymentTypeStatsAsync()
        {
            var employmentTypeStats = await _context.Jobs
                .Where(j => j.IsPublished)
                .GroupBy(j => j.EmploymentType)
                .Select(g => new EmploymentTypeStatsDto
                {
                    EmploymentType = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(e => e.Count)
                .ToListAsync();

            return employmentTypeStats;
        }

        public async Task<List<ExperienceLevelStatsDto>> GetExperienceLevelStatsAsync()
        {
            var experienceLevelStats = await _context.Jobs
                .Where(j => j.IsPublished)
                .GroupBy(j => j.ExperienceLevel)
                .Select(g => new ExperienceLevelStatsDto
                {
                    ExperienceLevel = g.Key,
                    Count = g.Count()
                })
                .OrderByDescending(e => e.Count)
                .ToListAsync();

            return experienceLevelStats;
        }
    }
}