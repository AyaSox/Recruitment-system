using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.DTOs
{
    // Job DTOs
    public class CreateJobDto
    {
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        public DateTime ClosingDate { get; set; }

        [Required]
        public string EmploymentType { get; set; } = string.Empty;

        [Required]
        public string ExperienceLevel { get; set; } = string.Empty;

        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        
        // Employment Equity fields
        public bool IsEmploymentEquityPosition { get; set; }
        public string? EmploymentEquityNotes { get; set; }
    }

    public class UpdateJobDto
    {
        [Required]
        public int Id { get; set; }

        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Location { get; set; } = string.Empty;

        [Required]
        public string Department { get; set; } = string.Empty;

        [Required]
        public DateTime ClosingDate { get; set; }

        public bool IsPublished { get; set; }

        [Required]
        public string EmploymentType { get; set; } = string.Empty;

        [Required]
        public string ExperienceLevel { get; set; } = string.Empty;

        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        
        // Employment Equity fields
        public bool IsEmploymentEquityPosition { get; set; }
        public string? EmploymentEquityNotes { get; set; }
    }

    public class JobListDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public DateTime ClosingDate { get; set; }
        public bool IsPublished { get; set; }
        public bool IsApproved { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
    }

    public class JobDetailDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        public DateTime PostedDate { get; set; }
        public DateTime ClosingDate { get; set; }
        public bool IsPublished { get; set; }
        public bool IsApproved { get; set; }
        public string CreatedById { get; set; } = string.Empty;
        public string CreatedByName { get; set; } = string.Empty;
        public string TimelineNote { get; set; } = string.Empty;
    }

    public class JobDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public DateTime ClosingDate { get; set; }
        public bool IsPublished { get; set; }
        public bool IsApproved { get; set; } = true; // Admin approval status
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        public string CreatedByName { get; set; } = string.Empty;
        public int ApplicationCount { get; set; }
        public string TimelineNote { get; set; } = string.Empty;
        public bool IsEmploymentEquityPosition { get; set; }
        public string? EmploymentEquityNotes { get; set; }
        
        // Display properties
        public string DisplayLocation => Location;
        public string DisplayDepartment => Department;
    }

    public class JobSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
        public string Department { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }
        public DateTime ClosingDate { get; set; }
        public bool IsPublished { get; set; }
        public bool IsApproved { get; set; } = true; // Admin approval status
        public string EmploymentType { get; set; } = string.Empty;
        public string ExperienceLevel { get; set; } = string.Empty;
        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        public int ApplicationCount { get; set; }
        public string TimelineNote { get; set; } = string.Empty;
        public bool IsEmploymentEquityPosition { get; set; }
        
        // Display properties
        public string DisplayLocation => Location;
        public string DisplayDepartment => Department;
    }

    public class PaginatedJobResponseDto
    {
        public List<JobSummaryDto> Items { get; set; } = new List<JobSummaryDto>();
        public int TotalCount { get; set; }
        public int PageIndex { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
    }
}