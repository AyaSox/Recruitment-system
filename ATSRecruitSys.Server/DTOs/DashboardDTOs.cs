namespace ATSRecruitSys.Server.DTOs
{
    // Dashboard DTOs
    public class DashboardStatsDto
    {
        public int TotalJobs { get; set; }
        public int ActiveJobs { get; set; }
        public int TotalApplications { get; set; }
        public int NewApplications { get; set; }
        public int ScreeningApplications { get; set; }
        public int InterviewApplications { get; set; }
        public int PendingApprovalJobs { get; set; }
    }

    public class JobPerformanceDto
    {
        public int JobId { get; set; }
        public string JobTitle { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public int ApplicationCount { get; set; }
        public DateTime PostedDate { get; set; }
        public DateTime ClosingDate { get; set; }
    }

    public class ApplicationStatusDistributionDto
    {
        public List<StatusCountDto> StatusCounts { get; set; } = new List<StatusCountDto>();
    }

    public class StatusCountDto
    {
        public string Status { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class RecentActivityDto
    {
        public string Type { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public int RelatedId { get; set; }
    }

    // New DTOs for department analytics
    public class DepartmentStatsDto
    {
        public string Department { get; set; } = string.Empty;
        public int JobCount { get; set; }
        public int ApplicationCount { get; set; }
        public int ActiveJobs { get; set; }
        public double AverageApplicationsPerJob { get; set; }
    }

    public class DepartmentAnalyticsDto
    {
        public List<DepartmentStatsDto> Departments { get; set; } = new List<DepartmentStatsDto>();
    }

    public class EmploymentTypeStatsDto
    {
        public string EmploymentType { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    public class ExperienceLevelStatsDto
    {
        public string ExperienceLevel { get; set; } = string.Empty;
        public int Count { get; set; }
    }

    // Search and filtering
    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    }
}