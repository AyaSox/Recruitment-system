using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.DTOs
{
    /// <summary>
    /// DTO for advanced job search with multiple filters
    /// </summary>
    public class AdvancedJobSearchDto
    {
        /// <summary>
        /// Keywords to search in title, description, or department
        /// </summary>
        public string? Keywords { get; set; }

        /// <summary>
        /// Filter by department
        /// </summary>
        public string? Department { get; set; }

        /// <summary>
        /// Filter by location
        /// </summary>
        public string? Location { get; set; }

        /// <summary>
        /// Filter by employment type (Full-time, Part-time, Contract, etc.)
        /// </summary>
        public string? EmploymentType { get; set; }

        /// <summary>
        /// Filter by experience level (Entry, Mid, Senior, Executive)
        /// </summary>
        public string? ExperienceLevel { get; set; }

        /// <summary>
        /// Minimum salary range
        /// </summary>
        [Range(0, double.MaxValue, ErrorMessage = "Minimum salary must be non-negative")]
        public decimal? MinSalary { get; set; }

        /// <summary>
        /// Maximum salary range
        /// </summary>
        [Range(0, double.MaxValue, ErrorMessage = "Maximum salary must be non-negative")]
        public decimal? MaxSalary { get; set; }

        /// <summary>
        /// Filter by required skills (list of skill IDs)
        /// </summary>
        public List<int>? RequiredSkills { get; set; }

        /// <summary>
        /// Filter by Employment Equity positions only
        /// </summary>
        public bool? IsEmploymentEquity { get; set; }

        /// <summary>
        /// Filter jobs posted after this date
        /// </summary>
        public DateTime? PostedAfter { get; set; }

        /// <summary>
        /// Sort order: "newest", "salary_high", "salary_low", "title", "closing_soon"
        /// </summary>
        public string? SortBy { get; set; }

        /// <summary>
        /// Sort descending (true) or ascending (false)
        /// </summary>
        public bool SortDescending { get; set; } = true;

        /// <summary>
        /// Page index for pagination
        /// </summary>
        [Range(0, int.MaxValue)]
        public int PageIndex { get; set; } = 0;

        /// <summary>
        /// Page size for pagination
        /// </summary>
        [Range(1, 100)]
        public int PageSize { get; set; } = 10;
    }

    /// <summary>
    /// DTO for advanced application search with multiple filters
    /// </summary>
    public class AdvancedApplicationSearchDto
    {
        /// <summary>
        /// Search by candidate name or email
        /// </summary>
        public string? CandidateName { get; set; }

        /// <summary>
        /// Filter by specific job ID
        /// </summary>
        public int? JobId { get; set; }

        /// <summary>
        /// Filter by multiple statuses
        /// </summary>
        public List<string>? Statuses { get; set; }

        /// <summary>
        /// Filter applications submitted after this date
        /// </summary>
        public DateTime? AppliedAfter { get; set; }

        /// <summary>
        /// Filter applications submitted before this date
        /// </summary>
        public DateTime? AppliedBefore { get; set; }

        /// <summary>
        /// Minimum skills match percentage (0-100)
        /// </summary>
        [Range(0, 100)]
        public int? MinSkillsMatch { get; set; }

        /// <summary>
        /// Filter by specific skills
        /// </summary>
        public List<int>? RequiredSkills { get; set; }

        /// <summary>
        /// Sort order: "date", "name", "status", "match"
        /// </summary>
        public string? SortBy { get; set; }

        /// <summary>
        /// Sort descending (true) or ascending (false)
        /// </summary>
        public bool SortDescending { get; set; } = true;

        /// <summary>
        /// Page index for pagination
        /// </summary>
        [Range(0, int.MaxValue)]
        public int PageIndex { get; set; } = 0;

        /// <summary>
        /// Page size for pagination
        /// </summary>
        [Range(1, 100)]
        public int PageSize { get; set; } = 10;
    }

    /// <summary>
    /// Response DTO with filter metadata
    /// </summary>
    public class SearchFiltersDto
    {
        public List<string> Departments { get; set; } = new();
        public List<string> Locations { get; set; } = new();
        public List<string> EmploymentTypes { get; set; } = new();
        public List<string> ExperienceLevels { get; set; } = new();
        public decimal MinSalary { get; set; }
        public decimal MaxSalary { get; set; }
        public int TotalJobs { get; set; }
    }
}
