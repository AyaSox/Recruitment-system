using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ATSRecruitSys.Server.Models
{
    public class Job
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        [StringLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Description { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Location { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string Department { get; set; } = string.Empty;
        
        public DateTime PostedDate { get; set; } = DateTime.UtcNow;
        public DateTime ClosingDate { get; set; }
        public bool IsPublished { get; set; }
        
        // Admin approval for job posting
        public bool IsApproved { get; set; } = true; // Default to true for existing jobs
        
        [Required]
        [StringLength(50)]
        public string EmploymentType { get; set; } = string.Empty; // Full-time, Part-time, Contract, Internship
        
        [Required]
        [StringLength(50)]
        public string ExperienceLevel { get; set; } = string.Empty; // Entry, Mid, Senior, Executive
        
        // Salary fields
        public decimal? SalaryRangeMin { get; set; }
        public decimal? SalaryRangeMax { get; set; }
        public string Currency { get; set; } = "ZAR";
        
        // Relations
        public string CreatedById { get; set; } = string.Empty;
        public ApplicationUser? CreatedBy { get; set; }
        
        public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
        
        // Helper property for the 1-month timeline note
        public string TimelineNote => "Should you not hear from us within 1 month after the closing date, please consider your application unsuccessful.";
    }
}