using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace ATSRecruitSys.Server.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Required]
        [StringLength(100)]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        [StringLength(100)]
        public string LastName { get; set; } = string.Empty;
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? LastLoginDate { get; set; }
        
        public string? ProfilePictureUrl { get; set; }
        
        // Navigation properties - simplified
        public ICollection<Job> CreatedJobs { get; set; } = new List<Job>();
        public ICollection<JobApplication> JobApplications { get; set; } = new List<JobApplication>();
    }
}