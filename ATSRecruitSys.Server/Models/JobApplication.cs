using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ATSRecruitSys.Server.Models
{
    public class JobApplication
    {
        [Key]
        public int Id { get; set; }
        
        [Required]
        public int JobId { get; set; }
        
        [ForeignKey("JobId")]
        public Job? Job { get; set; }
        
        [Required]
        public string ApplicantId { get; set; } = string.Empty;
        
        [ForeignKey("ApplicantId")]
        public ApplicationUser? Applicant { get; set; }
        
        [Required]
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        
        [Required]
        [StringLength(30)]
        public string Status { get; set; } = "Applied"; // Applied, Screening, Interview, Offer, Hired, Rejected
        
        public DateTime StatusUpdatedDate { get; set; } = DateTime.UtcNow;
        
        // Resume/CV information
        [Required]
        public string ResumeFilePath { get; set; } = string.Empty;
        
        public string? CoverLetter { get; set; }
        
        [StringLength(500)]
        public string? ApplicantNotes { get; set; }
        
        [StringLength(500)]
        public string? RecruiterNotes { get; set; }
        
        // Simplified skills as JSON field instead of many-to-many
        public string? Skills { get; set; } // JSON array of skill names
        
        // 1-month timeline note flag
        public bool TimelineNoteSent { get; set; } = false;
    }
}